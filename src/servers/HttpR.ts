
import { 
	createServer,
	Server,
	IncomingMessage,
	ServerResponse } from 'http';
import * as net from 'net';


import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subscriber } from 'rxjs/Subscriber';
import { Subscription } from 'rxjs/Subscription';
import { merge } from 'rxjs/operator/merge';
import { FromEventObservable } from 'rxjs/observable/FromEventObservable';
import { BoundCallbackObservable } from 'rxjs/observable/BoundCallbackObservable';



import { HttpServeRConfig } from '../ConfigR';
import { RequestR, IncomingReq } from '../messages/RequestR';
import { HandleR } from '../handler/HandleR';
import { 
	HttpEvent,
	HttpSocketUpgrade, 
	HttpClientError } from './events';
import { PoolCount } from './PoolR';


export class HttpR extends Subject<> {

	private server: Server;
	private server$: Observable<HttpEvent>;
	private server__: Subscription;
	
	constructor(public config: HttpServeRConfig) {
		super();
		this.server$ = this._setListeners();
		this.server__ = this.server$.subscribe(
			(event: HttpEvent) => {}, 
			(err: Error) => {},
			() => {}
		);
	}

	_setListeners(): Observable<HttpEvent> {

		let server = createServer();
		server.maxHeadersCount = this.config.maxHeadersCount;
		server.setTimeout(this.config.timeout.ms, this.config.timeout.cb);
		server.timeout = this.config.timeout.ms;
		
		const server$ = <Observable<HttpEvent>>BoundCallbackObservable.call(
			server.listen(
				this.config.env.PORT, 
				this.config.env.HOST, 
				this.config.backlog,
			),
			() => { 
				if (this.config.onListeningMessage) {
					this.config.onListening();
			}}
		);

		const request$ = FromEventObservable.call(server, 'request',
			(req: IncomingMessage, res: ServerResponse) => { 
				if (this.config.requestHandler) {
					let socket__ = new SocketR(config, 'http', req, res);
				} else { 
					res.statusCode = 500;
					res.end({"message":"<h1>No Request Handler Found<h1>"}, 'utf8');
				}
		});
			
		const checkContinue$ = FromEventObservable.call(server, 'checkContinue',
			(req: IncomingMessage, res: ServerResponse) => { 
				if (this.config.http.handleCheckContinue) {
					res.writeContinue();
					_server.emit('request', req, res);
				}
		});

		const connect$ = FromEventObservable.call(server, /(connect|upgrade)/,
			(req: IncomingMessage, socket: net.Socket, head: Buffer) => {
				if (this.config.http.allowUpgrade) { 
					observer.next({req, socket, head});
				}
			});

		const clientError$ = FromEventObservable.call(server, 'clientError', 
			(err: Error, socket: net.Socket) => { 
				if (this.config.http.handleClientError) {
					observer.next({err, socket});
				}
		});

		const error$ = FromEventObservable.call(server, 'error',
			err => observer.error(err)
		);

		const close$ = FromEventObservable.call(server, 'close', () => {
			_server.removeAllListeners();
			if (this.config.http.onCloseMessage) {
				this.config.onClose(); 
			}
			observer.complete(); 
		});

		return merge.call(listening$, request$, checkContinue$, connect$, upgrade$, clientError$, error$, close$)
	};

		
};