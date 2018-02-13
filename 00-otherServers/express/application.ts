/*!
 * express
 * Copyright(c) 2009-2013 TJ Holowaychuk
 * Copyright(c) 2013 Roman Shtylman
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * Copyright(c) 2017 Matthew Keil
 * MIT Licensed
 */


/**
 * Module dependencies.
 * @private
 */

import { EventEmitter } from 'events';
import * as finalhandler from 'finalhandler';
import * as Methods from 'methods';
import * as http from 'http';
import * as flatten from 'array-flatten';
import * as merge from 'utils-merge';
import * as setPrototypeOf from 'setprototypeof'
import { resolve } from 'path';
import * as debug from 'debug';
debug('express:application');
import * as Static from 'serve-static';
import * as deprecate from 'depd';
deprecate('express');
let slice = Array.prototype.slice;


import * as req from './request';
import * as res from './response';
import * as Route from './router/route';
import * as Router from './router'
import * as Query from './middleware/query';
import * as middleware from './middleware/init';
import * as query from './middleware/query';
import * as View from './view';
import { compileETag } from './utils';
import { compileQueryParser } from './utils';
import { compileTrust } from './utils';


/*
 * Application prototype.
 */
	 /**
	 * Variable for trust proxy inheritance back-compat
	 * @private
	 */
export default class Application extends EventEmitter {
	public trustProxyDefaultSymbol = '@@symbol:trust_proxy_default';
	public cache: any;
	public engines: any;
	public request: any;
	public response: any;
	private _router: any;
	public parent: any;
	public methods: any[];
	public locals: any;
	public settings: any;
	public static = Static;
	public query = Query;
	 /* Initialize the server.
	 *
	 *   - setup default configuration
	 *   - setup default middleware
	 *   - setup route reflection methods
	 *
	 * @private
	 */
	constructor(){
		super();
		let app = <any>function(req, res, next) {
			this.handle(req, res, next);
		};

		// expose the prototype that will get set on requests
		this.request = Object.create(req, {
			app: { configurable: true, enumerable: true, writable: true, value: app }
		})

		// expose the prototype that will get set on responses
		this.response = Object.create(res, {
			app: { configurable: true, enumerable: true, writable: true, value: app }
		})

		this.init();
		return app;
	 }
	public init() {
		this.cache = {};
		this.engines = {};
		this.settings = {};

		this.defaultConfiguration();
	 };
	 /**
	 * Initialize application configuration.
	 * @private
	 */

	public defaultConfiguration() {
		let env = process.env.NODE_ENV || 'development';

		// default settings
		this.enable('x-powered-by');
		this.set('etag', 'weak');
		this.set('env', env);
		this.set('query parser', 'extended');
		this.set('subdomain offset', 2);
		this.set('trust proxy', false);

		// trust proxy inherit back-compat
		Object.defineProperty(this.settings, this.trustProxyDefaultSymbol, {
			configurable: true,
			value: true
		});

		debug(`booting in ${env} mode`);

		this.on('mount', parent => {
			// inherit trust proxy
			if (this.settings[this.trustProxyDefaultSymbol] === true
				&& typeof parent.settings['trust proxy fn'] === 'function') {
					delete this.settings['trust proxy'];
					delete this.settings['trust proxy fn'];
			}

			// inherit protos
			setPrototypeOf(this.request, parent.request)
			setPrototypeOf(this.response, parent.response)
			setPrototypeOf(this.engines, parent.engines)
			setPrototypeOf(this.settings, parent.settings)
		});

		// setup locals
		this.locals = Object.create(null);

		// top-most app is mounted at /
		this.mountpath = '/';

		// default locals
		this.locals.settings = this.settings;

		// default configuration
		this.set('view', View);
		this.set('views', resolve('views'));
		this.set('jsonp callback name', 'callback');

		if (env === 'production') {
			this.enable('view cache');
		}
	 };
	 /**
	 * lazily adds the base router if it has not yet been added.
	 *
	 * We cannot add the base router in the defaultConfiguration because
	 * it reads app settings which might be set after that has run.
	 *
	 * @private
	 */

	public lazyrouter() {
		if (!this._router) {
			let opts = {
				caseSensitive: this.enabled('case sensitive routing'),
				strict: this.enabled('strict routing')
			};
			this._router = new Router(opts);
			this._router.use(query(this.get('query parser fn')));
			this._router.use(middleware.init(this));
		}
	 };
	 /**
	 * Dispatch a req, res pair into the application. Starts pipeline processing.
	 *
	 * If no callback is provided, then default error handlers will respond
	 * in the event of an error bubbling through the stack.
	 *
	 * @private
	 */

	public handle(req, res, callback) {
		let router = this._router;

		// final handler
		let done = callback || finalhandler(req, res, {
			env: this.get('env'),
			onerror: logerror.bind(this)
		});

		// no routes
		if (!router) {
			debug('no routes defined on app');
			done();
			return;
		}

		router.handle(req, res, done);
	 };
	 /**
	 * Proxy `Router#use()` to add middleware to the app router.
	 * See Router#use() documentation for details.
	 *
	 * If the _fn_ parameter is an express app, then it will be
	 * mounted at the _route_ specified.
	 *
	 * @public
	 */

	public use(fn: any) {
		let offset = 0;
		let path = '/';

		// default path to '/'
		// disambiguate app.use([fn])
		if (typeof fn !== 'function') {
			let arg = <Function[]>fn;

			while (Array.isArray(arg) && arg.length !== 0) {
				arg = <any>arg[0];
			}

			// first arg is the path
			if (typeof arg !== 'function') {
				offset = 1;
				path = <string>fn;
			}
		}

		let fns = <Function[]>flatten(slice.call(arguments, offset));

		if (fns.length === 0) {
			throw new TypeError('app.use() requires middleware functions');
		}

		// setup router
		this.lazyrouter();
		let router = this._router;

		fns.forEach(fn => {
			// non-express app
			if (!fn || !(<any>fn).handle || !(<any>fn).set) {
				return router.use(path, fn);
			}

			debug(`use app under ${path}`);
			(<any>fn).mountpath = path;
			(<any>fn).parent = this;

			// restore .app property on req and res
			router.use(path, function mounted_app(req, res, next) {
				let orig = req.app;
				(<any>fn).handle(req, res, err => {
					setPrototypeOf(req, orig.request)
					setPrototypeOf(res, orig.response)
					next(err);
				});
			});

			// mounted an app
			(<any>fn).emit('mount', this);
		}, this);

		return this;
	 };
	 /**
	 * Proxy to the app `Router#route()`
	 * Returns a new `Route` instance for the _path_.
	 *
	 * Routes are isolated middleware stacks for specific paths.
	 * See the Route api docs for details.
	 *
	 * @public
	 */

	public route(path) {
		this.lazyrouter();
		return this._router.route(path);
	 };
	 /**
	 * Register the given template engine callback `fn`
	 * as `ext`.
	 *
	 * By default will `require()` the engine based on the
	 * file extension. For example if you try to render
	 * a "foo.ejs" file Express will invoke the following internally:
	 *
	 *     app.engine('ejs', require('ejs').__express);
	 *
	 * For engines that do not provide `.__express` out of the box,
	 * or if you wish to "map" a different extension to the template engine
	 * you may use this method. For example mapping the EJS template engine to
	 * ".html" files:
	 *
	 *     app.engine('html', require('ejs').renderFile);
	 *
	 * In this case EJS provides a `.renderFile()` method with
	 * the same signature that Express expects: `(path, options, callback)`,
	 * though note that it aliases this method as `ejs.__express` internally
	 * so if you're using ".ejs" extensions you dont need to do anything.
	 *
	 * Some template engines do not follow this convention, the
	 * [Consolidate.js](https://github.com/tj/consolidate.js)
	 * library was created to map all of node's popular template
	 * engines to follow this convention, thus allowing them to
	 * work seamlessly within Express.
	 *
	 * @param {String} ext
	 * @param {Function} fn
	 * @return {app} for chaining
	 * @public
	 */

	public engine(ext, fn) {
		if (typeof fn !== 'function') {
			throw new Error('callback function required');
		}

		// get file extension
		let extension = ext[0] !== '.'
			? '.' + ext
			: ext;

		// store engine
		this.engines[extension] = fn;

		return this;
	 };
	 /**
	 * Proxy to `Router#param()` with one added api feature. The _name_ parameter
	 * can be an array of names.
	 *
	 * See the Router#param() docs for more details.
	 *
	 * @param {String|Array} name
	 * @param {Function} fn
	 * @return {app} for chaining
	 * @public
	 */
	public param(name, fn) {
		this.lazyrouter();

		if (Array.isArray(name)) {
			for (var i = 0; i < name.length; i++) {
				this.param(name[i], fn);
			}

			return this;
		}

		this._router.param(name, fn);

		return this;
	 };
	 /**
	 * Assign `setting` to `val`, or return `setting`'s value.
	 *
	 *    app.set('foo', 'bar');
	 *    app.get('foo');
	 *    // => "bar"
	 *
	 * Mounted servers inherit their parent server's settings.
	 *
	 * @param {String} setting
	 * @param {*} [val]
	 * @return {Server} for chaining
	 * @public
	 */
	public set(setting, val?) {
		if (arguments.length === 1) {
			// app.get(setting)
			return this.settings[setting];
		}

		debug(`set "${setting}" to ${val}`);

		// set value
		this.settings[setting] = val;

		// trigger matched settings
		switch (setting) {
			case 'etag':
				this.set('etag fn', compileETag(val));
				break;
			case 'query parser':
				this.set('query parser fn', compileQueryParser(val));
				break;
			case 'trust proxy':
				this.set('trust proxy fn', compileTrust(val));
				// trust proxy inherit back-compat
				Object.defineProperty(this.settings, this.trustProxyDefaultSymbol, {
					configurable: true,
					value: false
				});
				break;
		}

		return this;
	 };
	 /**
	 * Return the app's absolute pathname
	 * based on the parent(s) that have
	 * mounted it.
	 *
	 * For example if the application was
	 * mounted as "/admin", which itself
	 * was mounted as "/blog" then the
	 * return value would be "/blog/admin".
	 *
	 * @return {String}
	 * @private
	 */

	public path() {
		return this.parent
			? this.parent.path() + this.mountpath
			: '';
	 };
	 /**
	 * Delegate `.VERB(...)` calls to `router.VERB(...)`.
	 */

	 /**
	 * Special-cased "all" method, applying the given route `path`,
	 * middleware, and callback to _every_ HTTP method.
	 *
	 * @param {String} path
	 * @param {Function} ...
	 * @return {app} for chaining
	 * @public
	 */
	public all(path) {
		this.lazyrouter();

		let route = this._router.route(path);
		let args = slice.call(arguments, 1);

		for (let i = 0; i < methods.length; i++) {
			route[methods[i]].apply(route, args);
		}

		return this;
	 };
	 /**
	 * Render the given view `name` name with `options`
	 * and a callback accepting an error and the
	 * rendered template string.
	 *
	 * Example:
	 *
	 *    app.render('email', { name: 'Tobi' }, function(err, html){
	 *      // ...
	 *    })
	 *
	 * @param {String} name
	 * @param {Object|Function} options or fn
	 * @param {Function} callback
	 * @public
	 */

	public render(name, options, callback) {
		let cache = this.cache;
		let done = callback;
		let engines = this.engines;
		let opts = options;
		let renderOptions = {};
		let view;

		// support callback function as second arg
		if (typeof options === 'function') {
			done = options;
			opts = {};
		}

		// merge app.locals
		merge(renderOptions, this.locals);

		// merge options._locals
		if (opts._locals) {
			merge(renderOptions, opts._locals);
		}

		// merge options
		merge(renderOptions, opts);

		// set .cache unless explicitly provided
		if ((<any>renderOptions).cache == null) {
			(<any>renderOptions).cache = this.enabled('view cache');
		}

		// primed cache
		if ((<any>renderOptions).cache) {
			view = cache[name];
		}

		// view
		if (!view) {
				let View = this.get('view');

				view = new View(name, {
				defaultEngine: this.get('view engine'),
				root: this.get('views'),
				engines: engines
			});

			if (!view.path) {
				let dirs = Array.isArray(view.root) && view.root.length > 1
					? 'directories "' + view.root.slice(0, -1).join('", "') + '" or "' + view.root[view.root.length - 1] + '"'
					: 'directory "' + view.root + '"';
				let err = new Error(`Failed to lookup view "${name}" in views ${dirs}`);
					(<any>err).view = view;
				return done(err);
			}

			// prime the cache
			if ((<any>renderOptions).cache) {
				cache[name] = view;
			}
		}

		// render
		this.tryRender(view, renderOptions, done);
	 };
	 /**
	 * Try rendering a view.
	 * @private
	 */
	public tryRender(view, options, callback) {
		try {
			view.render(options, callback);
		} catch (err) {
			callback(err);
		}
	 }
	Methods.forEach(method => {
		this[method] = path => {
			if (method === 'get' && arguments.length === 1) {
				// app.get(setting)
				return this.set(path);
			}

			this.lazyrouter();

			var route = this._router.route(path);
			route[method].apply(route, slice.call(arguments, 1));
			return this;
		};
	 });
}