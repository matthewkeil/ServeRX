

import { isString, isArray, isFunction, isObject, isError } from "util";
import * as _ from 'lodash';

import {
	Path,
	HandlerError
} from "../common";

import {
	Handler,
	HandlerConfig,
	Mounted,
	RouteAuth,
} from "./";




type ValidParamFunc = (arg: any) => HandlerError | Mounted.Param | undefined
interface ValidParam extends ValidParamFunc {
	values: (arg: any) => HandlerError | [Mounted.Param.Value, Handler][] | undefined;
	check: (arg: any) => HandlerError | ((value?: Mounted.Param.Value) => Handler | undefined) | undefined;
	inOrder: (arg: any) => HandlerError | [Path.Identifier, Handler][] | undefined;
	stars: (arg: any) => HandlerError | [Path.Identifier, Handler][] | undefined;
}
type ValidConfigFunc = (arg: object) => HandlerError | HandlerConfig | undefined;
interface IValid extends ValidConfigFunc {
	METHODS: Handler.Methods[];
	method: (arg: any, supported?: Handler.Methods[]) => HandlerError | Handler.Methods | undefined;
	methods: (args: any, supported?: Handler.Methods[]) => HandlerError | Handler.Methods[] | undefined;
	param: ValidParam;
	middleware: (arg: any) => HandlerError | Handler.Middleware | undefined;
	auth: (arg: any) => HandlerError | RouteAuth | undefined;
	resource: (arg: any) => HandlerError | Mounted.Resource<any> | undefined;
	path: (arg: any) => Error | Path | undefined;
	segment: (arg: any) => Error | Path.Segment | undefined;
	identifier: (arg: any) => Error | Path.Identifier | undefined;

}

let checkFunctions = {
	METHODS: <Handler.Methods[]>[
		"all",
		"get",
		"put",
		"post",
		"patch",
		"delete",
		"options",
		"head",
		"connect"
	],
	methodIsSupported: (arg: any, supported?: Handler.Methods[]):
		HandlerError | Handler.Methods | undefined => {

		if (isString(arg)) checkFunctions.METHODS.forEach(METHOD => {

			if (arg === METHOD) {

				if (supported) {
					supported.forEach(SUPPORTED => {
						if (arg === SUPPORTED) return SUPPORTED;
					});
				} else return METHOD;

				return new HandlerError(`${arg} is an unsupported method`);
			}

		});

		return undefined;
	},
	methodsAreSupported: (args: any, supported?: Handler.Methods[]):
		HandlerError | Handler.Methods[] | undefined => {

		let valid: Handler.Methods[] = [];

		if (isArray(args)) args.forEach(arg => {
			let result = checkFunctions.methodIsSupported(arg);
			switch (typeof result) {
				case 'string':
					valid.push(<Handler.Methods>result);
					break;
				case 'object':
					return <Error>result;
				case 'undefined':
				default:
					if (valid.length > 0 && (typeof arg === 'string'))
						return new HandlerError(`${arg} is not a Method`);
					break;
			}
		});
		else return checkFunctions.methodsAreSupported([args], supported);

		return valid.length > 0
			? valid
			: undefined;
	},
	validMountedParamValues: (args: any):
		HandlerError | [Mounted.Param.Value, Handler][] | undefined => {

		if (isArray(args)) {
			let valid: [Mounted.Param.Value, Handler][] = [];
			let error: undefined | HandlerError;

			args.forEach((arg, index) => {
				if (isString(arg[0]) && (arg[1] instanceof Handler))
					valid.push(arg);
				else if (valid.length > 0)
					error = new HandlerError(`param.values array index ${index} is invalid`, arg);
			});

			return error ? error : valid;
		}

		return undefined;
	},
	validParamCheck: (arg: any):
		HandlerError | ((value?: Mounted.Param.Value) => undefined | Handler) | undefined => {

		if (isFunction(arg) && (<Function>arg).length === 1) {
			return <((value?: Mounted.Param.Value) => (undefined | Handler))>arg
		}

		return undefined;
	},
	validParamInOrder: (args: any):
		HandlerError | [Path.Identifier, Handler][] | undefined => {

		if (isArray(args)) {
			let valid: [Path.Identifier, Handler][] = [];
			let error: undefined | HandlerError;

			args.forEach((arg: Path.Segment, index) => {
				if (isArray(arg)
					&& Path.validateIdentifier(arg[0])
					&& arg[0].startsWith(':')
					&& arg[1] instanceof Handler)
					valid.push(arg);
				else if (valid.length > 0)
					error = new HandlerError(`param.inOrder array index ${index} is invalid`, arg);
			});

			return error ? error : valid;
		}

		return undefined;
	},
	validParamStars: (args: any):
		HandlerError | [Path.Identifier, Handler][] | undefined => {

		if (isArray(args)) {
			let valid: [Path.Identifier, Handler][] = [];
			let error: undefined | HandlerError;

			args.forEach((arg, index) => {
				if (arg instanceof Handler && isArray(arg.segment) && (arg.segment[1] === '*'))
					valid.push([`:${arg.segment[0]}`, arg]);
				else if (valid.length > 0)
					error = new HandlerError(`param.inOrder array index ${index} is invalid`, arg);
			});

			return error ? error : valid;
		}

		return undefined;
	},
	validParam: (arg: any): HandlerError | Param | undefined => {

		if (isObject(arg)) {

			let valid = <Param>{};
			let keys = Object.keys(arg);

			if (keys.length === 0) return new HandlerError('empty object');

			keys.forEach(key => {

				let value = (<any>arg)[key];

				switch (key) {
					case 'values':
						(<any>valid).values = checkFunctions.validMounted.Param.Values(value);
						if (!valid.values || isError(valid.values))
							return <Error>valid.values || new HandlerError('values array is invalid')
						break;
					case 'check':
						(<any>valid).check = checkFunctions.validParamCheck(value);
						if (!valid.check || isError(valid.check))
							return <Error>valid.check || new HandlerError('check function is invalid')
						break;
					case 'inOrder':
						(<any>valid).inOrder = checkFunctions.validParamInOrder(value);
						if (!valid.inOrder || isError(valid.inOrder))
							return <Error>valid.inOrder || new HandlerError('inOrder array is invalid')
						break;
					case 'stars':
						(<any>valid).stars = checkFunctions.validParamStars(value);
						if (!valid.stars || isError(valid.stars))
							return <Error>valid.stars || new HandlerError('stars array is invalid')
						break;
					default: if (Object.keys(valid).length > 0)
						return new HandlerError('object has erroneous properties');
				}

			});

			return Object.keys(valid).length > 0
				? valid
				: undefined;
		}

		return undefined
	},
	validAuth: (arg: any): HandlerError | RouteAuth | undefined => {

		let found = false;
		let notOne = false;

		[_.flattenDeep([arg])].forEach(item => {
			if (item instanceof RouteAuth) found = true;
			else notOne = true;
		});

		if (!found) return undefined;

		if (notOne) return new HandlerError('invalid auth found');

		return RouteAuth.from(arg);
	},
	validResource: (arg: any):
		HandlerError | Resource<any> | undefined => {

		if (!isFunction(arg)) return new HandlerError('not a function');
		if (arg.length !== 2) return new HandlerError(`supplied function expects
				${ arg.length} arguments instead of 2 (req, res)`);
		return arg
	},
	validMiddleware: (arg: any): HandlerError | Handler.Middleware | undefined => {
		return undefined;
	},
	validConfig: (arg: any): HandlerError | Handler.Config | undefined => {

		if (isObject(arg)) {

			let config: {
				root?: HandlerError | Router | undefined;
				path?: HandlerError | MatchString | undefined;
				supportedMethods?: HandlerError | Method[] | undefined;
				param?: HandlerError | Param | undefined;
				auth?: HandlerError | RouteAuth | undefined;
				middleware?: HandlerError | Middleware | undefined;
				methods?: HandlerError | Method[] | undefined;
				resource?: HandlerError | Resource<any> | undefined;
			} = {};

			let keys = Object.keys(arg);

			if (keys.length === 0) return new HandlerError('object is empty');

			keys.forEach(key => {

				let value = (<any>arg)[key];

				switch (key) {
					case 'path':
						config.path = MatchString.isValid(value);
						if (!config.path || (config.path instanceof Error))
							return config.path || new HandlerError("invalid path");
						break;
					case 'methods':
						if (isArray(value)) {
							let test: any;
							let valid = checkFunctions.methodsAreSupported(value)
							if (valid && !(valid instanceof Error)) {
								config.methods = valid;
								if (config.supportedMethods && !isError(config.supportedMethods)) test = checkFunctions.methodsAreSupported(config.methods, config.supportedMethods);
								if (test && (test instanceof Error)) return test;
							}
							else return valid || new HandlerError(`methods array is invalid`);
						} else return new HandlerError(`config.methods must be an array`);
						break;
					case 'supportedMethods':
						if (isArray(value)) {
							let test: any;
							let valid = checkFunctions.methodsAreSupported(value);
							if (valid && !(valid instanceof Error)) {
								config.supportedMethods = valid;
								if (config.methods) test = checkFunctions.methodsAreSupported(config.methods, config.supportedMethods);
								if (test && (test instanceof Error)) return test;
							}
							else return valid || new HandlerError(`supportedMethods array is invalid`);
						} else return new HandlerError(`config.supportedMethods must be an array`);
						break;
					case 'auth':
						config.auth = value;
						if (!(value instanceof RouteAuth))
							return new HandlerError("Handler.auth must be a valid RouteAuth", value);
						break;
					case 'root':
						config.root = value;
						if (!(value instanceof Router))
							return new HandlerError("Handler.root must be a valid Router", value);
						break;
					case 'param':
						config.param = checkFunctions.validParam(value);
						if (!config.param || (config.param instanceof Error))
							return config.param || new HandlerError("Handler.param must be a valid SegmentParams", value);
						break;
					case 'middleware':
						config.middleware = checkFunctions.validMiddleware(value);
						if (!config.middleware || (config.middleware instanceof Error))
							return config.middleware || new HandlerError("Handler.middleware must be valid Middleware", value);
						break;
					case 'resource':
						config.resource = checkFunctions.validResource(value);
						if (!config.resource || (config.resource instanceof Error))
							return config.resource || new HandlerError("Handler.resource must be valid a valid resource", value);
						break;
					default:
						return new HandlerError(`object has an erroneous property of ${key}`);
				}

			});

			return Object.keys(config).length > 0
				? <IHandlerConfig>config
				: undefined;

		}

		return undefined;
	}
}

let Valid = <IValid>((arg: object) => {

	Valid.METHODS = checkFunctions.METHODS;
	Valid.method = checkFunctions.methodIsSupported;
	Valid.methods = checkFunctions.methodsAreSupported;
	Valid.middleware = checkFunctions.validMiddleware;
	Valid.resource = checkFunctions.validResource;
	Valid.identifier = Path.validateIdentifier;
	Valid.segment = Path.validateSegment;
	Valid.path = Path.validate;
	Valid.param = <ValidParam>checkFunctions.validParam;
	Valid.param.values = checkFunctions.validMountedParamValues;
	Valid.param.check = checkFunctions.validParamCheck;
	Valid.param.inOrder = checkFunctions.validParamInOrder;
	Valid.param.stars = checkFunctions.validParamStars;

	if (isObject(arg)) {

		let config: {
			root?: HandlerError | Router | undefined;
			path?: HandlerError | Path | undefined;
			supportedMethods?: HandlerError | Handlder.Methods[] | undefined;
			param?: HandlerError | Mounted.Param | undefined;
			auth?: HandlerError | RouteAuth | undefined;
			middleware?: HandlerError | Handler.Middleware | undefined;
			methods?: HandlerError | Handler.Methods[] | undefined;
			resource?: HandlerError | Mounted.Resource<any> | undefined;
		} = {};

		let keys = Object.keys(arg);

		if (keys.length === 0) return new HandlerError('object is empty');

		keys.forEach(key => {

			let value = (<any>arg)[key];

			switch (key) {
				case 'path':
					config.path = <Path>Valid.path(value);
					if (!config.path || (config.path instanceof Error))
						return config.path || new HandlerError("invalid path", value);
					break;
				case 'methods':
					if (isArray(value)) {
						let test: any;
						let valid = checkFunctions.methodsAreSupported(value)
						if (valid && !(valid instanceof Error)) {
							config.methods = valid;
							if (config.supportedMethods && !isError(config.supportedMethods)) test = checkFunctions.methodsAreSupported(config.methods, config.supportedMethods);
							if (test && (test instanceof Error)) return test;
						}
						else return valid || new HandlerError(`methods array is invalid`);
					} else return new HandlerError(`config.methods must be an array`);
					break;
				case 'supportedMethods':
					if (isArray(value)) {
						let test: any;
						let valid = checkFunctions.methodsAreSupported(value);
						if (valid && !(valid instanceof Error)) {
							config.supportedMethods = valid;
							if (config.methods) test = checkFunctions.methodsAreSupported(config.methods, config.supportedMethods);
							if (test && (test instanceof Error)) return test;
						}
						else return valid || new HandlerError(`supportedMethods array is invalid`);
					} else return new HandlerError(`config.supportedMethods must be an array`);
					break;
				case 'auth':
					config.auth = value;
					if (!(value instanceof RouteAuth))
						return new HandlerError("Handler.auth must be a valid RouteAuth", value);
					break;
				case 'root':
					config.root = value;
					if (!(value instanceof Router))
						return new HandlerError("Handler.root must be a valid Router", value);
					break;
				case 'param':
					config.param = checkFunctions.validParam(value);
					if (!config.param || (config.param instanceof Error))
						return config.param || new HandlerError("Handler.param must be a valid SegmentParams", value);
					break;
				case 'middleware':
					config.middleware = checkFunctions.validMiddleware(value);
					if (!config.middleware || (config.middleware instanceof Error))
						return config.middleware || new HandlerError("Handler.middleware must be valid Middleware", value);
					break;
				case 'resource':
					config.resource = checkFunctions.validResource(value);
					if (!config.resource || (config.resource instanceof Error))
						return config.resource || new HandlerError("Handler.resource must be valid a valid resource", value);
					break;
				default:
					return new HandlerError(`object has an erroneous property of ${key}`);
			}

		});

		return Object.keys(config).length > 0
			? <Handler.Config>config
			: undefined;

	}

	return undefined;
});

export { Valid, IValid }


// export namespace Valid {

// 	export type METHODS = Config['METHODS'];
// 	export type Method = Config['method'];
// 	export type Methods = Config['methods'];
// 	export type Middleware = Config['middleware'];
// 	export type Resource = Config['resource'];
// 	export type Path = Config['matchString'];
// 	export type Segment = Config['segment'];
// 	export type Path.Identifier = Config['identifier'];
// 	export type Path = Config['path'];

// 	export namespace Param {
// 		export type Values = Param['values'];
// 		export type Check = Param['check'];
// 		export type InOrder = Param['inOrder'];
// 		export type Stars = Param['stars'];
// 	}
// }




		// 	path?: HandlerError | MatchString | undefined;
		// 	methods?: HandlerError | Method[] | undefined;
		// 	supportedMethods?: MountError | Method[] | undefined;
		// 	auth?: MountError | RouteAuth | undefined;
		// 	param?: MountError | Param | undefined;
		// 	middleware?: MountError | Middleware | undefined;
		// 	resource?: MountError | Resource<any> | undefined;
		// } = {};