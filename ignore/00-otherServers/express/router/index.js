/*!
* express
* Copyright(c) 2009-2013 TJ Holowaychuk
* Copyright(c) 2013 Roman Shtylman
* Copyright(c) 2014-2015 Douglas Christopher Wilson
* MIT Licensed
*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Route = require("./route");
const Layer = require("./layer");
const debug = require("debug");
debug('express:router');
const deprecate = require("depd");
deprecate('express');
const flatten = require("array-flatten");
/**
 * Module constiables.
 * @private
 */
const objectRegExp = /^\[object (\S+)\]$/;
const slice = Array.prototype.slice;
const toString = Object.prototype.toString;
/**
 * Initialize a new `Router` with the given `options`.
 *
 * @param {Object} options
 * @return {Router} which is an callable function
 * @public
 */
class Router {
    constructor(options) {
        this.opts = options || {};
        this.params = {};
        this._params = [];
        this.caseSensitive = options.caseSensitive;
        this.mergeParams = options.mergeParams;
        this.strict = options.strict;
        this.stack = [];
        return this;
    }
    router(req, res, next) {
        this.router.handle(req, res, next);
    }
    /**
    * Map the given param placeholder `name`(s) to the given callback.
    *
    * Parameter mapping is used to provide pre-conditions to routes
    * which use normalized placeholders. For example a _:user_id_ parameter
    * could automatically load a user's information from the database without
    * any additional code,
    *
    * The callback uses the same signature as middleware, the only difference
    * being that the value of the placeholder is passed, in this case the _id_
    * of the user. Once the `next()` function is invoked, just like middleware
    * it will continue on to execute the route, or subsequent parameter functions.
    *
    * Just like in middleware, you must either respond to the request or call next
    * to avoid stalling the request.
    *
    *  app.param('user_id', function(req, res, next, id){
    *    User.find(id, function(err, user){
    *      if (err) {
    *        return next(err);
    *      } else if (!user) {
    *        return next(new Error('failed to load user'));
    *      }
    *      req.user = user;
    *      next();
    *    });
    *  });
    *
    * @param {String} name
    * @param {Function} fn
    * @return {app} for chaining
    * @public
    */
    param(name, fn) {
        // apply param functions
        const params = this._params;
        const len = params.length;
        let ret;
        for (let param of params) {
            if (ret = param(name, fn)) {
                fn = ret;
            }
        }
        // ensure we end up with a
        // middleware function
        if ('function' !== typeof fn) {
            throw new Error('invalid param() call for ' + name + ', got ' + fn);
        }
        (this.params[name] = this.params[name] || []).push(fn);
        return this;
    }
    ;
    /**
    * Dispatch a req, res into the router.
    * @private
    */
    handle(req, res, out) {
        const self = this;
        let idx = 0;
        const protohost = getProtohost(req.url) || '';
        let removed = '';
        let slashAdded = false;
        const paramcalled = {};
        // store options for OPTIONS request
        // only used if OPTIONS request
        const options = [];
        // middleware and routes
        const stack = self.stack;
        // manage inter-router constiables
        const parentParams = req.params;
        const parentUrl = req.baseUrl || '';
        let done = restore(out, req, 'baseUrl', 'next', 'params');
        // setup next layer
        req.next = next;
        // for options requests, respond with a default if nothing else responds
        if (req.method === 'OPTIONS') {
            done = wrap(done, (old, err) => {
                if (err || options.length === 0)
                    return old(err);
                sendOptionsResponse(res, options, old);
            });
        }
        // setup basic req values
        req.baseUrl = parentUrl;
        req.originalUrl = req.originalUrl || req.url;
        next();
        function next(err) {
            let layerError = err === 'route'
                ? null
                : err;
            // remove added slash
            if (slashAdded) {
                req.url = req.url.substr(1);
                slashAdded = false;
            }
            // restore altered req.url
            if (removed.length !== 0) {
                req.baseUrl = parentUrl;
                req.url = protohost + removed + req.url.substr(protohost.length);
                removed = '';
            }
            // signal to exit router
            if (layerError === 'router') {
                setImmediate(done, null);
                return;
            }
            // no more matching layers
            if (idx >= stack.length) {
                setImmediate(done, layerError);
                return;
            }
            // get pathname of request
            const path = getPathname(req);
            if (path == null) {
                return done(layerError);
            }
            // find next matching layer
            let layer;
            let match;
            let route;
            while (match !== true && idx < stack.length) {
                layer = stack[idx++];
                match = matchLayer(layer, path);
                route = layer.route;
                if (typeof match !== 'boolean') {
                    // hold on to layerError
                    layerError = layerError || match;
                }
                if (match !== true) {
                    continue;
                }
                if (!route) {
                    // process non-route handlers normally
                    continue;
                }
                if (layerError) {
                    // routes do not match with a pending error
                    match = false;
                    continue;
                }
                const method = req.method;
                const has_method = route._handles_method(method);
                // build up automatic options response
                if (!has_method && method === 'OPTIONS') {
                    appendMethods(options, route._options());
                }
                // don't even bother matching route
                if (!has_method && method !== 'HEAD') {
                    match = false;
                    continue;
                }
            }
            // no match
            if (match !== true) {
                return done(layerError);
            }
            // store route for dispatch on change
            if (route) {
                req.route = route;
            }
            // Capture one-time layer values
            req.params = self.mergeParams
                ? mergeParams(layer.params, parentParams)
                : layer.params;
            const layerPath = layer.path;
            // this should be done for the layer
            self.process_params(layer, paramcalled, req, res, function (err) {
                if (err) {
                    return next(layerError || err);
                }
                if (route) {
                    return layer.handle_request(req, res, next);
                }
                trim_prefix(layer, layerError, layerPath, path);
            });
        }
        function trim_prefix(layer, layerError, layerPath, path) {
            if (layerPath.length !== 0) {
                // Validate path breaks on a path separator
                const c = path[layerPath.length];
                if (c && c !== '/' && c !== '.')
                    return next(layerError);
                // Trim off the part of the url that matches the route
                // middleware (.use stuff) needs to have the path stripped
                debug('trim prefix (%s) from url %s', layerPath, req.url);
                removed = layerPath;
                req.url = protohost + req.url.substr(protohost.length + removed.length);
                // Ensure leading slash
                if (!protohost && req.url[0] !== '/') {
                    req.url = '/' + req.url;
                    slashAdded = true;
                }
                // Setup base URL (no trailing slash)
                req.baseUrl = parentUrl + (removed[removed.length - 1] === '/'
                    ? removed.substring(0, removed.length - 1)
                    : removed);
            }
            debug('%s %s : %s', layer.name, layerPath, req.originalUrl);
            if (layerError) {
                layer.handle_error(layerError, req, res, next);
            }
            else {
                layer.handle_request(req, res, next);
            }
        }
    }
    ;
    /**
    * Process any parameters for the layer.
    * @private
    */
    process_params(layer, called, req, res, done) {
        const params = this.params;
        // captured parameters from the layer, keys and values
        const keys = layer.keys;
        // fast track
        if (!keys || keys.length === 0) {
            return done();
        }
        let i = 0;
        let name;
        let paramIndex = 0;
        let key;
        let paramVal;
        let paramCallbacks;
        let paramCalled;
        // process params in order
        // param callbacks can be async
        function param(err) {
            if (err) {
                return done(err);
            }
            if (i >= keys.length) {
                return done();
            }
            paramIndex = 0;
            key = keys[i++];
            name = key.name;
            paramVal = req.params[name];
            paramCallbacks = params[name];
            paramCalled = called[name];
            if (paramVal === undefined || !paramCallbacks) {
                return param();
            }
            // param previously called with same value or error occurred
            if (paramCalled && (paramCalled.match === paramVal
                || (paramCalled.error && paramCalled.error !== 'route'))) {
                // restore value
                req.params[name] = paramCalled.value;
                // next param
                return param(paramCalled.error);
            }
            called[name] = paramCalled = {
                error: null,
                match: paramVal,
                value: paramVal
            };
            paramCallback();
        }
        // single param callbacks
        function paramCallback(err) {
            const fn = paramCallbacks[paramIndex++];
            // store updated value
            paramCalled.value = req.params[key.name];
            if (err) {
                // store error
                paramCalled.error = err;
                param(err);
                return;
            }
            if (!fn)
                return param();
            try {
                fn(req, res, paramCallback, paramVal, key.name);
            }
            catch (e) {
                paramCallback(e);
            }
        }
        param();
    }
    ;
    /**
    * Use the given middleware function, with optional path, defaulting to "/".
    *
    * Use (like `.all`) will run for any http METHOD, but it will not add
    * handlers for those methods so OPTIONS requests will not consider `.use`
    * functions even if they could respond.
    *
    * The other difference is that _route_ path is stripped and not visible
    * to the handler function. The main effect of this feature is that mounted
    * handlers can operate without any code changes regardless of the "prefix"
    * pathname.
    *
    * @public
   */
    use(fn) {
        const offset = 0;
        const path = '/';
        // default path to '/'
        // disambiguate router.use([fn])
        if (typeof fn !== 'function') {
            const arg = fn;
            while (Array.isArray(arg) && arg.length !== 0) {
                arg = arg[0];
            }
            // first arg is the path
            if (typeof arg !== 'function') {
                offset = 1;
                path = fn;
            }
        }
        const callbacks = flatten(slice.call(arguments, offset));
        if (callbacks.length === 0) {
            throw new TypeError('Router.use() requires middleware functions');
        }
        for (const i = 0; i < callbacks.length; i++) {
            const fn = callbacks[i];
            if (typeof fn !== 'function') {
                throw new TypeError('Router.use() requires middleware function but got a ' + gettype(fn));
            }
            // add the middleware
            debug('use %o %s', path, fn.name || '<anonymous>');
            const layer = Layer(path, {
                sensitive: this.caseSensitive,
                strict: false,
                end: false
            }, fn);
            layer.route = undefined;
            this.stack.push(layer);
        }
        return this;
    }
    ;
    /**
    * Create a new Route for the given path.
    *
    * Each route contains a separate middleware stack and VERB handlers.
    *
    * See the Route api documentation for details on adding handlers
    * and middleware to routes.
    *
    * @param {String} path
    * @return {Route}
    * @public
    */
    route(path) {
        const route = new Route(path);
        const layer = Layer(path, {
            sensitive: this.caseSensitive,
            strict: this.strict,
            end: true
        }, route.dispatch.bind(route));
        layer.route = route;
        this.stack.push(layer);
        return route;
    }
    ;
    // create Router#VERB functions
    // Methods.concat('all').forEach(method => {
    // 	this[method] = path => {
    // 		const route = this.route(path)
    // 		route[method].apply(route, slice.call(arguments, 1));
    // 		return this;
    // 	};
    //  });
    // append methods to a list of methods
    appendMethods(list, addition) {
        for (const i = 0; i < addition.length; i++) {
            const method = addition[i];
            if (list.indexOf(method) === -1) {
                list.push(method);
            }
        }
    }
    // get pathname of request
    getPathname(req) {
        try {
            return parseUrl(req).pathname;
        }
        catch (err) {
            return undefined;
        }
    }
    // Get get protocol + host for a URL
    getProtohost(url) {
        if (typeof url !== 'string' || url.length === 0 || url[0] === '/') {
            return undefined;
        }
        const searchIndex = url.indexOf('?');
        const pathLength = searchIndex !== -1
            ? searchIndex
            : url.length;
        const fqdnIndex = url.substr(0, pathLength).indexOf('://');
        return fqdnIndex !== -1
            ? url.substr(0, url.indexOf('/', 3 + fqdnIndex))
            : undefined;
    }
    // get type for error message
    gettype(obj) {
        const type = typeof obj;
        if (type !== 'object') {
            return type;
        }
        // inspect [[Class]] for objects
        return toString.call(obj)
            .replace(objectRegExp, '$1');
    }
    /**
    * Match path to a layer.
    *
    * @param {Layer} layer
    * @param {string} path
    * @private
    */
    matchLayer(layer, path) {
        try {
            return layer.match(path);
        }
        catch (err) {
            return err;
        }
    }
    // merge params with parent params
    mergeParams(params, parent) {
        if (typeof parent !== 'object' || !parent) {
            return params;
        }
        // make copy of parent for base
        const obj = mixin({}, parent);
        // simple non-numeric merging
        if (!(0 in params) || !(0 in parent)) {
            return mixin(obj, params);
        }
        let i = 0;
        let o = 0;
        // determine numeric gaps
        while (i in params) {
            i++;
        }
        while (o in parent) {
            o++;
        }
        // offset numeric indices in params before merge
        for (i--; i >= 0; i--) {
            params[i + o] = params[i];
            // create holes for the merge when necessary
            if (i < o) {
                deconste;
                params[i];
            }
        }
        return mixin(obj, params);
    }
    // restore obj props after function
    restore(fn, obj) {
        const props = new Array(arguments.length - 2);
        const vals = new Array(arguments.length - 2);
        for (let i = 0; i < props.length; i++) {
            props[i] = arguments[i + 2];
            vals[i] = obj[props[i]];
        }
        return function () {
            // restore vals
            for (let i = 0; i < props.length; i++) {
                obj[props[i]] = vals[i];
            }
            return fn.apply(this, arguments);
        };
    }
    // send an OPTIONS response
    sendOptionsResponse(res, options, next) {
        try {
            const body = options.join(',');
            res.set('Allow', body);
            res.send(body);
        }
        catch (err) {
            next(err);
        }
    }
    // wrap a function
    wrap(old, fn) {
        return function proxy() {
            const args = new Array(arguments.length + 1);
            args[0] = old;
            for (const i = 0, len = arguments.length; i < len; i++) {
                args[i + 1] = arguments[i];
            }
            fn.apply(this, args);
        };
    }
}
exports.default = Router;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBRTs7Ozs7O0VBTUM7OztBQVNILGlDQUFpQztBQUNqQyxpQ0FBaUM7QUFFakMsK0JBQStCO0FBQy9CLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ3hCLGtDQUFrQztBQUNsQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDckIseUNBQXlDO0FBQ3pDOzs7R0FHRztBQUVILE1BQU0sWUFBWSxHQUFHLG9CQUFvQixDQUFDO0FBQzFDLE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDO0FBQ3BDLE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDO0FBQzNDOzs7Ozs7R0FNRztBQUNIO0lBT0MsWUFBWSxPQUE2RDtRQUN4RSxJQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sSUFBSSxFQUFFLENBQUM7UUFDMUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFDakIsSUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7UUFDbEIsSUFBSSxDQUFDLGFBQWEsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDO1FBQzNDLElBQUksQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQztRQUN2QyxJQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUM7UUFDN0IsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7UUFDaEIsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNaLENBQUM7SUFFSyxNQUFNLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJO1FBQzNCLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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