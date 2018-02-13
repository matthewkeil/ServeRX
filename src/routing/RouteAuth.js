"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
const _ = require("lodash");
const common_1 = require("../common");
class RouteAuth {
    static empty() {
        return new RouteAuth();
    }
    static create(here, nested) {
        return new RouteAuth(here || true, nested || true);
    }
    static from(arg) {
        let auth;
        try {
            auth = RouteAuth.empty().merge(arg);
        }
        catch (err) {
            return err;
        }
        return auth;
    }
    constructor(here, nested, from) {
        Object.defineProperties(this, {
            created: {
                value: Date.now(),
                configurable: false,
                enumerable: true,
                writable: false
            },
            here: {
                value: here,
                configurable: false,
                enumerable: true,
                set: (...args) => {
                    throw new common_1.AuthError('cannot manually set an auth', args);
                }
            },
            nested: {
                value: nested,
                configurable: false,
                enumerable: true,
                set: (...args) => {
                    throw new common_1.AuthError('cannot manually set an auth', args);
                }
            },
            from: {
                value: this._validateFrom(from),
                configurable: false,
                enumerable: true,
                writable: false
            }
        });
    }
    _validateFrom(from) {
        if (!from)
            return undefined;
        let flat = _.flattenDeep([from]);
        flat.forEach(auth => {
            if (!(auth instanceof RouteAuth))
                throw new common_1.AuthError('from contains an invalid RoutAuth', auth);
        });
        return from;
    }
    merge(arg) {
        let source = util_1.isArray(arg) ? arg : [arg];
        if (!arg || source.length === 0)
            return this;
        let here = false;
        let nested = false;
        let from = [this];
        source.forEach(auth => {
            if (!(auth instanceof RouteAuth))
                throw new common_1.AuthError('can only merge a valid Auth', auth);
            if (auth.here)
                here = auth.here;
            if (auth.nested)
                nested = auth.nested;
            from.push(auth);
        });
        return new RouteAuth(here, nested, from);
    }
}
exports.RouteAuth = RouteAuth;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUm91dGVBdXRoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiUm91dGVBdXRoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsK0JBQStCO0FBQy9CLDRCQUE0QjtBQUc1QixzQ0FBc0M7QUFJdEM7SUFFUyxNQUFNLENBQUMsS0FBSztRQUNuQixNQUFNLENBQUMsSUFBSSxTQUFTLEVBQUUsQ0FBQztJQUN4QixDQUFDO0lBQ0QsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFjLEVBQUUsTUFBZ0I7UUFDN0MsTUFBTSxDQUFDLElBQUksU0FBUyxDQUFDLElBQUksSUFBSSxJQUFJLEVBQUUsTUFBTSxJQUFJLElBQUksQ0FBQyxDQUFDO0lBQ3BELENBQUM7SUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQVE7UUFFbkIsSUFBSSxJQUFJLENBQUM7UUFDVCxJQUFJLENBQUM7WUFDSixJQUFJLEdBQUcsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNyQyxDQUFDO1FBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUE7UUFBQyxDQUFDO1FBRTVCLE1BQU0sQ0FBWSxJQUFJLENBQUM7SUFDeEIsQ0FBQztJQUVELFlBQ0MsSUFBYyxFQUNkLE1BQWdCLEVBQ2hCLElBQWlCO1FBRWpCLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUU7WUFDN0IsT0FBTyxFQUFFO2dCQUNSLEtBQUssRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFO2dCQUNqQixZQUFZLEVBQUUsS0FBSztnQkFDbkIsVUFBVSxFQUFFLElBQUk7Z0JBQ2hCLFFBQVEsRUFBRSxLQUFLO2FBQ2Y7WUFDRCxJQUFJLEVBQUU7Z0JBQ0wsS0FBSyxFQUFFLElBQUk7Z0JBQ1gsWUFBWSxFQUFFLEtBQUs7Z0JBQ25CLFVBQVUsRUFBRSxJQUFJO2dCQUNoQixHQUFHLEVBQUUsQ0FBQyxHQUFH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