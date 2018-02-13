"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
function Response(req) {
    http.ServerResponse.bind(this, req);
}
exports.Response = Response;
util.inherits(Response, http.ServerResponse);
/**

    public parse(req: RequestI, serverRes: http.ServerResponse): ResponseI {
        let res = <ResponseI>{};
        res.id = req.id;
        res.raw = serverRes;
        return res;
     }

    public writeHead(statusCode: number, reasonPhrase?: string, headers?: any): void {

     }

    public write(chunk: Buffer | string, encoding?: string, fd?: string): void {

     }
    public end(chunk?: Buffer | string, encoding?: string): void {

     }

    public json(obj: Object) {

        var body = Helpers.JSONify(obj);

        // content-type
        if (!this.headers.getHeader('Content-Type')) {
            this.headers.setHeader('Content-Type', 'application/json');
        }

        return this.write(body);
     };

    public sendStatus(code: number) {
        let body = statuses[code]
        this.statusCode = code;
        ContentType.set('txt');
        this.send(code);
     }

    public writeBody(body: Buffer | string): void {
        let chunk = body;
        let type: string;
        let encoding: string;
        let length: number;
        let app = this.app;

        switch (typeof chunk) {
            case 'boolean':
            case 'number':
            case 'object':
                if (chunk === null) {
                    chunk = '';
                } else if (Buffer.isBuffer(chunk)) {
                    if (!this.getHeader('Content-Type')) {
                        type = 'bin';
                    }
                } else {
                    // return this.json(chunk);
                }
                break;
            default:
            case 'string':
                if (!this.getHeader('Content-Type')) {
                    type = 'html';
                }
                break;
        }

        // write strings in utf-8
        if (typeof chunk === 'string') {
            encoding = 'utf8';
            type = this.getHeader('Content-Type');

            // reflect this in content-type
            if (typeof type === 'string') {
                this.setHeaders({'Content-Type': setCharset(type, 'utf-8')});
            }
        }

        // populate Content-Length
        if (chunk !== undefined) {
            if (!Buffer.isBuffer(chunk)) {
                // convert chunk to Buffer; saves later double conversions
                chunk = new Buffer(chunk, encoding);
                encoding = undefined;
            }
            length = chunk.length;
            this.setHeaders({'Content-Length': length});
        }

        // populate ETag
        let etag;
        let generateETag = length !== undefined && app.get('etag fn');
        if (typeof generateETag === 'function' && !this.getHeader('ETag')) {
            if ((etag = generateETag(chunk, encoding))) {
                this.setHeaders({'ETag': etag});
            }
        }

        // freshness
        if (this.fresh) this.statusCode = 304;

        // strip irrelevant headers
        if (204 === this.statusCode || 304 === this.statusCode) {
            this.removeHeader('Content-Type');
            this.removeHeader('Content-Length');
            this.removeHeader('Content-MD5');
            this.removeHeader('Transfer-Encoding');
            chunk = '';
        }

        if (req.method === 'HEAD') {
            // skip body for HEAD
            this.end();
        } else {
            // respond
            this.end(chunk, encoding);
        }
     }

}
        /**
         * Respond to the Acceptable formats using an `obj`
         * of mime-type callbacks.
         *
         * This method uses `req.accepted`, an array of
         * acceptable types ordered by their quality values.
         * When "Accept" is not present the _first_ callback
         * is invoked, otherwise the first match is used. When
         * no match is performed the server responds with
         * 406 "Not Acceptable".
         *
         * Content-Type is set for you, however if you choose
         * you may alter this within the callback using `res.type()`
         * or `res.set('Content-Type', ...)`.
         *
         *    res.format({
         *      'text/plain': function(){
         *        res.send('hey');
         *      },
         *
         *      'text/html': function(){
         *        res.send('<p>hey</p>');
         *      },
         *
         *      'appliation/json': function(){
         *        res.send({ message: 'hey' });
         *      }
         *    });
         *
         * In addition to canonicalized MIME types you may
         * also use extnames mapped to these types:
         *
         *    res.format({
         *      text: function(){
         *        res.send('hey');
         *      },
         *
         *      html: function(){
         *        res.send('<p>hey</p>');
         *      },
         *
         *      json: function(){
         *        res.send({ message: 'hey' });
         *      }
         *    });
         *
         * By default Express passes an `Error`
         * with a `.status` of 406 to `next(err)`
         * if a match is not made. If you provide
         * a `.default` callback it will be invoked
         * instead.
         *
         * @param {Object} obj
         * @return {ServerResponse} for chaining
         * @public
        */
res.format = function (obj) {
    var req = this.req;
    var next = req.next;
    var fn = obj.default;
    if (fn)
        delete obj.default;
    var keys = Object.keys(obj);
    var key = keys.length > 0
        ? req.accepts(keys)
        : false;
    this.vary("Accept");
    if (key) {
        this.set('Content-Type', normalizeType(key).value);
        obj[key](req, this, next);
    }
    else if (fn) {
        fn();
    }
    else {
        var err = new Error('Not Acceptable');
        err.status = err.statusCode = 406;
        err.types = normalizeTypes(keys).map(function (o) { return o.value; });
        next(err);
    }
    return this;
};
Response.prototype._findFormatter = function _findFormatter(callback) {
    var formatter;
    var type = this.contentType || this.getHeader('Content-Type');
    if (!type) {
        if (this.req.accepts(this.acceptable)) {
            type = this.req.accepts(this.acceptable);
        }
        if (!type) {
            return callback(new errors.NotAcceptableError({
                message: 'could not find suitable formatter'
            }));
        }
    }
    else if (type.indexOf(';') !== '-1') {
        type = type.split(';')[0];
    }
    if (!(formatter = this.formatters[type])) {
        if (type.indexOf('/') === -1) {
            type = mime.lookup(type);
        }
        if (this.acceptable.indexOf(type) === -1) {
            type = 'application/octet-stream';
        }
        formatter = this.formatters[type] || this.formatters['*/*'];
        // this is a catastrophic case - should always fall back on
        // octet-stream but if for some reason that's gone, return a 500.
        if (!formatter) {
            return callback(new errors.InternalServerError({
                message: 'could not find formatter for application/octet-stream'
            }));
        }
    }
    if (this._charSet) {
        type = type + '; charset=' + this._charSet;
    }
    this.setHeader('Content-Type', type);
    return callback(null, formatter, type);
};
redirect(url);
{
    var address = url;
    var body;
    var status = 302;
    // Set location header
    address = this.location(address).getHeader('Location');
    // Support text/{plain,html} by default
    this.format({
        text: function () {
            body = statuses[status] + '. Redirecting to ' + address;
        },
        html: function () {
            var u = escapeHtml(address);
            body = '<p>' + statuses[status] + '. Redirecting to <a href="' + u + '">' + u + '</a></p>';
        },
        default: function () {
            body = '';
        }
    });
    // Respond
    this.statusCode = status;
    this.setHeader('Content-Length', Buffer.byteLength(body));
    if (this.req.method === 'HEAD') {
        this.end();
    }
    else {
        this.end(body);
    }
}
;
/**
 * Transfer the file at the given `path`.
 *
 * Automatically sets the _Content-Type_ response header field.
 * The callback `callback(err)` is invoked when the transfer is complete
 * or when an error occurs. Be sure to check `res.sentHeader`
 * if you wish to attempt responding, as the header and some data
 * may have already been transferred.
 *
 * Options:
 *
 *   - `maxAge`   defaulting to 0 (can be string converted by `ms`)
 *   - `root`     root directory for relative filenames
 *   - `headers`  object of headers to serve with file
 *   - `dotfiles` serve dotfiles, defaulting to false; can be `"allow"` to send them
 *
 * Other options are passed along to `send`.
 *
 * Examples:
 *
 *  The following example illustrates how `res.sendFile()` may
 *  be used as an alternative for the `static()` middleware for
 *  dynamic situations. The code backing `res.sendFile()` is actually
 *  the same code, so HTTP cache support etc is identical.
 *
 *     app.get('/user/:uid/photos/:file', function(req, res){
 *       var uid = req.params.uid
 *         , file = req.params.file;
 *
 *       req.user.mayViewFilesFrom(uid, function(yes){
 *         if (yes) {
 *           res.sendFile('/uploads/' + uid + '/' + file);
 *         } else {
 *           res.send(403, 'Sorry! you cant see that.');
 *         }
 *       });
 *     });
 *
 * @public
 */
res.sendFile = function sendFile(path, options, callback) {
    var done = callback;
    var next = req.next;
    var opts = options || {};
    if (!path) {
        throw new TypeError('path argument is required to res.sendFile');
    }
    // support function as second arg
    if (typeof options === 'function') {
        done = options;
        opts = {};
    }
    if (!opts.root && !isAbsolute(path)) {
        throw new TypeError('path must be absolute or specify root to res.sendFile');
    }
    // create file stream
    var pathname = encodeURI(path);
    var file = send(req, pathname, opts);
    // transfer
    sendfile(res, file, opts, function (err) {
        if (done)
            return done(err);
        if (err && err.code === 'EISDIR')
            return next();
        // next() all but write errors
        if (err && err.code !== 'ECONNABORTED' && err.syscall !== 'write') {
            next(err);
        }
    });
};
// pipe the send file stream
function sendfile(res, file, options, callback) {
    var done = false;
    var streaming;
    // request aborted
    function onaborted() {
        if (done)
            return;
        done = true;
        var err = new Error('Request aborted');
        err.code = 'ECONNABORTED';
        callback(err);
    }
    // directory
    function ondirectory() {
        if (done)
            return;
        done = true;
        var err = new Error('EISDIR, read');
        err.code = 'EISDIR';
        callback(err);
    }
    // errors
    function onerror(err) {
        if (done)
            return;
        done = true;
        callback(err);
    }
    // ended
    function onend() {
        if (done)
            return;
        done = true;
        callback();
    }
    // file
    function onfile() {
        streaming = false;
    }
    // finished
    function onfinish(err) {
        if (err && err.code === 'ECONNRESET')
            return onaborted();
        if (err)
            return onerror(err);
        if (done)
            return;
        setImmediate(function () {
            if (streaming !== false && !done) {
                onaborted();
                return;
            }
            if (done)
                return;
            done = true;
            callback();
        });
    }
    // streaming
    function onstream() {
        streaming = true;
    }
    file.on('directory', ondirectory);
    file.on('end', onend);
    file.on('error', onerror);
    file.on('file', onfile);
    file.on('stream', onstream);
    onFinished(res, onfinish);
    if (options.headers) {
        // set headers on successful transfer
        file.on('headers', function headers(res) {
            var obj = options.headers;
            var keys = Object.keys(obj);
            for (var i = 0; i < keys.length; i++) {
                var k = keys[i];
                res.setHeader(k, obj[k]);
            }
        });
    }
    // pipe
    file.pipe(res);
}
/**
 * Transfer the file at the given `path` as an attachment.
 *
 * Optionally providing an alternate attachment `filename`,
 * and optional callback `callback(err)`. The callback is invoked
 * when the data transfer is complete, or when an error has
 * ocurred. Be sure to check `res.headersSent` if you plan to respond.
 *
 * This method uses `res.sendfile()`.
 *
 * @public
 */
res.download = function download(path, filename, callback) {
    var done = callback;
    var name = filename;
    // support function as second arg
    if (typeof filename === 'function') {
        done = filename;
        name = null;
    }
    // set Content-Disposition when file is sent
    var headers = {
        'Content-Disposition': contentDisposition(name || path)
    };
    // Resolve the full path for sendFile
    var fullPath = resolve(path);
    return this.sendFile(fullPath, { headers: headers }, done);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVzcG9uc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJSZXNwb25zZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUE2QjtBQW9DN0Isa0JBQXlCLEdBQUc7SUFFcEIsSUFBSyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBRTdDLENBQUM7QUFKRCw0QkFJQztBQUNELElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQTtBQUU1Qzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7VUFnTEk7QUFFSCxHQUFHLENBQUMsTUFBTSxHQUFHLFVBQVMsR0FBRztJQUN4QixJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDO0lBQ25CLElBQUksSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7SUFFcEIsSUFBSSxFQUFFLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQztJQUNyQixFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFBQyxPQUFPLEdBQUcsQ0FBQyxPQUFPLENBQUM7SUFDM0IsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUU1QixJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUM7VUFDdEIsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7VUFDakIsS0FBSyxDQUFDO0lBRVQsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUVwQixFQUFFLENBQUMsQ0FBQyxHQUFH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