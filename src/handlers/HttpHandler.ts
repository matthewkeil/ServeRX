


import * as http from 'http';
import * as Rx from 'rxjs';
import { withLatestFrom } from 'rxjs/Operator/withLatestFrom'


// import { HttpServerConfig } from './../ConfigRX'
import { HttpPair } from './../servers/Http';
import { RouteHandler } from '../routing/Router';
import { Request, Authorization } from './../messages/Request'
import { Response } from '../messages/Response'



export class HttpHandler extends Rx.BehaviorSubject<HttpPair>{

	_id: string

	routeHandler: RouteHandler

	constructor(public req: Request, public res: Response) {
		
		super({req, res});

		let self = this;
		this.req.parse();
		
		super.next({req, res});
		
		let handler$ = req.getHandler()
			.do(routeHandler => {
				let pair = self.value
				pair.req.routeHandler = routeHandler
				return super.next(pair)
			})

		let headers$ = req.getHeaders(req, res)
			.combineAll(headers => {})
			.do(header => {
				switch (header.priority) {
					case 'pre':
						header.value.subscribe()
						break
					case 'ordered':
					case 'info':
					default:
						req.headers$[header.priority].push(header)
						break
				}
			})
			.filter(header => header.pre !== undefined)
			.flatMap(header => header.pre.observable)
			
		let runRequest$ = handler$.withLatestFrom(headers$)
			.flatMap(([routeHandler, header]) => {
				if (!self.value.req.routeHandler && routeHandler) {
					let pair = self.value
					pair.req.auth.isRequired = routeHandler.config.auth.isRequired
					if(!pair.req.auth.isRequired) {
						pair.req.auth.isAuthorized = true
						super.next(pair)
						return Rx.Observable.from([(<Authorization>{
							isRequired: false,
							isAuthorized: true
						})])
					}
					super.next(pair)
					return req._user.authorization(req)
				}
			})
			.do(auth => {
				if (auth.isRequired && !auth.isAuthorized) {
					throw new Error('Not authorized')
				}
				let pair = self.value
				pair.req.auth = auth
				return super.next(pair)
			})
			.flatMap(auth => req.routeHandler.observable(req.routeHandler.config))
			.subscribe(res)

	}

	get id() {
		return this._id ? 
			this._id : 
			this._id = this.generateId()
	}

	public generateId(): string {

		let id = this.req.socket.address()

		return Object.assign(this.req.id, id, {
			timestamp: Date.now(), 
			insertId: (id.address + ' | ' + id.family)
		}).insertId
	}




	private _httpNext(value: any): void {}

	private _handleError(error: Error): void {}

}