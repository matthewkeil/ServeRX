import * as http from 'http';


// import { Subscription } from 'rxjs/Subscription';
// import { Observable } from 'rxjs/Observable';
// import { merge } from 'rxjs/operator/merge';
// import { FromEventObservable } from 'rxjs/observable/FromEventObservable';
// import { Subject } from 'rxjs/Subject';


import { ServerConfig, HttpServerConfig } from '../ConfigRX';
import { Request, RequestI } from './Request';
// import { Helpers } from './HelpeR';
import { Header, Headers, RawHeaders } from './headers/Headers';



// private charsetRegExp = /;\s*charset\s*=/;



export interface Response {
	id: string;
	raw: http.ServerResponse;
	date: Date;
	status: {
		code: number;
		message: string;
	};
	headers: { 
		raw: RawHeaders,
		written: RawHeaders
	};
	body?: string | Buffer;
}

export function Response(req) {

		(<any>http).ServerResponse.bind(this, req);

}
util.inherits(Response, http.ServerResponse)

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

	res.format = function(obj){
		var req = this.req;
		var next = req.next;
		
		var fn = obj.default;
		if (fn) delete obj.default;
		var keys = Object.keys(obj);
		
		var key = keys.length > 0
			? req.accepts(keys)
			: false;
		
		this.vary("Accept");
		
		if (key) {
			this.set('Content-Type', normalizeType(key).value);
			obj[key](req, this, next);
		} else if (fn) {
			fn();
		} else {
			var err = new Error('Not Acceptable');
			err.status = err.statusCode = 406;
			err.types = normalizeTypes(keys).map(function(o){ return o.value });
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
    } else if (type.indexOf(';') !== '-1') {
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





/**
 * Redirect to the given `url` with optional response `status`
 * defaulting to 302.
 *
 * The resulting `url` is determined by `res.location()`, so
 * it will play nicely with mounted apps, relative paths,
 * `"back"` etc.
 *
 * Examples:
 *
 *    res.redirect('/foo/bar');
 *    res.redirect('http://example.com');
 *    res.redirect(301, 'http://example.com');
 *    res.redirect('../login'); // /blog/post/1 -> /blog/login
 *
 * @public
*/
	public redirect(url) {
		var address = url;
		var body;
		var status = 302;

		// Set location header
		address = this.location(address).getHeader('Location');

		// Support text/{plain,html} by default
		this.format({
			text: function(){
				body = statuses[status] + '. Redirecting to ' + address
			},

			html: function(){
				var u = escapeHtml(address);
				body = '<p>' + statuses[status] + '. Redirecting to <a href="' + u + '">' + u + '</a></p>'
			},

			default: function(){
				body = '';
			}
		});

		// Respond
		this.statusCode = status;
		this.setHeader('Content-Length', Buffer.byteLength(body));

		if (this.req.method === 'HEAD') {
			this.end();
		} else {
			this.end(body);
		}
	};

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
    if (done) return done(err);
    if (err && err.code === 'EISDIR') return next();

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
    if (done) return;
    done = true;

    var err = new Error('Request aborted');
    err.code = 'ECONNABORTED';
    callback(err);
  }

  // directory
  function ondirectory() {
    if (done) return;
    done = true;

    var err = new Error('EISDIR, read');
    err.code = 'EISDIR';
    callback(err);
  }

  // errors
  function onerror(err) {
    if (done) return;
    done = true;
    callback(err);
  }

  // ended
  function onend() {
    if (done) return;
    done = true;
    callback();
  }

  // file
  function onfile() {
    streaming = false;
  }

  // finished
  function onfinish(err) {
    if (err && err.code === 'ECONNRESET') return onaborted();
    if (err) return onerror(err);
    if (done) return;

    setImmediate(function () {
      if (streaming !== false && !done) {
        onaborted();
        return;
      }

      if (done) return;
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