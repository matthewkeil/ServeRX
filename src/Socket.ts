
export interface SocketRxI extends ServerResponse {
	socket: Socket;
	events__: Subscription;
	encoding?: string;
	objectMode?: boolean;
	read(size?: number): void; // only need in paused mode, pulls size? from internal buffer
	pause(): void; // pauses readable stream
	resume(): void;
	setEncoding(encoding: string): void
	next(): void;
	complete(): void;

	isSecure(): boolean;
}

export class SocketRx extends BehaviorSubject<Buffer | String> implements SocketRxI {

	socket: Socket;
	events__: Subscription;
	encoding?: string;
	objectMode?: boolean;
	
	constructor(req: IncomingMessage, res: ServerResponse) {
		super('SocketRx by Matthew Keil')
		this.socket = req.socket;
		this.events__ = this._setListeners();
	}

	private _setListeners(): Subscription {
		let data$ = FromEventObservable.call(this.socket, 'data', 
			(buffer: Buffer | string) => { 
				super.next(buffer);
			});
		let close$ = FromEventObservable.call(this.socket, 'close', 
			(had_error?: boolean) => { 
				if(had_error) super.error(had_error);
				super.complete();
			});
		let drain$ = FromEventObservable.call(this.socket, 'drain', 
			() => {
				super.next(); 
			});
		let end$ = FromEventObservable.call(this.socket, 'end', 
			() => { 
				super.complete();
			});
		let error$ = FromEventObservable.call(this.socket, 'error', 
			(err: Error) => { 
				super.error(err);
			});
		let timeout$ = FromEventObservable.call(this.socket, 'timeout', 
			() => { 
				super.complete();
			});
		return merge.call(data$, close$, drain$, end$, error$, timeout$).subscribe();
	}

	read(size?: number): void { super.next(this.socket.read(size)) }; 
	pause(): void  { this.socket.pause() };
	resume(): void  { this.socket.resume() };
	setEncoding(encoding: string): void { this.socket.setEncoding(encoding) };
	destroy(): void {}
	next() {}
	complete() { this.events__.unsubscribe(); }
}

export class PoolRx {

}