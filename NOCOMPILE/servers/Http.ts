


import * as util from 'util'
import * as net from 'net'
import * as http from 'http'

import * as Rx from 'rxjs'


import { Configuration, ServerConfig } from "../ConfigRX";

import { Headers } from './../messages/headers/Headers';


import Route from ;
import Router from '../routing/Router';


import { Request, RequestPatcher } from './../messages/Request'
import { Response, ResponsePatcher } from '../messages/Response'
import { ConnectionHandler } from './../handlers/ConnectionHandler'
import { ServerError } from '../common/Errors';


export interface HttpPair {
	req: Request
	res: Response
}

export interface UpgradeSet {
	req: Request
	socket: net.Socket
	head: Buffer | string
}

export class Http extends Rx.Subject<any> {

	public config: ServerConfig;
	public headers: Headers;
	public router: Router;
	public handler?: ConnectionHandler

	private _server: http.Server
	private _listeners__: Rx.Subscription
	

	constructor(baseConfig?: Configuration) {

		super();

		/**
		 * check to see if config is an instantiated ServerConfig object
		 * if not it throws the configuration error.  Specifically require()
		 * here to ensure it is loaded at time of check.  All other references
		 * to the singleton config object can be done through the import statement
		 * so it wont need to be passed
		 */
		ServerConfig.check(baseConfig) ?
			this.config = new ServerConfig(baseConfig) :
			this.error(new ServerError('invalid base config provided', baseConfig));

		/**
		 * 
		 * build and configure internal dependencies.  Make sure to run Route.ts 
		 * first.  The root router object sits withing the Route singleton object * so that wherever the Route() API is called from any routing file it 
		 * always mounts to the root router
		 *
		 * 
		 */
		(this.config.router.obj instanceof Router) ?
			this.router = require('./routing/Route').router = this.config.router.obj :
			this.router = require('./routing/Route').router;

		this.router.configureRouter(this.config);

		/**
		 * 
		 * 
		 * Patch http.IncomingMessage and http.ServerResponse to add ServeRx
		 * functionality and headers to the objects node provides to the handler
		 * 
		 * 
		 */
		this.headers = new Headers(this.config)

		RequestPatcher(
			(<any>http).IncomingMessage,
			this.config, 
			this.headers,
			this.router
		)

		ResponsePatcher(
			(<any>http).ServerResponse, 
			this.config,
			this.headers
		)

		/**
		 * 
		 * 
		 * Patch http.creatServer to add ServerRx functionality and 
		 * 
		 * 
		 * 
		 */
		this._server = http.createServer(this.handle);
		this._listeners__ = this._listeners$().subscribe(
			() => {},
			err => this.error(err),
			() => this.error(new Error("Server listener completed unexpectedly"))
		);

		/**
		 * 
		 * 
		 * Configure the server object
		 * 
		 * 
		 * 
		 */
		if (this.config.maxHeadersCount) { 
			this._server.maxHeadersCount = this.config.maxHeadersCount;
		}
			
		this.config.timeout.ms ? 
			this._server.timeout = this.config.timeout.ms : 
			this.config.timeout.ms = this._server.timeout;
		
		if (util.isFunction(this.config.timeout.cb)) { 
			this._server.setTimeout(this.config.timeout.ms, (<Function>this.config.timeout.cb));
		}

		/**
		 * Call listen() on the server and pass in relevant config options.
		 * Once server is listening subscribe to the event listeners.  Listeners
		 * are only subscribed to once server is actively listening to prevent
		 * memory leaks for attempts that do not fully connect as there will be
		 * no way to unsubscribe if server doesn't get to "listening" event
		 * 
		 * 
		 *  interface net.ListenOptions = {     
		 * 		port?: number;
       *			host?: string;
       *			backlog?: number;
       *			path?: string;
		 *			exclusive?: boolean;
		 *		}
		 */
		let listenOptions = {};
		if (this.config.port) Object.assign(listenOptions, {port: this.config.port});
		if (this.config.host) Object.assign(listenOptions, {host: this.config.host});
		if (this.config.backlog) Object.assign(listenOptions, {backlog: this.config.backlog});
		if (this.config.path) Object.assign(listenOptions, {path: this.config.path});
		if (this.config.exclusive) Object.assign(listenOptions, {exclusive: this.config.exclusive});

		this._server.listen(listenOptions, () => {
			this.config.onListening ?
				null :
				(this.config.onListening === true || !util.isFunction(this.config.onListening)) ?
					this._defaultListening() :
					(<any>this.config).onListening(this.config, this._server.address());
		});
	}

	private _listeners$() {

		let self = this;

		let listeners = [
			Rx.Observable.fromEvent(self._server, 'error',
				(err: Error) => self.error(err)),
			Rx.Observable.fromEvent(self._server, 'close', () => { 
				!self.config.onClosing ? 
					null :
					self.config.onClosing === true ?
						console.log(`Closing server on ${self.config.host}:${self.config.port}...`) :
						self.config.onClosing(self.config, self._server.address());
					self.complete();
		})];

		if (self.config.handleCheckContinue) listeners.push(
			Rx.Observable.fromEvent(self._server, 'checkContinue',
				(req: http.IncomingMessage, res: http.ServerResponse) => {
					(<any>self.config).handleCheckContinue(req, res, () => self._server.emit('request', req, res));
				}));

		if(self.config.handleClientError) listeners.push(
			Rx.Observable.fromEvent(self._server, 'clientError', 
				(err: Error, socket: net.Socket) => { 
					(<any>self.config).handleClientError(err, socket);
				}));
		
		// if(this.config.handleUpgrade) listeners.push(
		// 	Rx.Observable.fromEvent(self._server, 'upgrade',
		// 		(req: http.IncomingMessage, socket: net.Socket, head: Buffer) => {
				
		// 	}))

		return Rx.Observable.merge(listeners)
	}

	private _defaultListening() {
		let address = this._server.address();
		console.log(`Listening on ${address.address}:${address.port}...`);
	}

	private _close() {

		if (this._server && this._server.listening) this._server.close();

		if (this._listeners__ && !this._listeners__.closed) {
			this._listeners__.unsubscribe();
		}
	}

	public error(err: Error) {

		this._close();

		super.error(err);
	}
	
	public complete() {

		this._close();
		
		super.complete();
	}

	public handle(req: Request, res: Response): void {

	/** 
	 * 
	 *  run auto headers and fetch handler
	 *  run pre headers & middleware
	 *  run middleware and handler
	 * 
	 * 
	 * */

	 

	}
	

}