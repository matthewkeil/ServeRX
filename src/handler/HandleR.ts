import { Socket } from 'net';
import { IncomingMessage, ServerResponse } from 'http';


import { merge } from 'rxjs/operator/merge';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from './../lib/rxjs/BehaviorSubject';
import { FromEventObservable } from 'rxjs/observable/FromEventObservable';


import { ServeRxConfig, ServeRConfig } from './ConfigR';
import { RequestR, IncomingReq } from './RequestR';
import { RespondeR } from './RespondeR';


export enum SocketStatus {
	new,
	active,
	open,
	closed,
	error,
	timeout
}

const Status = SocketStatus;

export interface SocketRxI {
	socket: Socket;
	events__: Subscription;
	encoding?: string;
	objectMode?: boolean;
	next(): void;
	complete(): void;
	read(size?: number): void; // only need in paused mode, pulls size? from internal buffer
	pause(): void; // pauses readable stream
	resume(): void;
	setEncoding(encoding: string): void
	end(data?: any, encoding?: string, callback?: Function): void;
	setTimeout(msec: number, callback: Function): void;
	write(chunk: any, encoding: string, callback: Function): boolean;
	writeHead(statusCode: number, statusMessage: string, headers: Headers)
	isSecure(): boolean;
}

export class HandleR extends BehaviorSubject<SocketStatus> implements SocketRxI {

	socket: Socket;
	req$: RequestR;
	res: RespondeR;
	req__: Subscription;
	res__: Subscription;
	events__: Subscription;
	encoding?: string;
	objectMode?: boolean;

	constructor(public protocol: string, private config: ServeRConfig, private _req?: IncomingMessage) {
		super(0)
		if (_req) {
			this.socket = _req.socket;
			this.events__ = this._setListeners();
			this.req$ = new RequestR(<any>this.config);
			this.res = new RespondeR();
			this.req__ = this.req$.subscribe(request => 
				this.req$.handler.next(request, this.res.runNext(request)));
			// this.res__ = this.res$.subscribe(status => this.updateStatus(status));
		}
	}

	private _setListeners(): Subscription {
		let data$ = FromEventObservable.call(this.socket, 'data', 
			(chunk: Buffer | string) => { 
				this.req$.parseData(chunk);
		});
		let close$ = FromEventObservable.call(this.socket, 'close', 
			(had_error?: boolean) => {  had_error ? super.next(Status.error)
				: super.next(Status.closed);
		});
		let drain$ = FromEventObservable.call(this.socket, 'drain', 
			() => { this.handleDrain(); });
		let end$ = FromEventObservable.call(this.socket, 'end', 
			() => { super.next(Status.closed); });
		let error$ = FromEventObservable.call(this.socket, 'error', 
			(err: Error) => { super.error(err); });
		let timeout$ = FromEventObservable.call(this.socket, 'timeout', 
			() => { super.next(Status.timeout); });
		return merge.call(data$, close$, drain$, end$, error$, timeout$).subscribe();
	}


	private _nextReq(nextReq: IncomingReq) {
		this._handle(this.req.runNext(nextReq), this.resthis.res));
	}

	private sendRes(res: any) {}

	private handleDrain() {}


	read(size?: number): void { super.next(this.socket.read(size)) }; 
	pause(): void  { this.socket.pause() };
	resume(): void  { this.socket.resume() };
	setEncoding(encoding: string): void { this.socket.setEncoding(encoding) };
	destroy(): void {}
	next() {}
	complete() { this.events__.unsubscribe(); }
}

