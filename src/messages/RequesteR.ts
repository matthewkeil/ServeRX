

import * as Url from 'url';
import { IncomingMessage } from 'http';

import { uuidv4 } from 'uuid/v4';

import { Subject } from 'rxjs/Subject';
// import { Observable } from 'rxjs/Observable';
// import { merge } from 'rxjs/operator/merge';
// import { FromEventObservable } from 'rxjs/observable/FromEventObservable';
// import { BehaviorSubject } from 'rxjs/BehaviorSubject';


import { HttpServeRConfig } from '../ConfigR';
import { Header, HeadeR } from './headers/HeadeR';
import { ContentR } from './headers/ContentR';
import { AcceptR } from './headers/AcceptR';
import { Helpers } from '../HelpeR';

export interface IncomingReq {
		id: string;
		method?: string;
		url?: {
			href?: string;
			pathname?: string;
			query?: {[param: string]: string};
			hash?: string;
		}
		httpVersion?: string;
		certificate?: Object;  // tlsSocket.getPeerCertificate(detailed?: boolean)
		headers?: {
			list: Header[];
		};
		accept?: {
			types?: string[];
			encodings?: string[];
			charsets?: string[];
			languages?: string[];
		};
		content?: {
			length?: number;
			types?: string[];
		}
		body?: string | Buffer;
}

export class RequesteR extends Subject<IncomingReq> implements IncomingReq {

	que?: IncomingReq[];
	id: string;
	headers: HeadeR;
	method?: string;
	url?: {
		href?: string;
		pathname?: string;
		query?: {[param: string]: string};
		hash?: string;
	 }
	httpVersion: string;
	body?: string | Buffer;

	constructor(private config: HttpServeRConfig) {
		super();
		this.headers = new HeadeR(this.config);
	 }

	public parseMessage(req: IncomingMessage): void {

		let thisReq = <IncomingReq>{};
		thisReq.id = this.id = uuidv4();
		thisReq.method = this.method = req.method.toUpperCase() || 'GET';
		thisReq.url = this.url = Url.parse(req.url, true);
		thisReq.httpVersion = this.httpVersion = req.httpVersion;
		
		this.headers.getFrom(req);
		thisReq.headers = this.headers;
		for (let name in Object.getOwnPropertyNames(this.headers)) if(
			name !== 'que' &&
			name !== 'id' &&
			name !== 'headers' &&
			name !== 'method' &&
			name !== 'url' &&
			name !== 'httpVersion' &&
			name !== 'body') Object.assign(this, name);

		thisReq.body = this.body = this.parseBody(req);
		
		this.que.push(thisReq);
		this.next(thisReq);
	 }

	public parseData(buffer: any): void {
		//  req line
		//  headers are colon ':' separated pairs
		//  lines end with carriage return (CR) and line feed (LF sequence)
		//  end of the headers is denoted by empty line ie. double '(CR)(LF)'

		// 1) if buffer turns out to be another request
		//    super.next(newReq)
		// 2) if buffer if data pertaining 
		//    search through que for reqId and handle whatever it is
	 }

	public parseBody(req: IncomingMessage): Buffer | string {
		return '';
	 }

	public startHandlerTimer(handlerName): void {
		/**
		 * Start the timer for a request handler function. You must explicitly invoke
		 * endHandlerTimer() after invoking this function. Otherwise timing information
		 * will be inaccurate.
		 * @public
		 * @function startHandlerTimer
		 * @param    {String}    handlerName The name of the handler.
		 * @returns  {undefined}
		*/
		// // For nested handlers, we prepend the top level handler func name
		// var name = (this._currentHandler === handlerName
		// 	? handlerName 
		// 	: this._currentHandler + '-' + handlerName);

		// if (!this._timerMap) {
		// 	this._timerMap = {};
		// }

		// this._timerMap[name] = process.hrtime();

		// dtrace._rstfy_probes['handler-start'].fire(function () {
		// 	return ({
		// 			serverName: this.serverName,
		// 			_currentRoute: this._currentRoute, // set in server._run
		// 			name: name,
		// 			_dtraceId: this._dtraceId
		// 	});
		// });
	 }

	public endHandlerTimer(handlerName): void {
		/**
		 * Stop the timer for a request handler function.
		 * @public
		 * @function endHandlerTimer
		 * @param    {String}    handlerName The name of the handler.
		 * @returns  {undefined}
		*/
		// var self = this;

		// // For nested handlers, we prepend the top level handler func name
		// var name = (self._currentHandler === handlerName ?
		// 				handlerName : self._currentHandler + '-' + handlerName);

		// if (!self.timers) {
		// 	self.timers = [];
		// }

		// self._timerMap[name] = process.hrtime(self._timerMap[name]);
		// self.timers.push({
		// 	name: name,
		// 	time: self._timerMap[name]
		// });

		// dtrace._rstfy_probes['handler-done'].fire(function () {
		// 	return ({
		// 				serverName: this.serverName,
		// 				_currentRoute: this._currentRoute, // set in server._run
		// 				name: name,
		// 				_dtraceId: this._dtraceId
		// 		});
		// });
	 }

}