
import * as parseRange from 'range-parser';

import { IncomingMessage } from 'http';

import { RequestR } from '../RequestR';

/// Allow in the response header if path exists but method not supported
// res tag X-Powered-By: ServeRx by Matthew Keil
// X-Frame-Options: [deny, sameorigin, allow-from, allow-all] - prevents clickjacking
// X-UA-Compatible: Chrome=1  // set ie engine to use chrome instead
// User-Agent figures out what browser and device are being used

export type Header = {[name: string]: string[]};

export class HeadeR {

	public list: Header[];

	constructor(config?: HttpServeRConfig) {
		if (req) this.next(req);
	}

	next(req: IncomingMessage) {
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
	};

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
	};



	public addLink(links: any): this {

		let formatedLinks = '';
		formatedLinks.concat((this.getHeader('Link') + ', ') || '');

		for (let link of links) {
			formatedLinks.concat(`<${link}>; rel="` + links[link] + '", ');
		}
		
		Object.assign(this.list, {'Link': formatedLinks.substr(0, formatedLinks.length - 2)});
		return this;
	};

	public isChunked(): boolean {
		return (this.getHeader('transfer-encoding') === 'chunked');
	};


	public isKeepAlive(version: string): boolean {

		if (this.list['connection'] === /keep-alive/) {
			return true
		} else {
			version === '1.0' ? false : true;
		}

	};

};


