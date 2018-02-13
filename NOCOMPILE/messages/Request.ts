import { Response } from './Response';


import * as net from 'net';
import * as http from 'http';


import * as uuid from 'uuid';
import * as url from 'url';
import * as Querystring from 'querystring';
import * as Rx from 'rxjs';



import * as CC from '../common/CaseChange';
import { Ms, MatchString } from './../common/MatchString';
import { RootRouter, RouteHandler } from './../routing/Router';
import { Configuration, HttpServerConfig } from '../ConfigRX';
import { Header, Headers, IncomingHeaders, HeaderPriority, HeaderValue } from './headers/Headers';
import { HeaderExecutionOrder } from '../handlers/HttpHandler';

export type Parameters = {[param: string]: string | string[]}

export class User {
	public authorization(req: Request): Rx.Observable<Authorization> {
	  return new Rx.Observable<Authorization>(obs => {
		  if (!req.headers$.authorization && !req.headers$.cookie) obs.error(
			  new Error('Authorization required'))
		  obs.next(req.headers$.authorization)
		  obs.complete()

		  })
  }
}

export interface Authorization {
	isRequired: boolean
	isAuthorized: boolean
}

export interface Request extends http.IncomingMessage {
	
	_headers: Headers
	_router: RootRouter
	_user: User


	parse: () => void
	getHeaders: (req: Request, res: Response) => Rx.Observable<IncomingHeaders> 
	getHandler: () => Rx.Observable<RouteHandler>
	_getRouteHandler: () => Rx.Observable<RouteHandler>
	routeHandler?: RouteHandler
	
	
	id: {
		insertId: string;
		timestamp: number;
		port: number;
		family: string;
		address: string;
	}
	method: string;
	_url: url.Url;
	path: MatchString;
	params: Parameters
	query: Parameters;
	hash: string;
	headers$: IncomingHeaders;


	auth: Authorization;


}

export function RequestPatcher(IncomingMessage: Function, config: HttpServerConfig, headers: Headers, router: RootRouter ): any {

	IncomingMessage.prototype.parse = function parse(): void {
		
		(<Request>this).auth = <Authorization>{};

		(<Request>this).method = this.method.toUpperCase() || 'GET';
		(<Request>this)._url = url.parse(this.url, true);
		(<Request>this).path = Ms.pathToMs((<url.Url>this._url).pathname);
		(<Request>this).params = Ms.extractParams(this.path);
		(<Request>this).query = (<url.Url>this._url).query;

		let queryKeys = Object.keys(this.query);
		if (queryKeys.length > 0)
			queryKeys.forEach(key => this.params.hasOwnProperty(key) ?
				this.params[key] = [].concat(this.params[key], this.query[key]) :
				this.params[key] = this.query[key]);

		(<Request>this).hash = (<url.Url>this._url).hash.startsWith('#') ?
			this._url.hash.substr(1) :
			this._url.hash;

		return
	}

	IncomingMessage.prototype.getHeaders = function getHeaders(req: Request, res: Response): Rx.Observable<IncomingHeaders> {
		return Headers.parseIncoming(req, res)
	}

	IncomingMessage.prototype.getHandler = function getHandler(): Rx.Observable<RouteHandler> {
		return (<Request>this)._router.returnRouteHandler(this.path)
	}


}
