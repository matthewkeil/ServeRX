/*!
 * express
 * Copyright(c) 2009-2013 TJ Holowaychuk
 * Copyright(c) 2013 Roman Shtylman
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * Copyright(c) 2017 Matthew Keil
 * MIT Licensed
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module dependencies.
 * @private
 */
const events_1 = require("events");
const finalhandler = require("finalhandler");
const flatten = require("array-flatten");
const merge = require("utils-merge");
const setPrototypeOf = require("setprototypeof");
const path_1 = require("path");
const debug = require("debug");
debug('express:application');
const Static = require("serve-static");
const deprecate = require("depd");
deprecate('express');
let slice = Array.prototype.slice;
const req = require("./request");
const res = require("./response");
const Router = require("./router");
const Query = require("./middleware/query");
const middleware = require("./middleware/init");
const query = require("./middleware/query");
const View = require("./view");
const utils_1 = require("./utils");
const utils_2 = require("./utils");
const utils_3 = require("./utils");
/*
 * Application prototype.
 */
/**
* Variable for trust proxy inheritance back-compat
* @private
*/
class Application extends events_1.EventEmitter {
    /* Initialize the server.
    *
    *   - setup default configuration
    *   - setup default middleware
    *   - setup route reflection methods
    *
    * @private
    */
    constructor() {
        super();
        this.trustProxyDefaultSymbol = '@@symbol:trust_proxy_default';
        this.static = Static;
        this.query = Query;
        let app = function (req, res, next) {
            this.handle(req, res, next);
        };
        // expose the prototype that will get set on requests
        this.request = Object.create(req, {
            app: { configurable: true, enumerable: true, writable: true, value: app }
        });
        // expose the prototype that will get set on responses
        this.response = Object.create(res, {
            app: { configurable: true, enumerable: true, writable: true, value: app }
        });
        this.init();
        return app;
    }
    init() {
        this.cache = {};
        this.engines = {};
        this.settings = {};
        this.defaultConfiguration();
    }
    ;
    /**
    * Initialize application configuration.
    * @private
    */
    defaultConfiguration() {
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
            setPrototypeOf(this.request, parent.request);
            setPrototypeOf(this.response, parent.response);
            setPrototypeOf(this.engines, parent.engines);
            setPrototypeOf(this.settings, parent.settings);
        });
        // setup locals
        this.locals = Object.create(null);
        // top-most app is mounted at /
        this.mountpath = '/';
        // default locals
        this.locals.settings = this.settings;
        // default configuration
        this.set('view', View);
        this.set('views', path_1.resolve('views'));
        this.set('jsonp callback name', 'callback');
        if (env === 'production') {
            this.enable('view cache');
        }
    }
    ;
    /**
    * lazily adds the base router if it has not yet been added.
    *
    * We cannot add the base router in the defaultConfiguration because
    * it reads app settings which might be set after that has run.
    *
    * @private
    */
    lazyrouter() {
        if (!this._router) {
            let opts = {
                caseSensitive: this.enabled('case sensitive routing'),
                strict: this.enabled('strict routing')
            };
            this._router = new Router(opts);
            this._router.use(query(this.get('query parser fn')));
            this._router.use(middleware.init(this));
        }
    }
    ;
    /**
    * Dispatch a req, res pair into the application. Starts pipeline processing.
    *
    * If no callback is provided, then default error handlers will respond
    * in the event of an error bubbling through the stack.
    *
    * @private
    */
    handle(req, res, callback) {
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
    }
    ;
    /**
    * Proxy `Router#use()` to add middleware to the app router.
    * See Router#use() documentation for details.
    *
    * If the _fn_ parameter is an express app, then it will be
    * mounted at the _route_ specified.
    *
    * @public
    */
    use(fn) {
        let offset = 0;
        let path = '/';
        // default path to '/'
        // disambiguate app.use([fn])
        if (typeof fn !== 'function') {
            let arg = fn;
            while (Array.isArray(arg) && arg.length !== 0) {
                arg = arg[0];
            }
            // first arg is the path
            if (typeof arg !== 'function') {
                offset = 1;
                path = fn;
            }
        }
        let fns = flatten(slice.call(arguments, offset));
        if (fns.length === 0) {
            throw new TypeError('app.use() requires middleware functions');
        }
        // setup router
        this.lazyrouter();
        let router = this._router;
        fns.forEach(fn => {
            // non-express app
            if (!fn || !fn.handle || !fn.set) {
                return router.use(path, fn);
            }
            debug(`use app under ${path}`);
            fn.mountpath = path;
            fn.parent = this;
            // restore .app property on req and res
            router.use(path, function mounted_app(req, res, next) {
                let orig = req.app;
                fn.handle(req, res, err => {
                    setPrototypeOf(req, orig.request);
                    setPrototypeOf(res, orig.response);
                    next(err);
                });
            });
            // mounted an app
            fn.emit('mount', this);
        }, this);
        return this;
    }
    ;
    /**
    * Proxy to the app `Router#route()`
    * Returns a new `Route` instance for the _path_.
    *
    * Routes are isolated middleware stacks for specific paths.
    * See the Route api docs for details.
    *
    * @public
    */
    route(path) {
        this.lazyrouter();
        return this._router.route(path);
    }
    ;
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
    engine(ext, fn) {
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
    }
    ;
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
    param(name, fn) {
        this.lazyrouter();
        if (Array.isArray(name)) {
            for (var i = 0; i < name.length; i++) {
                this.param(name[i], fn);
            }
            return this;
        }
        this._router.param(name, fn);
        return this;
    }
    ;
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
    set(setting, val) {
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
                this.set('etag fn', utils_1.compileETag(val));
                break;
            case 'query parser':
                this.set('query parser fn', utils_2.compileQueryParser(val));
                break;
            case 'trust proxy':
                this.set('trust proxy fn', utils_3.compileTrust(val));
                // trust proxy inherit back-compat
                Object.defineProperty(this.settings, this.trustProxyDefaultSymbol, {
                    configurable: true,
                    value: false
                });
                break;
        }
        return this;
    }
    ;
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
    path() {
        return this.parent
            ? this.parent.path() + this.mountpath
            : '';
    }
    ;
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
    all(path) {
        this.lazyrouter();
        let route = this._router.route(path);
        let args = slice.call(arguments, 1);
        for (let i = 0; i < methods.length; i++) {
            route[methods[i]].apply(route, args);
        }
        return this;
    }
    ;
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
    render(name, options, callback) {
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
        if (renderOptions.cache == null) {
            renderOptions.cache = this.enabled('view cache');
        }
        // primed cache
        if (renderOptions.cache) {
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
                err.view = view;
                return done(err);
            }
            // prime the cache
            if (renderOptions.cache) {
                cache[name] = view;
            }
        }
        // render
        this.tryRender(view, renderOptions, done);
    }
    ;
    /**
    * Try rendering a view.
    * @private
    */
    tryRender(view, options, callback) {
        try {
            view.render(options, callback);
        }
        catch (err) {
            callback(err);
        }
    }
}
exports.default = Application;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwbGljYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhcHBsaWNhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7OztHQU9HOzs7QUFHSDs7O0dBR0c7QUFFSCxtQ0FBc0M7QUFDdEMsNkNBQTZDO0FBRzdDLHlDQUF5QztBQUN6QyxxQ0FBcUM7QUFDckMsaURBQWdEO0FBQ2hELCtCQUErQjtBQUMvQiwrQkFBK0I7QUFDL0IsS0FBSyxDQUFDLHFCQUFxQixDQUFDLENBQUM7QUFDN0IsdUNBQXVDO0FBQ3ZDLGtDQUFrQztBQUNsQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDckIsSUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUM7QUFHbEMsaUNBQWlDO0FBQ2pDLGtDQUFrQztBQUVsQyxtQ0FBa0M7QUFDbEMsNENBQTRDO0FBQzVDLGdEQUFnRDtBQUNoRCw0Q0FBNEM7QUFDNUMsK0JBQStCO0FBQy9CLG1DQUFzQztBQUN0QyxtQ0FBNkM7QUFDN0MsbUNBQXVDO0FBR3ZDOztHQUVHO0FBQ0Q7OztFQUdFO0FBQ0osaUJBQWlDLFNBQVEscUJBQVk7SUFhbkQ7Ozs7Ozs7TUFPRTtJQUNIO1FBQ0MsS0FBSyxFQUFFLENBQUM7UUFyQkYsNEJBQXVCLEdBQUcsOEJBQThCLENBQUM7UUFVekQsV0FBTSxHQUFHLE1BQU0sQ0FBQztRQUNoQixVQUFLLEdBQUcsS0FBSyxDQUFDO1FBV3BCLElBQUksR0FBRyxHQUFRLFVBQVMsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJO1lBQ3JDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUM3QixDQUFDLENBQUM7UUFFRixxREFBcUQ7UUFDckQsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRTtZQUNqQyxHQUFHLEVBQUUsRUFBRSxZQUFZLEVBQUUsSUFBSSxF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