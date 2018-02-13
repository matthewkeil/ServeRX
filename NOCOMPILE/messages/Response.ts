import { ContentType } from './headers/Accept';
import { OutgoingHeaders, Headers, Header } from './headers/Headers';


import * as http from 'http';
import * as util from 'util';



import { Request } from './Request';
import { HttpServerConfig } from './../ConfigRX';



function _stringify(
	objToStringify: any, 
	replacer?: (key: string, value?: any) => any, 
	spaces?: string | number, 
	escape?: boolean
	) {

	// v8 checks arguments.length for optimizing simple call
	// https://bugs.chromium.org/p/v8/issues/detail?id=4730
	let json = replacer || spaces
		? JSON.stringify(objToStringify, replacer, spaces)
		: JSON.stringify(objToStringify);

	if (escape) {
		json = json.replace(/[<>&]/g, function (c) {
			switch (c.charCodeAt(0)) {
			case 0x3c:
				return '\\u003c'
			case 0x3e:
				return '\\u003e'
			case 0x26:
				return '\\u0026'
			default:
				return c
			}
		})
	}

	return json
}

export type ResponseMessage = {
	statusCode: number
	statusMessage: string
	headers: {[header: string]: string[]}
	body: string | Buffer
}

export interface Response extends http.ServerResponse {
	id: {
		insertId: string;
		timestamp: number;
		port: number;
		family: string;
		address: string;
	}
	req: Request;
	_headers: Headers;
	headers: OutgoingHeaders;
	sendJSON: (objToSend: Object) => void;
}

export function ResponsePatcher(config: HttpServerConfig, Response: any, _headers: Headers) {


		Object.keys(ResponsePatcher).forEach(method => {
			Object.assign(
				Response.prototype[method], 
				ResponsePatcher[method](config)
			)
		});

		Response.headers = _headers;
		Response.headers.que = Response.headers.sent = [];

	}

 /** _send(
		args: {
			statusCode?: number;
			message?: string;
			headers?: OutgoingHeaders;
			body?: any;
		}): void {

		let message = <any>{};

		if (args.statusCode && util.isNumber(args.statusCode)) {
			message.statusCode = args.statusCode;
		}

		(<any>this).setStatus(message.statusCode).send(args.body)

	} 

	static sendJSON(config: HttpServerConfig): (objToSend: Object) => void {

		return (objToSend: Object): void => {
			
			// settings
			let replacer = config.response.stringify.replacer;
			let spaces = config.response.stringify.spaces;
			let escape = config.response.stringify.escape;

			let jsonToSend = _stringify(objToSend, replacer, spaces, escape)

			// content-type
			if (!(<any>this).headers.contentType) {
				(<any>this).headers.contentType.set({
					mime: 'application', sub: 'json'});
			}
		
			return (<any>this)._send({
				statusCode: 200,
				body: jsonToSend
			})
		}
	}
}