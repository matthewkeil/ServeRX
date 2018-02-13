import { HttpServerConfig } from './../../ConfigRX';
import { Category, RawHeaders, HeaderCategory } from './Headers';
	
import { mime } from 'mime-types';



// import { Observable } from 'rxjs/Observable';
// import { IncomingMessage } from 'http';


// import { IncomingReq, RequestRx } from '../RequestRx';
// import { ResponseRx } from '../ResponseRx';

export interface ContentType {
	type: string;
	subtype: string;
	q: number;
}

export type ContentLength = number;

export type ContentEncoding = 'gzip' | 'compress' | 'deflate' | 'identity' | 'br' | 'ERROR';

export interface ContentI {
	type?: ContentType[];
	length?: ContentLength[];
	encoding?: ContentEncoding[];
}

export class Content implements HeaderCategory {

	type?: boolean;
	length?: boolean;
	encoding?: boolean;
	
	constructor(config?: HttpServerConfig) {
		config.headers.content.type ? this.type = true : this.type = false;
		config.headers.content.length ? this.length = true : this.length = false;
		config.headers.content.encoding ? this.encoding = true : this.encoding = false;
	}

	public getFromRaw(headers: RawHeaders): Category {
		
		let content: ContentI;
		
		if (this.type) content.type = this.getTypes(headers);
		if (this.length) content.length = this.getLength(headers);
		if (this.encoding) content.encoding = this.getEncoding(headers);
		
		return content;
	}

	public getTypes(headers: RawHeaders): ContentType[] {

		let contentTypes: ContentType[] = [];

		if (headers.contentType) {
			headers.contentType.forEach(ct => {
				let t = ct.split(';');
				let main = t[0].split('/')
				t[1] ? null : t[1] = '1';
				contentTypes.push({type: main[0], subtype: main[1], q: +t[1]});
			});
			return contentTypes;
		}

		// RFC2616 section 7.2.1
		return [{type: 'application', subtype: 'octet-stream', q: 1}];
	}

	public typeExists(type: ContentType): boolean {
		if (mime.lookup(
			type.type.concat(
				type.subtype ?
					'/' + type.subtype :
					''
			)
		)) return true;
		return false;
	}
	
	public getLength(headers: RawHeaders): ContentLength[] {

		let length = headers.contentLength;

		if (length) return [parseInt(length[0], 10)]
		
		return [0];
	}

	private CE = ['gzip', 'compress', 'deflate', 'identity', 'br'];

	public getEncoding(headers: RawHeaders): ContentEncoding[] {
		let encoding = headers.contentEncoding;
		let contentEncoding: ContentEncoding[] = [];

		if (encoding) {
			encoding.forEach(enc => {
				let found = false;
				this.CE.forEach(ce => {
					if (enc === ce) found = true;
				});
				found ?  
					contentEncoding.push(<ContentEncoding>enc) : 
					contentEncoding.push('ERROR');
			});
		}
		
		return contentEncoding;
	}
}
	// public setTypes(...types: string[]): Header {

	// 	let ct = [];
		
	// 	types.forEach(type => {
	// 		ct.push(type.indexOf('/') === -1
	// 			? mime.lookup(type)
	// 			: type);
	// 	});

	// 	return {'Content-Type': ct};
	// };

	// public setLength(res: ResponseRx): Header {
	// 	return null // request body only, measured in octets (8-bit bytes) {'Content-Length': [res.length.toString()]};
	// };

	
	// public isType(...types: string[]): boolean {

	// 	var contentType = types.forEach(type => this.getTypes(type));
	// 	var matches = true;

	// 	if (!contentType) {
	// 		return (false);
	// 	}

	// 	if (type.indexOf('/') === -1) {
	// 		type = mime.lookup(type);
	// 	}

	// 	if (type.indexOf('*') !== -1) {
	// 		type = type.split('/');
	// 		contentType = contentType.split('/');
	// 		matches &= (type[0] === '*' || type[0] === contentType[0]);
	// 		matches &= (type[1] === '*' || type[1] === contentType[1]);
	// 	} else {
	// 		matches = (contentType === type);
	// 	}

	// 	return (matches);
	// };


// /**
//  * creates and sets negotiator on request if one doesn't already exist,
//  * then returns it.
//  * @private
//  * @function negotiator
//  * @param    {Object} req the request object
//  * @returns  {Object}     a negotiator
//  */
// function negotiator(req) {
//     var h = req.headers;

//     if (!req._negotiator) {
//         req._negotiator = new Negotiator({
//             headers: {
//                 accept: h.accept || '*/*',
//                 'accept-encoding': h['accept-encoding'] ||
//                     'identity'
//             }
//         });
//     }

//     return (req._negotiator);
// }


