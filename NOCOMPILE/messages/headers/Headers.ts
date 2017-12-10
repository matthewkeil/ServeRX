import { HeaderCategories } from './Headers';
import { MergeMapOperator } from './../../../00-otherServers/rxjs/operator/mergeMap';
import { HttpServerConfig } from './../../ConfigRX';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { changeCase, Case} from '../../common/caseChange';

import { from } from './../../../lib/rxjs/add/observable/from';

import * as parseRange from 'range-parser';

import { IncomingMessage } from 'http';

import { HttpServerConfig } from '../../ConfigR';
import { RequesteR } from '../RequesteR';

import { Accept, AcceptI, AcceptType } from './Accept';
import { Content, ContentI } from './Content';

import { Cors } from './Cors';
import { Authorization } from './Authorization';
import { Cache } from './Cache';
import { Cookie } from './Cookie';
import { Client } from './Client';
import { Etag } from './Etag';
import { Dnt } from './Dnt';

/// Allow in the response header if path exists but method not supported
// res tag X-Powered-By: ServeRx by Matthew Keil
// X-Frame-Options: [deny, sameorigin, allow-from, allow-all] - prevents clickjacking
// X-UA-Compatible: Chrome=1  // set ie engine to use chrome instead
// User-Agent figures out what browser and device are being used




// ServeRX headers are generic. Allows for each header to have its own type to aid with itelisense
export type Header<T> = { [name: string]: T[] };

export type Category = BaseI | AcceptI | ContentI ;

export interface HeaderCategory<Category> {
	name: string;
	getFromRaw(headers: RawHeaders): Category;
}

export interface HeadersI {
	categories: {[category: string]: HeaderCategory<any>};
	accept?: AcceptI;
	content?: ContentI;
	// host: string;
	// date: string;
	// referer: string;
	// location: string;
	// server: string;
	// // connection: Connection;
	// keepAlive: string;
	// from: string; // user-agent for contact info ie owner of a robot crawler
	// allow; // This header must be sent if the server responds with a 405 Method Not Allowed status code to indicate which request methods can be used. An empty Allow header indicates that the resource allows no request methods, which might occur temporarily for a given resource, for example.
	// templates
	// proxies;
	//  Server Actions will set these note* not sure whether to put login with headers or in general server files
	// contentDisposition;
	// retryAfter;
	// expect;
}

export class Headers implements HeadersI {

	categories: {[category: string]: HeaderCategory<any>};

	constructor(config?: HttpServerConfig) {
		Object.assign(this.categories.base, new Base(config));
		if (config.headers.accept) Object.assign(this.categories.accept, new Accept(config));
		if (config.headers.content) Object.assign(this.categories.content, new Content(config));
		// if (config.headers.authorization) Object.assign(this.categories.auth, new Authorization(config));
		// if (config.headers.cors) Object.assign(this.categories.cors, new Cors(config));
		// if (config.headers.cache) Object.assign(this.categories, { cache: new Cache(config) });
		// if (config.headers.client) Object.assign(this.categories, { client: new Client(config) });
		// if (config.headers.cookie) Object.assign(this.categories, { cookie: new Cookie(config) });
		// if (config.headers.dnt) Object.assign(this.categories, { dnt: new Dnt(config) });
		// if (config.headers.etag) Object.assign(this.categories, { etag: new Etag(config) });
	}


	public processRaw(req: IncomingMessage): RawHeaders {
		
		
	}

	public getFrom(raw: RawHeaders): BehaviorSubject<HeadersI> {

		let headers$ = new BehaviorSubject(<HeadersI>{});

		let categories = ['base'].concat(Object.getOwnPropertyNames(this.categories));
		
		Rx.Observable.from(categories)
			.map(category => {
				headers$.next(Object.assign(headers$.value[category], null)); // allows initialization timer for subscribers
				return {name: category, cat: this.categories[category].getFromRaw(raw)};
			})
			.take(categories.length)
			.subscribe(
				category => headers$.next(Object.assign(headers$.value[category.name], category.cat)),
				err => headers$.error(err),
				() => headers$.complete()
			);
		
		return headers$
	}
}

export type BaseI = {
	// ['host', 'date', 'referer', 'location', 'server', 'connection', 'keepAlive', 'from'].forEach(prop => {
	// 	if (this.raw[prop]) (<any>this)[prop] = this.raw[prop];
	// });
}

export class Base implements HeaderCategories<BaseI> {
	constructor(config: HttpServerConfig) {}
	public getFromRaw(raw: RawHeaders): BaseI {
		return (<BaseI>{});
	}
}

	// public findRaw(name: string): Header<any> {
	// 	name = toCamelCase(name);
	// 	if (name === 'referer' || name === 'referrer') name = 'referer';
	// 	let value = this.raw[name];
	// 	name = toKebabCase(name);

	// 	return { name: this.list[name], value };
	//  }

	 
	// public find(...names: string[]): Header[] {
	// 	let headers = [];
	// 	for (let name of names) {
	// 		name = toCamelCase(name);
	// 		if (name === 'referer' || name ==='referrer') name = 'referer';
	// 		if(this.list[name]) {
	// 			name = toKebabCase(name);
	// 			headers.push({name: this.list[name]})
	// 		}
	// 	}
	// 	if (!names) headers = this.list;
		
	// 	return headers;
	// }
		
	// public set(name: string, value: string): this {
	// 	name = toCamelCase(name);
	// 	if (name === 'referer' || name ==='referrer') name = 'referer';
	// 	this.list[name] = value;

	// 	return this;
	// }

	// public setHeaders(headers: Header[]): this {
	// 	for (let name in headers) {
	// 		name = toCamelCase(name);
	// 		let value = this.list[name];
	// 		name = toKebabCase(name);
	// 		Object.assign(this.list, {name: value});
	// 	}
	// 	return this;
	// }

	// public appendHeader(name: string, ...args: string[]): this {
	// 	let append = Array.isArray(args) ? args : [args];
	// 	let header = this.getHeader(toCamelCase(name));

	// 	if (header) for(let arg of append) header.value.push(arg);
	// 	else header.value = append;

	// 	this.list[name] = header.value;
		
	// 	return this;
	//  }

	// public addLink(links: any): this {
	// 	let formatedLinks = '';
	// 	formatedLinks.concat((this.getHeader('Link') + ', ') || '');

	// 	for (let link of links) {
	// 		formatedLinks.concat(`<${link}>; rel="` + links[link] + '", ');
	// 	}
		
	// 	Object.assign(this.list, {'Link': formatedLinks.substr(0, formatedLinks.length - 2)});

	// 	return this;
	// }

	// public isChunked(): boolean {
	// 	return (this.getHeader('transfer-encoding').value.join() === 'chunked');
	// }

	// public isKeepAlive(version: string): boolean {
	// 	if (this.list['connection'] === /keep-alive/) {
	// 		return true
	// 	} else {
	// 		version === '1.0' ? false : true;
	// 	}

	// }




// export type Connection = 'keep-alive' | 'close'; // comma separated list if transmission artifacts remain

// 	content: ContentR;
// 	accept: AcceptR;

// 		this.content.next(this.headers);
// 		let { types: contentTypes, length } = this.content;
		
// 		this.accept.next(this.headers);
// 		let { types: acceptTypes, encodings, charsets, languages } = this.accept
		