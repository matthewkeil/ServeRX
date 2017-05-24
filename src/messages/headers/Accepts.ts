// accept // no accept-'*'
// charset;
// encoding;
// language;
// ranges;

import { IncomingMessage } from 'http';


import { HttpServeRConfig } from '../../ConfigR';
import { RawHeader, Header } from './HeadeR';


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

export class Accepts {

	public type?: Header<AcceptType>;
	public charset?: Header<AcceptCharset>;
	public encoding?: Header<AcceptEncoding>;
	public language?: Header<AcceptLanguage>;
	
	constructor(config?: HttpServeRConfig) {
		if (config.headers.accepts.charsets) this.charset = <AcceptCharsetHeader>{};
		if (config.headers.accepts.encodings) this.encoding = <AcceptEncodingHeader>{};
		if (config.headers.accepts.languages) this.language = <AcceptLanguageHeader>{};
		if (config.headers.accepts.types) this.type = <AcceptTypeHeader>{};
	 }

	public getAccepts(headers: RawHeader[]): void {
		if (this.charsets) this.getCharset(headers);
		if (this.encodings) this.getEncoding(headers);
		if (this.languages) this.getLanguages(headers);
		if (this.types) this.getTypes(headers);
	 }

	public getTypes(headers: RawHeader[]): void {
		let typeHeader = <Header<AcceptType>>{};
		for (let name in headers) if(name === 'accept') {
			let values = headers[name].value.split(',');
			values.forEach(type => {
				type = type.trim();
				let values = type.split(';');
				let mime = values[0].split('/');
				let q = +values[1];
				typeHeader.value.push({mime: mime[0], subType: mime[1], q})
			 });
		 }
		this.type = typeHeader;
	 }

	public getEncoding(headers: RawHeader[]): void {
		let encodingHeader = <Header<AcceptEncoding>>{};
		for (let name in headers) if(name === 'acceptEncoding') {
			let values = headers[name].value.split(',');
			values.forEach(enc => {
				enc = enc.trim();
				let values = enc.split(';');
				if(values[0] === 'gzip' ||
					values[0] === 'compress' ||
					values[0] === 'deflate' ||
					values[0] === 'br' ||
					values[0] === 'identity' ||
					values[0] === '*') {
						let directive = <Directive>values[0];
						let q = +values[1];
						encodingHeader.value.push({directive, q})
					}
			 });
		 }
		this.encoding = encodingHeader;
	 }

	public getCharset(headers: RawHeader[]): void {
		let charsetHeader = <Header<AcceptCharset>>{};
		for (let name in headers) if(name === 'acceptCharset') {
			let values = headers[name].value.split(',');
			values.forEach(set => {
				set = set.trim();
				let values = set.split(';');
				let charset = values[0];
				let q = +values[1];
				charsetHeader.value.push({charset, q})
			 });
		 }
		this.charset = charsetHeader;
	 }

	public getLanguage(headers: RawHeader[]): void {
		let langHeader = <Header<AcceptLanguage>>{};
		for (let name in headers) if(name === 'acceptLanguage') {
			let values = headers[name].value.split(',');
			values.forEach(lang => {
				lang = lang.trim();
				let values = lang.split(';');
				let language = values[0].split('-');
				let q = +values[1];
				langHeader.value.push({language: language[0], locale: language[1], q})
			 });
		 }
		this.language = langHeader;
	 }

}