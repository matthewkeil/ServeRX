
	import { MatchString, MSRegEx, extractMS } from './MatchString';
import { RouteObserver, ObservableRoute } from './RouteObserver';
import { RespondeR } from '../messages/RespondeR';
import { ServeRConfig } from './../ConfigR';


export type ROUTE_OPTION = 'protected' | 'internal';

export type METHOD = 'GET' | 'PUT' | 'POST' | 'PATCH' | 'DELETE' | 'HEAD' | 'CONNECT' | 'TRACE' | 'OPTIONS';

export interface RouteI<T> {
	matchString?: MatchString;
	methods?: METHOD[];
	options?: ROUTE_OPTION[];
	stack: ObservableRoute<T>[];
	nested?: RouteI<T>; 
}

export class Routes {

	private buildRoutes: (...args: any[]) => RouteI<any>;
	public routes: RouteI<any>;
	
	constructor(private _config: ServeRConfig) {
		this.buildRoutes = this._buildRoutesFactory(_config);
	}

	private _buildRoutesFactory(config: ServeRConfig): (...args: any[]) => RouteI<any> {

		let ALLOWED_METHODS = <METHOD[]>[];
		const VALID_METHODS = <METHOD[]>[
			'GET',
			'PUT',
			'POST',
			'PATCH',
			'DELETE',
			'HEAD',
			'CONNECT',
			'TRACE',
			'OPTIONS'
		];
		
		let ALLOWED_OPTIONS = <ROUTE_OPTION[]>[];
		const VALID_OPTIONS = <ROUTE_OPTION[]>[
			'protected',
			'internal'
		];

		if (config.allowedMethods) {
			for (let valid of VALID_METHODS) {
				config.allowedMethods.forEach(allowed => {
					if (allowed === valid) ALLOWED_METHODS.push(valid);
				});
			}
		} else ALLOWED_METHODS = VALID_METHODS;
		
		if (config.allowedRouteOptions) {
			for (let valid of VALID_OPTIONS) {
				config.allowedRouteOptions.forEach(allowed => {
					if (allowed === valid) ALLOWED_OPTIONS.push(valid);
				});
			}
		} else ALLOWED_OPTIONS = VALID_OPTIONS;

		return function _route(...args: any[]): RouteI<any> {
			const METHODS = ALLOWED_METHODS;
			const OPTIONS = ALLOWED_OPTIONS;

			let matchString = <MatchString>{};
			let methods = <METHOD[]>[];
			let options = <ROUTE_OPTION[]>[];
			let stack = <ObservableRoute<any>[]>[];
			let nested = <RouteI<any>>{}

			for(let arg of args) {
				if (typeof arg == 'string') {
					let found = false;
					for (let method of METHODS) {
						if (arg.toUpperCase() === method) {
							methods.push(<METHOD>arg);
							found = true;
							break;
						}
					}
					if (!found) {
						for (let option of OPTIONS) {
							if (arg.toLowerCase() === option) {
								options.push(<ROUTE_OPTION>arg);
								break;
							};
						}
					}
					if (!found) MSRegEx.test(arg)
						? matchString = extractMS(arg)
						: console.error(`${arg} is not an allowed Method or Option nor a valid MatchString`);
				}
				if (Array.isArray(arg)) {
					nested = _route(...arg);
				}
				if ((typeof arg) === 'function') {
					if (((typeof (<RouteObserver<any>>arg.arguments[0]).next) === 'function')
						&& ((typeof (<RespondeR>arg.arguments[0].res).id) === 'string')) {
							stack.push(<ObservableRoute<any>>arg);
					} else console.error(`${arg} is not an observable route`);
				} else console.error(`${arg} is of unsupported type ${typeof arg}.`);
			}

			return { matchString, methods, options, stack, nested };
		};
	}
}