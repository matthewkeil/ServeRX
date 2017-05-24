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
import { Dnt } from './Dnt';

/// Allow in the response header if path exists but method not supported
// res tag X-Powered-By: ServeRx by Matthew Keil
// X-Frame-Options: [deny, sameorigin, allow-from, allow-all] - prevents clickjacking
// X-UA-Compatible: Chrome=1  // set ie engine to use chrome instead
// User-Agent figures out what browser and device are being used


export const camelCase = /^[a-z0-9]*([A-Z][a-z0-9$]*)*$/;
export function toCamelCase(name: string): string {
	
	let words;
	if (camelCase.test(name)) return name;
	else words = name.split(/-_\s/);
	
	words.forEach(name => name = name[0].toUpperCase() + name.substr(1).toLowerCase());
	let newName = words.join();
	
	return newName[0].toLowerCase() + newName.substr(1);
 }

export const kebabCase = /^([A-Z][a-z0-9]*)-([A-Z][a-z0-9]*)*$/;
export function toKebabCase(name: string, upperCase: boolean = true): string {
	
	let words;
	if (kebabCase.test(name)) return name;
	else words = name.split(/([A-Z]|[-_0-9\s]*)/);
	
	words.forEach(name => name = 
		upperCase ? name[0].toUpperCase() : name[0].toLowerCase()
			+ name.substr(1).toLowerCase());
	let newName = words.join('-');
	
	return newName;
 }

export type Connection = 'keep-alive' | 'close'; // comma separated list if transmission artifacts remain
export type RawHeader = {[name: string]: string};
export class Header<T> {

	name: string;
	value: T[];
 }

export class HeadeR {

	raw?: RawHeader[];
	Accepts: Accepts;
	Authorization: Authorization;
	Cache: Cache;
	Content: Content;
	Cookie: Cookie;
	Cors: Cors;
	Client: Client;
	Etag: Etag;
	Dnt: Dnt;

		host: string;
		date: string;
		referer: string;
		location: string;
		server: string;
		connection: Connection;
		keepAlive: string;
		from: string; // user-agent for contact info ie owner of a robot crawler
		allow; // This header must be sent if the server responds with a 405 Method Not Allowed status code to indicate which request methods can be used. An empty Allow header indicates that the resource allows no request methods, which might occur temporarily for a given resource, for example.


	// templates
		// proxies;
		
		//  Server Actions will set these note* not sure whether to put login with headers or in general server files
		// contentDisposition;
		// retryAfter;
		// expect;


	constructor(config?: HttpServeRConfig) {
		if (config.headers.dnt) this.Dnt = new Dnt(config);
		if (config.headers.cors) this.Cors = new Cors(config);
		if (config.headers.etag) this.Etag = new Etag(config);
		if (config.headers.cache) this.Cache = new Cache(config);
		if (config.headers.cookie) this.Cookie = new Cookie(config);
		if (config.headers.client) this.Client = new Client(config);
		if (config.headers.accepts) this.Accepts = new Accepts(config);
		if (config.headers.content) this.Content = new Content(config);
		if (config.headers.authorization) this.Authorization = new Authorization(config);
	 }

	public getFrom(req: IncomingMessage): void {
		Object.keys(req.headers).forEach(key => {
			toCamelCase(key);
			this.raw.push({key: req.headers[key]})
		 });
		['Accepts', 'Authorization', 'Cache', 'Content', 'Cookie', 'Cors', 'Client',
		'Etag', 'Dnt'].forEach(category => {
			if (this[category]) {
				this[category]['get' + category](this.list);
				for (let prop of Object.getOwnPropertyNames(this[category])) {
					Object.assign(this, prop);
			 	 }
			 }
		 });
	 }

	public getHeader(name: string): Header {
		name = toCamelCase(name);
		if (name === 'referer' || name ==='referrer') name = 'referer';
		let value = this.list[name];
		name = toKebabCase(name);
		return { name: this.list[name] };
	 }

	public setHeader(name: string, value: string): this {
		
		name = toCamelCase(name);
		if (name === 'referer' || name ==='referrer') name = 'referer';
		this.list[name] = value;
		return this;
	 }

	public getHeaders(...names: string[]): Header[] {

		let headers = [];

		for (let name of names) {
			name = toCamelCase(name);
			if (name === 'referer' || name ==='referrer') name = 'referer';
			if(this.list[name]) {
				name = toKebabCase(name);
				headers.push({name: this.list[name]})
			 }
		 }
		if (!names) headers = this.list;
		
		return headers;
	 }
	
	public setHeaders(headers: Header[]): this {
		for (let name in headers) {
			name = toCamelCase(name);
			let value = this.list[name];
			name = toKebabCase(name);
			Object.assign(this.list, {name: value});
		}
		return this;
	 }

	public appendHeader(name: string, ...args: string[]): this {
		
		let append = Array.isArray(args) ? args : [args];

		let header = this.getHeader(toCamelCase(name));
		if (header) for(let arg of append) header.value.push(arg);
		else header.value = append;

		this.list[name] = header.value;
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

		return (this.getHeader('transfer-encoding').value.join() === 'chunked');
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
		