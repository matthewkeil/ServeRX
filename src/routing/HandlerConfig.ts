import * as _ from 'lodash';

import {
	isArray,
	isError,
	isFunction,
	isObject,
	isString,
	isUndefined
} from 'util';

import {
	Path,
	PathError
} from '../common';

import {
	Handler,
	Mounted,
	RouteAuth,
	IValid,
	Valid
} from './';



export class HandlerConfig {

	public static valid: IValid = Valid;

	public static decipherArgs(args: any): Handler.Config | Error {

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
			config          : <IHandlerConfig[]>[],
			methods         : <(Handler.Methods | Handler.Methods[])[]>[],
			supportedMethods: [undefined, -1],
			path            : <Path.MatchString[]>[],
			root            : <Handler[]>[],
			auth            : RouteAuth.create(false, false),
			middleware      : <Handler.Middleware[]>[],
			param           : <Mounted.Param[]>[],
			/**
			 * Mountable can be
			 * - resource to mount to methods
			 * - star parameter to mount to identifiers/stars
			 * - value parameter to mount to identifiers/values&check
			 */
			mountable       : <Mounted.Mountable[]>[]
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
				else if (valid) maybe.param.push({inOrder: valid});

				valid = HandlerConfig.valid.param.values(arg);
				if (isError(valid)) return valid;
				else if (valid) maybe.param.push({values: valid});

				valid = HandlerConfig.valid.path(arg);
				if (isError(valid)) return valid;
				else if (valid) maybe.path.push(arg);

				valid = HandlerConfig.valid.auth(arg);
				if (isError(valid)) return valid;
				else if (valid) maybe.auth.merge(arg);

				try {
					valid = RouteHandler.decipherArgs(arg);
				} catch (err) {
				}
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
				else if (valid) maybe.param.push({stars: valid});

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
				else if (valid) maybe.param.push({check: valid});

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
	protected _mount: Mounted.Add;
	protected _unmount: Mounted.Remove;


	get path(): Path {
		return this._path;
	}

	set path(arg: Path) {
		throw new PathError('cannot manually set the path', arg);
	}

	public last                 = this._path.last;
	public identifier           = this._path.id;
	public value: Handler.Value = this._path.val;
	public updatePath           = this._path.update;


	get root() {
		return this._root;
	}

	set root(handler: Handler | undefined) {
		if (isUndefined(handler) || handler instanceof Handler) this.config.root = handler;
		else throw new MountError('Handler.root must be a valid Handler ', handler);
	}

	get supportedMethods(): Handler.Methods[] {
		return this._supportedMethods || HandlerConfig.validate.METHODS;
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

	get auth(): RouteAuth | undefined {
		return this._auth;
	}

	set auth(arg: RouteAuth | undefined) {
		if (arg instanceof RouteAuth) this.config.auth = arg;
		else throw new AuthError('RouteHandler.auth must be a valid RouteAuth', arg);
	}

	get middleware(): Handler.Middleware | undefined {
		return this._middleware;
	}

	set middleware(arg) {
		let valid = HandlerConfig.validate.middleware(arg);
		if (valid && !(valid instanceof Error)) this.config.middleware = valid;
		else throw valid || new MountError('RouteHandler.middleware must be valid middleware', arg);
	}

	get methods(): Mounted.Methods | undefined {
		return this._mounted.methods;
	}

	set methods(arg) {
		throw new MountError('methods must be mounted', arg);
	}

	get param(): Mounted.Param | undefined {
		return this._mounted.param;
	}

	set param(arg) {
		throw new MountError('methods must be mounted', arg);
	}

	get routes(): Mounted.Routes | undefined {
		return this._mounted.routes;
	}

	set routes(arg) {
		throw new MountError('methods must be mounted', arg);
	}


	constructor(_config: Handler.Config) {

		this._path = _config.path || Path.validate('./');

		this._root             = _config.root; //|| new Handler({path: this._path});
		this._supportedMethods = _config.supportedMethods;
		this._auth             = _config.auth;
		this._middleware       = _config.middleware;

		this.config = this;

		this._mounted = new Mounted(this);
		this._mount   = this._mounted.add;
		this._unmount = this._mounted.remove;

		let results = this._mount(_config);

		if (isError(results)) results;

	}


}
export namespace HandlerConfig {
	export interface IHandlerConfig {
		root?: Handler;
		path?: Path;
		methods?: Handler.Methods[];
		supportedMethods?: Handler.Methods[];
		auth?: RouteAuth;
		middleware?: Handler.Middleware;
		param?: Mounted.Param;
		mountable?: Mounted.Mountable;
		resource?: Resource<any>;
	}
	export type I = IHandlerConfig;
}