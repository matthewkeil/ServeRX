/*!
 * express
 * Copyright(c) 2009-2013 TJ Holowaychuk
 * Copyright(c) 2013 Roman Shtylman
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flatten = require("array-flatten");
const debug = require("debug");
debug('express:application');
const Layer = require("./layer");
/**
* Module variables.
* @private
*/
const slice = Array.prototype.slice;
const toString = Object.prototype.toString;
/**
 * Module exports.
 * @public
 */
/**
* Initialize `Route` with the given `path`,
*
* @param {String} path
* @public
*/
class Route {
    constructor(path) {
        this.path = path;
        this.stack = [];
        debug(`new ${path}`);
        // route handlers for various http methods
        this.methods = {};
    }
    /**
    * Determine if the route handles a given method.
    * @private
    */
    _handles_method(method) {
        if (this.methods._all) {
            return true;
        }
        var name = method.toLowerCase();
        if (name === 'head' && !this.methods['head']) {
            name = 'get';
        }
        return Boolean(this.methods[name]);
    }
    ;
    /**
    * @return {Array} supported HTTP methods
    * @private
    */
    _options() {
        var methods = Object.keys(this.methods);
        // append automatic head
        if (this.methods.get && !this.methods.head) {
            methods.push('head');
        }
        for (var i = 0; i < methods.length; i++) {
            // make upper case
            methods[i] = methods[i].toUpperCase();
        }
        return methods;
    }
    ;
    /**
    * dispatch req, res into this route
    * @private
    */
    dispatch(req, res, done) {
        let idx = 0;
        const stack = this.stack;
        if (stack.length === 0) {
            return done();
        }
        let method = req.method.toLowerCase();
        if (method === 'head' && !this.methods['head']) {
            method = 'get';
        }
        req.route = this;
        next();
        function next(err) {
            // signal to exit route
            if (err && err === 'route') {
                return done();
            }
            // signal to exit router
            if (err && err === 'router') {
                return done(err);
            }
            const layer = stack[idx++];
            if (!layer) {
                return done(err);
            }
            if (layer.method && layer.method !== method) {
                return next(err);
            }
            if (err) {
                layer.handle_error(err, req, res, next);
            }
            else {
                layer.handle_request(req, res, next);
            }
        }
    }
    ;
    /**
    * Add a handler for all HTTP verbs to this route.
    *
    * Behaves just like middleware and can respond or call `next`
    * to continue processing.
    *
    * You can use multiple `.all` call to add multiple handlers.
    *
    *   function check_something(req, res, next){
    *     next();
    *   };
    *
    *   function validate_user(req, res, next){
    *     next();
    *   };
    *
    *   route
    *   .all(validate_user)
    *   .all(check_something)
    *   .get(function(req, res, next){
    *     res.send('hello world');
    *   });
    *
    * @param {function} handler
    * @return {Route} for chaining
    * @api public
    */
    all() {
        var handles = flatten(slice.call(arguments));
        for (var i = 0; i < handles.length; i++) {
            var handle = handles[i];
            if (typeof handle !== 'function') {
                var type = toString.call(handle);
                var msg = 'Route.all() requires callback functions but got a ' + type;
                throw new TypeError(msg);
            }
            let layer = Layer('/', {}, handle);
            layer.method = undefined;
            this.methods._all = true;
            this.stack.push(layer);
        }
        return this;
    }
    ;
}
exports.default = Route;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJyb3V0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7OztBQVNILHlDQUF5QztBQUN6QywrQkFBK0I7QUFDL0IsS0FBSyxDQUFDLHFCQUFxQixDQUFDLENBQUM7QUFDN0IsaUNBQWlDO0FBRWhDOzs7RUFHRTtBQUVILE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDO0FBQ3BDLE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDO0FBRTFDOzs7R0FHRztBQUVGOzs7OztFQUtFO0FBQ0o7SUFJQyxZQUFZLElBQUk7UUFDZixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUVoQixLQUFLLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQyxDQUFBO1FBRXBCLDBDQUEwQztRQUMxQyxJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztJQUNsQixDQUFDO0lBRUQ7OztNQUdFO0lBRUksZUFBZSxDQUFDLE1BQU07UUFDNUIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDYixDQUFDO1FBRUQsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBRWhDLEVBQUUsQ0FBQyxDQUFDLElBQUksS0FBSyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM5QyxJQUFJLEdBQUcsS0FBSyxDQUFDO1FBQ2QsQ0FBQztRQUVELE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFBQSxDQUFD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