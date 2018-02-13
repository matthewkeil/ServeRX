/*!
 * express
 * Copyright(c) 2009-2013 TJ Holowaychuk
 * Copyright(c) 2013 Roman Shtylman
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
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
class View {
    constructor(name, options) {
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
            var mod = this.ext.substr(1);
            debug('require "%s"', mod);
            opts.engines[this.ext] = require(mod).__express;
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
    lookup(name) {
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
    }
    ;
    /**
    * Render with the given options.
    *
    * @param {object} options
    * @param {function} callback
    * @private
    */
    render(options, callback) {
        debug('render "%s"', this.path);
        this.engine(this.path, options, callback);
    }
    ;
    resolve(dir, file) {
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
    }
    ;
    /**
    * Return a stat, maybe.
    *
    * @param {string} path
    * @return {fs.Stats}
    * @private
    */
    _tryStat(path) {
        debug(`stat "${path}"`);
        try {
            return fs.statSync(path);
        }
        catch (e) {
            return undefined;
        }
    }
}
exports.default = View;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlldy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInZpZXcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsWUFBWSxDQUFDOztBQUViOzs7R0FHRztBQUVILElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUM3QyxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDM0IsSUFBSSxFQUFFLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3ZCLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUUvQjs7O0dBR0c7QUFFSCxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO0FBQzNCLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7QUFDN0IsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztBQUMzQixJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQ3JCLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7QUFFMUI7OztFQUdFO0FBRUQ7Ozs7Ozs7Ozs7OztFQVlFO0FBQ0o7SUFJQyxZQUFhLElBQUksRUFBRSxPQUFPO1FBQ3pCLElBQUksSUFBSSxHQUFHLE9BQU8sSUFBSSxFQUFFLENBQUM7UUFFekIsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDO1FBQ3hDLElBQUksQ0FBQyxHQUFHLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3pCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztRQUV0QixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxD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