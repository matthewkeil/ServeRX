
import * as net from 'net';
import * as http from 'http';


import { merge } from 'rxjs/operator/merge';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable'; 
import { FromEventObservable } from 'rxjs/observable/FromEventObservable';


import { ServerConfig } from '../ConfigRX';
import { RequesteR, IncomingReq } from '../messages/RequesteR';
import { RespondeR, OutgoingRes, ResponseStatus } from '../messages/RespondeR';
import { PoolR, PoolData } from './PoolR';
import { RouteR } from '../routes/RouteR'; 

export type SocketData = Buffer | string;

// export enum SocketStatus {
// 	new,
// 	active,
// 	open,
// 	closed,
// 	error,
// 	timeout
// }

// const Status = SocketStatus;

export interface HandleRI {
	socket: Socket;
	protocol: string;
	req?: RequesteR;
	res?: RespondeR;
	

	next(data: PoolData): void;
	error(err: Error): void;
	complete(): void;
	// encoding?: string;
	// setTimeout(msec: number, callback: Function): void;
	// write(chunk: any, encoding: string, callback: Function): boolean;
	// writeHead(statusCode: number, statusMessage: string, headers: Headers)
	// end(data?: any, encoding?: string, callback?: Function): void;
	// setEncoding(encoding: string): void
	// objectMode?: boolean;
	// read(size?: number): void; // only need in paused mode, pulls size? from internal buffer
	// pause(): void; // pauses readable stream
	// resume(): void;
	// isSecure(): boolean;
}

export class Socket extends BehaviorSubject<PoolData> {

	subscriptions?: Subscription[];

	constructor(
		public protocol: string, 
		private config: ServerConfig,
		private req: http.IncomingMessage,
		private socket: net.Socket,
		private head: SocketData
	 ) {
		super(head);
			this.router = new RouteR(this.config);
			this.subscriptions.push(
				this._buildSocketSubscription(),
				this.req.subscribe(
					request => this.router.handle(
							this.req, 
						this.res.runNext(request))
				 ),
				this.res.subscribe(status => { 
					this._updateStatus(status)
				 })
			 );
			this.req.parseMessage(_req);
	 }

	private _buildSocketSubscription(): Subscription {
		let drain$, end$, timeout$;
		if (!this.protocol.startsWith('http')) {
			drain$ = FromEventObservable.call(this.socket, 'drain', 
				() => {}
			 );
			end$ = FromEventObservable.call(this.socket, 'end', 
				() => {}
			 );
			timeout$ = FromEventObservable.call(this.socket, 'timeout', 
				() => {}
			 );
		 };
		let data$ = FromEventObservable.call(this.socket, 'data',
		   // data should be parsed to see if its another request or being pushed to the pool
			(chunk: Buffer | string) => { this._handleData$(chunk) }
		 );
		let error$ = FromEventObservable.call(this.socket, 'error',
			(err: Error) => { this.error(err) }
		 );
		let close$ = FromEventObservable.call(this.socket, 'close', 
			(had_error?: boolean) => { this.complete() }
		 );
		return merge.call(data$, close$, drain$, end$, error$, timeout$).subscribe();
	 }

	private _updateStatus(status: ResponseStatus) {
		
	 }

	private _handleData$(chunk: SocketData) {

	 }

	public imcoming(data: PoolData): void {

	 }

	public next(data: PoolData): void {

	 }

	public error(err: Error): void {

	 }
	
	public complete(): void { 
		for (let sub of this.subscriptions) {
			sub.unsubscribe(); 
		}
	 }

}
