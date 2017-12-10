




import * as Rx from 'rxjs';


import { Route } from './Route'
import { HttpServerConfig } from '../../src/ConfigRX';
import { MatchString, MS } from '../common/MatchString'




export type METHOD = 'GET' | 'PUT' | 'POST' | 'PATCH' | 'DELETE' | 'HEAD' | 'CONNECT' | 'TRACE' | 'OPTIONS';

export interface RouteConfig {
	auth?: {}
}

export type RouteHandler<T> = {
	config?: RouteConfig
	observable: Rx.Observable<T>
}

export interface RoutingTree {
	[segment: string]: Router | RoutingTree
}

export class Router {

	matchString?: MatchString
	nested?: RoutingTree
	handlers?: RouteHandler<any>[]
	get?: RouteHandler<any>
	put?: RouteHandler<any>
	post?: RouteHandler<any>
	patch?: RouteHandler<any>
	delete?: RouteHandler<any>
	head?: RouteHandler<any>
	connect?: RouteHandler<any>
	trace?: RouteHandler<any>
	options?: RouteHandler<any>

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

}
