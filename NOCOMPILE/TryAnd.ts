import { ServerError } from "./Errors";
import { isFunction, isUndefined } from "util";



let error: undefined | Error | ((err: Error) => Error);



let tryCatchTarget: Function;

function tryCatcher<T extends Function>(this: any): Error | T {
	try {
		return tryCatchTarget.apply(this, arguments);
	} catch (e) {
		return isUndefined(error) ?
			new Error('unhandled try/catch exception') :
			error instanceof Error ?
				error :
				error(e);
	}
}
export function TryCatch(
	fn: Function,
	ifError?: Error | ((e: Error) => Error)) {

	tryCatchTarget = fn;
	error = ifError;

	return tryCatcher();
};



// let tryBuildTarget: any;
// let buildArgs: any[];

// function tryBuilder<T extends Object>(this: any): T | Error {

// 	try {
// 		let instance: T = tryBuildTarget.constructor.apply(this, buildArgs);
// 		if (instance instanceof Error) return instance;
// 		return instance;
// 	} catch (err) { return err }


// 	// try {
// 	// 	return Object.create(tryBuildTarget.constructor(...buildArgs));
// 	// } catch (e) {
// 	// 	return !error
// 	// 		? new ServerError('unhandled try/catch exception', e)
// 	// 		: error instanceof Error
// 	// 			? error
// 	// 			: (typeof error) === 'function'
// 	// 				? error(e)
// 	// 				: new ServerError('unhandled try/catch exception and bad error response', e, error);
// 	// }
// }
// export function tryBuild<T extends Object>(
// 	obj: [T, undefined | any],
// 	ifError: Error | ((e: Error) => Error) = new ServerError('unhandled try/catch exception'),
// ): Error | T {

// 	tryBuildTarget = obj[0];
// 	buildArgs = obj[1];
// 	error = ifError;

// 	return <any>tryBuilder;
// }
