

import { Observable } from 'rxjs/Observable';
import { IncomingMessage } from 'http';


import { IncomingReq, RequestRx } from '../RequestRx';
import { ResponseRx } from '../ResponseRx';
import { Header, HeadeRx } from '../HeadeRx';


export interface ContentRxI {
	length?: number;
	type?: string[];
	get(req: RequestRx): void;
	getTypes(req: RequestRx): void;
	setTypes(...types: string[]): Header;
	getLength(req: RequestRx): void;
	setLength(res: ResponseRx): Header;
	// isType(...types: string[]): boolean;
}

export class Content implements ContentRxI {

	length?: number;
	types?: string[];
	
	constructor(req?: RequestRx) {
		if (req) this.next(req);
	}

	get(req: RequestRx): RequestRx {
		this.getTypes(req);
		this.getLength(req);
		return req;
	}

	public getTypes(req: RequestRx): void {

		let types = req.headers.getHeader('Content-Type');

		if (!types) {
			// RFC2616 section 7.2.1
			types = 'application/octet-stream';
		} else {
			if (types.indexOf(';') === -1) {
					this.types.push(types.toLowerCase());
			} else {
					this.types.push(...types.toLowerCase().split(';'));
			}
		}
	};
	
	public getLength(req: RequestRx): void {

		var len = req.headers.getHeader('Content-Length') || 0;

		if (len !== 0) {
			this.length = parseInt(<string>len, 10);
		} else this.length = len;

	};

	public setTypes(...types: string[]): Header {

		let ct = [];
		
		types.forEach(type => {
			ct.push(type.indexOf('/') === -1
				? mime.lookup(type)
				: type);
		});

		return {'Content-Type': ct};
	};

	public setLength(res: ResponseRx): Header {
		return null // request body only, measured in octets (8-bit bytes) {'Content-Length': [res.length.toString()]};
	};

	public setEncodings(...encodings: string[]): Header[] {};
	public setCharsets(...charsets: string[]): Header[] {};
	public setLanguages(...languages: string[]): Header[] {};
	
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

	
}

/**
 * creates and sets negotiator on request if one doesn't already exist,
 * then returns it.
 * @private
 * @function negotiator
 * @param    {Object} req the request object
 * @returns  {Object}     a negotiator
 */
function negotiator(req) {
    var h = req.headers;

    if (!req._negotiator) {
        req._negotiator = new Negotiator({
            headers: {
                accept: h.accept || '*/*',
                'accept-encoding': h['accept-encoding'] ||
                    'identity'
            }
        });
    }

    return (req._negotiator);
}


