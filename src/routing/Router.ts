

import { isError } from "util";


import { ServerError } from "../common";

import {
	Handler,
	HandlerConfig
} from "./";



export interface RouterConfiguration {
}

export class Router {

	public root: Handler;
	constructor(...args: any[]) {
		try {
			(<any>this).root = Handler.create(args);
			if (!(this.root instanceof Handler))
				throw isError(this.root) ? this.root : new ServerError('unknown error building root handler');
		} catch (err) { throw err }
	}

	public configure(config: ServerConfig): Router {
		let path: MatchString | null;
		this._config = config;
		/**
		 * mount location order of precedence is
		 * 1 - submitted config file mountAt field
		 * 2 - if Router was passed on config.router.obj, use existing path
		 * 3 - root
		 */
		(path = MS.isValid(this._config.router.mountAt))
			? (this.path = path)
			: this.path ? null : (this.path = []);
		/**
		 * auth persists from both passed config.router.obj and config.router.auth
		 * and will flag any differences/discrepencies when applying both. middleware
		 * will compose/append any additional middleware passed with the config file
		 */
		if (!(config.router.obj instanceof Router)) {
			this.auth = this.checkAuth(config);
			this.middleware = this.buildStack(config);
		}

		this.buildRoutes(config);

		return this;
	}

	private find(input: any): RouteObservable {
		let self = this;

		let resolve = <RouteObservable>new Rx.Observable<RouteHandler>(
			observer => {
				let ms = MS.isValid(input);

				if (ms) {
					if (!(util.isObject(ms[0]) && ms[0].hasOwnProperty("~"))) {
						observer.error(
							new RouteError(
								"must resolve route from the root ~/",
								input
							)
						);
					}

					ms.shift(); // pulls root element off the front of the array

					let route$ = self._routes.resolve(ms);
					let subscription = route$.subscribe(observer);

					resolve.cancel = () => {
						if (route$) route$.cancel();
						if (subscription && !subscription.closed)
							subscription.unsubscribe();
						observer.complete();
					};
				} else observer.error(new RouteError("path not valid", input));
			}
		);

		return resolve;
	}
}