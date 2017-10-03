/*!
 * express
 * Copyright(c) 2009-2013 TJ Holowaychuk
 * Copyright(c) 2013 Roman Shtylman
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 * @private
 */

var debug = require('debug')('express:view');
var path = require('path');
var fs = require('fs');
var utils = require('./utils');

/**
 * Module variables.
 * @private
 */

var dirname = path.dirname;
var basename = path.basename;
var extname = path.extname;
var join = path.join;
var resolve = path.resolve;

 /**
 * Module exports.
 * @public
 */

	 /**
	 * Initialize a new `View` with the given `name`.
	 *
	 * Options:
	 *
	 *   - `defaultEngine` the default template engine name
	 *   - `engines` template engine require() cache
	 *   - `root` root path for view lookup
	 *
	 * @param {string} name
	 * @param {object} options
	 * @public
	 */
export default class View {
	public defaultEngine: any;
	public name: any;
	public root: any;
	constructor (name, options) {
		var opts = options || {};

		this.defaultEngine = opts.defaultEngine;
		this.ext = extname(name);
		this.name = name;
		this.root = opts.root;

		if (!this.ext && !this.defaultEngine) {
			throw new Error('No default engine was specified and no extension was provided.');
		}

		var fileName = name;

		if (!this.ext) {
			// get extension from default engine name
			this.ext = this.defaultEngine[0] !== '.'
				? '.' + this.defaultEngine
				: this.defaultEngine;

			fileName += this.ext;
		}

		if (!opts.engines[this.ext]) {
			// load engine
			var mod = this.ext.substr(1)
			debug('require "%s"', mod)
			opts.engines[this.ext] = require(mod).__express
		}

		// store loaded engine
		this.engine = opts.engines[this.ext];

		// lookup path
		this.path = this.lookup(fileName);
	 }

	 /**
	 * Lookup view by the given `name`
	 *
	 * @param {string} name
	 * @private
	 */

	public lookup(name) {
		var path;
		var roots = [].concat(this.root);

		debug('lookup "%s"', name);

		for (var i = 0; i < roots.length && !path; i++) {
			var root = roots[i];

			// resolve the path
			var loc = resolve(root, name);
			var dir = dirname(loc);
			var file = basename(loc);

			// resolve the file
			path = this.resolve(dir, file);
		}

		return path;
	 };

	 /**
	 * Render with the given options.
	 *
	 * @param {object} options
	 * @param {function} callback
	 * @private
	 */

	public render(options, callback) {
		debug('render "%s"', this.path);
		this.engine(this.path, options, callback);
	 };

	 /**
	 * Resolve the file within the given directory.
	 *
	 * @param {string} dir
	 * @param {string} file
	 * @private
	 */

	public ext: any;
	public resolve(dir, file) {
		let ext = this.ext;

		// <path>.<ext>
		let path = join(dir, file);
		let stat = this._tryStat(path);

		if (stat && stat.isFile()) {
			return path;
		}

		// <path>/index.<ext>
		path = join(dir, basename(file, ext), 'index' + ext);
		stat = this._tryStat(path);

		if (stat && stat.isFile()) {
			return path;
		}
	 };
	 /**
	 * Return a stat, maybe.
	 *
	 * @param {string} path
	 * @return {fs.Stats}
	 * @private
	 */
	private _tryStat(path) {
		debug(`stat "${path}"`);

		try {
			return fs.statSync(path);
		} catch (e) {
			return undefined;
		}
	 }
}

