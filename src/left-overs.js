/**
 * Clear cookie `name`.
 *
 * @param {String} name
 * @param {Object} [options]
 * @return {ServerResponse} for chaining
 * @public
 */

res.clearCookie = function clearCookie(name, options) {
  var opts = merge({ expires: new Date(1), path: '/' }, options);

  return this.cookie(name, '', opts);
};
/**
 * Set cookie `name` to `value`, with the given `options`.
 *
 * Options:
 *
 *    - `maxAge`   max-age in milliseconds, converted to `expires`
 *    - `signed`   sign the cookie
 *    - `path`     defaults to "/"
 *
 * Examples:
 *
 *    // "Remember Me" for 15 minutes
 *    res.cookie('rememberme', '1', { expires: new Date(Date.now() + 900000), httpOnly: true });
 *
 *    // save as above
 *    res.cookie('rememberme', '1', { maxAge: 900000, httpOnly: true })
 *
 * @param {String} name
 * @param {String|Object} value
 * @param {Options} options
 * @return {ServerResponse} for chaining
 * @public
 */

res.cookie = function (name, value, options) {
  var opts = merge({}, options);
  var secret = this.req.secret;
  var signed = opts.signed;

  if (signed && !secret) {
    throw new Error('cookieParser("secret") required for signed cookies');
  }

  var val = typeof value === 'object'
    ? 'j:' + JSON.stringify(value)
    : String(value);

  if (signed) {
    val = 's:' + sign(val, secret);
  }

  if ('maxAge' in opts) {
    opts.expires = new Date(Date.now() + opts.maxAge);
    opts.maxAge /= 1000;
  }

  if (opts.path == null) {
    opts.path = '/';
  }

  this.append('Set-Cookie', cookie.serialize(name, String(val), opts));

  return this;
};
/**
 * Render `view` with the given `options` and optional callback `fn`.
 * When a callback function is given a response will _not_ be made
 * automatically, otherwise a response of _200_ and _text/html_ is given.
 *
 * Options:
 *
 *  - `cache`     boolean hinting to the engine it should cache
 *  - `filename`  filename of the view being rendered
 *
 * @public
 */

res.render = function render(view, options, callback) {
  var app = this.req.app;
  var done = callback;
  var opts = options || {};
  var req = this.req;
  var self = this;

  // support callback function as second arg
  if (typeof options === 'function') {
    done = options;
    opts = {};
  }

  // merge res.locals
  opts._locals = self.locals;

  // default callback to respond
  done = done || function (err, str) {
    if (err) return req.next(err);
    self.send(str);
  };

  // render
  app.render(view, opts, done);
};
/**
 * creates and sets negotiator on request if one doesn't already exist,
 * then returns it.
 * @private
 * @function negotiator
 * @param    {Object} req the request object
 * @returns  {Object}     a negotiator
 */
function negotiator(req) {
    var h = req.headers;

    if (!req._negotiator) {
        req._negotiator = new Negotiator({
            headers: {
                accept: h.accept || '*/*',
                'accept-encoding': h['accept-encoding'] ||
                    'identity'
            }
        });
    }

    return (req._negotiator);
}
Request.prototype.absoluteUri = function absoluteUri(path) {
    assert.string(path, 'path');

    var protocol = this.isSecure() ? 'https://' : 'http://';
    var hostname = this.headers.host;
    return (url.resolve(protocol + hostname + this.path() + '/', path));
};
/*
 * redirect is sugar method for redirecting. takes a few different signatures:
 * 1) res.redirect(301, 'www.foo.com', next);
 * 2) res.redirect('www.foo.com', next);
 * 3) res.redirect({...}, next);
 * `next` is mandatory, to complete the response and trigger audit logger.
 * @public
 * @param    {Number | String}   arg1 the status code or url to direct to
 * @param    {String | Function} arg2 the url to redirect to, or `next` fn
 * @param    {Function}          arg3 `next` fn
 * @emits    redirect
 * @function redirect
 * @return   {undefined}
 */
Response.prototype.redirect = function redirect(arg1, arg2, arg3) {

    var self = this;
    var statusCode = 302;
    var finalUri;
    var redirectLocation;
    var next;

    // 1) this is signature 1, where an explicit status code is passed in.
    //    MUST guard against null here, passing null is likely indicative
    //    of an attempt to call res.redirect(null, next);
    //    as a way to do a reload of the current page.
    if (arg1 && !isNaN(arg1)) {
        statusCode = arg1;
        finalUri = arg2;
        next = arg3;
    }

    // 2) this is signaure number 2
    else if (typeof (arg1) === 'string') {
        // otherwise, it's a string, and use it directly
        finalUri = arg1;
        next = arg2;
    }

    // 3) signature number 3, using an options object.
    else if (typeof (arg1) === 'object') {

        // set next, then go to work.
        next = arg2;

        var req = self.req;
        var opt = arg1 || {};
        var currentFullPath = req.href();
        var secure = (opt.hasOwnProperty('secure')) ?
                        opt.secure :
                        req.isSecure();

        // if hostname is passed in, use that as the base,
        // otherwise fall back on current url.
        var parsedUri = url.parse(opt.hostname || currentFullPath, true);

        // create the object we'll use to format for the final uri.
        // this object will eventually get passed to url.format().
        // can't use parsedUri to seed it, as it confuses the url module
        // with some existing parsed state. instead, we'll pick the things
        // we want and use that as a starting point.
        finalUri = {
            port: parsedUri.port,
            hostname: parsedUri.hostname,
            query: parsedUri.query,
            pathname: parsedUri.pathname
        };

        // start building url based on options.
        // first, set protocol.
        finalUri.protocol = (secure === true) ? 'https' : 'http';

        // then set host
        if (opt.hostname) {
            finalUri.hostname = opt.hostname;
        }

        // then set current path after the host
        if (opt.pathname) {
            finalUri.pathname = opt.pathname;
        }

        // then add query params
        if (opt.query) {
            if (opt.overrideQuery === true) {
                finalUri.query = opt.query;
            } else {
                finalUri.query = utils.mergeQs(opt.query, finalUri.query);
            }
        }

        // change status code to 301 permanent if specified
        if (opt.permanent) {
            statusCode = 301;
        }
    }

    // if we're missing a next we should probably throw. if user wanted
    // to redirect but we were unable to do so, we should not continue
    // down the handler stack.
    assert.func(next, 'res.redirect() requires a next param');

    // if we are missing a finalized uri
    // by this point, pass an error to next.
    if (!finalUri) {
        return (next(new InternalServerError('could not construct url')));
    }

    redirectLocation = url.format(finalUri);

    self.emit('redirect', redirectLocation);

    // now we're done constructing url, send the res
    self.send(statusCode, null, {
        Location: redirectLocation
    });

    // tell server to stop processing the handler stack.
    return (next(false));
};
/**
 * internal implementation of send. convenience method that handles:
 * writeHead(), write(), end().
 * @private
 * @private
 * @param    {Number} [maybeCode] http status code
 * @param    {Object | Buffer | Error} [maybeBody] the content to send
 * @param    {Object} [maybeHeaders] any add'l headers to set
 * @param    {Function} [maybeCallback] optional callback for async formatters
 * @param    {Function} format when false, skip formatting
 * @returns  {Object} returns the response object
 */
Response.prototype.__send =
function __send(maybeCode, maybeBody, maybeHeaders, maybeCallback, format) {

    var self = this;
    var isHead = (self.req.method === 'HEAD');
    var log = self.log;
    var code;
    var body;
    var headers;
    var callback;

    // normalize variadic args.
    if (typeof maybeCode === 'number') {
        // if status code was passed in, then signature should look like jsdoc
        // signature and we only need to figure out headers/callback variation.
        code = maybeCode;

        // signature should look like jsdoc signature
        body = maybeBody;

        if (typeof maybeHeaders === 'function') {
            callback = maybeHeaders;
        } else {
            callback = maybeCallback;
            headers = maybeHeaders;
        }
    } else {
        // if status code was omitted, then first arg must be body.
        body = maybeCode;

        // now figure out headers/callback variation
        if (typeof maybeBody === 'function') {
            callback = maybeBody;
        } else {
            callback = maybeHeaders;
            headers = maybeBody;
        }
    }

    // if an error object is being sent and a status code isn't explicitly set,
    // infer one from the error object itself.
    if (!code && body instanceof Error) {
        self.statusCode = body.statusCode || 500;
    } else {
        self.statusCode = code || 200;
    }

    headers = headers || {};

    if (log.trace()) {
        var _props = {
            code: self.statusCode,
            headers: headers
        };

        if (body instanceof Error) {
            _props.err = body;
        } else {
            _props.body = body;
        }
        log.trace(_props, 'response::send entered');
    }

    self._body = body;

    function _flush(formattedBody) {
        self._data = formattedBody;

        Object.keys(headers).forEach(function (k) {
            self.setHeader(k, headers[k]);
        });

        self.writeHead(self.statusCode);

        if (self._data && !(isHead || code === 204 || code === 304)) {
            self.write(self._data);
        }

        self.end();

        if (log.trace()) {
            log.trace({res: self}, 'response sent');
        }
    }

    // if no formatting, assert that the value to be written is a string
    // or a buffer, then send it.
    if (format === false) {
        assert.ok(typeof body === 'string' || Buffer.isBuffer(body),
                  'res.sendRaw() accepts only strings or buffers');
        return _flush(body);
    }

    // if no body, then no need to format. if this was an error caught by a
    // domain, don't send the domain error either.
    if (body === null ||
        body === undefined ||
        (body instanceof Error && body.domain)) {
        return _flush();
    }

    // otherwise, try to find a formatter
    self._findFormatter(
    function foundFormatter(findErr, formatter, contentType) {

        // handle missing formatters
        if (findErr) {
            // if user set a status code outside of the 2xx range, it probably
            // outweighs being unable to format the response. set a status code
            // then flush empty response.
            if (self.statusCode >= 200 && self.statusCode < 300) {
                self.statusCode = findErr.statusCode;
            }
            log.warn({
                req: self.req,
                err: findErr
            }, 'error retrieving formatter');
            return _flush();
        }

        // if we have formatter, happy path.
        var asyncFormat = (formatter && formatter.length === 4) ? true : false;

        if (asyncFormat === true) {

            assert.func(callback, 'async formatter for ' + contentType +
                                  ' requires callback to res.send()');

            // if async formatter error, propagate error back up to
            // res.send() caller, most likely a handler.
            return formatter.call(self, self.req, self, body,
            function _formatDone(formatErr, formattedBody) {

                if (formatErr) {

                    return callback(new errors.FormatterError(formatErr, {
                        message: 'unable to format response for ' +
                                    self.header('content-type'),
                        context: {
                            rawBody: body
                        }
                    }));
                }
                return _flush(formattedBody);
            });
        }
        // for sync formatters, invoke formatter and send response body.
        else {
            _flush(formatter.call(self, self.req, self, body), body);
            // users can always opt to pass in next, even when formatter is not
            // async. invoke callback in that case. return null when no
            // callback because eslint wants consistent-return.
            return (callback) ? callback() : null;
        }
    });

    return self;
};
/**
 * pass through to native response.writeHead()
 * @public
 * @function writeHead
 * @emits    header
 * @returns  {undefined}
 */
Response.prototype.writeHead = function restifyWriteHead() {
    this.emit('header');

    if (this.statusCode === 204 || this.statusCode === 304) {
        this.removeHeader('Content-Length');
        this.removeHeader('Content-MD5');
        this.removeHeader('Content-Type');
        this.removeHeader('Content-Encoding');
    }

    this._writeHead.apply(this, arguments);
};
/**
 * gets the content-length header off the request.
 * @public
 * @function getContentLength
 * @returns {Number}
 */

/**
 * finds a formatter that is both acceptable and works for the content-type
 * specified on the response. Can return two errors:
 *      NotAcceptableError - couldn't find a suitable formatter
 *      InternalServerError - couldn't find a fallback formatter
 * @public
 * @function _findFormatter
 * @param    {Function} callback a callback fn
 * @returns  {undefined}
 */


/**
 * checks if the accept header is present and has the value requested.
 * e.g., req.accepts('html');
 * @public
 * @function accepts
 * @param    {String | Array} types an array of accept type headers
 * @returns  {Boolean}
 */

/**
 * checks if the request accepts the encoding types.
 * @public
 * @function acceptsEncoding
 * @param    {String | Array} types an array of accept type headers
 * @returns  {Boolean}
 */

/**
 * returns the accept-version header.
 * @public
 * @function getVersion
 * @returns  {String}
 */
Request.prototype.getVersion = function getVersion() {
    if (this._version !== undefined) {
        return (this._version);
    }

    this._version =
        this.headers['accept-version'] ||
            this.headers['x-api-version'] ||
            '*';

    return (this._version);
};
/**
 * Check if the incoming request contains the Content-Type header field, and
 * if it contains the given mime type.
 * @public
 * @function is
 * @param    {String} type  a content-type header value
 * @returns  {Boolean}
 */