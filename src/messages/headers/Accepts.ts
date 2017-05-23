// accept // no accept-'*'
// charset;
// encoding;
// language;
// ranges;

import { IncomingMessage } from 'http';


import { Content } from './Content';
	import { Header, HeadeRx } from '../HeadeRx';
import { IncomingReq, RequestRx } from '../RequestRx';



export class Accepts {

	public types?: string[];
	public encodings?: string[];
	public charsets?: string[];
	public languages?: string[];
	
	constructor(config?: HttpServeRConfig) {
		if (req) this.get(req);
	}

	public getAccepts(list: Header[]): void {
		this.getTypes(req);
		this.getEncoding(req);
		this.getCharset(req);
		this.getLanguages(req);
	}

	public getTypes(req: RequestRx): void {}
	public getEncoding(req: RequestRx): void {}
	public getCharset(req: RequestRx): void {}
	public getLanguages(req: RequestRx): void {}

}



	// public type(...type: string[]): string[] {
	// 	/**
	// 	 * To do: update docs.
	// 	 *
	// 	 * Check if the given `type(s)` is acceptable, returning
	// 	 * the best match when true, otherwise `undefined`, in which
	// 	 * case you should respond with 406 "Not Acceptable".
	// 	 *
	// 	 * The `type` value may be a single MIME type string
	// 	 * such as "application/json", an extension name
	// 	 * such as "json", a comma-delimited list such as "json, html, text/plain",
	// 	 * an argument list such as `"json", "html", "text/plain"`,
	// 	 * or an array `["json", "html", "text/plain"]`. When a list
	// 	 * or array is given, the _best_ match, if any is returned.
	// 	 *
	// 	 * Examples:
	// 	 *
	// 	 *     // Accept: text/html
	// 	 *     req.accepts('html');
	// 	 *     // => "html"
	// 	 *
	// 	 *     // Accept: text/*, application/json
	// 	 *     req.accepts('html');
	// 	 *     // => "html"
	// 	 *     req.accepts('text/html');
	// 	 *     // => "text/html"
	// 	 *     req.accepts('json, text');
	// 	 *     // => "json"
	// 	 *     req.accepts('application/json');
	// 	 *     // => "application/json"
	// 	 *
	// 	 *     // Accept: text/*, application/json
	// 	 *     req.accepts('image/png');
	// 	 *     req.accepts('png');
	// 	 *     // => undefined
	// 	 *
	// 	 *     // Accept: text/*;q=.5, application/json
	// 	 *     req.accepts(['html', 'json']);
	// 	 *     req.accepts('html', 'json');
	// 	 *     req.accepts('html, json');
	// 	 *     // => "json"
	// 	 *
	// 	 * @param {String|Array} type(s)
	// 	 * @return {String|Array|Boolean}
	// 	 * @public
	// 	 */

	// 	req.accepts = function(){
	// 	var accept = accepts(this);
	// 	return accept.types.apply(accept, arguments);
	// 	};
		
		publuc accepts(types: string[]) {



			negotiator(this);

			return (this._negotiator.preferredMediaType(types));
		};
	}
	public encoding(...encoding: string[]): string[] {
		/**
		 * Check if the given `encoding`s are accepted.
		 *
		 * @param {String} ...encoding
		 * @return {String|Array}
		 * @public
		 */

		req.acceptsEncodings = function(){
		var accept = accepts(this);
		return accept.encodings.apply(accept, arguments);
		}
		Request.prototype.acceptsEncoding = function acceptsEncoding(types) {
			if (typeof (types) === 'string') {
				types = [types];
			}

			assert.arrayOfString(types, 'types');

			negotiator(this);

			return (this._negotiator.preferredEncoding(types));
		};
	}
	public charset(...charsets: string[]): string[] {
		/**
		 * Check if the given `charset`s are acceptable,
		 * otherwise you should respond with 406 "Not Acceptable".
		 *
		 * @param {String} ...charset
		 * @return {String|Array}
		 * @public
		 */

		req.acceptsCharsets = function(){
		var accept = accepts(this);
		return accept.charsets.apply(accept, arguments);
		};
	}
	public language(...languages: string[]): string[] {
		/**
		 * Check if the given `lang`s are acceptable,
		 * otherwise you should respond with 406 "Not Acceptable".
		 *
		 * @param {String} ...lang
		 * @return {String|Array}
		 * @public
		 */

		req.acceptsLanguages = function(){
		var accept = accepts(this);
		return accept.languages.apply(accept, arguments);
		};
	}

}