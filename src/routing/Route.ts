

import * as Rx from 'rxjs'

import { RouteConfig, RouteHandler, Router, RoutingTree, RootRouter } from "./Router"

type RouteFunc = (path?: string, config?: RouteConfig, handler?: Rx.Observable<any>) => RouteI


export interface RouteI extends RouteFunc {
	router: RootRouter
	root: (path: string, config?: RouteConfig) => RouteI
	get: <T>(observable: Rx.Observable<T>, config?: RouteConfig) => RouteI
	put:  <T>(observable: Rx.Observable<T>, config?: RouteConfig) => RouteI
	post:  <T>(observable: Rx.Observable<T>, config?: RouteConfig) => RouteI
	patch:  <T>(observable: Rx.Observable<T>, config?: RouteConfig) => RouteI
	delete:  <T>(observable: Rx.Observable<T>, config?: RouteConfig) => RouteI
	head:  <T>(observable: Rx.Observable<T>, config?: RouteConfig) => RouteI
	options: <T>(observable: Rx.Observable<T>, config?: RouteConfig) => RouteI
	nest: (tree: RoutingTree) => RouteI
}

function _Route(path?: string, config?: RouteConfig, handler?: Rx.Observable<any>): RouteI {

	let args = Array.prototype.slice.call(arguments)
	
	args.forEach(arg => {
		switch (arg) {
			case 'string':
				this.path = arg
				break
			default:
			case 'object':
				if (arg instanceof Rx.Observable) {
					(<RouteHandler<any>>this.handler).observable = arg
				}
				if ((<RouteConfig>arg).auth) {
					(<RouteHandler<any>>this.handler).config = <RouteConfig>arg
				}
				break;
			}
		})

	return this
}

_Route['nest'] = (tree: RoutingTree): RouteI => {

	if (tree instanceof RoutingTree) {
		this.ne
	}

	return this
}

function methodFactory<T>(method: string) {`¡`
	return (observable: Rx.Observable<T>, config?: RouteConfig): RouteI	=> {	

		let args = Array.prototype.slice.call(arguments)
		let handler = <RouteHandler<T>>{}
	
		args.forEach(arg => {
			if (typeof arg === 'object') {
				if (arg instanceof Rx.Observable) {
					(<RouteHandler<T>>this[method]).observable = arg
				}
				if ((<RouteConfig>arg).auth) {
					(<RouteHandler<T>>this[method]).config = <RouteConfig>arg
				}
			}
		})
	
		return this
	}
}

function configureRoute(): RouteI {
	['get', 'put', 'post', 'patch', 'delete', 'head', 'options']
		.forEach(method => {
			_Route[method] = methodFactory(method)
		})

		
	return <RouteI>_Route
}


let _route = _Route['get'] ? <RouteI>_Route : configureRoute()

export { _route as Route }


/**
 

Route.prototype.get = function get<T>(
	observable: Rx.Observable<T>, config?: RouteConfig, path?: string
) : RouterObject {

	let args = Array.prototype.slice.call(arguments)
	let handler = <RouteHandler<T>>{}

	args.forEach(arg => {
		switch (arg) {
			case 'string':
				if (!this.path) this.path = arg
				break

			case 'object':
				if (arg instanceof Rx.Observable) {
					(<RouteHandler<T>>this.handler.get).observable = arg
				}
				if ((<RouteConfig>arg).auth) {
					(<RouteHandler<T>>this.handler.get).config = <RouteConfig>arg
				}
				break

			default:
				break
		}
	})

	return this
}

Route.prototype.post = function post<T>(
	observable: Rx.Observable<T>, config?: RouteConfig, path?: string
) : RouterObject {

	let args = Array.prototype.slice.call(arguments)
	let handler = <RouteHandler<T>>{}

	args.forEach(arg => {
		switch (arg) {
			case 'string':
				if (!this.path) this.path = arg
				break

			case 'object':
				if (arg instanceof Rx.Observable) {
					(<RouteHandler<T>>this.handler.post).observable = arg
				}
				if ((<RouteConfig>arg).auth) {
					(<RouteHandler<T>>this.handler.post).config = <RouteConfig>arg
				}
				break

			default:
				break
		}
	})

	return this
}


*/