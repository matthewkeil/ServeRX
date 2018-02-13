

import { isArray, isString, isError } from "util";


import {
	Path,
	HandlerError
} from "../common";

import {
	Handler,
	RouteAuth,
	HandlerConfig
} from "./";




export class Mounted {

	public methods: Mounted.Methods;
	public param: Mounted.Param;
	public routes: Mounted.Routes;
	public add: Mounted.Add;
	public remove: Mounted.Remove;


	constructor(private config: HandlerConfig) {
		this.methods = this.routes = {};
		this.param = {
			values: [],
			inOrder: [],
			stars: {}
		};

		this.add = <Mounted.Add>this._add.all;
		this.add.methods = this._add.methods;
		this.add.param = <Mounted.Add.Param>this._add.param;
		this.add.param.values = this._add.paramValues;
		this.add.param.check = this._add.paramCheck;
		this.add.param.inOrder = this._add.paramInOrder;
		this.add.param.stars = this._add.paramStars;

		this.remove = <Mounted.Remove>this._remove.all;
		this.remove.methods = this._remove.methods;
		this.remove.param = <Mounted.Remove.Param>this._remove.param;
		this.remove.param.values = this._remove.paramValues;
		this.remove.param.check = this._remove.paramCheck;
		this.remove.param.inOrder = this._remove.paramInOrder;
		this.remove.param.stars = this._remove.paramStars;
	}
	[Symbol.iterator] = () => {

		let searchOrder = <[Handler.Value, Handler][]>[];

		for (let valHandler of this.param.inOrder) {
			for (let val of valHandler[1]) {
				val
					? searchOrder.push(val)
					: null;
			}
		}

		Object.keys(this.param.stars).forEach(identifier => {
			searchOrder.push(['*', (<Handler>this.param.stars[identifier])]);
		});

		return {
			next: () => {
				let current = searchOrder.shift();
				return current
					? {
						value: current,
						done: false
					}
					: {
						value: undefined,
						done: true
					}
			}
		}
	}


	private _add = {
		methods: (resource: Resource<any>, methods: Method[] = ['all'], supported: Method[] = this.config.supportedMethods): HandlerConfig | MountError => {

			let self = this;

			if (HandlerConfig.validate.methods(methods, supported)) methods.forEach(method => {

				if (method === 'all')
					return supported.forEach(METHOD => {
						(<any>self).methods[METHOD] = resource;
					});
				else (<any>self).methods[method] = resource;

			});
			else throw new MountError('Cannot mount a resource to an unsupported method');

			return this.config;
		},
		paramValues: (values: [Mounted.Param.Value, Handler][], replaceExisting: boolean = false): HandlerConfig | MountError => {

			if (isArray(this.segment)
				&& this.segment[0].startsWith(':')
				&& (this.segment[1] === undefined)) {

				let test = HandlerConfig.validate.param.values(values);

				if (!test || isError(test))
					return test || new MountError('cannon mount invalid param values');

				replaceExisting
					? this.param.values = test
					: this.param.values.concat(test);

				return this.config;
			}

			return new MountError('param values can only be added to segments that are value params');
		},
		paramCheck: (check: Mounted.Param.ValueCheckFunction): HandlerConfig | MountError => {

			if (isArray(this.segment)
				&& this.segment[0].startsWith(':')
				&& (this.segment[1] === undefined)) {

				let test = HandlerConfig.validate.param.check(check);

				if (!test || isError(test))
					return test || new MountError('cannon mount invalid check function');

				this.param.check = test;

				return this.config;
			}

			return new MountError('check function can only be added to segments that are value params');
		},
		paramInOrder: (params: [Path.Identifier, Handler][], replaceExisting: boolean = false): HandlerConfig | MountError => {

			let test = HandlerConfig.validate.param.inOrder(params);

			if (!test || isError(test))
				return test || new MountError('cannon mount invalid segment params');

			replaceExisting
				? this.param.inOrder = test
				: this.param.inOrder.concat(test);

			return this.config;
		},
		paramStars: (params: [Path.Identifier, Handler][], replaceExisting: boolean = false): HandlerConfig | MountError => {

			let test = HandlerConfig.validate.param.stars(params);

			if (!test || isError(test))
				return test || new MountError('cannon mount invalid star params');

			replaceExisting
				? this.param.stars = test
				: this.param.stars.concat(test);

			return this.config;
		},
		param: (param: Mounted.Param): HandlerConfig | MountError => {

			let valid = HandlerConfig.validate.param(param);

			if (!valid || isError(valid))
				return valid || new MountError('cannon mount invalid params');

			let error: undefined | MountError;
			let original = Object.assign({}, this.param);

			function checkResults(results: MountError | HandlerConfig) {
				if (isError(results) && !error) error = results;
			}

			if (valid.check) checkResults(this._add.paramCheck(valid.check));
			if (valid.values) checkResults(this._add.paramValues(valid.values));
			if (valid.inOrder) checkResults(this._add.paramInOrder(valid.inOrder));
			if (valid.stars) checkResults(this._add.paramStars(valid.stars));

			if (error) {
				this.param = original;
				return error;
			}

			return this.config;
		},
		all: (config: Handler.Config): HandlerConfig | MountError => {

			if (config.resource && !config.param) {
				let results = this.add.methods(config.resource, config.methods, this.supportedMethods);
				if (isError(results)) return <MountError>results;
			} else if (!config.resource && config.param) {

			} else if (config.resource && config.param) {

			}

			return this.config;

		}
	}
	private _remove = {
		methods: (remove: Method[]): HandlerConfig | MountError => {

			if (isArray(remove) && this.methods) remove.forEach(method => {
				if (isString(method) && (<any>this).methods[method])
					delete (<any>this).methods[method];
			});

			return this.config;
		},
		paramValues: (remove: Handler.Value | Handler.Value[]): HandlerConfig | MountError => {

			if (this.param && this.param.values) {

				let self = this;
				let original = Object.assign({}, this.param.values);

				(isArray(remove) ? remove : [remove]).forEach(value => {

					let newValues: [Handler.Value, Handler][] = [];
					let found = false;

					self.param.values.forEach(val => {
						if (value === val[0]) found = true;
						else newValues.push(val);
					});

					if (!found) {
						this.param.values = original;
						return new MountError(`couldnt find param value ${value}`);
					}

					self.param.values = newValues;
				});

				return this.config;
			}

			return new MountError('no param values found');
		},
		paramCheck: (): HandlerConfig | MountError => {

			if (this.param && this.param.check) {
				delete this.param.check;
				return this.config;
			}

			return new MountError('no param check function found');
		},
		paramInOrder: (remove: Path.Identifier | Path.Identifier[]): HandlerConfig | MountError => {

			let self = this;
			let original = Object.assign({}, this.param.inOrder);

			(isArray(remove) ? remove : [remove]).forEach(identifier => {

				if (!Path.ValidIdentifier.test(identifier)) {
					this.param.inOrder = original;
					return new MountError(`${identifier} is not a valid identifier`);
				}

				let newValues: [Path.Identifier, Handler][] = [];
				let found = false;

				self.param.inOrder.forEach(val => {
					if (identifier === val[0]) found = true;
					else newValues.push(val);
				});

				if (!found) {
					this.param.inOrder = original;
					return new MountError(`couldnt find param identifier ${identifier}`);
				}

				self.param.values = newValues;
			});

			return this.config;

		},
		paramStars: (remove: Path.Identifier | Path.Identifier[]): HandlerConfig | MountError => {

			let self = this;
			let original = Object.assign({}, this.param.stars);

			(isArray(remove) ? remove : [remove]).forEach(identifier => {

				if (!Path.ValidIdentifier.test(identifier)) {
					this.param.stars = original;
					return new MountError(`${identifier} is not a valid identifier`);
				}

				if (!identifier.startsWith(':')) identifier = `:${identifier}`

				if (self.param.stars.hasOwnProperty(identifier))
					delete self.param.stars[identifier];
				else {
					this.param.stars = original;
					return new MountError(`couldnt find param identifier ${identifier}`);
				}

			});

			return this.config;
		},
		param: (): HandlerConfig | MountError => {

			if (this.param) delete this.param;
			else return new MountError('no param to remove');

			return this.config;
		},
		all: (): Handler.Config | MountError => { }
	}
}
export namespace Mounted {
	export namespace Param {
		export type Value = [Handler.Value, Handler];
		export type Stars = Handler.IndexByIdentifier;
		export type ValuesToSearch = Handler.ArrayByValue;
		export type ValueHandlersToSearch = Handler.ArrayByIdentifier;
		export type ValueCheckFunction = (value?: Path.ParamValue) => undefined | Handler;
	}
	export namespace Add {
		export namespace Param {
			export type Func = (param: Mounted.Param) => HandlerConfig | MountError;
			export type Values = (values: [Mounted.Param.Value, Handler][], replaceExisting: boolean) => HandlerConfig | MountError;
			export type Check = (check: Mounted.Param.ValueCheckFunction) => HandlerConfig | MountError;
			export type InOrder = (params: [Path.Identifier, Handler][], replaceExisting: boolean) => HandlerConfig | MountError;
			export type Stars = (params: [Path.Identifier, Handler][], replaceExisting: boolean) => HandlerConfig | MountError;
		}

		export type Func = (config: Handler.Config) => HandlerConfig | MountError
		export type Methods = (resource: Resource<any>, methods?: Method[], supported?: Method[]) => HandlerConfig | MountError;
		export type Routes = (config: Handler.Config) => HandlerConfig | MountError;
		export interface Param extends Param.Func {
			values: Param.Values;
			check: Param.Check;
			inOrder: Param.InOrder;
			stars: Param.Stars;
		}
	}
	export interface Add extends Add.Func {
		methods: Mounted.Add.Methods;
		param: Mounted.Add.Param;
		routes: Mounted.Add.Routes;
	}
	export namespace Remove {
		export namespace Param {
			export type Func = () => HandlerConfig | MountError;
			export type Values = (remove: Mounted.Param.Value | Mounted.Param.Value[]) => HandlerConfig | MountError;
			export type Check = () => HandlerConfig | MountError;
			export type InOrder = (remove: Path.Identifier | Path.Identifier[]) => HandlerConfig | MountError;
			export type Stars = (remove: Path.Identifier | Path.Identifier[]) => HandlerConfig | MountError;
		}

		export type Func = () => HandlerConfig | MountError;
		export type Methods = (remove: Method[]) => HandlerConfig | MountError;
		export type Routes = () => HandlerConfig | MountError;
		export interface Param extends Param.Func {
			values: Param.Values;
			check: Param.Check;
			inOrder: Param.InOrder;
			stars: Param.Stars;
		}
	}
	export interface Remove extends Remove.Func {
		methods: Remove.Methods;
		routes: Remove.Routes;
		param: Remove.Param;

	}


	export type Methods = {
		get?: Resource<any>;
		put?: Resource<any>;
		post?: Resource<any>;
		patch?: Resource<any>;
		delete?: Resource<any>;
		options?: Resource<any>;
		head?: Resource<any>;
		connect?: Resource<any>;
	}
	export type Param = {
		values: Mounted.Param.ValuesToSearch;
		check?: Mounted.Param.ValueCheckFunction;
		inOrder: Mounted.Param.ValueHandlersToSearch;
		stars: Mounted.Param.Stars;
	}
	export type Routes = Handler.IndexByIdentifier;
	export type Mountable<T> = ['methods', T] | ['stars', T] | ['values', T];
	export type Resource<T> = {
		resource: Handler.Resource<T>;
		methods: Handler.Methods[];
	};
	export type MountableStar = {
		stars: Mounted.Param.Stars,
		methods: Handler.Methods[]
	};
	export type MountableValues = {
		values?: Mounted.Param.ValuesToSearch,
		check?: Mounted.Param.ValueCheckFunction
		methods: Handler.Methods[]
	};
}
