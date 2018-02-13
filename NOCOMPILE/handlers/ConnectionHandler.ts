







import { HttpPair } from '../servers/Http'
import { Response } from './../messages/Response'
import { Request } from './../messages/Request'
import { HttpHandler } from './HttpHandler'






export class ConnectionHandler {

	http: {[id: string]: [HttpHandler, Rx.Subscription]}

	constructor() {
		this.http = {}
		
	}	

	public handle(req: Request, res: Response) {


		req.url
		/**
		 * all tasks are async. once the call is ready to be decoded, it 
		 * will be handled below
		 * 	- parse path and return observable handler
		 * 	- parse headers and return observables for each
		 * 		= while returning observables insert them into hierarchical 
		 * 		  decode order
		 * 	- assign body/input stream to observable
		 * 
		 * if (!handler) return 404 Error
		 * else	async {
		 * 	headers.subscribe(requirements => handler(requirements))
		 * 	if(!preAuth && handler.needs.auth) return auth
		 * 		if(auth)
		 * 			body.subscribe(body => handler)
		 * 			handler.subscribe((req, res) => res.send())
		 * }
		 */

		let handler = new HttpHandler(req, res)
		let subscription = handler.subscribe(this.httpObserver)
		let id = handler.id

		Object.assign(this.http, {[id]: [handler, subscription]})

	}

	public httpObserver = {
		next: (pair: HttpPair) => {},
		error: (error: Error) => {},
		complete: () => {}
	}

}
