import { Observable } from './../../00-otherServers/rxjs/Observable';
import { EWOULDBLOCK } from 'constants';
import { read } from 'fs';


import { URL } from 'url';
import * as querystring from 'querystring';
import * as http from 'http'; 
import * as bodyParser from 'body-parser';


import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { AsyncSubject } from 'rxjs/AsyncSubject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
// import { Observable } from 'rxjs/Observable';
// import { merge } from 'rxjs/operator/merge';
// import { FromEventObservable } from 'rxjs/observable/FromEventObservable';
// import { BehaviorSubject } from 'rxjs/BehaviorSubject';


import * as uuid from 'uuid';


import { HttpServerConfig } from '../ConfigRX';
import { RawHeaders, Header, Headers, HeadersI } from './headers/Headers';

export interface RequestI {
		id: string;
		raw: http.IncomingMessage;
		method?: string;
		httpVersion?: {
			major: number;
			minor: number;
		};
		url?: URL;
		protocol?: string;
		host?: string;
		path?: string;
		query?: {[key: string]: string};
		hash?: string;
		rawHeaders?: RawHeaders;
		Headers: Headers;
		headers$?: BehaviorSubject<HeadersI>;
		headers?: HeadersI;
		body$?: null | Observable<string | Buffer>;
		body?: null | Array<string | Buffer>;
		parser?: (req: http.IncomingMessage, res: http.ServerResponse) => any;
		// certificate?: Object;  // tlsSocket.getPeerCertificate(detailed?: boolean)
}

export class Request {

	headers: Headers;

	constructor(private config: HttpServerConfig) {
		this.headers = new Headers(this.config);
	}

	public parse(incoming: http.IncomingMessage): RequestI {

		let req = <RequestI>{};

		req.id = uuid.v4();
		req.raw = incoming;
		req.Headers = this.headers;
		req.method = incoming.method.toUpperCase() || 'GET';
		req.httpVersion = {
			major: incoming.httpVersionMajor,
			minor: incoming.httpVersionMinor
		};
		req.url = new URL(incoming.url);
		req.protocol = req.url.protocol;
		req.host = req.url.host;
		req.path = req.url.pathname;
		req.query = querystring.parse(req.url.search);
		req.hash = req.url.hash.startsWith('#') ? 
			req.url.hash.substr(1) :
			req.url.hash;
		req.rawHeaders = this.headers.processRaw(incoming);
		req.headers$ = this.headers.getFrom(req.rawHeaders);
		req.headers$.subscribe(headers => req.headers = headers);
		req.body$ = this.getBody(req);
		if (req.body$) req.body$.subscribe(chunk => req.body.push(chunk));
		
		return req;
	}
	
	public getBody(req: RequestI): null | Observable<string | Buffer> {
		
		// Message must be from an incoming method
		if (req.method === 'POST' || req.method === 'PATCH') {
			
			req.headers.content.type.forEach(type => {
				if (!req.parser) {
					if (type.type.includes('application')) type.subtype.includes('json') ?
						req.parser = bodyParser.json() :
						parser = bodyParser.raw
					if (type.type.includes('text')) parser = bodyParser.text;
				}
			});

			return new Observable(observer => {
				incoming.on('data', (chunk) => {
					observer.next(chunk);
				});
				req.on('end', () => {
					observer.complete();
				});
			});
		}
	
		return null;
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
	}
}