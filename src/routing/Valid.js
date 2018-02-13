"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
const _ = require("lodash");
const common_1 = require("../common");
const _1 = require("./");
let checkFunctions = {
    METHODS: [
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
    methodIsSupported: (arg, supported) => {
        if (util_1.isString(arg))
            checkFunctions.METHODS.forEach(METHOD => {
                if (arg === METHOD) {
                    if (supported) {
                        supported.forEach(SUPPORTED => {
                            if (arg === SUPPORTED)
                                return SUPPORTED;
                        });
                    }
                    else
                        return METHOD;
                    return new common_1.HandlerError(`${arg} is an unsupported method`);
                }
            });
        return undefined;
    },
    methodsAreSupported: (args, supported) => {
        let valid = [];
        if (util_1.isArray(args))
            args.forEach(arg => {
                let result = checkFunctions.methodIsSupported(arg);
                switch (typeof result) {
                    case 'string':
                        valid.push(result);
                        break;
                    case 'object':
                        return result;
                    case 'undefined':
                    default:
                        if (valid.length > 0 && (typeof arg === 'string'))
                            return new common_1.HandlerError(`${arg} is not a Method`);
                        break;
                }
            });
        else
            return checkFunctions.methodsAreSupported([args], supported);
        return valid.length > 0
            ? valid
            : undefined;
    },
    validMountedParamValues: (args) => {
        if (util_1.isArray(args)) {
            let valid = [];
            let error;
            args.forEach((arg, index) => {
                if (util_1.isString(arg[0]) && (arg[1] instanceof _1.Handler))
                    valid.push(arg);
                else if (valid.length > 0)
                    error = new common_1.HandlerError(`param.values array index ${index} is invalid`, arg);
            });
            return error ? error : valid;
        }
        return undefined;
    },
    validParamCheck: (arg) => {
        if (util_1.isFunction(arg) && arg.length === 1) {
            return arg;
        }
        return undefined;
    },
    validParamInOrder: (args) => {
        if (util_1.isArray(args)) {
            let valid = [];
            let error;
            args.forEach((arg, index) => {
                if (util_1.isArray(arg)
                    && common_1.Path.validateIdentifier(arg[0])
                    && arg[0].startsWith(':')
                    && arg[1] instanceof _1.Handler)
                    valid.push(arg);
                else if (valid.length > 0)
                    error = new common_1.HandlerError(`param.inOrder array index ${index} is invalid`, arg);
            });
            return error ? error : valid;
        }
        return undefined;
    },
    validParamStars: (args) => {
        if (util_1.isArray(args)) {
            let valid = [];
            let error;
            args.forEach((arg, index) => {
                if (arg instanceof _1.Handler && util_1.isArray(arg.segment) && (arg.segment[1] === '*'))
                    valid.push([`:${arg.segment[0]}`, arg]);
                else if (valid.length > 0)
                    error = new common_1.HandlerError(`param.inOrder array index ${index} is invalid`, arg);
            });
            return error ? error : valid;
        }
        return undefined;
    },
    validParam: (arg) => {
        if (util_1.isObject(arg)) {
            let valid = {};
            let keys = Object.keys(arg);
            if (keys.length === 0)
                return new common_1.HandlerError('empty object');
            keys.forEach(key => {
                let value = arg[key];
                switch (key) {
                    case 'values':
                        valid.values = checkFunctions.validMounted.Param.Values(value);
                        if (!valid.values || util_1.isError(valid.values))
                            return valid.values || new common_1.HandlerError('values array is invalid');
                        break;
                    case 'check':
                        valid.check = checkFunctions.validParamCheck(value);
                        if (!valid.check || util_1.isError(valid.check))
                            return valid.check || new common_1.HandlerError('check function is invalid');
                        break;
                    case 'inOrder':
                        valid.inOrder = checkFunctions.validParamInOrder(value);
                        if (!valid.inOrder || util_1.isError(valid.inOrder))
                            return valid.inOrder || new common_1.HandlerError('inOrder array is invalid');
                        break;
                    case 'stars':
                        valid.stars = checkFunctions.validParamStars(value);
                        if (!valid.stars || util_1.isError(valid.stars))
                            return valid.stars || new common_1.HandlerError('stars array is invalid');
                        break;
                    default: if (Object.keys(valid).length > 0)
                        return new common_1.HandlerError('object has erroneous properties');
                }
            });
            return Object.keys(valid).length > 0
                ? valid
                : undefined;
        }
        return undefined;
    },
    validAuth: (arg) => {
        let found = false;
        let notOne = false;
        [_.flattenDeep([arg])].forEach(item => {
            if (item instanceof _1.RouteAuth)
                found = true;
            else
                notOne = true;
        });
        if (!found)
            return undefined;
        if (notOne)
            return new common_1.HandlerError('invalid auth found');
        return _1.RouteAuth.from(arg);
    },
    validResource: (arg) => {
        if (!util_1.isFunction(arg))
            return new common_1.HandlerError('not a function');
        if (arg.length !== 2)
            return new common_1.HandlerError(`supplied function expects
				${arg.length} arguments instead of 2 (req, res)`);
        return arg;
    },
    validMiddleware: (arg) => {
        return undefined;
    },
    validConfig: (arg) => {
        if (util_1.isObject(arg)) {
            let config = {};
            let keys = Object.keys(arg);
            if (keys.length === 0)
                return new common_1.HandlerError('object is empty');
            keys.forEach(key => {
                let value = arg[key];
                switch (key) {
                    case 'path':
                        config.path = MatchString.isValid(value);
                        if (!config.path || (config.path instanceof Error))
                            return config.path || new common_1.HandlerError("invalid path");
                        break;
                    case 'methods':
                        if (util_1.isArray(value)) {
                            let test;
                            let valid = checkFunctions.methodsAreSupported(value);
                            if (valid && !(valid instanceof Error)) {
                                config.methods = valid;
                                if (config.supportedMethods && !util_1.isError(config.supportedMethods))
                                    test = checkFunctions.methodsAreSupported(config.methods, config.supportedMethods);
                                if (test && (test instanceof Error))
                                    return test;
                            }
                            else
                                return valid || new common_1.HandlerError(`methods array is invalid`);
                        }
                        else
                            return new common_1.HandlerError(`config.methods must be an array`);
                        break;
                    case 'supportedMethods':
                        if (util_1.isArray(value)) {
                            let test;
                            let valid = checkFunctions.methodsAreSupported(value);
                            if (valid && !(valid instanceof Error)) {
                                config.supportedMethods = valid;
                                if (config.methods)
                                    test = checkFunctions.methodsAreSupported(config.methods, config.supportedMethods);
                                if (test && (test instanceof Error))
                                    return test;
                            }
                            else
                                return valid || new common_1.HandlerError(`supportedMethods array is invalid`);
                        }
                        else
                            return new common_1.HandlerError(`config.supportedMethods must be an array`);
                        break;
                    case 'auth':
                        config.auth = value;
                        if (!(value instanceof _1.RouteAuth))
                            return new common_1.HandlerError("Handler.auth must be a valid RouteAuth", value);
                        break;
                    case 'root':
                        config.root = value;
                        if (!(value instanceof Router))
                            return new common_1.HandlerError("Handler.root must be a valid Router", value);
                        break;
                    case 'param':
                        config.param = checkFunctions.validParam(value);
                        if (!config.param || (config.param instanceof Error))
                            return config.param || new common_1.HandlerError("Handler.param must be a valid SegmentParams", value);
                        break;
                    case 'middleware':
                        config.middleware = checkFunctions.validMiddleware(value);
                        if (!config.middleware || (config.middleware instanceof Error))
                            return config.middleware || new common_1.HandlerError("Handler.middleware must be valid Middleware", value);
                        break;
                    case 'resource':
                        config.resource = checkFunctions.validResource(value);
                        if (!config.resource || (config.resource instanceof Error))
                            return config.resource || new common_1.HandlerError("Handler.resource must be valid a valid resource", value);
                        break;
                    default:
                        return new common_1.HandlerError(`object has an erroneous property of ${key}`);
                }
            });
            return Object.keys(config).length > 0
                ? config
                : undefined;
        }
        return undefined;
    }
};
let Valid = ((arg) => {
    Valid.METHODS = checkFunctions.METHODS;
    Valid.method = checkFunctions.methodIsSupported;
    Valid.methods = checkFunctions.methodsAreSupported;
    Valid.middleware = checkFunctions.validMiddleware;
    Valid.resource = checkFunctions.validResource;
    Valid.identifier = common_1.Path.validateIdentifier;
    Valid.segment = common_1.Path.validateSegment;
    Valid.path = common_1.Path.validate;
    Valid.param = checkFunctions.validParam;
    Valid.param.values = checkFunctions.validMountedParamValues;
    Valid.param.check = checkFunctions.validParamCheck;
    Valid.param.inOrder = checkFunctions.validParamInOrder;
    Valid.param.stars = checkFunctions.validParamStars;
    if (util_1.isObject(arg)) {
        let config = {};
        let keys = Object.keys(arg);
        if (keys.length === 0)
            return new common_1.HandlerError('object is empty');
        keys.forEach(key => {
            let value = arg[key];
            switch (key) {
                case 'path':
                    config.path = Valid.path(value);
                    if (!config.path || (config.path instanceof Error))
                        return config.path || new common_1.HandlerError("invalid path", value);
                    break;
                case 'methods':
                    if (util_1.isArray(value)) {
                        let test;
                        let valid = checkFunctions.methodsAreSupported(value);
                        if (valid && !(valid instanceof Error)) {
                            config.methods = valid;
                            if (config.supportedMethods && !util_1.isError(config.supportedMethods))
                                test = checkFunctions.methodsAreSupported(config.methods, config.supportedMethods);
                            if (test && (test instanceof Error))
                                return test;
                        }
                        else
                            return valid || new common_1.HandlerError(`methods array is invalid`);
                    }
                    else
                        return new common_1.HandlerError(`config.methods must be an array`);
                    break;
                case 'supportedMethods':
                    if (util_1.isArray(value)) {
                        let test;
                        let valid = checkFunctions.methodsAreSupported(value);
                        if (valid && !(valid instanceof Error)) {
                            config.supportedMethods = valid;
                            if (config.methods)
                                test = checkFunctions.methodsAreSupported(config.methods, config.supportedMethods);
                            if (test && (test instanceof Error))
                                return test;
                        }
                        else
                            return valid || new common_1.HandlerError(`supportedMethods array is invalid`);
                    }
                    else
                        return new common_1.HandlerError(`config.supportedMethods must be an array`);
                    break;
                case 'auth':
                    config.auth = value;
                    if (!(value instanceof _1.RouteAuth))
                        return new common_1.HandlerError("Handler.auth must be a valid RouteAuth", value);
                    break;
                case 'root':
                    config.root = value;
                    if (!(value instanceof Router))
                        return new common_1.HandlerError("Handler.root must be a valid Router", value);
                    break;
                case 'param':
                    config.param = checkFunctions.validParam(value);
                    if (!config.param || (config.param instanceof Error))
                        return config.param || new common_1.HandlerError("Handler.param must be a valid SegmentParams", value);
                    break;
                case 'middleware':
                    config.middleware = checkFunctions.validMiddleware(value);
                    if (!config.middleware || (config.middleware instanceof Error))
                        return config.middleware || new common_1.HandlerError("Handler.middleware must be valid Middleware", value);
                    break;
                case 'resource':
                    config.resource = checkFunctions.validResource(value);
                    if (!config.resource || (config.resource instanceof Error))
                        return config.resource || new common_1.HandlerError("Handler.resource must be valid a valid resource", value);
                    break;
                default:
                    return new common_1.HandlerError(`object has an erroneous property of ${key}`);
            }
        });
        return Object.keys(config).length > 0
            ? config
            : undefined;
    }
    return undefined;
});
exports.Valid = Valid;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVmFsaWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJWYWxpZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLCtCQUF3RTtBQUN4RSw0QkFBNEI7QUFFNUIsc0NBR21CO0FBRW5CLHlCQUtZO0FBMkJaLElBQUksY0FBYyxHQUFHO0lBQ3BCLE9BQU8sRUFBcUI7UUFDM0IsS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsTUFBTTtRQUNOLE9BQU87UUFDUCxRQUFRO1FBQ1IsU0FBUztRQUNULE1BQU07UUFDTixTQUFTO0tBQ1Q7SUFDRCxpQkFBaUIsRUFBRSxDQUFDLEdBQVEsRUFBRSxTQUE2QjtRQUcxRCxFQUFFLENBQUMsQ0FBQyxlQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7WUFBQyxjQUFjLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNO2dCQUV2RCxFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQztvQkFFcEIsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQzt3QkFDZixTQUFTLENBQUMsT0FBTyxDQUFDLFNBQVM7NEJBQzFCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsS0FBSyxTQUFTLENBQUM7Z0NBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQzt3QkFDekMsQ0FBQyxDQUFDLENBQUM7b0JBQ0osQ0FBQztvQkFBQyxJQUFJO3dCQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7b0JBRXJCLE1BQU0sQ0FBQyxJQUFJLHFCQUFZLENBQUMsR0FBRyxHQUFHLDJCQUEyQixDQUFDLENBQUM7Z0JBQzVELENBQUM7WUFFRixDQUFDLENBQUMsQ0FBQztRQUVILE1BQU0sQ0FBQyxTQUFTLENBQUM7SUFDbEIsQ0FBQztJQUNELG1CQUFtQixFQUFFLENBQUMsSUFBUyxFQUFFLFNBQTZCO1FBRzdELElBQUksS0FBSyxHQUFzQixFQUFFLENBQUM7UUFFbEMsRUFBRSxDQUFDLENBQUMsY0FBTyxDQUFDLElBQUks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