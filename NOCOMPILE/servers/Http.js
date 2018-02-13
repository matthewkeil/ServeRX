"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util = require("util");
const http = require("http");
const Rx = require("rxjs");
const ConfigRX_1 = require("../ConfigRX");
const Headers_1 = require("./../messages/headers/Headers");
const Router_1 = require("../routing/Router");
const Request_1 = require("./../messages/Request");
const Response_1 = require("../messages/Response");
const Errors_1 = require("../common/Errors");
class Http extends Rx.Subject {
    constructor(baseConfig) {
        super();
        /**
         * check to see if config is an instantiated ServerConfig object
         * if not it throws the configuration error.  Specifically require()
         * here to ensure it is loaded at time of check.  All other references
         * to the singleton config object can be done through the import statement
         * so it wont need to be passed
         */
        ConfigRX_1.ServerConfig.check(baseConfig) ?
            this.config = new ConfigRX_1.ServerConfig(baseConfig) :
            this.error(new Errors_1.ServerError('invalid base config provided', baseConfig));
        /**
         *
         * build and configure internal dependencies.  Make sure to run Route.ts
         * first.  The root router object sits withing the Route singleton object * so that wherever the Route() API is called from any routing file it
         * always mounts to the root router
         *
         *
         */
        (this.config.router.obj instanceof Router_1.default) ?
            this.router = require('./routing/Route').router = this.config.router.obj :
            this.router = require('./routing/Route').router;
        this.router.configureRouter(this.config);
        /**
         *
         *
         * Patch http.IncomingMessage and http.ServerResponse to add ServeRx
         * functionality and headers to the objects node provides to the handler
         *
         *
         */
        this.headers = new Headers_1.Headers(this.config);
        Request_1.RequestPatcher(http.IncomingMessage, this.config, this.headers, this.router);
        Response_1.ResponsePatcher(http.ServerResponse, this.config, this.headers);
        /**
         *
         *
         * Patch http.creatServer to add ServerRx functionality and
         *
         *
         *
         */
        this._server = http.createServer(this.handle);
        this._listeners__ = this._listeners$().subscribe(() => { }, err => this.error(err), () => this.error(new Error("Server listener completed unexpectedly")));
        /**
         *
         *
         * Configure the server object
         *
         *
         *
         */
        if (this.config.maxHeadersCount) {
            this._server.maxHeadersCount = this.config.maxHeadersCount;
        }
        this.config.timeout.ms ?
            this._server.timeout = this.config.timeout.ms :
            this.config.timeout.ms = this._server.timeout;
        if (util.isFunction(this.config.timeout.cb)) {
            this._server.setTimeout(this.config.timeout.ms, this.config.timeout.cb);
        }
        /**
         * Call listen() on the server and pass in relevant config options.
         * Once server is listening subscribe to the event listeners.  Listeners
         * are only subscribed to once server is actively listening to prevent
         * memory leaks for attempts that do not fully connect as there will be
         * no way to unsubscribe if server doesn't get to "listening" event
         *
         *
         *  interface net.ListenOptions = {
         * 		port?: number;
       *			host?: string;
       *			backlog?: number;
       *			path?: string;
         *			exclusive?: boolean;
         *		}
         */
        let listenOptions = {};
        if (this.config.port)
            Object.assign(listenOptions, { port: this.config.port });
        if (this.config.host)
            Object.assign(listenOptions, { host: this.config.host });
        if (this.config.backlog)
            Object.assign(listenOptions, { backlog: this.config.backlog });
        if (this.config.path)
            Object.assign(listenOptions, { path: this.config.path });
        if (this.config.exclusive)
            Object.assign(listenOptions, { exclusive: this.config.exclusive });
        this._server.listen(listenOptions, () => {
            this.config.onListening ?
                null :
                (this.config.onListening === true || !util.isFunction(this.config.onListening)) ?
                    this._defaultListening() :
                    this.config.onListening(this.config, this._server.address());
        });
    }
    _listeners$() {
        let self = this;
        let listeners = [
            Rx.Observable.fromEvent(self._server, 'error', (err) => self.error(err)),
            Rx.Observable.fromEvent(self._server, 'close', () => {
                !self.config.onClosing ?
                    null :
                    self.config.onClosing === true ?
                        console.log(`Closing server on ${self.config.host}:${self.config.port}...`) :
                        self.config.onClosing(self.config, self._server.address());
                self.complete();
            })
        ];
        if (self.config.handleCheckContinue)
            listeners.push(Rx.Observable.fromEvent(self._server, 'checkContinue', (req, res) => {
                self.config.handleCheckContinue(req, res, () => self._server.emit('request', req, res));
            }));
        if (self.config.handleClientError)
            listeners.push(Rx.Observable.fromEvent(self._server, 'clientError', (err, socket) => {
                self.config.handleClientError(err, socket);
            }));
        // if(this.config.handleUpgrade) listeners.push(
        // 	Rx.Observable.fromEvent(self._server, 'upgrade',
        // 		(req: http.IncomingMessage, socket: net.Socket, head: Buffer) => {
        // 	}))
        return Rx.Observable.merge(listeners);
    }
    _defaultListening() {
        let address = this._server.address();
        console.log(`Listening on ${address.address}:${address.port}...`);
    }
    _close() {
        if (this._server && this._server.listening)
            this._server.close();
        if (this._listeners__ && !this._listeners__.closed) {
            this._listeners__.unsubscribe();
        }
    }
    error(err) {
        this._close();
        super.error(err);
    }
    complete() {
        this._close();
        super.complete();
    }
    handle(req, res) {
        /**
         *
         *  run auto headers and fetch handler
         *  run pre headers & middleware
         *  run middleware and handler
         *
         *
         * */
    }
}
exports.Http = Http;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSHR0cC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkh0dHAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFHQSw2QkFBNEI7QUFFNUIsNkJBQTRCO0FBRTVCLDJCQUEwQjtBQUcxQiwwQ0FBMEQ7QUFFMUQsMkRBQXdEO0FBSXhELDhDQUF1QztBQUd2QyxtREFBK0Q7QUFDL0QsbURBQWdFO0FBRWhFLDZDQUErQztBQWMvQyxVQUFrQixTQUFRLEVBQUUsQ0FBQyxPQUFZO0lBV3hDLFlBQVksVUFBMEI7UUFFckMsS0FBSyxFQUFFLENBQUM7UUFFUjs7Ozs7O1dBTUc7UUFDSCx1QkFBWSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUM7WUFDN0IsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLHVCQUFZLENBQUMsVUFBVSxDQUFDO1lBQzFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxvQkFBVyxDQUFDLDhCQUE4QixFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFFekU7Ozs7Ozs7V0FPRztRQUNILENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxZQUFZLGdCQUFNLENBQUM7WUFDekMsSUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRztZQUN4RSxJQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLE1BQU0sQ0FBQztRQUVqRCxJQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFekM7Ozs7Ozs7V0FPRztRQUNILElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxpQkFBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUV2Qyx3QkFBYyxDQUNQLElBQUssQ0FBQyxlQUFlLEVBQzNCLElBQUksQ0FBQyxNQUFNLEVBQ1gsSUFBSSxDQUFDLE9BQU8sRUFDWixJQUFJLENBQUMsTUFBTSxDQUNYLENBQUE7UUFFRCwwQkFBZSxDQUNSLElBQUssQ0FBQyxjQUFjLEVBQzFCLElBQUksQ0FBQyxNQUFNLEVBQ1gsSUFBSSxDQUFDLE9BQU8sQ0FDWixDQUFBO1FBRUQ7Ozs7Ozs7V0FPRztRQUNILElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDOUMsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsU0FBUyxDQUMvQyxRQUFPLENBQUMsRUFDUixHQUFHLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFDdEIsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxDQUFDLHdDQUF3QyxDQUFDLENBQUMsQ0FDckUsQ0FBQztRQUVGOzs7Ozs7O1dBT0c7UUFDSCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7WUFDakMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUM7UUFDNUQsQ0FBQztRQUVELElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEVBQUU7WUFDckIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUM3QyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUM7UUFFL0MsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0MsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFhLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEVBQUcsQ0FBQyxDQUFDO1FBQ3JGLENBQUM7UUFFRDs7Ozs7Ozs7Ozs7Ozs7O1dBZUc7UUFDSCxJQUFJLGFBQWEsR0FBRyxFQUFFLENBQUM7UUFDdkIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFBQyxNQUFNLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxFQUFDLElBQUksRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBQyxDQUFDLENBQUM7UUFDN0UsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFBQyxNQUFNLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxFQUFDLElBQUksRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBQyxDQUFDLENBQUM7UUFDN0UsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7WUFBQyxNQUFNLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxFQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBQyxDQUFDLENBQUM7UUFDdEYsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFBQyxNQUFNLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxFQUFDLElBQUksRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBQyxDQUFDLENBQUM7UUFDN0UsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUM7WUFBQyxNQUFNLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxFQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBQyxDQUFDLENBQUM7UUFFNUYsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFO1lBQ2xDLElBQUksQ0FBQyxNQUFNLENBQUMs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