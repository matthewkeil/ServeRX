
import * as parseRange from 'range-parser';

export type Header = {[name: string]: string[];

export class Headers {

	public list: Header[];

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

	public setNoCache(version: string): this {
		if (version === '1.1') {
			this.list['Cache-Control'] = 'no-cache, no-store, must-revalidate';
		} else if (version === '1.0') {
			this.list['Pragma'] = 'no-cache';
		} else {
			this.list['Expires'] = '0';
		}

		return this;
	};

	public setCache(type?: string, options?: any): this {
		if (typeof type !== 'string') {
			options = type;
			type = 'public';
		}

		if (options && options.maxAge !== undefined) {
			type += ', max-age=' + options.maxAge;
		}

		this.list['Cache-Control'] = type;
		return this;
	};

	public isKeepAlive(version: string): boolean {

		if (this.list['connection'] === /keep-alive/) {
			return true
		} else {
			version === '1.0' ? false : true;
		}

	};

};


