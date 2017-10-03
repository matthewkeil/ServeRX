
// accept // no accept-'*'
// charset;
// encoding;
// language;
// ranges;

import { IncomingMessage } from 'http';
import { HttpServerConfig } from '../../ConfigRX';
import { RawHeaders, Category, HeaderCategory } from './Headers';


export type AcceptType = {
	mime: string;
	subType?: string;
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
	directive: Directive;
	q?: number;
}

export type AcceptLanguage = {
	language: string;
	locale?: string;
	q?: number;
}

export interface AcceptI {
	type?: AcceptType[],
	charset?: AcceptCharset[],
	encoding?: AcceptEncoding[],
	language?: AcceptLanguage[]
}

export class Accept implements HeaderCategory<AcceptI> {

	public type: boolean;
	public charset: boolean;
	public encoding: boolean;
	public language: boolean;
	
	constructor(config?: HttpServerConfig) {
		config.headers.accept.charset ? this.charset = true : this.charset = false;
		config.headers.accept.encoding ? this.encoding = true : this.encoding = false;
		config.headers.accept.language ? this.language = true : this.language = false;
		config.headers.accept.type ? this.type = true : this.type = false;
	}

	public getFromRaw(headers: RawHeaders): AcceptI {
		
		let accept: AcceptI;
		
		if (this.charset) accept.charset = this.getCharset(headers);
		if (this.encoding) accept.encoding = this.getEncoding(headers);
		if (this.language) accept.language = this.getLanguage(headers);
		if (this.type) accept.type = this.getType(headers);

		return accept; 
	}

	public getCharset(headers: RawHeaders): AcceptCharset[] {
		
		let charsetHeader: AcceptCharset[] = [];

		if (headers.acceptCharset) headers.acceptCharset.forEach(
			set => {
				let values = set.trim().split(';');
				charsetHeader.push({
					charset: values[0], q: +values[1]})
			});

		return charsetHeader;
	}
	
	private directives = ['gzip', 'compress', 'deflate', 'br', 'identity', '*'];

	public getEncoding(headers: RawHeaders): AcceptEncoding[] {
		
		let encodingHeader: AcceptEncoding[] = [];

		if (headers.acceptEncoding) headers.acceptEncoding.forEach(
			enc => {
				let values = enc.split(';');
				this.directives.forEach(dir => {
					if (values[0] === dir) {
						let directive = <Directive>values[0];
						let q = +values[1];
						encodingHeader.push({directive, q})
					}
				});
			});

		return encodingHeader;
	}

	public getLanguage(headers: RawHeaders): AcceptLanguage[] {

		let langHeader: AcceptLanguage[] = [];
		
		if (headers.acceptLanguage) headers.language.forEach(
			lang => {
				let values = lang.split(';');
				let language = values[0].split('-');
				let q = +values[1];
				langHeader.push({language: language[0], locale: language[1], q})
			});

		return langHeader;
	}

	public getType(headers: RawHeaders): AcceptType[] {

		let typeHeader: AcceptType[] = [];
		
		if (headers.accept) headers.accept.forEach(
			type => {
				let values = type.split(';');
				let mime = values[0].split('/');
				let q = +values[1];
				typeHeader.push({mime: mime[0], subType: mime[1], q})
			});

		return typeHeader;
	}
}