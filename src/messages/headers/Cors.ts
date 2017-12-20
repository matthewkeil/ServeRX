
import * as Rx from 'rxjs'


import { HttpServerConfig } from './../../ConfigRX';
import { Header, HeaderValue, HeaderFactory } from './Headers';
import { Request } from '../Request';
import { Response } from '../Response';



export class Cors {

/** ===== Access-Control-Request-Method =====
 * 
 *  
 * 
 */

/** ===== Access-Control-Allow-Methods =====
 * 
 *  
 * 
 */

/** ===== Access-Control-Request-Header =====
 * 
 *  
 * 
 */

/** ===== Access-Control-Allow-Headers =====
 * 
 *  
 * 
 */

/** ===== Access-Control-Expose-Headers =====
 * 
 *  XMLHttpRequest simple response headers are listed. All others must be explicity added 
 *  to be exposed to the browser's javascript. Accepts arguments as either comma delimited 
 *  list of arguments or an array.
 * 
 *  Cache-Control
 *  Content-Language
 *  Content-Type
 *  Expires
 *  Last-Modified
 *  Pragma
 * 
 */
	public accessControlExposeHeaders: Header<AccessControlExposeHeaders>

	static accessControlExposeHeaders: HeaderFactory<AccessControlExposeHeaders> =
		(config: HttpServerConfig): AccessControlExposeHeaders => {

		return {
			set: (...headerNames: string[]) => {
				// figure out how to set headers
				return
			}
		}
	}

/** ===== Access-Control-Allow-Origin =====
 * 
 *  
 * 
 */

/** ===== Access-Control-Allow-Credentials =====
 * 
 *  
 * 
 */

/** ===== Access-Control-Max-Age =====
 * 
 *  
 * 
 */

/** ===== Origin =====
 * 
 *  
 * 
 */
	private static _validOrigin = /^http(s?):\/\/([\w\.]*)\.(\w*\.\w*):?(\d{1,5})?\/?([\w\/]*)?/

	private static _runPreFlight(req: Request, res: Response): Rx.Observable<void> {
		return new Rx.Observable(observer => {
			observer.complete()
		})
	}

	public origin: Cors.Origin

	static origin: HeaderFactory<Cors.Origin> = (config: HttpServerConfig) => {
		return {
			priority: 'pre',
			get: (args: string[], req: Request, res: Response) => {

				return new Rx.Observable<void>(observer => {

					let blacklist = config.headers.incoming.origin.blacklist;
					let allowed = config.headers.incoming.origin.allowed;
					let originIsValid = false;
					let [ original, secure, subDomain, domain, port, path ] = 
						Cors._validOrigin.exec(args[0]);

					if (blacklist.hasOwnProperty(domain)) {
						let subs = blacklist[domain].subDomains
						switch(typeof subs) {
							case 'boolean':
								subs ? 
									observer.error(new Error('Sub-Domains not authorized')) :
									originIsValid = true
								break
							case 'string':
								subs === subDomain ?
									observer.error(new Error('Sub-Domain not authorized')) :
									originIsValid = true
								break
							default:
								Array.isArray(subs) ?
									subs.forEach(sub => sub === subDomain ? 
										observer.error(new Error('Sub-Domain not authorized')) :
										originIsValid = true) :
									observer.error(new Error('Configuration Error'))
								break
						}
					} else if(allowed.hasOwnProperty('*')) {
						originIsValid = true
					} else if (allowed.hasOwnProperty(domain)) {
						let subs = allowed[domain].subDomains
						switch(typeof subs) {
							case 'boolean':
								subs ? 
									originIsValid = true :
									observer.error(new Error('Sub-Domains not authorized'))
								break
							case 'string':
								subs === subDomain ?
									originIsValid = true :
									observer.error(new Error('Sub-Domain not authorized'))
								break
							default:
								Array.isArray(subs) ?
									subs.forEach(sub => sub === subDomain ? 
										originIsValid = true : 
										observer.error(new Error('SubDomain not authorized'))) :
									observer.error(new Error('Configuration Error'))
								break
						}
					} else {
						observer.error(new Error('Domain not authorized'))
					}

					if (!originIsValid) throw new Error('Origin header, !originIsValid');

					let isPreFlight = false;
					let needsPreFlight = false;

					switch (req.method) {
						case 'GET':
						case 'POST':
							break;
						case 'OPTIONS':
							if (req.headers$.hasOwnProperty('accessControlRequestMethod')) {
								isPreFlight = true;
								Cors._runPreFlight(req, res).subscribe(observer);
							}
							break;
						case 'PATCH':
						case 'PUT':
						case 'DELETE':
							needsPreFlight = true;
							break;
						default:
							observer.error(new Error(`${req.method} not CORS supported`))
							break;
					}

					if (!isPreFlight) {

						// Set Access-Control-Expose-Headers ???

						// Set Access-Control-Allow-Origin

						// Set Access-Control-Allow-Credentials
						
						observer.complete()
					}
				})
			},
			set: null
		}
	}
}

export namespace Cors {

	export interface CORSDomains {
		[domain: string]: {
			secure?: boolean
			subDomains?: boolean | string | string[]
			port?: number
		}
	}

	export interface Origin extends Header {
		priority: 'pre';
		get: (args: string[], req: Request, res: Response) => HeaderValue<void>
	}

	export interface AccessControlExposeHeaders extends Header {
		set: (...headerNames: any[]) => void
	}
}
		