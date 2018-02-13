"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const url = require("url");
const Rx = require("rxjs");
const MatchString_1 = require("./../common/MatchString");
const Headers_1 = require("./headers/Headers");
class User {
    authorization(req) {
        return new Rx.Observable(obs => {
            if (!req.headers$.authorization && !req.headers$.cookie)
                obs.error(new Error('Authorization required'));
            obs.next(req.headers$.authorization);
            obs.complete();
        });
    }
}
exports.User = User;
function RequestPatcher(IncomingMessage, config, headers, router) {
    IncomingMessage.prototype.parse = function parse() {
        this.auth = {};
        this.method = this.method.toUpperCase() || 'GET';
        this._url = url.parse(this.url, true);
        this.path = MatchString_1.Ms.pathToMs(this._url.pathname);
        this.params = MatchString_1.Ms.extractParams(this.path);
        this.query = this._url.query;
        let queryKeys = Object.keys(this.query);
        if (queryKeys.length > 0)
            queryKeys.forEach(key => this.params.hasOwnProperty(key) ?
                this.params[key] = [].concat(this.params[key], this.query[key]) :
                this.params[key] = this.query[key]);
        this.hash = this._url.hash.startsWith('#') ?
            this._url.hash.substr(1) :
            this._url.hash;
        return;
    };
    IncomingMessage.prototype.getHeaders = function getHeaders(req, res) {
        return Headers_1.Headers.parseIncoming(req, res);
    };
    IncomingMessage.prototype.getHandler = function getHandler() {
        return this._router.returnRouteHandler(this.path);
    };
}
exports.RequestPatcher = RequestPatcher;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVxdWVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIlJlcXVlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFRQSwyQkFBMkI7QUFFM0IsMkJBQTJCO0FBSzNCLHlEQUEwRDtBQUcxRCwrQ0FBa0c7QUFLbEc7SUFDUSxhQUFhLENBQUMsR0FBWTtRQUMvQixNQUFNLENBQUMsSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFnQixHQUFHO1lBQzFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxhQUFhLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztnQkFBQyxHQUFHLENBQUMsS0FBSyxDQUNqRSxJQUFJLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUE7WUFDckMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFBO1lBQ3BDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQTtRQUVkLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQztDQUNGO0FBVkQsb0JBVUM7QUEwQ0Qsd0JBQStCLGVBQXlCLEVBQUUsTUFBd0IsRUFBRSxPQUFnQixFQUFFLE1BQWtCO0lBRXZILGVBQWUsQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHO1FBRXZCLElBQUssQ0FBQyxJQUFJLEdBQWtCLEVBQUUsQ0FBQztRQUUvQixJQUFLLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLElBQUksS0FBSyxDQUFDO1FBQ2xELElBQUssQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3ZDLElBQUssQ0FBQyxJQUFJLEdBQUcsZ0JBQUUsQ0FBQyxRQUFRLENBQVcsSUFBSSxDQUFDLElBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN4RCxJQUFLLENBQUMsTUFBTSxHQUFHLGdCQUFFLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMzQyxJQUFLLENBQUMsS0FBSyxHQUFhLElBQUksQ0FBQyxJQUFLLENBQUMsS0FBSyxDQUFDO1FBRW5ELElBQUksU0FBUyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3hDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1lBQ3hCLFNBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQztnQkFDdkQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDL0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFFNUIsSUFBSyxDQUFDLElBQUksR0FBYSxJQUFJLENBQUMsSUFBSyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDO1lBQy9ELElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDeEIsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7UUFFaEIsTUFBTSxDQUFBO0lBQ1AsQ0FBQyxDQUFBO0lBRUQsZUFBZSxDQUFDLFNBQVMsQ0FBQyxVQUFVLEdBQUcsb0JBQW9CLEdBQVksRUFBRSxHQUFhO1FBQ3JGLE1BQU0sQ0FBQyxpQkFBTyxDQUFDLGFBQWEsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUE7SUFDdkMsQ0FBQyxDQUFBO0lBRUQsZUFBZSxDQUFDLFNBQVMsQ0FBQyxVQUFVLEdBQUc7UUFDdEMsTUFBTSxDQUFXLElBQUssQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQzdELENBQUMsQ0FBQTtBQUdGLENBQUM7QUFsQ0Qsd0NBa0NDIn0=