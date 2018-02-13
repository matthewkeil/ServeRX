"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Subject_1 = require("./../../lib/rxjs/Subject");
const MatchString_1 = require("./MatchString");
class RouteR extends Subject_1.Subject {
    constructor(_config) {
        super();
        this._config = _config;
        this._parseRoutes = this._parseRoutesFunctionFactory(_config);
        this._buildRoutesObject(this._config);
    }
    _parseRoutesFunctionFactory(config) {
        let ALLOWED_METHODS = [];
        const VALID_METHODS = [
            'GET',
            'PUT',
            'POST',
            'PATCH',
            'DELETE',
            'HEAD',
            'CONNECT',
            'TRACE',
            'OPTIONS'
        ];
        let ALLOWED_OPTIONS = [];
        const VALID_OPTIONS = [
            'protected',
            'internal'
        ];
        if (config.allowedMethods) {
            for (let valid of VALID_METHODS) {
                config.allowedMethods.forEach(allowed => {
                    if (allowed === valid)
                        ALLOWED_METHODS.push(valid);
                });
            }
        }
        else
            ALLOWED_METHODS = VALID_METHODS;
        if (config.allowedRouteOptions) {
            for (let valid of VALID_OPTIONS) {
                config.allowedRouteOptions.forEach(allowed => {
                    if (allowed === valid)
                        ALLOWED_OPTIONS.push(valid);
                });
            }
        }
        else
            ALLOWED_OPTIONS = VALID_OPTIONS;
        return function _parseRoutes(...args) {
            const METHODS = ALLOWED_METHODS;
            const OPTIONS = ALLOWED_OPTIONS;
            let matchString = {};
            let methods = [];
            let options = [];
            let stack = [];
            let nested = {};
            for (let arg of args) {
                if (typeof arg == 'string') {
                    let found = false;
                    for (let method of METHODS) {
                        if (arg.toUpperCase() === method) {
                            methods.push(arg);
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        for (let option of OPTIONS) {
                            if (arg.toLowerCase() === option) {
                                options.push(arg);
                                break;
                            }
                            ;
                        }
                    }
                    if (!found)
                        MatchString_1.MSRegEx.test(arg)
                            ? matchString = MatchString_1.extractMS(arg)
                            : console.error(`${arg} is not an allowed Method or Option nor a valid MatchString`);
                }
                if (Array.isArray(arg)) {
                    nested = _parseRoutes(...arg);
                }
                if ((typeof arg) === 'function') {
                    if (((typeof arg.arguments[0].next) === 'function')
                        && ((typeof arg.arguments[0].res.id) === 'string')) {
                        stack.push(arg);
                    }
                    else
                        console.error(`${arg} is not an observable route`);
                }
                else
                    console.error(`${arg} is of unsupported type ${typeof arg}.`);
            }
            return { matchString, methods, options, stack, nested };
        };
    }
    _buildRoutesObject(config) {
        const index = config.routes || require('./routes/index.ts').index;
        Array.isArray(index)
            ? this.routes = this._parseRoutes(index)
            : console.error(`Route location not defined in config and we didn't find an array named "index" at routes/index.ts `);
    }
    handle(req, res) {
    }
}
exports.RouteR = RouteR;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUm91dGVSLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiUm91dGVSLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0RBQW1EO0FBSW5ELCtDQUFnRTtBQU9oRSxZQUFvQixTQUFRLGlCQUFvQjtJQUsvQyxZQUFvQixPQUFxQjtRQUN4QyxLQUFLLEVBQUUsQ0FBQztRQURXLFlBQU8sR0FBUCxPQUFPLENBQWM7UUFFeEMsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsMkJBQTJCLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDOUQsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBRU0sMkJBQTJCLENBQUMsTUFBb0I7UUFFdkQsSUFBSSxlQUFlLEdBQWEsRUFBRSxDQUFDO1FBQ25DLE1BQU0sYUFBYSxHQUFhO1lBQy9CLEtBQUs7WUFDTCxLQUFLO1lBQ0wsTUFBTTtZQUNOLE9BQU87WUFDUCxRQUFRO1lBQ1IsTUFBTTtZQUNOLFNBQVM7WUFDVCxPQUFPO1lBQ1AsU0FBUztTQUNULENBQUM7UUFFRixJQUFJLGVBQWUsR0FBbUIsRUFBRSxDQUFDO1FBQ3pDLE1BQU0sYUFBYSxHQUFtQjtZQUNyQyxXQUFXO1lBQ1gsVUFBVTtTQUNWLENBQUM7UUFFRixFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztZQUMzQixHQUFHLENBQUMsQ0FBQyxJQUFJLEtBQUssSUFBSSxhQUFhLENBQUMsQ0FBQyxDQUFDO2dCQUNqQyxNQUFNLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxPQUFPO29CQUNwQyxFQUFFLENBQUMsQ0FBQyxPQUFPLEtBQUssS0FBSyxDQUFDO3dCQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3BELENBQUMsQ0FBQyxDQUFDO1lBQ0osQ0FBQztRQUNGLENBQUM7UUFBQyxJQUFJO1lBQUMsZUFBZSxHQUFHLGFBQWEs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