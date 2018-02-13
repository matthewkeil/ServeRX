"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Observable_1 = require("./../../00-otherServers/rxjs/Observable");
const bodyParser = require("body-parser");
const Headers_1 = require("./headers/Headers");
class Request {
    constructor(config) {
        this.config = config;
        this.headers = new Headers_1.Headers(this.config);
    }
    parse(incoming) {
        let req = {};
        req.Headers = this.headers;
        req.rawHeaders = this.headers.processRaw(incoming);
        req.headers$ = this.headers.getFrom(req.rawHeaders);
        req.headers$.subscribe(headers => req.headers = headers);
        req.body$ = this.getBody(req);
        if (req.body$)
            req.body$.subscribe(chunk => req.body.push(chunk));
        return req;
    }
    getBody(req) {
        // Message must be from an incoming method
        if (req.method === 'POST' || req.method === 'PATCH') {
            req.headers.content.type.forEach(type => {
                if (!req.parser) {
                    if (type.type.includes('application'))
                        type.subtype.includes('json') ?
                            req.parser = bodyParser.json() :
                            parser = bodyParser.raw;
                    if (type.type.includes('text'))
                        parser = bodyParser.text;
                }
            });
            return new Observable_1.Observable(observer => {
                incoming.on('data', (chunk) => {
                    observer.next(chunk);
                });
                req.on('end', () => {
                    observer.complete();
                });
            });
        }
        return null;
    }
    startHandlerTimer(handlerName) {
        /**
         * Start the timer for a request handler function. You must explicitly invoke
         * endHandlerTimer() after invoking this function. Otherwise timing information
         * will be inaccurate.
         * @public
         * @function startHandlerTimer
         * @param    {String}    handlerName The name of the handler.
         * @returns  {undefined}
        */
        // // For nested handlers, we prepend the top level handler func name
        // var name = (this._currentHandler === handlerName
        // 	? handlerName 
        // 	: this._currentHandler + '-' + handlerName);
        // if (!this._timerMap) {
        // 	this._timerMap = {};
        // }
        // this._timerMap[name] = process.hrtime();
        // dtrace._rstfy_probes['handler-start'].fire(function () {
        // 	return ({
        // 			serverName: this.serverName,
        // 			_currentRoute: this._currentRoute, // set in server._run
        // 			name: name,
        // 			_dtraceId: this._dtraceId
        // 	});
        // });
    }
    endHandlerTimer(handlerName) {
        /**
         * Stop the timer for a request handler function.
         * @public
         * @function endHandlerTimer
         * @param    {String}    handlerName The name of the handler.
         * @returns  {undefined}
        */
        // var self = this;
        // // For nested handlers, we prepend the top level handler func name
        // var name = (self._currentHandler === handlerName ?
        // 				handlerName : self._currentHandler + '-' + handlerName);
        // if (!self.timers) {
        // 	self.timers = [];
        // }
        // self._timerMap[name] = process.hrtime(self._timerMap[name]);
        // self.timers.push({
        // 	name: name,
        // 	time: self._timerMap[name]
        // });
        // dtrace._rstfy_probes['handler-done'].fire(function () {
        // 	return ({
        // 				serverName: this.serverName,
        // 				_currentRoute: this._currentRoute, // set in server._run
        // 				name: name,
        // 				_dtraceId: this._dtraceId
        // 		});
    }
}
exports.Request = Request;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVxdWVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIlJlcXVlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx3RUFBcUU7QUFNckUsMENBQTBDO0FBaUIxQywrQ0FBMEU7QUEwQjFFO0lBSUMsWUFBb0IsTUFBd0I7UUFBeEIsV0FBTSxHQUFOLE1BQU0sQ0FBa0I7UUFDM0MsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLGlCQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3pDLENBQUM7SUFFTSxLQUFLLENBQUMsUUFBOEI7UUFFMUMsSUFBSSxHQUFHLEdBQWEsRUFBRSxDQUFDO1FBRXZCLEdBQUcsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUMzQixHQUFHLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ25ELEdBQUcsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3BELEdBQUcsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLE9BQU8sSUFBSSxHQUFHLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxDQUFDO1FBQ3pELEdBQUcsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM5QixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDO1lBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBSyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFFbEUsTUFBTSxDQUFDLEdBQUcsQ0FBQztJQUNaLENBQUM7SUFFTSxPQUFPLENBQUMsR0FBYTtRQUUzQiwwQ0FBMEM7UUFDMUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sS0FBSyxNQUFNLElBQUksR0FBRyxDQUFDLE1BQU0sS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBRXJELEdBQUcsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSTtnQkFDcEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztvQkFDakIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUM7d0JBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDOzRCQUNuRSxHQUFHLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FBQyxJQUFJLEVBQUU7NEJBQzlCLE1BQU0sR0FBRyxVQUFVLENBQUMsR0FBRyxDQUFBO29CQUN4QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQzt3QkFBQyxNQUFNLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQztnQkFDMUQsQ0FBQztZQUNGLENBQUMsQ0FBQyxDQUFDO1lBRUgsTUFBTSxDQUFDLElBQUksdUJBQVUsQ0FBQyxRQUFRO2dCQUM3QixRQUFRLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDLEtBQUs7b0JBQ3pCLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3RCLENBQUMsQ0FBQyxDQUFDO2dCQUNILEdBQUcsQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFO29CQUNiLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDckIsQ0FBQyxDQUFDLENBQUM7WUFDSixDQUFDLENBQUMsQ0FBQztRQUNKLENBQUM7UUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2IsQ0FBQztJQUVNLGlCQUFpQixDQUFDLFdBQVc7UUFDbkM7Ozs7Ozs7O1VBUUU7UUFDRixxRUFBcUU7UUFDckUsbURBQW1EO1FBQ25ELGtCQUFrQjtRQUNsQixnREFBZ0Q7UUFFaEQseUJBQXlCO1FBQ3pCLHdCQUF3QjtRQUN4QixJQUFJO1FBRUosMkNBQTJDO1FBRTNDLDJEQUEyRDtRQUMzRCxhQUFhO1FBQ2Isa0NBQWtDO1FBQ2xDLDhEQUE4RDtRQUM5RCxpQkFBaUI7UUFDakIsK0JBQStCO1FBQy9CLE9BQU87UUFDUCxNQUFNO0lBQ1AsQ0FBQztJQUVNLGVBQWUsQ0FBQyxXQUFXO1FBQ2pDOzs7Ozs7VUFNRTtRQUNGLG1CQUFtQjtRQUVuQixxRUFBcUU7UUFDckUscURBQXFEO1FBQ3JELCtEQUErRDtRQUUvRCxzQkFBc0I7UUFDdEIscUJBQXFCO1FBQ3JCLElBQUk7UUFFSiwrREFBK0Q7UUFDL0QscUJBQXFCO1FBQ3JCLGVBQWU7UUFDZiw4QkFBOEI7UUFDOUIsTUFBTTtRQUVOLDBEQUEwRDtRQUMxRCxhQUFhO1FBQ2IsbUNBQW1DO1FBQ25DLCtEQUErRDtRQUMvRCxrQkFBa0I7UUFDbEIsZ0NBQWdDO1FBQ2hDLFFBQVE7SUFDVCxDQUFDO0NBQ0Q7QUFoSEQsMEJBZ0hDIn0=