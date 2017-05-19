import { HttpServeRConfig } from './../ConfigR';


export type METHOD = 'GET' | 'PUT' | 'POST' | 'PATCH' | 'DELETE' | 'HEAD' | 'CONNECT' | 'TRACE' | 'OPTIONS';

export class Methods {

	constructor(config?: HttpServeRConfig) {

		let options = config.supportedMethods;
		
		if (!options) {
			options = this.METHODS;
		}

		options.forEach(allowed => {
			for (let method of this.METHODS) {
				if (method === allowed) {
					this[method.toUpperCase()] =
					this[method.toLowerCase()] = 
					this[method.toLowerCase().substr(0,1).toUpperCase()] = 
					allowed.toUpperCase();
				}
			} 
		});
	}
}

export type Matchstring = {
	path: string[];
	params: string[];
}

export interface RouteI {
	matchstring?: Matchstring;
	methods?: METHOD[];
	stack: Function[];
}

export function Route(...args: any[]) {

	const METHODS = [
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
}



