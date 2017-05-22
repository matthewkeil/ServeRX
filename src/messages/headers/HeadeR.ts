import { from } from './../../../lib/rxjs/add/observable/from';

import * as parseRange from 'range-parser';

import { IncomingMessage } from 'http';

import { HttpServeRConfig } from '../../ConfigR';
import { RequesteR } from '../RequesteR';

import { Accepts } from './Accepts';
import { Cors } from './Cors';
import { Authorization } from './Authorization';
import { Cache } from './Cache';
import { Content } from './Content';
import { Cookie } from './Cookie';
import { Client } from './ClientAccepts';
import { Etag } from './Etag';

/// Allow in the response header if path exists but method not supported
// res tag X-Powered-By: ServeRx by Matthew Keil
// X-Frame-Options: [deny, sameorigin, allow-from, allow-all] - prevents clickjacking
// X-UA-Compatible: Chrome=1  // set ie engine to use chrome instead
// User-Agent figures out what browser and device are being used

export type Header = {[name: string]: string[]};

export class HeadeR {

	accepts: Accepts;
	cors: Cors;
	authorization: Authorization;
	cache: Cache;
	content: Content;
	cookie: Cookie;
	client: Client;
	etag: Etag;

	// templates
		// accept;
		// accessControl; // CORS
		// authorization; // The HTTP Authorization request header contains the credentials to authenticate a user agent with a server, usually after the server has responded with a 401 Unauthorized status and the WWW-Authenticate header.
		// cache;
		// content;
		// cookie;
		// client; // user-agent etc.
		// etag;
		// proxies;

		// // handle directly in headers module
		// server;
		// connection;
		// keepAlive;
		// location;
		// referer;
		// dnt
		// date;
		// from;
		// host;

		
		// //  Server Actions will set these note* not sure whether to put login with headers or in general server files
		// contentDisposition;
		// allow; // This header must be sent if the server responds with a 405 Method Not Allowed status code to indicate which request methods can be used. An empty Allow header indicates that the resource allows no request methods, which might occur temporarily for a given resource, for example.
		// retryAfter;
		// expect;


	constructor(config?: HttpServeRConfig) {
		if (config.headers.accepts) this.accepts = Accepts;
		if (config.headers.cors) this.cors = cors;
		if (config.headers.authorization) this.authorization = authorization;
		if (config.headers.cache) this.cache = cache;
		if (config.headers.content) this.content = content;
		if (config.headers.cookie) this.cookie = cookie;
		if (config.headers.client) this.client = client;
		if (config.headers.etag) this.etag = etag;
		// accessControl; // CORS
		// authorization; // The HTTP Authorization request header contains the credentials to authenticate a user agent with a server, usually after the server has responded with a 401 Unauthorized status and the WWW-Authenticate header.
		// cache;
		// content;
		// cookie;
		// client; // user-agent etc.
		// etag;
		// proxies;
	 }

	getFrom(req: IncomingMessage): void {
		Object.keys(req.headers).forEach(key => {
			key.toLowerCase();
			this.list.push({key: req.headers[key]})
		});
	 }

	public getHeader(name: string): string {
		return this.list[name.toLowerCase()].;
	 }

	public setHeader(name: string, value: string): this {
		this.list[name.toLowerCase()] = value;
		return this;
	 }

	public getHeaders(...names: string[]): Header[] {

		let headers = [];

		for (let name of names) {
			name.toLowerCase();
			if(this.list[name]) { 
				if (name === 'referer' || name ==='referrer') {
					headers.push(this.list['referer'], this.list['referrer']);
				} else headers.push(this.list[name])
			}
		}

		if (!names) headers = this.list;
		
		return headers;
	 }
	
	public setHeaders(headers: Header[]): this {
		for (let header in headers) {
			Object.assign(this.list, {header: headers[header]});
		}
		return this;
	 }

	public appendHeader(name: string, ...args: string[]): this {
		
		let value = this.getHeader(name);
		let append = Array.isArray(args) ? args.join(' ') : String(args);
		
		if (value) {
			value.concat(' ' + append);
		} else { 
			value = append;
		}

		this.list[name] = value;
		return this;
	 }

	public addLink(links: any): this {

		let formatedLinks = '';
		formatedLinks.concat((this.getHeader('Link') + ', ') || '');

		for (let link of links) {
			formatedLinks.concat(`<${link}>; rel="` + links[link] + '", ');
		}
		
		Object.assign(this.list, {'Link': formatedLinks.substr(0, formatedLinks.length - 2)});
		return this;
	 }

	public isChunked(): boolean {
		return (this.getHeader('transfer-encoding') === 'chunked');
	 }


	public isKeepAlive(version: string): boolean {

		if (this.list['connection'] === /keep-alive/) {
			return true
		} else {
			version === '1.0' ? false : true;
		}

	 }

}

	content: ContentR;
	accept: AcceptR;

		this.content.next(this.headers);
		let { types: contentTypes, length } = this.content;
		
		this.accept.next(this.headers);
		let { types: acceptTypes, encodings, charsets, languages } = this.accept
		