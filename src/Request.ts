

import * as EventEmitter from 'events';import * as stream from 'stream';
import { Socket } from 'net';
import * as url from 'url';
import { IncomingMessage, ServerResponse } from 'http';

import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { merge } from 'rxjs/operator/merge';
import { FromEventObservable } from 'rxjs/observable/FromEventObservable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export type IncomingReq = http.IncomingRequest | https.IncomingRequest;

export interface RequestRxI {

	private _socket: SocketRx;
	req?: IncomingReq;
	content: Content;
	accepts: Accepts;
	method?: string;
	url?: {
		href?: string;
		search?: string;
		query?: {[param: string]: string};
		pathname?: string; };
	httpVersion?: string
	headers?: {[name: string]: string};
	body?: string | Buffer;
	certificate?: Object;  // tlsSocket.getPeerCertificate(detailed?: boolean) t
	startHandlerTimer(handlerName: string): {
		[serverName: string]: string;
		[_currentRoute: string]: string;
		[name: string]: string;
		[_dtraceId: string]: string;
	};
	endHandlerTimer(handlerName: string): {
		[serverName: string]: string;
		[_currentRoute: string]: string;
		[name: string]: string;
		[_dtraceId: string]: string;
	};
}

export class RequestRx implements RequestRxI {

	headers: HeadeR;
	content: ContentR;
	accepts: AcceptR;
	method: string;
	url: {
		href?: string;
		search?: string;
		query?: {[param: string]: string};
		pathname?: string; };
	httpVersion: string;
	body?: string | Buffer;

	constructor(public req: IncomingReq) {
		this.method = req.method;
		this.url = url.parse(req.url, true);
		this.httpVersion = req.httpVersion;
		if (req.headers['Date']) {
			this.headers = new HeadeRx(req);
			this.content = new ContentRx(req);
			this.accepts = new AcceptRx(req);
		}
		if (this.req.hasBody()) {
			this.body = Helpers.parseBody(req);
		}
	}

	}	
}

/**
 * Start the timer for a request handler function. You must explicitly invoke
 * endHandlerTimer() after invoking this function. Otherwise timing information
 * will be inaccurate.
 * @public
 * @function startHandlerTimer
 * @param    {String}    handlerName The name of the handler.
 * @returns  {undefined}
 */
Request.prototype.startHandlerTimer = function startHandlerTimer(handlerName) {
    var self = this;

    // For nested handlers, we prepend the top level handler func name
    var name = (self._currentHandler === handlerName ?
                handlerName : self._currentHandler + '-' + handlerName);

    if (!self._timerMap) {
        self._timerMap = {};
    }

    self._timerMap[name] = process.hrtime();

    dtrace._rstfy_probes['handler-start'].fire(function () {
        return ([
            self.serverName,
            self._currentRoute, // set in server._run
            name,
            self._dtraceId
        ]);
    });
};
/**
 * Stop the timer for a request handler function.
 * @public
 * @function endHandlerTimer
 * @param    {String}    handlerName The name of the handler.
 * @returns  {undefined}
 */
Request.prototype.endHandlerTimer = function endHandlerTimer(handlerName) {
    var self = this;

    // For nested handlers, we prepend the top level handler func name
    var name = (self._currentHandler === handlerName ?
                handlerName : self._currentHandler + '-' + handlerName);

    if (!self.timers) {
        self.timers = [];
    }

    self._timerMap[name] = process.hrtime(self._timerMap[name]);
    self.timers.push({
        name: name,
        time: self._timerMap[name]
    });

    dtrace._rstfy_probes['handler-done'].fire(function () {
        return ([
            self.serverName,
            self._currentRoute, // set in server._run
            name,
            self._dtraceId
        ]);
    });
};