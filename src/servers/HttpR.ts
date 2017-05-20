

import { 
	createServer,
	Server,
	IncomingMessage,
	ServerResponse } from 'http';
import { Socket } from 'net';


import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subscriber } from 'rxjs/Subscriber';
import { Subscription } from 'rxjs/Subscription';
import { merge } from 'rxjs/operator/merge';
import { FromEventObservable } from 'rxjs/observable/FromEventObservable';
import { BoundCallbackObservable } from 'rxjs/observable/BoundCallbackObservable';



import { HttpServeRConfig } from '../ConfigR';
import { RequestR, IncomingReq } from '../messages/RequestR';
import { HandleR } from '../handlers/HandleR';
import { 
	HttpEvent,
	HttpSocketUpgrade, 
	HttpClientError } from './events';
import { PoolR, PoolCount, PoolEvent } from '../handlers/PoolR';
import { UpgradeRequest, UpgradeR } from './../handlers/UpgradeR';




export enum ServeREvent {
	Starting,
	Listening,
	ServerError,
	ServerComplete,
	PoolError,
	PoolComplete,
	UpgradeWaiting
}

export class HttpR extends BehaviorSubject<ServeREvent> {

		// public listening: boolean;
		// public getConnections(cb: (err: Error, number: number)=>void): void {};
		// public address(): { port: number, family: string, address: string } { return };
	public protocol: string;
	public upgrader: UpgradeR;
	private server: Server;
	private server$: Observable<HttpEvent>;
	private server__: Subscription;
	private pool$: PoolR;
	private pool__: Subscription;
	
	constructor(public config: HttpServeRConfig) {
		super(ServeREvent.Starting);
		this.protocol = 'http';
		this.server$ = this._buildServer();
		this.server__ = this.server$.subscribe(
			(any: any) => {}, 
			(err: Error) => { this._handle('server', err) },
			() => { this._handle('server') }
		 );
		this.pool$ = new PoolR;
		this.pool__= this.pool$.subscribe(
			(event: PoolEvent) => {}, 
			(err: Error) => { this._handle('pool', err) },
			() => { this._handle('pool') }
		 );;
		if (this.config.allowUpgrade) this.upgrader = new UpgradeR;
	}

	_buildServer(): Observable<HttpEvent> {

		this.server = createServer();
		this.server.maxHeadersCount = this.config.maxHeadersCount;
		this.server.setTimeout(this.config.timeout.ms, this.config.timeout.cb);
		this.server.timeout = this.config.timeout.ms;

		const request$ = FromEventObservable.call(this.server, 'request',
			(req: IncomingMessage, res: ServerResponse) => {
				let socket = new HandleR(this.protocol, this.config, req, res);
				this.pool$.next(socket); 
			}
		 );
		
		const error$ = FromEventObservable.call(this.server, 'error',
			(err: Error) => this._handle('server', err)
		 );

		const close$ = FromEventObservable.call(this.server, 'close', () => {
			if (this.config.onCloseMessage) this.config.onClose();
			this._handle('server');
		 });

		let checkContinue$, clientError$, upgrade$;
		if (this.config.allowUpgrade) {
			const upgrade$ = FromEventObservable.call(this.server, /(connect|upgrade)/,
				(req: IncomingMessage, socket: Socket, head: Buffer) => {
					this.upgrader.next({req, socket, head});
			});
		 }

		if (this.config.handleClientError) {
			const clientError$ = FromEventObservable.call(this.server, 'clientError', 
				(err: Error, socket: Socket) => { 
					this.config.handleClientError(err, socket);
			});
		 }
		if (this.config.handleCheckContinue) {
			const checkContinue$ = FromEventObservable.call(this.server, 'checkContinue',
				(req: IncomingMessage, res: ServerResponse) => {
					res.writeContinue();
					this.server.emit('request', req, res);
			});
		 }

		return BoundCallbackObservable.call(
			this.server.listen(
				this.config.env.PORT, 
				this.config.env.HOST, 
				this.config.backlog,
			),
			() => {
				super.next(ServeREvent.Listening)
				if (this.config.onListeningMessage) this.config.onListening();
			}
		).merge(request$, error$, close$, upgrade$, checkContinue$, clientError$)
	};

	_handle(from: string, err?: Error) {

	}

};
