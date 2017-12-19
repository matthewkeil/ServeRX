


import * as util from 'util'
import * as net from 'net'
import * as http from 'http'

import * as Rx from 'rxjs'


import { HttpServerConfig } from '../ConfigRX'
import { Headers } from './../messages/headers/Headers'
import { Route } from './../routing/Route';
import { RootRouter } from './../routing/Router';
import { Request, RequestPatcher } from './../messages/Request'
import { Response, ResponsePatcher } from '../messages/Response'
import { ConnectionHandler } from './../handlers/ConnectionHandler'


export interface HttpPair {
	req: Request
	res: Response
}

export interface UpgradeSet {
	req: Request
	socket: net.Socket
	head: Buffer | string
}

export type Connection = HttpPair | UpgradeSet

export class Http extends Rx.Subject<any> {

	public config: HttpServerConfig
	public headers: Headers
	public router: RootRouter
	public handler?: ConnectionHandler

	private _server: http.Server
	private _listeners__: Rx.Subscription
	

	constructor(_config?: HttpServerConfig) {

		super()
		
		/**
		 * check to see if _config is an instantiated HttpServerConfig object
		 * if already instsantiated set public config to passed in _config
		 * or create a new instantiated object
		 */ 
		_config instanceof HttpServerConfig ?
			this.config = _config :
			this.config = new HttpServerConfig(_config)
		

		/**
		 * build and configure internal dependencies.  Make sure to run Route.ts 
		 * first.  The root router object sits withing the Route singleton object * so that wherever the Route() API is called from any routing file it 
		 * always mounts to the root router
		 */
		Route.router instanceof RootRouter ?
			this.router = Route.router :
			this.router = Route.router = new RootRouter(this.config)
			
			
		/**
		 * Patch http.IncomingMessage and http.ServerResponse to add ServeRx
		 * functionality and headers to the objects node provides to the handler
		 */
		this.headers = new Headers(this.config)
		
		RequestPatcher(
			(<any>http).IncomingMessage,
			this.config, 
			this.headers,
			this.router
		)

		ResponsePatcher(
			this.config,
			(<any>http).ServerResponse, 
			this.headers
		)


		/**
		 * Patch http.creatServer to add ServerRx functionality and 
		 */
		this._server = http.createServer(this.handler.handle)


		/**
		 * Configure the server object
		 */
		if (this.config.maxHeadersCount) { 
			this._server.maxHeadersCount = this.config.maxHeadersCount
		}

		if (this.config.timeout !== undefined) {
			
			this.config.timeout.ms ? 
				this._server.timeout = this.config.timeout.ms : 
				this.config.timeout.ms = this._server.timeout;
			
			if (util.isFunction(this.config.timeout.cb)) { 
				this._server.setTimeout(this.config.timeout.ms, <Function>this.config.timeout.cb);
			}
		}

		
		/**
		 * Call listen() on the server and pass in relevant config options.
		 * Once server is listening subscribe to the event listeners.  Listeners
		 * are only subscribed to once server is actively listening to prevent
		 * memory leaks for attempts that do not fully connect as there will be
		 * no way to unsubscribe if server doesn't get to "listening" event
		 */		
		this._server.listen({
			port: this.config.port ? this.config.port : this.config.port = 3000,
			host: this.config.host,
			backlog: this.config.backlog,
			exclusive: this.config.exclusive
		 }, () => {

			this._listeners__ = this._getListeners().subscribe(
				() => {},
				err => this.error(err),
				() => this.error(new Error("Server listener completed unexpectedly"))
			)

			!this.config.onListening ?
				null :
				(this.config.onListening === true || !util.isFunction(this.config.onListening)) ?
					this._defaultListening() :
					this.config.onListening(this.config, this._server.address())
		})
	}

	error(err: Error) {

		if (this._server && this._server.listening) { this._server.close() }

		if (this._listeners__ && !this._listeners__.closed) {
			this._listeners__.unsubscribe();
		}

		super.error(err);
	}
	
	complete() {

		if (this._server && this._server.listening) { this._server.close() }

		if (this._listeners__ && !this._listeners__.closed) {
			this._listeners__.unsubscribe();
		}
		
		super.complete();
	}
	
	private _getListeners(): Rx.Observable<any> {
		return Rx.Observable.merge(
			Rx.Observable.fromEvent(this._server, 'error',
				(err: Error) => this.error(err)
			),
			Rx.Observable.fromEvent(this._server, 'close', () => { 
				!this.config.onClosing ? 
					null :
					this.config.onClosing === true ?
						console.log(`Closing server on ${this.config.host}:${this.config.port}...`) :
						this.config.onClosing(this.config);
				this.complete()
			})
			// ,	!this.config.handleCheckContinue ?
			// 		Rx.Observable.empty() :
			// 		Rx.Observable.fromEvent(server, 'checkContinue',
			// 			(req: http.IncomingMessage, res: http.ServerResponse) => {
			// 				this.config.handleCheckContinue(req, res);
			// 				server.emit('request', req, res);
			// 			})
			// ,	!this.config.handleClientError ? 
			// 		Rx.Observable.empty() : 
			// 		Rx.Observable.fromEvent(server, 'clientError', 
			// 			(err: Error, socket: net.Socket) => { 
			// 				this.config.handleClientError(err, socket)();
			// 			})
			// ,	!this.config.handleUpgrage ? 
			// 		Rx.Observable.empty() :
			// 		Rx.Observable.fromEvent(server, 'upgrade',
			// 			(req: http.IncomingMessage, socket: net.Socket, head: Buffer) => {
			// 				this.next(new Upgrade (this.protocol, this.config, req, socket, head));
			// 		})
		)
	}

	private _defaultListening() {
		let address = this._server.address();
		console.log(`Listening on ${address.address}:${address.port}...`)
	}

}