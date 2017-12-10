




import * as http from 'http';
import * as uuid from 'uuid';
import { URL } from 'url';
import * as querystring from 'querystring';
import { Observable } from 'rxjs/Observable';


import { Configuration, HttpServerConfig } from '../ConfigRX';
import { HeadersI, Headers, IncomingHeaders } from './headers/Headers';


export interface Request extends http.IncomingMessage {
	id: {
		insertId: string;
		timestamp: number;
		port: number;
		family: string;
		address: string;
	}
	method: string;
	Url: URL;
	protocol: string;
	path: string[];
	query: { [key: string]: string };
	hash: string;
	_headers?: Headers;
	headers$: IncomingHeaders;
	parse: (incoming: Request) => void;
}

function _segmentPath(pathname: string): string[] {
	
	let path = pathname.startsWith('/') ? pathname.substr(1) : pathname;

	if (path.endsWith('/')) { 
		path = path.substr(0, (path.length - 1));
	}
	
	return path.split('/')
}

export class RequestPatcher {
	
	constructor(config: HttpServerConfig, Request: any, _headers: Headers) {

		Object.keys(RequestPatcher).forEach(method => {
			Object.assign(
				Request.prototype[method], 
				RequestPatcher[method](config)
			)
		});

		Request._headers = _headers;

	}

	static parse = (incoming: Request): void => {

		incoming.method = incoming.method.toUpperCase() || 'GET';
		incoming.Url = new URL(incoming.url);
		incoming.protocol = incoming.Url.protocol;
		incoming.path = _segmentPath(incoming.Url.pathname);
		incoming.query = querystring.parse(incoming.Url.search);
		incoming.hash = incoming.Url.hash.startsWith('#') ?
			incoming.Url.hash.substr(1) :
			incoming.Url.hash;
		incoming.headers$ = incoming._headers.parse(incoming);
		
		return
	}


}