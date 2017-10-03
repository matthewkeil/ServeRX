

import * as util from 'util';
import * as http from 'http';
import * as net from 'net';

import * as Rx from 'rxjs';


import { HttpServerConfig, HttpServerConfigI } from '../ConfigRX';
import { Handler } from './../handlers/Handler';
// import { Socket } from './../handlers/Socket';


export class Http extends Rx.Subject {

	public config: HttpServerConfig
	private _server__: Rx.Subscription;
	private _handler: Handler;
	/**
	 * 
	 * Http.server, Http.server$ and Http.handler only exist during testing (config.NODE_ENV === 'testing')
	 * 
	 */
	public server?: http.Server;
	public server$?: Rx.Observable<any>[];
	public handler?: Handler;

	
	constructor(private _config?: HttpServerConfig | HttpServerConfigI) {
		
		super();
		this._config instanceof HttpServerConfig ?
			this.config = this._config :
			this.config = new HttpServerConfig(this._config)
	
		this._server__ = this.buildServer().subscribe();
		
	}
	

	public buildServer(): Rx.Observable<any> {
		
		let server = http.createServer();
		let server$: Rx.Observable<any>[] = [];
		this._handler = new Handler(this.config);

		if (this.config.NODE_ENV === 'testing') {
			this.server = server;
			this.server$ = server$;
			this.handler = this._handler;
		}
		
		server$.push(new Rx.Observable(observer => {

			let listenArgs: any[] = [
				this.config.port || 3000,
				this.config.host || 'localhost'
			];

			if (this.config.maxHeadersCount) { 
				server.maxHeadersCount = this.config.maxHeadersCount
			}

			if (this.config.timeout !== undefined) {
				
				this.config.timeout.ms ? 
					server.timeout = this.config.timeout.ms : 
					this.config.timeout.ms = server.timeout;
				
				if (util.isFunction(this.config.timeout.cb)) { 
					server.setTimeout(this.config.timeout.ms, <Function>this.config.timeout.cb);
				}
			}

			if (this.config.backlog) { 
				listenArgs.push(this.config.backlog)
			}
			
			listenArgs.push(() => {
				!this.config.onListening ? 
					(<any>this.config).onListening(listenArgs) : 
					this.config.onListening === false ?
						null :
						console.log(`Listening on ${this.config.host}:${this.config.port}` + 
							this.config.backlog ? ` with a backlog set to ${this.config.backlog}...` : '...') ;
				observer.complete();
			});
			
			server.listen(listenArgs);

		}));

		// server$.push(Rx.Observable.fromEvent(server, 'request',
		// 	(req: http.IncomingMessage, res: http.ServerResponse) => {
		// 		this._handler.handle(req, res);
		// 	}
		// ));
			
		// server$.push(Rx.Observable.fromEvent(server, 'error',
		// 	(err: Error) => this.error(err)
		// ));
			
		// server$.push(Rx.Observable.fromEvent(server, 'close', () => { 
		// 	!this.config.onClosing ? 
		// 		null :
		// 		this.config.onClosing === true ?
		// 			console.log(`Closing server on ${this.config.host}:${this.config.port}` + 
		// 				this.config.backlog ? ` with a backlog set to ${this.config.backlog}...` : '...') :
		// 			this.config.onClosing(activeConfigs);
		// 	this.complete();
		// }));

		// if (this.config.handleCheckContinue) server$.push(Rx.Observable
		// 	.fromEvent(server, 'checkContinue',
		// 		(req: http.IncomingMessage, res: http.ServerResponse) => {
		// 			(<any>this.config).handleCheckContinue(req, res);
		// 			server.emit('request', req, res);
		// 		}
		// ));

		// if (this.config.handleClientError) server$.push(Rx.Observable
		// 	.fromEvent(server, 'clientError', 
		// 		(err: Error, socket: net.Socket) => { 
		// 			(<any>this.config).handleClientError(err, socket);
		// 		}
		// ));

		// if (this.config.allowUpgrade) server$.push(
		// 	Rx.Observable.fromEvent(server, 'connect',
		// 		(req: http.IncomingMessage, socket: net.Socket, head: Buffer) => {
		// 			this.next(new Upgrade (this.protocol, this.config, req, socket, head));
		// 	}),
		// 	Rx.Observable.fromEvent(server, 'upgrade',
		// 		(req: http.IncomingMessage, socket: net.Socket, head: Buffer) => {
		// 			this.next(new Upgrade (this.protocol, this.config, req, socket, head));
		// 	})
		// );

		return Rx.Observable
			.merge(...server$)
			.retry(3)
			.debounceTime(200);
	}

}

	// next(value: any) {
	// 	super.next(value);
	// }

	// error(err: Error) {
	// 	this._server__.unsubscribe();
	// 	// this.handler__.unsubscribe();
	// 	super.error(err);
	// }
	
	// complete() {
	// 	this._server__.unsubscribe();
	// 	// this.handler__.unsubscribe();
	// 	super.complete();
	// }
