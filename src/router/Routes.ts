
import { MatchString, MSRegEx, extractMS } from './MatchString';
import { RouteObserver, ObservableRoute } from './RouteObserver';
import { ServeRConfig } from './../ConfigR';


export type OPTION = 'protected' | 'internal';

export type METHOD = 'GET' | 'PUT' | 'POST' | 'PATCH' | 'DELETE' | 'HEAD' | 'CONNECT' | 'TRACE' | 'OPTIONS';

export interface RouteI<T> {
	matchString?: MatchString;
	methods?: METHOD[];
	options?: OPTION[];
	stack: ObservableRoute<T>[];
}

export default class Routes {

	public Route: (...args: any[]) => RouteI;

	constructor(private config: ServeRConfig) {
		this.Route = this._RouteFunctionFactory(config);
	}

	private _RouteFunctionFactory(config: ServeRConfig): (...args: any[]) => RouteI {

		let ALLOWED_METHODS = [];
		const VALID_METHODS = [
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
		
		if (config.allowedMethods) {
			for (let valid of VALID_METHODS) {
				config.allowedMethods.forEach(allowed => {
					if (allowed === valid) ALLOWED_METHODS.push(valid);
				});
			}
		} else ALLOWED_METHODS = VALID_METHODS;

		return (...args: any[]): RouteI => {
			const METHODS = ALLOWED_METHODS;
			let matchString = '';
			let methods = [];
			let stack = []; 
			for(let arg of args) {

				if (typeof arg == 'function') {
					stack.push(arg);
				}

				if (typeof arg == 'string') {
					for (let method of METHODS) {
						if (arg.toUpperCase() === method) {
							methods.push(method);
						} else {
							matchString = arg;
						}
					}
				}
			}
			return { matchString, methods, stack };
		};
	}
}


function Route(...args: any[]): RouteI<any> {

	const METHODS = [
		'GET',
		'PUT',
		'POST',
		'OPTIONS'
	];

	const OPTIONS = [
		'protected',
		'internal',
	];

	let matchString = <MatchString>{};
	let methods = <METHOD[]>[];
	let options = <OPTION[]>[];
	let stack = <ObservableRoute<any>[]>[];
	let nestedRoutes: Function;

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
						options.push(<OPTION>arg);
						break;
					};
				}
			}
			if (!found) MSRegEx.test(arg)
				? matchString = extractMS(arg)
				: console.error(`${arg} is not a valid Method, Option or MatchString`);
		} 
		else if (typeof arg == 'function') {
			if ((<Function>arg).name == 'Route') {
				//recursively build object
			}
			stack.push(arg);
		} else console.error(`${arg} is of unsupported type ${typeof arg}.`);
	}

	return { matchString, methods, options, stack};
}