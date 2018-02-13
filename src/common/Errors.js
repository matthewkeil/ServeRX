"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const routing_1 = require("../routing");
const _1 = require("./");
const util_1 = require("util");
const Handler_1 = require("../routing/Handler");
class ServeRxError extends Error {
    constructor(error) {
        super(error.message);
        this.error = [];
        this.path = [];
        this.auth = [];
        this._stack = [];
        this.handler = [];
        this.other = [];
        Object.keys(error).forEach(key => this[key] = [error[key]]);
        if (error.other)
            error.other.forEach(item => {
                switch (typeof item) {
                    case 'boolean':
                        this.hasOwnProperty('fatal')
                            ? this.other = (this.other || []).concat(item)
                            : this.fatal = item;
                        break;
                    case 'number':
                        this.code
                            ? this.other = (this.other || []).concat(item)
                            : this.code = item;
                        break;
                    default:
                        if (item instanceof Error)
                            this.error = (this.error || []).concat(item);
                        if (item instanceof _1.Path)
                            this.path = (this.path || []).concat(item);
                        if (item instanceof Handler_1.Handler)
                            this.handler = (this.handler || []).concat(item);
                        if (item instanceof routing_1.Stack)
                            this._stack = (this._stack || []).concat(item);
                        else
                            this.other = (this.other || []).concat(item);
                }
            });
    }
}
class ApiError extends ServeRxError {
    constructor(code, message = 'ApiError - Failing Safely', ...args) {
        super({
            message,
            code,
            auth: [],
            fatal: false,
            error: [],
            path: [],
            _stack: [],
            handler: [],
            other: [...args]
        });
        this.code = code;
        this.message = message;
    }
}
exports.ApiError = ApiError;
class ServerError extends ServeRxError {
    constructor(message, error = new Error('fatal error was not passed'), ...args) {
        super({
            message,
            auth: [],
            fatal: true,
            code: -1,
            error: [...util_1.isArray(error) ? error : [error]],
            path: [],
            _stack: [],
            handler: [],
            other: [...args]
        });
    }
}
exports.ServerError = ServerError;
class AuthError extends ServeRxError {
    constructor(message, auth, ...args) {
        super({
            message,
            auth: [...util_1.isArray(auth) ? auth : [auth]],
            fatal: false,
            code: -1,
            error: [],
            path: [],
            _stack: [],
            handler: [],
            other: [...args]
        });
    }
}
exports.AuthError = AuthError;
class PathError extends ServeRxError {
    constructor(message, path, ...args) {
        super({
            message,
            auth: [],
            fatal: true,
            code: -1,
            error: [],
            path: [...util_1.isArray(path) ? path : [path]],
            _stack: [],
            handler: [],
            other: [...args]
        });
    }
}
exports.PathError = PathError;
class StackError extends ServeRxError {
    constructor(message, stack, ...args) {
        super({
            message,
            auth: [],
            fatal: true,
            code: -1,
            error: [],
            path: [],
            _stack: [...util_1.isArray(stack) ? stack : [stack]],
            handler: [],
            other: [...args]
        });
    }
}
exports.StackError = StackError;
class HandlerError extends ServeRxError {
    constructor(message, handler, ...args) {
        super({
            message,
            auth: [],
            fatal: true,
            code: -1,
            error: [],
            path: [],
            _stack: [],
            handler: [...util_1.isArray(handler) ? handler : [handler]],
            other: [...args]
        });
    }
}
exports.HandlerError = HandlerError;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRXJyb3JzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiRXJyb3JzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBR0Esd0NBS29CO0FBRXBCLHlCQUEwQjtBQUMxQiwrQkFBK0I7QUFDL0IsZ0RBQTZDO0FBYzdDLGtCQUFtQixTQUFRLEtBQUs7SUFjL0IsWUFBWSxLQUFvQjtRQUMvQixLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBWHRCLFVBQUssR0FBUSxFQUFFLENBQUM7UUFDaEIsU0FBSSxHQUFRLEVBQUUsQ0FBQztRQUNmLFNBQUksR0FBUSxFQUFFLENBQUM7UUFDZixXQUFNLEdBQVEsRUFBRSxDQUFDO1FBQ2pCLFlBQU8sR0FBUSxFQUFFLENBQUM7UUFDbEIsVUFBSyxHQUFRLEVBQUUsQ0FBQztRQVFmLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsSUFBVSxJQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBTyxLQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRTFFLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7WUFBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJO2dCQUV4QyxNQUFNLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQ3JCLEtBQUssU0FBUzt3QkFDYixJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQzs4QkFDekIsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQzs4QkFDNUMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7d0JBQ3JCLEtBQUssQ0FBQztvQkFDUCxLQUFLLFFBQVE7d0JBQ1osSUFBSSxDQUFDLElBQUk7OEJBQ04sSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLElB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