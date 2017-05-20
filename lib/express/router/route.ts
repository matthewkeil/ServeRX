/*!
 * express
 * Copyright(c) 2009-2013 TJ Holowaychuk
 * Copyright(c) 2013 Roman Shtylman
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 */



 /**
 * Module dependencies.
 * @private
 */
import * as Methods from 'methods';
import * as flatten from 'array-flatten';
import * as debug from 'debug';
debug('express:application');
import * as Layer from './layer';

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
export default class Route {
	public path: any;
	public stack: any;
	public methods: any;
	constructor(path) {
		this.path = path;
		this.stack = [];

		debug(`new ${path}`)

		// route handlers for various http methods
		this.methods = {};
	 }

	 /**
	 * Determine if the route handles a given method.
	 * @private
	 */

	public _handles_method(method) {
		if (this.methods._all) {
			return true;
		}

		var name = method.toLowerCase();

		if (name === 'head' && !this.methods['head']) {
			name = 'get';
		}

		return Boolean(this.methods[name]);
	 };

	 /**
	 * @return {Array} supported HTTP methods
	 * @private
	 */

	public _options() {
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
	 };

	 /**
	 * dispatch req, res into this route
	 * @private
	 */

	public dispatch(req, res, done) {
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

		function next(err?) {
			// signal to exit route
			if (err && err === 'route') {
				return done();
			}

			// signal to exit router
			if (err && err === 'router') {
				return done(err)
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
			} else {
				layer.handle_request(req, res, next);
			}
		}
	 };

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

	public all() {
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
	 };

	Methods.forEach(method => {
		Route.prototype[method] = () => {
			let handles = flatten(slice.call(arguments));

			for (var i = 0; i < handles.length; i++) {
				var handle = handles[i];

				if (typeof handle !== 'function') {
					var type = toString.call(handle);
					var msg = 'Route.' + method + '() requires callback functions but got a ' + type;
					throw new Error(msg);
				}

				debug('%s %o', method, this.path)

				var layer = Layer('/', {}, handle);
				layer.method = method;

				this.methods[method] = true;
				this.stack.push(layer);
			}

			return this;
		}
	 });
}