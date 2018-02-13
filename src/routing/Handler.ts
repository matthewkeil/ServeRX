
import {
	isArray,
	isString,
	isObject,
	isError,
	isFunction,
	isUndefined
} from 'util';

import * as _ from 'lodash';
import * as Rx from 'rxjs';

import { Observer } from 'rxjs/Observer';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { AnonymousSubject, Subject } from 'rxjs/Subject';
let OBSERVABLE = Observable;

// import { ServerConfig } from '../../src/ConfigRX';

import {
	Path,
	ApiError,
	AuthError,
	HandlerError,
	ServerError,
	PathError,
	StackError
} from '../common';


import {
	Valid,
	IValid,
	Mounted,
	Stack,
	Routing,
	RouteAuth
} from './';







interface IHandlerConfig {
	root?: Handler;
	path?: Path.MatchString;
	methods?: Handler.Methods[];
	supportedMethods?: Handler.Methods[];
	auth?: RouteAuth;
	middleware?: Handler.Middleware;
	param?: Mounted.Param;
	mountable?: Mounted.Mountable;
	resource?: Resource<any>;
}
export class HandlerConfig {

	static valid: IValid = Valid;

	static decipherArgs(args: any): Handler.Config | Error {

		let maybe: {
			config: IHandlerConfig[];
			methods: (Handler.Methods | Handler.Methods[])[];
			supportedMethods: [undefined | Handler.Methods[], undefined | number];
			path: Path.MatchString[];
			root: Handler[];
			auth: RouteAuth;
			middleware: Handler.Middleware[];
			param: Mounted.Param[];
			mountable: Mounted.Mountable[];
		} = {
				config: <IHandlerConfig[]>[],
				methods: <(Handler.Methods | Handler.Methods[])[]>[],
				supportedMethods: [undefined, -1],
				path: <Path.MatchString[]>[],
				root: <Handler[]>[],
				auth: RouteAuth.create(false, false),
				middleware: <Handler.Middleware[]>[],
				param: <Mounted.Param[]>[],
				/**
				 * Mountable can be
				 * - resource to mount to methods
				 * - star parameter to mount to identifiers/stars
				 * - value parameter to mount to identifiers/values&check
				*/
				mountable: <Mounted.Mountable[]>[],
			};

		Array.from(arguments).forEach(arg => {

			let valid: any;
			let error: undefined | Error;

			function mergeMethods(methods: (Handler.Methods | Handler.Methods[])[]) {

				let isHere = {};

				_.flatten(methods).forEach(method => {
					(<any>isHere)[method] = true;
				});

				return <Handler.Methods[]>Object.keys(isHere);
			}

			function spreadConfig(config: IHandlerConfig) {
				if (config.root) maybe.root.push(config.root);
				if (config.path) maybe.path.push(config.path);
				if (config.auth) maybe.auth.merge(config.auth);
				if (config.middleware) maybe.middleware.push(config.middleware);
				if (config.methods) maybe.methods.push(config.methods);
				if (config.param) maybe.param.push(config.param);
				if (config.supportedMethods) {
					if (maybe.supportedMethods[0]) {

						let lengthWhenFound = maybe.supportedMethods[1];
						if (lengthWhenFound) {

							maybe.methods = maybe.methods.slice(0, (lengthWhenFound - 1)).concat(
								<Method[]>maybe.supportedMethods[0],
								maybe.methods.slice(lengthWhenFound));

							maybe.supportedMethods = [config.supportedMethods, undefined];

						} else maybe.supportedMethods[0] =
							mergeMethods([<Method[]>maybe.supportedMethods[0], config.supportedMethods]);

					} else maybe.supportedMethods = [config.supportedMethods, undefined];
				}
			}

			if (isString(arg)) {
				/**
				 *
				 *  can be
				 *  - Method
				 *  - MatchString
				 *
				 **/
				valid = HandlerConfig.valid.method(arg, maybe.supportedMethods[0]);
				// only returns an error if there is certainty of a supported methods array
				if (isError(valid) && !maybe.supportedMethods[1]) return valid;
				else if (valid) maybe.methods.push(<Handler.Methods>valid);

				valid = HandlerConfig.valid.path(arg);
				if (isError(valid)) return valid;
				else if (valid) maybe.path.push(<Path.Segment[]>valid);

			}

			if (isArray(arg)) {
				/**
				 *  can be
				 *  - Method[] -or- SupportedMethod[] and logic to decipher how they will be determined
				 *  - param.Path.SegmentsInSearchOrder[]
				 *  - param.ValuesInSearchOrder[]
				 *  - Path.Segment[]
				 *  - new RouteAuth(from: RouteAuth[])
				 **/
				valid = HandlerConfig.valid.method(arg, maybe.supportedMethods[0]);
				// only returns if there is certainty of a supported methods array
				if (isError(valid) && maybe.supportedMethods[1]) return valid;
				else if (valid) {

					let foundAtIndex: undefined | number;
					maybe.methods.forEach((set, index) => {
						if (!foundAtIndex && isArray(set)) foundAtIndex = index;
					});

					foundAtIndex && maybe.supportedMethods[0]
						? maybe.methods.push(valid)
						: maybe.supportedMethods.push([valid, foundAtIndex]);
				}

				valid = HandlerConfig.valid.param.inOrder(arg);
				if (isError(valid)) return valid;
				else if (valid) maybe.param.push({ inOrder: valid });

				valid = HandlerConfig.valid.param.values(arg);
				if (isError(valid)) return valid;
				else if (valid) maybe.param.push({ values: valid });

				valid = HandlerConfig.valid.path(arg);
				if (isError(valid)) return valid;
				else if (valid) maybe.path.push(arg);

				valid = HandlerConfig.valid.auth(arg);
				if (isError(valid)) return valid;
				else if (valid) maybe.auth.merge(arg);

				try {
					valid = RouteHandler.decipherArgs(arg);
				} catch (err) { }
				if (valid) spreadConfig(valid);

			}

			if (isObject(arg)) {
				/**
				 * can be a
				 * - Path.MatchString
				 * - Handler
				 * - RouteAuth
				 * - Mounted
				 * - Mounted.Mounted.Param.Stars
				 * - Mounted.Mounted.Param
				 * - Handler.Middleware
				 * - IHandlerConfig
				 */
				if (arg instanceof Path.MatchString) maybe.path.push(arg);
				if (arg instanceof Handler) maybe.root.push(arg);
				if (arg instanceof RouteAuth) maybe.auth.merge(arg);

				valid = HandlerConfig.valid.param.stars(arg);
				if (isError(valid)) return valid;
				else if (valid) maybe.param.push({ stars: valid });

				valid = HandlerConfig.valid.param(arg);
				if (isError(valid)) return valid;
				else if (valid) maybe.param.push(arg);

				valid = HandlerConfig.valid.middleware(arg);
				if (isError(valid)) return valid;
				else if (valid) maybe.middleware.push(arg);

				valid = HandlerConfig.valid(arg);
				if (isError(valid)) return valid;
				else if (valid) spreadConfig(valid);

			}

			if (isFunction(arg)) {

				valid = HandlerConfig.valid.param.check(arg);
				if (isError(valid)) return valid;
				else if (valid) maybe.param.push({ check: valid });

				valid = HandlerConfig.valid.resource(arg);
				if (isError(valid)) return valid;
				else if (valid) maybe.mountable.push(['resource', valid, mergeMethods(maybe.methods)]);

			}

			return new MountError(`unknown parameter of type ${typeof arg} passed to config`, arg);

		});






	}

	public config: HandlerConfig;

	protected _path: Path;
	protected _root?: Handler;
	protected _supportedMethods?: Handler.Methods[];
	protected _auth?: RouteAuth;
	protected _middleware?: Handler.Middleware;
	protected _mounted: Mounted;
	protected _mount: Mounted.Add
	protected _unmount: Mounted.Remove;



	get path(): Path { return this._path }
	set path(arg: Path) { throw new PathError('cannot manually set the path', arg) }
	public last = this._path.last;
	public identifier = this._path.identifier;
	public value: Handler.Value = this._path.value;
	public updatePath = this._path.update;


	get root() { return this._root }
	set root(handler: Handler | undefined) {
		if (isUndefined(handler) || handler instanceof Handler) this.config.root = handler;
		else throw new MountError('Handler.root must be a valid Handler ', handler);
	}
	get supportedMethods(): Handler.Methods[] {
		return this._supportedMethods || HandlerConfig.validate.METHODS
	}
	set supportedMethods(arg) {

		let valid = HandlerConfig.validate.methods(arg);
		let test: MountError | Handler.Methods[] | undefined;

		if (valid && !(valid instanceof Error)) {
			test = HandlerConfig.validate.methods(Object.keys(this._mounted.methods || {}), valid);

			if (test && (test instanceof Error))
				throw new MountError(`cannot update supportedMethods. an existing resources is mounted at a method that will not be supported`, valid);

			this.config.supportedMethods = valid;
		}
		else throw valid || new MountError(`supportedMethods array is invalid`, arg);
	}
	get auth(): RouteAuth | undefined { return this._auth }
	set auth(arg: RouteAuth | undefined) {
		if (arg instanceof RouteAuth) this.config.auth = arg;
		else throw new AuthError('RouteHandler.auth must be a valid RouteAuth', arg);
	}
	get middleware(): Handler.Middleware | undefined { return this._middleware }
	set middleware(arg) {
		let valid = HandlerConfig.validate.middleware(arg);
		if (valid && !(valid instanceof Error)) this.config.middleware = valid;
		else throw valid || new MountError('RouteHandler.middleware must be valid middleware', arg);
	}
	get methods(): Mounted.Methods | undefined { return this._mounted.methods }
	set methods(arg) { throw new MountError('methods must be mounted', arg) }
	get param(): Mounted.Param | undefined { return this._mounted.param }
	set param(arg) { throw new MountError('methods must be mounted', arg) }
	get routes(): Mounted.Routes | undefined { return this._mounted.routes }
	set routes(arg) { throw new MountError('methods must be mounted', arg) }


	constructor(_config: Handler.Config) {

		this._path = _config.path || Path.validate('./');

		this._root = _config.root //|| new Handler({path: this._path});
		this._supportedMethods = _config.supportedMethods;
		this._auth = _config.auth;
		this._middleware = _config.middleware;

		this.config = this;

		this._mounted = new Mounted(this);
		this._mount = this._mounted.add;
		this._unmount = this._mounted.remove;

		let results = this._mount(_config);

		if (isError(results)) results;

	}



}
export class Handler extends HandlerConfig {

	static create(args: any): Handler | Error {
		try {
			let config = Handler.decipherArgs(args);
			return new Handler(<IHandlerConfig>config);
		} catch (err) { return err }
	}


	private constructor(config: Handler.Config) {
		super(config);
	}

	public isHere(input: Path.MatchString): Handler.Match {

		let [results, path] = this.path.isHere(input);
		let handler: undefined | Handler | Error;

		if (!path || isError(path)) {
			path = path || new PathError('input is not a Path.MatchString', input);
			return <Handler.Match>[results, path, handler];
		}

		if (path.length === this.path.length) handler = this;

		let length = this.path.length - 1; // array index for current segment under scrutiny

		if (!handler || results[length] === 'maybe') {

			if (!handler) length++;

			let identifier: Path.Identifier = isString(path[length])
				? <string>path[length]
				: <string>path[length][0];

			let value: Handler.Value = isString(path[length])
				? null
				: path[length][1];

			if (handler || this._mounted.routes.hasOwnProperty(identifier)) {

				if (handler) results.pop();

				handler = handler || (<any>this)._mounted.routes[identifier];

				if (value) {

					let valHandler: undefined | Handler;

					for (let val of (<Handler>handler)) {
						if (val && value === val[0]) {
							results.concat('value');
							valHandler = val[1];
						}
					}

					if (!valHandler) {

						if ((<Handler>handler)._mounted.param.check) {
							valHandler = (<any>handler)._mounted.param.check(value);
							if (valHandler) results.concat('check');
						}

						if (!valHandler) results.push('no');
					}

					handler = valHandler;

				}

			}

		}

		return <Handler.Match>[results, path, handler];
	}
	public resolve(
		input: Path.MatchString,
		make: boolean = false,
		stack: Stack = new Stack): Routing {

		let self = this;

		let routing$ = new Routing(observer => {

			let results: Path.Results[];
			let path: Path;
			let handler: undefined | Handler;
			let error: undefined | Error;
			let orderedStackResults = <[number, Stack][]>[];

			let next = (stack: Stack) => {

				let rating = 0;
				let no = false;

				stack.results.forEach(result => {
					switch (result) {
						case 'no':
							rating = 0;
							no = true;
							break;
						case 'yes':
							rating += 5;
							break;
						case 'value':
							rating += 4;
							break;
						case 'star':
							rating += 3;
							break;
						case 'check':
							rating += 2.5;
							break;
						case 'maybe':
							rating += 2;
							break;
					}
				});

				if (!no) {
					if (make) observer.next([rating, stack]);
					else {
						orderedStackResults.unshift([rating, stack]);

						orderedStackResults.sort((a, b) => {
							if (a[0] < b[0]) return -1;
							if (a[0] > b[0]) return 1;
							return 0;
						});

						observer.next(orderedStackResults[0][1]);
					}
				}
				// if (routing$.nestedIsComplete) observer.complete();
			}

			let complete = () => routing$.nestedIsComplete && !observer.closed
				? observer.complete()
				: undefined;

			[results, path, handler] = <any>self.isHere(input);

			if (isError(path)) return self.root
				? void self.root.resolve(path, make, stack).subscribe(observer)
				: void observer.error(new PathError('invalid path', path));

			if (isError(handler)) return observer.error(handler); // only throws for bad catch function

			if (handler) {
				// if (!stack) stack = new Stack({ results, path, handlers: [self] });
				if (isError(error = stack.push(results, handler))) observer.error(error);

				if (path.length === handler._path.length) {
					next(stack);
					complete();
				}
				else routing$.addNested(handler.resolve(path, make, stack), observer);
			}

			if (!isString(path[self.path.length])) complete();

			let valueFound = false;
			let valueToSearch = <string>path[self.path.length];

			for (let valHandler of this._mounted) {

				let star = false;

				if (valHandler &&
					(valHandler[0] === valueToSearch || (star = (valHandler[0] === '*')))) {

					if (make && star) {
						break;
					} else if (!make && valueFound || !star) {
						valueFound = true;
						break;
					}

					routing$.addNested(
						valHandler[1].resolve(path, false, stack.copy),
						{
							next,
							error: (err: Error) => { },
							complete
						});
				}
			}

			complete();
		});

		return routing$;
	}
	public mount(path: any, ...args: any[]): Mounting {

		let self = this;

		let mounting$ = new Mounting(observer => {









		});

		return mounting$;

	}
	[Symbol.iterator] = () => {

		let valuesInSearchOrder = this._mounted.param.values.slice();

		return {
			next() {
				return valuesInSearchOrder.length > 0
					? {
						value: <Mounted.Param.Value>valuesInSearchOrder.shift(),
						done: false
					}
					: {
						value: undefined,
						done: true
					}
			}
		}
	}
}
export namespace Handler {
	export type Config = IHandlerConfig;
	export type Resolver = Rx.AnonymousSubject<Stack>;
	export type Methods =
		| "all"
		| "get"
		| "put"
		| "post"
		| "patch"
		| "delete"
		| "options"
		| "head"
		| "connect";
	export type Observable<T> = (stack: Stack) => Rx.Observable<T>;
	export type Match = [Path.Match[0], Error | Path, Error | Handler | undefined];
	export type Value = null | Path.ParamValue;

	// array of sync handler groups to run in parallel
	export type Middleware = Handler.Observable<any>[][];
	export type Resource<T> = (stack: Stack) => Observable<T>;
	type Array<T> = [T, Handler][];
	export type ArrayByValue = Array<Value>;
	export type ArrayByIdentifier = Array<Path.Identifier>;
	export type IndexByIdentifier = { [identifier: string]: Handler };
}

// if (path.length > here.length) handler.resolve(path).subscribe(observer)

// 	let remaining = ms.slice(current.length - 1);

// 	while (remaining.length > 0) {
// 		let foundPath.Segment = false;
// 		let madeNew = false;
// 		let segment = remaining.shift();
// 		let isString: boolean;
// 		current = current.concat(segment);

// 		if (!madeNew) {
// 			if (
// 				(isString = isString(segment)) &&
// 				handler.routes.hasOwnProperty(<string>segment)
// 			) {
// 				handler = handler.routes[<string>segment];
// 				foundPath.Segment = true;
// 			}

// 			if (
// 				!foundPath.Segment &&
// 				handler.routes.hasOwnProperty(`:${Object.keys(segment)[0]}`)
// 			) {
// 				handler = handler.routes[`:${Object.keys(segment)[0]}`];
// 				foundPath.Segment = true;
// 			}
// 		}

// 		if (!foundPath.Segment || madeNew) {
// 			let name = isString
// 				? <string>segment
// 				: `:${Object.keys(segment)[0]}`;

// 			handler = handler.routes[name] = new Handler({
// 				path: current,
// 				root: this.root ? this.root : undefined,
// 				supportedMethods: this.supportedMethods
// 					? this.supportedMethods
// 					: undefined
// 			});

// 			madeNew = true;
// 		}
// 	}

// 	return handler;
// }
