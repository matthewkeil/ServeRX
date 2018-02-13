"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
const common_1 = require("../common");
const _1 = require("./");
class Router {
    constructor(...args) {
        try {
            this.root = _1.Handler.create(args);
            if (!(this.root instanceof _1.Handler))
                throw util_1.isError(this.root) ? this.root : new common_1.ServerError('unknown error building root handler');
        }
        catch (err) {
            throw err;
        }
    }
    configure(config) {
        let path;
        this._config = config;
        /**
         * mount location order of precedence is
         * 1 - submitted config file mountAt field
         * 2 - if Router was passed on config.router.obj, use existing path
         * 3 - root
         */
        (path = MS.isValid(this._config.router.mountAt))
            ? (this.path = path)
            : this.path ? null : (this.path = []);
        /**
         * auth persists from both passed config.router.obj and config.router.auth
         * and will flag any differences/discrepencies when applying both. middleware
         * will compose/append any additional middleware passed with the config file
         */
        if (!(config.router.obj instanceof Router)) {
            this.auth = this.checkAuth(config);
            this.middleware = this.buildStack(config);
        }
        this.buildRoutes(config);
        return this;
    }
    find(input) {
        let self = this;
        let resolve = new Rx.Observable(observer => {
            let ms = MS.isValid(input);
            if (ms) {
                if (!(util.isObject(ms[0]) && ms[0].hasOwnProperty("~"))) {
                    observer.error(new RouteError("must resolve route from the root ~/", input));
                }
                ms.shift(); // pulls root element off the front of the array
                let route$ = self._routes.resolve(ms);
                let subscription = route$.subscribe(observer);
                resolve.cancel = () => {
                    if (route$)
                        route$.cancel();
                    if (subscription && !subscription.closed)
                        subscription.unsubscribe();
                    observer.complete();
                };
            }
            else
                observer.error(new RouteError("path not valid", input));
        });
        return resolve;
    }
}
exports.Router = Router;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUm91dGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiUm91dGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsK0JBQStCO0FBRy9CLHNDQUF3QztBQUV4Qyx5QkFHWTtBQU9aO0lBR0MsWUFBWSxHQUFHLElBQVc7UUFDekIsSUFBSSxDQUFDO1lBQ0UsSUFBSyxDQUFDLElBQUksR0FBRyxVQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3hDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxZQUFZLFVBQU8sQ0FBQyxDQUFDO2dCQUNuQyxNQUFNLGNBQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLG9CQUFXLENBQUMscUNBQXFDLENBQUMsQ0FBQztRQUNoRyxDQUFDO1FBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUFDLE1BQU0sR0FBRyxDQUFBO1FBQUMsQ0FBQztJQUM1QixDQUFDO0lBRU0sU0FBUyxDQUFDLE1BQW9CO1FBQ3BDLElBQUksSUFBd0IsQ0FBQztRQUM3QixJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUN0Qjs7Ozs7V0FLRztRQUNILENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7Y0FDN0MsQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztjQUNsQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDdkM7Ozs7V0FJRztRQUNILEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsWUFBWSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDNUMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ25DLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMzQyxDQUFDO1FBRUQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUV6QixNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2IsQ0FBQztJQUVPLElBQUksQ0FBQyxLQUFVO1FBQ3RCLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQztRQUVoQixJQUFJLE9BQU8sR0FBb0IsSUFBSSxFQUFFLENBQUMsVUFBVSxDQUMvQyxRQUFRO1lBQ1AsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUUzQixFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUNSLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzFELFFBQVEsQ0FBQyxLQUFLLENBQ2IsSUFBSSxVQUFVLENBQ2IscUNBQXFDLEVBQ3JDLEtBQUssQ0FDTCxDQUNELENBQUM7Z0JBQ0gsQ0FBQztnQkFFRCxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxnREFBZ0Q7Z0JBRTVELElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUN0QyxJQUFJLFlBQVksR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUU5QyxPQUFPLENBQUMsTUFBTSxHQUFHO29CQUNoQixFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUM7d0JBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO29CQUM1QixFQUFFLENBQUMsQ0FBQyxZQUFZLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDO3dCQUN4QyxZQUFZLENBQUMsV0FBVyxFQUFFLENBQUM7b0JBQzVCLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDckIsQ0FBQyxDQUFDO1lBQ0gsQ0FBQztZQUFDLElBQUk7Z0JBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLFVBQVUsQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ2hFLENBQUMsQ0FDRCxDQUFDO1FBRUYsTUFBTSxDQUFDLE9BQU8sQ0FBQztJQUNoQixDQUFDO0NBQ0Q7QUF4RUQsd0JBd0VDIn0=