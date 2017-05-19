
import { 
	createServer,
	Server,
	IncomingMessage,
	ServerResponse } from 'http';
import * as net from 'net';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { ServeRxConfig } from './ConfigR';
import { RequestR, IncomingReq } from './RequestR';
import { SocketR } from './SocketR';

export interface HttpSocketUpgrade {
	req: IncomingMessage;
	socket: net.Socket;
	head: Buffer;
}

export type HttpClientError = {
	err: Error;
	socket: net.Socket;
};

export type HttpEvent = HttpClientError | HttpSocketUpgrade;

export class HttpR extends Observable<HttpEvent> {

	constructor(public config: ServeRxConfig<any>) {
		super((observer: Observer<HttpEvent>) => {
			let _server = createServer();
			_server.maxHeadersCount = this.config.http.maxHeadersCount;
			_server.setTimeout(this.config.http.timeout.ms, this.config.http.timeout.cb);
			_server.timeout = this.config.http.timeout.ms;
			_server.on('listening', () => { 
				if (this.config.http.onListeningMessage) {
					this.config.onListening();
				}});
			_server.on('request',
				(req: IncomingMessage, res: ServerResponse) => { 
					if (this.config.http.requestHandler) {
						let socket__ = new SocketR(config, 'http', req, res);
					} else { 
						res.statusCode = 500;
						res.end({"message":"<h1>No Request Handler Found<h1>"}, 'utf8');
					}});
			_server.on('checkContinue',
				(req: IncomingMessage, res: ServerResponse) => { 
					if (this.config.http.handleCheckContinue) {
						res.writeContinue();
						_server.emit('request', req, res);
					}});
			_server.on('connect',
				(req: IncomingMessage, socket: net.Socket, head: Buffer) => {
					if (this.config.http.allowUpgrade) { 
						observer.next({req, socket, head});
					}});
			_server.on('upgrade',
				(req: IncomingMessage, socket: net.Socket, head: Buffer) => {
					if (this.config.http.allowUpgrade) { 
						observer.next({req, socket, head});
					}});
			_server.on('clientError', 
				(err: Error, socket: net.Socket) => { 
					if (this.config.http.handleClientError) {
						observer.next({err, socket});
					}});
			_server.on('error', err => observer.error(err) );
			_server.on('close', () => {
				_server.removeAllListeners();
				if (this.config.http.onCloseMessage) {
					this.config.onClose(); }
				observer.complete(); });
			_server.listen(this.config.http.env.PORT);
		});
	};
}