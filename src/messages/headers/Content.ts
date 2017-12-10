



import * as Rx from 'rxjs';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

import { HttpServerConfig } from '../../ConfigRX';
import { Headers, Header } from './Headers';

// accept // no accept-'*'
// charset;
// encoding;
// language;
// ranges;

// import { IncomingMessage } from 'http';
// import { RawHeaders, Category, HeaderCategory } from './Headers';



export type ContentType = {
	mime: string;
	sub?: string;
}

export interface AcceptType extends ContentType {
	q?: number;
}
	
export type AcceptCharset = {
	charset: string;
	q?: number;
}

export type Directive = 
	'gzip' | 
	'compress' | 
	'deflate' | 
	'br' | 
	'identity';
	
export type AcceptEncoding = {
	directive: string;
	q?: number;
}

export type AcceptLanguage = {
	language: string;
	locale?: string;
	q?: number;
}

export class Content {

	// incoming
	public acceptCharset: Header<AcceptCharset>;
	public acceptEncoding: Header<AcceptEncoding>;
	public acceptLanguage: Header<AcceptLanguage>;
	public acceptType: Header<AcceptType>;

	// outgoing
	public ContentType: Header<ContentType>;


	constructor(private _config: HttpServerConfig) {
		this.acceptCharset = this._config.headers.incoming.acceptCharset ?
			Content.acceptCharset : Headers.notRead;
		this.acceptEncoding = this._config.headers.incoming.acceptEncoding ? 
			Content.acceptEncoding(this._config) : Headers.notRead;
		this.acceptLanguage = this._config.headers.incoming.acceptLanguage ? 
			Content.acceptLanguage :Headers.notRead;
		this.acceptType = this._config.headers.incoming.acceptType ?
			Content.acceptType : Headers.notRead;

		this.ContentType = Content.contentType;
	}

	private static directives = [
		'*'
		, 'compress'
		, 'deflate'
		, 'br'
		, 'identity'
		, 'gzip'
	];

	static acceptCharset: Header<AcceptCharset> = {
		get: (charsets: string[]): Rx.Observable<AcceptCharset> => {
			return Rx.Observable.from(charsets.map(
				set => {
					let values = set.split(';');
					return { charset: values[0], q: +values[1] }
				}
			));
		}
	}
	
	static acceptEncoding(config: HttpServerConfig): Header<AcceptEncoding> {
		return {
			get: (encodings: string[]): Rx.Observable<AcceptEncoding> => {
				return Rx.Observable.from(encodings.map(
					set => {
						let values = set.split(';');
						return { directive: values[0], q: +values[1] }
					}
				));
			}
		}
	}

	static acceptLanguage: Header<AcceptLanguage> = {
		get: (languages: string[]): Rx.Observable<AcceptLanguage> => {
			return Rx.Observable.from(languages.map(
				lang => {
					let values = lang.split(';');
					let language = values[0].split('-');
					return { language: language[0], locale: language[1], q: +values[1]}
				}
			))
		}
	}

	static acceptType: Header<AcceptType> = {
		get: (types: string[]): Rx.Observable<AcceptType> => {
			return Rx.Observable.from(types.map(
				type => {
					let values = type.split(';');
					let mime = values[0].split('/');
					return { mime: mime[0], subType: mime[1], q: +values[1]}
				}
			))
		}
	}

	static contentType: Header<ContentType> = {
		set: (type: ContentType): void => {} 
}


// static getEncoding(config: HttpServerConfig): (encodings: string[]) => Rx.Observable<AcceptEncoding> {
		// 	return (encodings: string[]) => {

		// 		let acceptedDirectives = Accept.directives.concat(config.headers.accept.acceptedDirectives);
				
		// 		return new Rx.Observable(observer => {
		// 			encodings.forEach(encoding => {
		// 				let values = encoding.split(';');
		// 				acceptedDirectives.forEach(dir => {
		// 					let found = false;
		// 					if (values[0] === dir) {
		// 						let found = true;
		// 						observer.next({directive: <Directive>values[0], q: +values[1]});
		// 						return;
		// 					}
		// 					observer.error(new Error('Accept-Encoding Directive not recognized'))
		// 				});
		// 			});
		// 			observer.complete();
		// 		});

		// 	}
		// }