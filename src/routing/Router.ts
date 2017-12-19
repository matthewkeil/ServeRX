




import * as Rx from 'rxjs';


import { Route } from './Route'
import { HttpServerConfig } from '../../src/ConfigRX';
import { MatchString, Ms } from '../common/MatchString'
import { ResponseMessage } from './../messages/Response';




export type METHOD = 'GET' | 'PUT' | 'POST' | 'PATCH' | 'DELETE' | 'HEAD' | 'CONNECT' | 'TRACE' | 'OPTIONS';

export interface RouteConfig {
	auth: {
		isRequired: boolean
	}
}

 

export type RouteHandler = {
	config?: RouteConfig
	observable: (config?: RouteConfig) => Rx.Observable<ResponseMessage>
}

export interface RoutingTree {
	[segment: string]: Router | RoutingTree
}

export class Router {

	matchString?: MatchString
	nested?: RoutingTree
	handlers?: RouteHandler[]
	get?: RouteHandler
	put?: RouteHandler
	post?: RouteHandler
	patch?: RouteHandler
	delete?: RouteHandler
	head?: RouteHandler
	connect?: RouteHandler
	trace?: RouteHandler
	options?: RouteHandler

	constructor() {}

}

export class RootRouter extends Router {

	private _root: boolean
	public mountedAt?: MatchString
	public middleware: any[]
	public tree: Router | RoutingTree

	constructor(private _config: HttpServerConfig) {

		super()
		this._root = true
		this.middleware = []

		if (MS.isValidPath(this._config.router.mountRootAt)) {
			this.mountedAt = MS.pathToMS(this._config.router.mountRootAt)
		}
	}

	get root() {
		return this._root
	}

	returnRouteHandler(path: MatchString): Rx.Observable<RouteHandler> {
		return new Rx.Observable<RouteHandler>(observer => {

		})
	}

}
