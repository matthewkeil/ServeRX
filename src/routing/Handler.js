"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
const _ = require("lodash");
const Observable_1 = require("rxjs/Observable");
let OBSERVABLE = Observable_1.Observable;
// import { ServerConfig } from '../../src/ConfigRX';
const common_1 = require("../common");
const _1 = require("./");
class HandlerConfig {
    constructor(_config) {
        this.last = this._path.last;
        this.identifier = this._path.identifier;
        this.value = this._path.value;
        this.updatePath = this._path.update;
        this._path = _config.path || common_1.Path.validate('./');
        this._root = _config.root; //|| new Handler({path: this._path});
        this._supportedMethods = _config.supportedMethods;
        this._auth = _config.auth;
        this._middleware = _config.middleware;
        this.config = this;
        this._mounted = new _1.Mounted(this);
        this._mount = this._mounted.add;
        this._unmount = this._mounted.remove;
        let results = this._mount(_config);
        if (util_1.isError(results))
            results;
    }
    static decipherArgs(args) {
        let maybe = {
            config: [],
            methods: [],
            supportedMethods: [undefined, -1],
            path: [],
            root: [],
            auth: _1.RouteAuth.create(false, false),
            middleware: [],
            param: [],
            /**
             * Mountable can be
             * - resource to mount to methods
             * - star parameter to mount to identifiers/stars
             * - value parameter to mount to identifiers/values&check
            */
            mountable: [],
        };
        Array.from(arguments).forEach(arg => {
            let valid;
            let error;
            function mergeMethods(methods) {
                let isHere = {};
                _.flatten(methods).forEach(method => {
                    isHere[method] = true;
                });
                return Object.keys(isHere);
            }
            function spreadConfig(config) {
                if (config.root)
                    maybe.root.push(config.root);
                if (config.path)
                    maybe.path.push(config.path);
                if (config.auth)
                    maybe.auth.merge(config.auth);
                if (config.middleware)
                    maybe.middleware.push(config.middleware);
                if (config.methods)
                    maybe.methods.push(config.methods);
                if (config.param)
                    maybe.param.push(config.param);
                if (config.supportedMethods) {
                    if (maybe.supportedMethods[0]) {
                        let lengthWhenFound = maybe.supportedMethods[1];
                        if (lengthWhenFound) {
                            maybe.methods = maybe.methods.slice(0, (lengthWhenFound - 1)).concat(maybe.supportedMethods[0], maybe.methods.slice(lengthWhenFound));
                            maybe.supportedMethods = [config.supportedMethods, undefined];
                        }
                        else
                            maybe.supportedMethods[0] =
                                mergeMethods([maybe.supportedMethods[0], config.supportedMethods]);
                    }
                    else
                        maybe.supportedMethods = [config.supportedMethods, undefined];
                }
            }
            if (util_1.isString(arg)) {
                /**
                 *
                 *  can be
                 *  - Method
                 *  - MatchString
                 *
                 **/
                valid = HandlerConfig.valid.method(arg, maybe.supportedMethods[0]);
                // only returns an error if there is certainty of a supported methods array
                if (util_1.isError(valid) && !maybe.supportedMethods[1])
                    return valid;
                else if (valid)
                    maybe.methods.push(valid);
                valid = HandlerConfig.valid.path(arg);
                if (util_1.isError(valid))
                    return valid;
                else if (valid)
                    maybe.path.push(valid);
            }
            if (util_1.isArray(arg)) {
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
                if (util_1.isError(valid) && maybe.supportedMethods[1])
                    return valid;
                else if (valid) {
                    let foundAtIndex;
                    maybe.methods.forEach((set, index) => {
                        if (!foundAtIndex && util_1.isArray(set))
                            foundAtIndex = index;
                    });
                    foundAtIndex && maybe.supportedMethods[0]
                        ? maybe.methods.push(valid)
                        : maybe.supportedMethods.push([valid, foundAtIndex]);
                }
                valid = HandlerConfig.valid.param.inOrder(arg);
                if (util_1.isError(valid))
                    return valid;
                else if (valid)
                    maybe.param.push({ inOrder: valid });
                valid = HandlerConfig.valid.param.values(arg);
                if (util_1.isError(valid))
                    return valid;
                else if (valid)
                    maybe.param.push({ values: valid });
                valid = HandlerConfig.valid.path(arg);
                if (util_1.isError(valid))
                    return valid;
                else if (valid)
                    maybe.path.push(arg);
                valid = HandlerConfig.valid.auth(arg);
                if (util_1.isError(valid))
                    return valid;
                else if (valid)
                    maybe.auth.merge(arg);
                try {
                    valid = RouteHandler.decipherArgs(arg);
                }
                catch (err) { }
                if (valid)
                    spreadConfig(valid);
            }
            if (util_1.isObject(arg)) {
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
                if (arg instanceof common_1.Path.MatchString)
                    maybe.path.push(arg);
                if (arg instanceof Handler)
                    maybe.root.push(arg);
                if (arg instanceof _1.RouteAuth)
                    maybe.auth.merge(arg);
                valid = HandlerConfig.valid.param.stars(arg);
                if (util_1.isError(valid))
                    return valid;
                else if (valid)
                    maybe.param.push({ stars: valid });
                valid = HandlerConfig.valid.param(arg);
                if (util_1.isError(valid))
                    return valid;
                else if (valid)
                    maybe.param.push(arg);
                valid = HandlerConfig.valid.middleware(arg);
                if (util_1.isError(valid))
                    return valid;
                else if (valid)
                    maybe.middleware.push(arg);
                valid = HandlerConfig.valid(arg);
                if (util_1.isError(valid))
                    return valid;
                else if (valid)
                    spreadConfig(valid);
            }
            if (util_1.isFunction(arg)) {
                valid = HandlerConfig.valid.param.check(arg);
                if (util_1.isError(valid))
                    return valid;
                else if (valid)
                    maybe.param.push({ check: valid });
                valid = HandlerConfig.valid.resource(arg);
                if (util_1.isError(valid))
                    return valid;
                else if (valid)
                    maybe.mountable.push(['resource', valid, mergeMethods(maybe.methods)]);
            }
            return new MountError(`unknown parameter of type ${typeof arg} passed to config`, arg);
        });
    }
    get path() { return this._path; }
    set path(arg) { throw new common_1.PathError('cannot manually set the path', arg); }
    get root() { return this._root; }
    set root(handler) {
        if (util_1.isUndefined(handler) || handler instanceof Handler)
            this.config.root = handler;
        else
            throw new MountError('Handler.root must be a valid Handler ', handler);
    }
    get supportedMethods() {
        return this._supportedMethods || HandlerConfig.validate.METHODS;
    }
    set supportedMethods(arg) {
        let valid = HandlerConfig.validate.methods(arg);
        let test;
        if (valid && !(valid instanceof Error)) {
            test = HandlerConfig.validate.methods(Object.keys(this._mounted.methods || {}), valid);
            if (test && (test instanceof Error))
                throw new MountError(`cannot update supportedMethods. an existing resources is mounted at a method that will not be supported`, valid);
            this.config.supportedMethods = valid;
        }
        else
            throw valid || new MountError(`supportedMethods array is invalid`, arg);
    }
    get auth() { return this._auth; }
    set auth(arg) {
        if (arg instanceof _1.RouteAuth)
            this.config.auth = arg;
        else
            throw new common_1.AuthError('RouteHandler.auth must be a valid RouteAuth', arg);
    }
    get middleware() { return this._middleware; }
    set middleware(arg) {
        let valid = HandlerConfig.validate.middleware(arg);
        if (valid && !(valid instanceof Error))
            this.config.middleware = valid;
        else
            throw valid || new MountError('RouteHandler.middleware must be valid middleware', arg);
    }
    get methods() { return this._mounted.methods; }
    set methods(arg) { throw new MountError('methods must be mounted', arg); }
    get param() { return this._mounted.param; }
    set param(arg) { throw new MountError('methods must be mounted', arg); }
    get routes() { return this._mounted.routes; }
    set routes(arg) { throw new MountError('methods must be mounted', arg); }
}
HandlerConfig.valid = _1.Valid;
exports.HandlerConfig = HandlerConfig;
class Handler extends HandlerConfig {
    constructor(config) {
        super(config);
        this[Symbol.iterator] = () => {
            let valuesInSearchOrder = this._mounted.param.values.slice();
            return {
                next() {
                    return valuesInSearchOrder.length > 0
                        ? {
                            value: valuesInSearchOrder.shift(),
                            done: false
                        }
                        : {
                            value: undefined,
                            done: true
                        };
                }
            };
        };
    }
    static create(args) {
        try {
            let config = Handler.decipherArgs(args);
            return new Handler(config);
        }
        catch (err) {
            return err;
        }
    }
    isHere(input) {
        let [results, path] = this.path.isHere(input);
        let handler;
        if (!path || util_1.isError(path)) {
            path = path || new common_1.PathError('input is not a Path.MatchString', input);
            return [results, path, handler];
        }
        if (path.length === this.path.length)
            handler = this;
        let length = this.path.length - 1; // array index for current segment under scrutiny
        if (!handler || results[length] === 'maybe') {
            if (!handler)
                length++;
            let identifier = util_1.isString(path[length])
                ? path[length]
                : path[length][0];
            let value = util_1.isString(path[length])
                ? null
                : path[length][1];
            if (handler || this._mounted.routes.hasOwnProperty(identifier)) {
                if (handler)
                    results.pop();
                handler = handler || this._mounted.routes[identifier];
                if (value) {
                    let valHandler;
                    for (let val of handler) {
                        if (val && value === val[0]) {
                            results.concat('value');
                            valHandler = val[1];
                        }
                    }
                    if (!valHandler) {
                        if (handler._mounted.param.check) {
                            valHandler = handler._mounted.param.check(value);
                            if (valHandler)
                                results.concat('check');
                        }
                        if (!valHandler)
                            results.push('no');
                    }
                    handler = valHandler;
                }
            }
        }
        return [results, path, handler];
    }
    resolve(input, make = false, stack = new _1.Stack) {
        let self = this;
        let routing$ = new _1.Routing(observer => {
            let results;
            let path;
            let handler;
            let error;
            let orderedStackResults = [];
            let next = (stack) => {
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
                    if (make)
                        observer.next([rating, stack]);
                    else {
                        orderedStackResults.unshift([rating, stack]);
                        orderedStackResults.sort((a, b) => {
                            if (a[0] < b[0])
                                return -1;
                            if (a[0] > b[0])
                                return 1;
                            return 0;
                        });
                        observer.next(orderedStackResults[0][1]);
                    }
                }
                // if (routing$.nestedIsComplete) observer.complete();
            };
            let complete = () => routing$.nestedIsComplete && !observer.closed
                ? observer.complete()
                : undefined;
            [results, path, handler] = self.isHere(input);
            if (util_1.isError(path))
                return self.root
                    ? void self.root.resolve(path, make, stack).subscribe(observer)
                    : void observer.error(new common_1.PathError('invalid path', path));
            if (util_1.isError(handler))
                return observer.error(handler); // only throws for bad catch function
            if (handler) {
                // if (!stack) stack = new Stack({ results, path, handlers: [self] });
                if (util_1.isError(error = stack.push(results, handler)))
                    observer.error(error);
                if (path.length === handler._path.length) {
                    next(stack);
                    complete();
                }
                else
                    routing$.addNested(handler.resolve(path, make, stack), observer);
            }
            if (!util_1.isString(path[self.path.length]))
                complete();
            let valueFound = false;
            let valueToSearch = path[self.path.length];
            for (let valHandler of this._mounted) {
                let star = false;
                if (valHandler &&
                    (valHandler[0] === valueToSearch || (star = (valHandler[0] === '*')))) {
                    if (make && star) {
                        break;
                    }
                    else if (!make && valueFound || !star) {
                        valueFound = true;
                        break;
                    }
                    routing$.addNested(valHandler[1].resolve(path, false, stack.copy), {
                        next,
                        error: (err) => { },
                        complete
                    });
                }
            }
            complete();
        });
        return routing$;
    }
    mount(path, ...args) {
        let self = this;
        let mounting$ = new Mounting(observer => {
        });
        return mounting$;
    }
}
exports.Handler = Handler;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSGFuZGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkhhbmRsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSwrQkFPYztBQUVkLDRCQUE0QjtBQUs1QixnREFBNkM7QUFFN0MsSUFBSSxVQUFVLEdBQUcsdUJBQVUsQ0FBQztBQUU1QixxREFBcUQ7QUFFckQsc0NBUW1CO0FBR25CLHlCQU9ZO0FBbUJaO0lBc1FDLFlBQVksT0FBdUI7UUFoRDVCLFNBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQztRQUN2QixlQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUM7UUFDbkMsVUFBSyxHQUFrQixJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQztRQUN4QyxlQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7UUErQ3JDLElBQUksQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDLElBQUksSUFBSSxhQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRWpELElBQUksQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQSxDQUFDLHFDQUFxQztRQUMvRCxJQUFJLENBQUMsaUJBQWlCLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDO1FBQ2xELElBQUksQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQztRQUMxQixJQUFJLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUM7UUFFdEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7UUFFbkIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLFVBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNsQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7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