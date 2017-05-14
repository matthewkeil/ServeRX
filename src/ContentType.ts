export interface ContentI {
	length?: number;
	type?: string[];
	constructor(req: IncomingReq): void;
	isType(type: string): boolean;
	isLength(): boolean;
	getType(): string[];
	getLength(): number;
	setType(): this;
	setLength(): this;
}

Request.prototype.getContentLength = function getContentLength() {
    if (this._clen !== undefined) {
        return (this._clen === false ? undefined : this._clen);
    }

    var len = this.header('content-length');

    if (!len) {
        this._clen = false;
    } else {
        this._clen = parseInt(len, 10);
    }

    return (this._clen === false ? undefined : this._clen);
};
/**
 * Set _Content-Type_ response header with `type` through `mime.lookup()`
 * when it does not contain "/", or set the Content-Type to `type` otherwise.
 *
 * Examples:
 *
 *     res.type('.html');
 *     res.type('html');
 *     res.type('json');
 *     res.type('application/json');
 *     res.type('png');
 *
 * @param {String} type
 * @return {ServerResponse} for chaining
 * @public
 */

res.contentType = function contentType(type) {
  var ct = type.indexOf('/') === -1
    ? mime.lookup(type)
    : type;

  return this.set('Content-Type', ct);
};
Request.prototype.getContentType = function getContentType() {
    if (this._contentType !== undefined) {
        return (this._contentType);
    }

    var index;
    var type = this.headers['content-type'];

    if (!type) {
        // RFC2616 section 7.2.1
        this._contentType = 'application/octet-stream';
    } else {
        if ((index = type.indexOf(';')) === -1) {
            this._contentType = type;
        } else {
            this._contentType = type.substring(0, index);
        }
    }

    // #877 content-types need to be case insensitive.
    this._contentType = this._contentType.toLowerCase();

    return (this._contentType);
};
Request.prototype.is = function is(type) {
    assert.string(type, 'type');

    var contentType = this.getContentType();
    var matches = true;

    if (!contentType) {
        return (false);
    }

    if (type.indexOf('/') === -1) {
        type = mime.lookup(type);
    }

    if (type.indexOf('*') !== -1) {
        type = type.split('/');
        contentType = contentType.split('/');
        matches &= (type[0] === '*' || type[0] === contentType[0]);
        matches &= (type[1] === '*' || type[1] === contentType[1]);
    } else {
        matches = (contentType === type);
    }

    return (matches);
};



export interface Accepts {
	type?: string[];
	encodings?: string[];
	charsets?: string[];
	languages?: string[];
	constructor(req?: IncomingReq);
	type(...type?: string[]): string[];
	encoding(...encoding?: string[]): string[];
	charsets(...charsets?: string[]): string[];
	languages(...languages?: string[]): string[];
}
/**
 * To do: update docs.
 *
 * Check if the given `type(s)` is acceptable, returning
 * the best match when true, otherwise `undefined`, in which
 * case you should respond with 406 "Not Acceptable".
 *
 * The `type` value may be a single MIME type string
 * such as "application/json", an extension name
 * such as "json", a comma-delimited list such as "json, html, text/plain",
 * an argument list such as `"json", "html", "text/plain"`,
 * or an array `["json", "html", "text/plain"]`. When a list
 * or array is given, the _best_ match, if any is returned.
 *
 * Examples:
 *
 *     // Accept: text/html
 *     req.accepts('html');
 *     // => "html"
 *
 *     // Accept: text/*, application/json
 *     req.accepts('html');
 *     // => "html"
 *     req.accepts('text/html');
 *     // => "text/html"
 *     req.accepts('json, text');
 *     // => "json"
 *     req.accepts('application/json');
 *     // => "application/json"
 *
 *     // Accept: text/*, application/json
 *     req.accepts('image/png');
 *     req.accepts('png');
 *     // => undefined
 *
 *     // Accept: text/*;q=.5, application/json
 *     req.accepts(['html', 'json']);
 *     req.accepts('html', 'json');
 *     req.accepts('html, json');
 *     // => "json"
 *
 * @param {String|Array} type(s)
 * @return {String|Array|Boolean}
 * @public
 */

req.accepts = function(){
  var accept = accepts(this);
  return accept.types.apply(accept, arguments);
};
Request.prototype.accepts = function accepts(types) {
    if (typeof (types) === 'string') {
        types = [types];
    }

    types = types.map(function (t) {
        assert.string(t, 'type');

        if (t.indexOf('/') === -1) {
            t = mime.lookup(t);
        }
        return (t);
    });

    negotiator(this);

    return (this._negotiator.preferredMediaType(types));
};
/**
 * Check if the given `encoding`s are accepted.
 *
 * @param {String} ...encoding
 * @return {String|Array}
 * @public
 */

req.acceptsEncodings = function(){
  var accept = accepts(this);
  return accept.encodings.apply(accept, arguments);
}
Request.prototype.acceptsEncoding = function acceptsEncoding(types) {
    if (typeof (types) === 'string') {
        types = [types];
    }

    assert.arrayOfString(types, 'types');

    negotiator(this);

    return (this._negotiator.preferredEncoding(types));
};
/**
 * Check if the given `charset`s are acceptable,
 * otherwise you should respond with 406 "Not Acceptable".
 *
 * @param {String} ...charset
 * @return {String|Array}
 * @public
 */

req.acceptsCharsets = function(){
  var accept = accepts(this);
  return accept.charsets.apply(accept, arguments);
};
/**
 * Check if the given `lang`s are acceptable,
 * otherwise you should respond with 406 "Not Acceptable".
 *
 * @param {String} ...lang
 * @return {String|Array}
 * @public
 */

req.acceptsLanguages = function(){
  var accept = accepts(this);
  return accept.languages.apply(accept, arguments);
};







