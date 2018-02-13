/*!
 * express
 * Copyright(c) 2009-2013 TJ Holowaychuk
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
* Module dependencies.
* @api private
*/
var contentDisposition = require('content-disposition');
var contentType = require('content-type');
var deprecate = require('depd')('express');
var flatten = require('array-flatten');
var mime = require('send').mime;
var basename = require('path').basename;
var Etag = require('etag');
var proxyaddr = require('proxy-addr');
var qs = require('qs');
var querystring = require('querystring');
/**
* Return strong ETag for `body`.
*
* @param {String|Buffer} body
* @param {String} [encoding]
* @return {String}
* @api private
*/
function etag(body, encoding) {
    var buf = !Buffer.isBuffer(body)
        ? new Buffer(body, encoding)
        : body;
    return Etag(buf, { weak: false });
}
exports.etag = etag;
;
/**
* Return weak ETag for `body`.
*
* @param {String|Buffer} body
* @param {String} [encoding]
* @return {String}
* @api private
*/
exports.wetag = function wetag(body, encoding) {
    var buf = !Buffer.isBuffer(body)
        ? new Buffer(body, encoding)
        : body;
    return etag(buf, { weak: true });
};
/**
* Check if `path` looks absolute.
*
* @param {String} path
* @return {Boolean}
* @api private
*/
exports.isAbsolute = function (path) {
    if ('/' === path[0])
        return true;
    if (':' === path[1] && ('\\' === path[2] || '/' === path[2]))
        return true; // Windows device path
    if ('\\\\' === path.substring(0, 2))
        return true; // Microsoft Azure absolute path
};
/**
* Flatten the given `arr`.
*
* @param {Array} arr
* @return {Array}
* @api private
*/
exports.flatten = deprecate.function(flatten, 'utils.flatten: use array-flatten npm module instead');
/**
* Normalize the given `type`, for example "html" becomes "text/html".
*
* @param {String} type
* @return {Object}
* @api private
*/
exports.normalizeType = function (type) {
    return ~type.indexOf('/')
        ? acceptParams(type)
        : { value: mime.lookup(type), params: {} };
};
/**
* Normalize `types`, for example "html" becomes "text/html".
*
* @param {Array} types
* @return {Array}
* @api private
*/
exports.normalizeTypes = function (types) {
    var ret = [];
    for (var i = 0; i < types.length; ++i) {
        ret.push(exports.normalizeType(types[i]));
    }
    return ret;
};
/**
* Generate Content-Disposition header appropriate for the filename.
* non-ascii filenames are urlencoded and a filename* parameter is added
*
* @param {String} filename
* @return {String}
* @api private
*/
exports.contentDisposition = deprecate.function(contentDisposition, 'utils.contentDisposition: use content-disposition npm module instead');
/**
* Parse accept params `str` returning an
* object with `.value`, `.quality` and `.params`.
* also includes `.originalIndex` for stable sorting
*
* @param {String} str
* @return {Object}
* @api private
*/
function acceptParams(str, index) {
    var parts = str.split(/ *; */);
    var ret = { value: parts[0], quality: 1, params: {}, originalIndex: index };
    for (var i = 1; i < parts.length; ++i) {
        var pms = parts[i].split(/ *= */);
        if ('q' === pms[0]) {
            ret.quality = parseFloat(pms[1]);
        }
        else {
            ret.params[pms[0]] = pms[1];
        }
    }
    return ret;
}
/**
* Compile "etag" value to function.
*
* @param  {Boolean|String|Function} val
* @return {Function}
* @api private
*/
exports.compileETag = function (val) {
    var fn;
    if (typeof val === 'function') {
        return val;
    }
    switch (val) {
        case true:
            fn = exports.wetag;
            break;
        case false:
            break;
        case 'strong':
            fn = exports.etag;
            break;
        case 'weak':
            fn = exports.wetag;
            break;
        default:
            throw new TypeError('unknown value for etag function: ' + val);
    }
    return fn;
};
/**
* Compile "query parser" value to function.
*
* @param  {String|Function} val
* @return {Function}
* @api private
*/
exports.compileQueryParser = function compileQueryParser(val) {
    var fn;
    if (typeof val === 'function') {
        return val;
    }
    switch (val) {
        case true:
            fn = querystring.parse;
            break;
        case false:
            fn = newObject;
            break;
        case 'extended':
            fn = parseExtendedQueryString;
            break;
        case 'simple':
            fn = querystring.parse;
            break;
        default:
            throw new TypeError('unknown value for query parser function: ' + val);
    }
    return fn;
};
/**
* Compile "proxy trust" value to function.
*
* @param  {Boolean|String|Number|Array|Function} val
* @return {Function}
* @api private
*/
exports.compileTrust = function (val) {
    if (typeof val === 'function')
        return val;
    if (val === true) {
        // Support plain true/false
        return function () { return true; };
    }
    if (typeof val === 'number') {
        // Support trusting hop count
        return function (a, i) { return i < val; };
    }
    if (typeof val === 'string') {
        // Support comma-separated values
        val = val.split(/ *, */);
    }
    return proxyaddr.compile(val || []);
};
/**
* Set the charset in a given Content-Type string.
*
* @param {String} type
* @param {String} charset
* @return {String}
* @api private
*/
exports.setCharset = function setCharset(type, charset) {
    if (!type || !charset) {
        return type;
    }
    // parse type
    var parsed = contentType.parse(type);
    // set charset
    parsed.parameters.charset = charset;
    // format type
    return contentType.format(parsed);
};
/**
* Parse an extended query string with qs.
*
* @return {Object}
* @private
*/
function parseExtendedQueryString(str) {
    return qs.parse(str, {
        allowPrototypes: true
    });
}
/**
* Return new empty object.
*
* @return {Object}
* @api private
*/
function newObject() {
    return {};
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRzs7O0FBSUY7OztFQUdFO0FBRUgsSUFBSSxrQkFBa0IsR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUN4RCxJQUFJLFdBQVcsR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDMUMsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQzNDLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN2QyxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDO0FBQ2hDLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxRQUFRLENBQUM7QUFDeEMsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzNCLElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUN0QyxJQUFJLEVBQUUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdkIsSUFBSSxXQUFXLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBRXhDOzs7Ozs7O0VBT0U7QUFDSCxjQUFzQixJQUFJLEVBQUUsUUFBUTtJQUNsQyxJQUFJLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO1VBQzVCLElBQUksTUFBTSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUM7VUFDMUIsSUFBSSxDQUFDO0lBRVQsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsRUFBQyxJQUFJLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztBQUNqQyxDQUFDO0FBTkYsb0JBTUU7QUFBQSxDQUFDO0FBRUY7Ozs7Ozs7RUFPRTtBQUVILE9B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