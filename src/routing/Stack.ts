

import { isNumber, isError, isObject } from "util";

import {
	Path,
	PathError,
	StackError
} from "../common";

import {
	Handler,
	RouteAuth
} from "./";

export class Stack implements Stack.I {

	public results: Handler.Match[0] = [];
	public path?: Path;
	public handlers?: Handler[];
	public auth?: RouteAuth;
	public middleware?: Handler.Middleware[];
	public req?: Request;
	public res?: Response;
	public resources?: { [id: string]: any };

	get copy() {
		return new Stack(this);
	}
	constructor(base?: Stack.I) {

		if (base && !isObject(base)) throw new StackError('base stack invalid', base);

		Object.keys(base || {}).forEach(key => (<any>this)[key] = (<any>base)[key]);

	}

	public push(results: Handler.Match[0], handler?: Handler): undefined | Error {

		if (results.length > this.results.length)
			this.results.concat(results.slice(this.results.length - 1));

		function push(arg: any) {
			(<any>this).handlers = (this.handlers || []).push(arg)
		}

		if (handler)
			try {
				push(handler);

				if (handler.auth) this.auth
					? this.auth.merge(handler.auth)
					: this.auth = handler.auth;

				if (handler.middleware)
					(<any>this).middleware = (this.middleware || []).push(handler.middleware);

			} catch (err) { return err }

		else push(undefined);

		return undefined;
	}
}
export namespace Stack {
	export interface I {
		results?: Handler.Match[0];
		path?: Path;
		handlers?: Handler[];
		auth?: RouteAuth;
		middleware?: Handler.Middleware[];
		req?: Request;
		res?: Response;
		resources?: { [id: string]: any };

	}
	export type Resolution = Stack | [number, Stack]
}

// 	static concat(target: Stack, source: Stack): Stack | Error {

// 		if (!(target instanceof Stack)) return new StackError('target is not a stack', target);
// 		if (!(source instanceof Stack)) return new StackError('source is not a stack', source);

// 		let result = new Stack;

// 		let pathResult: undefined | Path | PathError | number;
// 		let insertAt: undefined | number;

// 		if (target.path && target.path.isFromRoot)
// 			pathResult = !source.path
// 				? target.path
// 				: source.path.isFromRoot
// 					? Path.oneExtendsTheOther(target, source)
// 					: source.isABranchOf(target);

// 		if (!pathResult && source.path && source.path.isFromRoot) {
// 			if (!target.path) pathResult = source.path;
// 			else
// 				if (!target.path.isFromRoot) pathResult = target.isABranchOf(source);
// 				else return Stack.concat(source, target);
// 		}


// 		if (!pathResult || pathResult instanceof Path) {
// 			return target.results.length > source.results.length
// 				? Stack.insertAt(target, source, 0)
// 				: Stack.insertAt(source, target, 0);
// 		} else if (isError(pathResult)) return pathResult

// 		return Stack.insertAt(target, source, insertAt);

// 	}

// 	static insertAt(target: Stack, source: Stack, index: number = (target.results.length - 1)): Stack | Error {



// 		// 	stack.handlers = (target.handlers || []).concat(source.handlers || []);
// 		// 	stack.middleware = (target.middleware || []).concat(source.middleware || []);
// 		// 	stack.auth = !target.auth
// 		// 		? source.auth
// 		// 		: source.auth
// 		// 			? target.auth.merge(source.auth)
// 		// 			: target.auth;



// 		// 		return results;
// 		// 	}



// 	}
// }