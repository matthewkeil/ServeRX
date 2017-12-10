


import * as Rx from 'rxjs';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';


import * as CC from '../../common/CaseChange';
import { HttpServerConfig } from '../../ConfigRX';
import { Request } from './../Request';
import { 
	Content, 
	AcceptCharset,
	AcceptEncoding, 
	AcceptLanguage, 
	AcceptType,
	ContentType } from './Content';


// // RawHeaders parallel the Node provided header object but names are camelCase and values are an Observable Aarray
// export type RawHeaders = {[name: string]: string[]};


// {
	// 	acceptCharset?: Rx.Observable<AcceptCharset>;
	// 	acceptEncoding?: Rx.Observable<AcceptEncoding>;
	// 	acceptLanguage?: Rx.Observable<AcceptLanguage>;
	// 	acceptType?: Rx.Observable<AcceptType>;
//}

export type SetDirective<T> = ((args?: T | T[]) => void) | { 
	[subDirective: string]: SetDirective<T> 
}

export class Header<T> {
	get?: (args: string[]) => Rx.Observable<T>;
	set?: SetDirective<T>;
}

export interface IncomingHeaders {
	[headerName: string]: Rx.Observable<any>
}

export interface OutgoingHeaders extends Headers {
	que: [{[headerName: string]: string[]}];
	sent?: [{
		headerName: string;
		timestamp?: number;
	}];
}

export class Headers {

	acceptCharset?: Header<AcceptCharset>;
	acceptEncoding?: Header<AcceptEncoding>;
	acceptLanguage?: Header<AcceptLanguage>;
	acceptType?: Header<AcceptType>;
	contentType?: Header<ContentType>;

	static notRead: Header<any> = {
		get: (args: any) => {
			let error = new Error('Header not read by server');
			(<any>error).args = args;
			return ErrorObservable.create(error);
		}
	}

	constructor(private _config: HttpServerConfig) {

		let categories = [
			new Content(this._config)
		];

		categories.forEach(category => {
			Object.getOwnPropertyNames(category).forEach(prop => {
				Object.assign(this[prop], category[prop]);
			});
		});

	}


	/* 
	* parse() normalizes Node provided raw headers such that all names are 
	* converted to camel case and values are split into an array. Values
	* are assigned to an observable if the header is read otherwise an error
	* observable is returned with the args attached to the error object.
	*
	* https://nodejs.org/dist/latest-v8.x/docs/api/http.html#http_message_headers
	*/

	public parse(req: Request): HeadersI {

		let headers = <HeadersI>{};

		for (let key in req.raw.headers) {
			
			let name = CC.of(key, CC.To.camel);
			let value: string[] = [];
			let headerVal: Rx.Observable<any>;
			
			// Normalize 'referer' tag name
			if (name === 'referrer' || name === 'referer') name = 'referer';
			
			/**
			 * Check for an array of values and if not an array split on the ',' 
			 * and push values into array. Node already checks for duplicate 
			 * values hence no need to check for duplicates again
			 */
			Array.isArray(req.raw.headers[key]) ?
				value = (<string[]>req.raw.headers[key]).map(val => val.trim()) :
				(<string>req.raw.headers[key]).split(',')
					.forEach(val => value.push(val.trim()));

			this[name] !== undefined ? 
				headerVal = (<Header<any>>this[name]).get(value) :
				headerVal = Headers.notRead.get(value);
			
			Object.assign(headers, {[name]: headerVal});
		};

		return headers;
	}
	
}
