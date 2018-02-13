


import {
	RouteAuth,
	Stack,
	Mounted,
	Mounting
} from "../routing";

import { Path } from "./";
import { isArray } from "util";
import { Handler } from "../routing/Handler";


export interface IServeRxError {
	message: string;
	fatal: boolean;
	code: number;
	error: any[];
	path: any[];
	auth: any[];
	_stack: any[];
	handler: any[];
	other: any[];
}
class ServeRxError extends Error implements IServeRxError {

	fatal: boolean;
	code: number;
	error = <any>[];
	path = <any>[];
	auth = <any>[];
	_stack = <any>[];
	handler = <any>[];
	other = <any>[];

	req?: Request;
	res?: Response;

	constructor(error: IServeRxError) {
		super(error.message);

		Object.keys(error).forEach(key => (<any>this)[key] = [(<any>error)[key]]);

		if (error.other) error.other.forEach(item => {

			switch (typeof item) {
				case 'boolean':
					this.hasOwnProperty('fatal')
						? this.other = (this.other || []).concat(item)
						: this.fatal = item;
					break;
				case 'number':
					this.code
						? this.other = (this.other || []).concat(item)
						: this.code = item;
					break;
				default:
					if (item instanceof Error) this.error = (this.error || []).concat(item);
					if (item instanceof Path) this.path = (this.path || []).concat(item);
					if (item instanceof Handler) this.handler = (this.handler || []).concat(item);
					if (item instanceof Stack) this._stack = (this._stack || []).concat(item);
					else this.other = (this.other || []).concat(item);
			}
		});

	}
}
export class ApiError extends ServeRxError {
	constructor(public code: number, public message: string = 'ApiError - Failing Safely',
		...args: any[]) {

		super({
			message,
			code,
			auth: [],
			fatal: false,
			error: [],
			path: [],
			_stack: [],
			handler: [],
			other: [...args]
		});
	}
}
export class ServerError extends ServeRxError {
	constructor(message: string,
		error: Error | Error[] = new Error('fatal error was not passed'),
		...args: any[]) {

		super({
			message,
			auth: [],
			fatal: true,
			code: -1,
			error: [...isArray(error) ? error : [error]],
			path: [],
			_stack: [],
			handler: [],
			other: [...args]
		});
	}
}
export class AuthError extends ServeRxError {
	constructor(message: string, auth?: any | any[], ...args: any[]) {

		super({
			message,
			auth: [...isArray(auth) ? auth : [auth]],
			fatal: false,
			code: -1,
			error: [],
			path: [],
			_stack: [],
			handler: [],
			other: [...args]
		});
	}
}
export class PathError extends ServeRxError {
	constructor(message: string, path?: any | any[], ...args: any[]) {
		super({
			message,
			auth: [],
			fatal: true,
			code: -1,
			error: [],
			path: [...isArray(path) ? path : [path]],
			_stack: [],
			handler: [],
			other: [...args]
		});
	}
}
export class StackError extends ServeRxError {
	constructor(message: string, stack?: any | any[], ...args: any[]) {
		super({
			message,
			auth: [],
			fatal: true,
			code: -1,
			error: [],
			path: [],
			_stack: [...isArray(stack) ? stack : [stack]],
			handler: [],
			other: [...args]
		});
	}
}
export class HandlerError extends ServeRxError {
	constructor(message: string, handler?: any | any[], ...args: any[]) {
		super({
			message,
			auth: [],
			fatal: true,
			code: -1,
			error: [],
			path: [],
			_stack: [],
			handler: [...isArray(handler) ? handler : [handler]],
			other: [...args]
		});
	}
}
