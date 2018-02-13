import { Cors } from './Cors';
import { Response } from '../Response';



import * as Rx from 'rxjs';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';


import * as CC from '../../common/CaseChange';
import { HttpServerConfig } from '../../ConfigRX';
import { Request } from '../Request';
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

export type SetDirective = ((args?: any) => void) |
	{
		[subDirective: string]: SetDirective
	}

export type HeaderPriority = 'pre' | 'ordered' | 'info'

export type HeaderValue<G> = Rx.Observable<G>

export type HeaderFactory<H> = (config: HttpServerConfig) => Header<H>;

export class Header<G> {
	priority?: HeaderPriority;
	get?: <G>(args: string[], req: Request, res: Response) => HeaderValue<G>;
	set?: SetDirective;
}

export type IncomingHeaders = {
	[headerName: string]: {
		priority: HeaderPriority
		value: HeaderValue<any>
		req: Request
		res: Response
	}
}

export interface OutgoingHeaders extends Headers {
	que: [{[headerName: string]: string[]}];
	sent?: [{
		headerName: string;
		timestamp?: number;
	}];
}

export class Headers implements Cors {

	[Symbol.iterator]() {
		let keys = Object.keys(this);
		return {
			next() {
				return keys.length > 0 ? 
				{
					value: keys.shift(),
					done: false
				} : {
					value: undefined,
					done: true
				};
			}
		};
	};

	origin: Cors.Origin;
	accessControlExposeHeaders: Cors.AccessControlExposeHeaders;
		
	constructor(private _config: HttpServerConfig) {

		[Cors]
		.forEach(category => Object.getOwnPropertyNames(category)
			.forEach(prop => Object.assign(this, {
				[prop]: category[prop](this._config)
			}))
		);

	}

	static notRead(headerName: string, args: any): HeaderValue<any> {
		return new Rx.Observable(observer => {
			Rx.Observable.from(args).subscribe({
				next: arg => observer.next(arg),
				complete: () => observer.error(new Error(`Header ${headerName} not handled`))
			})
		})
	}

  /* 
	 * parse() normalizes Node provided raw headers such that all names are 
	 * converted to camel case and values are split into an array. Values
	 * are assigned to an observable if the header is read otherwise an error
	 * observable is returned with the args attached to the error object.
	 *
	 * https://nodejs.org/dist/latest-v8.x/docs/api/http.html#http_message_headers
	 */

	static parseIncoming(req: Request, res: Response): Rx.Observable<IncomingHeaders> {

		return new Rx.Observable<IncomingHeaders>(observer => {

			let _headers = req._headers;
			let headers = req.headers;
			let headers$ = req.headers$;
			
			Object.keys(req.headers).forEach(key => {
				
				//  Convert names to camelCase. also verifies no problematic characters
				let headerName = CC.of(key, CC.To.camel);
				
				// Normalize 'referer' tag name
				if (headerName === 'referrer' || headerName === 'referer') {
					headerName = 'referer'
				}
				/**
				 * Check for an array of values and if not an array split on the ',' 
				 * and push values into array. Node already checks for duplicate 
				 * values hence no need to check for duplicates again
				 */
				let rawVal = Array.isArray(headers[headerName]) ?
					(<string[]>headers[headerName]).map(val => val.trim()) :
					(<string>headers[headerName]).split(',').map(val => val.trim());
				
				let headerVal = {[headerName]: 
					_headers.hasOwnProperty(headerName) ? {
						value: _headers[headerName].get(rawVal, req, res),
						priority: _headers[headerName].priority,
						req,
						res
					} : {
						value: Headers.notRead(headerName, rawVal),
						priority: <HeaderPriority>'info',
						req,
						res
					}
				}

				Object.assign(headers$, headerVal);
				observer.next(headerVal);
			})

			return observer.complete();
		})
	}	


}