"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Rx = require("rxjs");
class Cors {
    static _runPreFlight(req, res) {
        return new Rx.Observable(observer => {
            observer.complete();
        });
    }
}
Cors.accessControlExposeHeaders = (config) => {
    return {
        set: (...headerNames) => {
            // figure out how to set headers
            return;
        }
    };
};
/** ===== Access-Control-Allow-Origin =====
 *
 *
 *
 */
/** ===== Access-Control-Allow-Credentials =====
 *
 *
 *
 */
/** ===== Access-Control-Max-Age =====
 *
 *
 *
 */
/** ===== Origin =====
 *
 *
 *
 */
Cors._validOrigin = /^http(s?):\/\/([\w\.]*)\.(\w*\.\w*):?(\d{1,5})?\/?([\w\/]*)?/;
Cors.origin = (config) => {
    return {
        priority: 'pre',
        get: (args, req, res) => {
            return new Rx.Observable(observer => {
                let blacklist = config.headers.incoming.origin.blacklist;
                let allowed = config.headers.incoming.origin.allowed;
                let originIsValid = false;
                let [original, secure, subDomain, domain, port, path] = Cors._validOrigin.exec(args[0]);
                if (blacklist.hasOwnProperty(domain)) {
                    let subs = blacklist[domain].subDomains;
                    switch (typeof subs) {
                        case 'boolean':
                            subs ?
                                observer.error(new Error('Sub-Domains not authorized')) :
                                originIsValid = true;
                            break;
                        case 'string':
                            subs === subDomain ?
                                observer.error(new Error('Sub-Domain not authorized')) :
                                originIsValid = true;
                            break;
                        default:
                            Array.isArray(subs) ?
                                subs.forEach(sub => sub === subDomain ?
                                    observer.error(new Error('Sub-Domain not authorized')) :
                                    originIsValid = true) :
                                observer.error(new Error('Configuration Error'));
                            break;
                    }
                }
                else if (allowed.hasOwnProperty('*')) {
                    originIsValid = true;
                }
                else if (allowed.hasOwnProperty(domain)) {
                    let subs = allowed[domain].subDomains;
                    switch (typeof subs) {
                        case 'boolean':
                            subs ?
                                originIsValid = true :
                                observer.error(new Error('Sub-Domains not authorized'));
                            break;
                        case 'string':
                            subs === subDomain ?
                                originIsValid = true :
                                observer.error(new Error('Sub-Domain not authorized'));
                            break;
                        default:
                            Array.isArray(subs) ?
                                subs.forEach(sub => sub === subDomain ?
                                    originIsValid = true :
                                    observer.error(new Error('SubDomain not authorized'))) :
                                observer.error(new Error('Configuration Error'));
                            break;
                    }
                }
                else {
                    observer.error(new Error('Domain not authorized'));
                }
                if (!originIsValid)
                    throw new Error('Origin header, !originIsValid');
                let isPreFlight = false;
                let needsPreFlight = false;
                switch (req.method) {
                    case 'GET':
                    case 'POST':
                        break;
                    case 'OPTIONS':
                        if (req.headers$.hasOwnProperty('accessControlRequestMethod')) {
                            isPreFlight = true;
                            Cors._runPreFlight(req, res).subscribe(observer);
                        }
                        break;
                    case 'PATCH':
                    case 'PUT':
                    case 'DELETE':
                        needsPreFlight = true;
                        break;
                    default:
                        observer.error(new Error(`${req.method} not CORS supported`));
                        break;
                }
                if (!isPreFlight) {
                    // Set Access-Control-Expose-Headers ???
                    // Set Access-Control-Allow-Origin
                    // Set Access-Control-Allow-Credentials
                    observer.complete();
                }
            });
        },
        set: null
    };
};
exports.Cors = Cors;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkNvcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSwyQkFBMEI7QUFVMUI7SUE4RVMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxHQUFZLEVBQUUsR0FBYTtRQUN2RCxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDLFFBQVE7WUFDaEMsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFBO1FBQ3BCLENBQUMsQ0FBQyxDQUFBO0lBQ0gsQ0FBQzs7QUF4Q00sK0JBQTBCLEdBQ2hDLENBQUMsTUFBd0I7SUFFekIsTUFBTSxDQUFDO1FBQ04sR0FBRyxFQUFFLENBQUMsR0FBRyxXQUFxQjtZQUM3QixnQ0FBZ0M7WUFDaEMsTUFBTSxDQUFBO1FBQ1AsQ0FBQztLQUNELENBQUE7QUFDRixDQUFDLENBQUE7QUFFRjs7OztHQUlHO0FBRUg7Ozs7R0FJRztBQUVIOzs7O0dBSUc7QUFFSDs7OztHQUlHO0FBQ2EsaUJBQVksR0FBRyw4REFBOEQsQ0FBQTtBQVVyRixXQUFNLEdBQStCLENBQUMsTUFBd0I7SUFDcEUsTUFBTSxDQUFDO1FBQ04sUUFBUSxFQUFFLEtBQUs7UUFDZixHQUFHLEVBQUUsQ0FBQyxJQUFjLEVBQUUsR0FBWSxFQUFFLEdBQWE7WUFFaEQsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBTyxRQUFRO2dCQUV0QyxJQUFJLFNBQVMsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDO2dCQUN6RCxJQUFJLE9BQU8sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDO2dCQUNyRCxJQUFJLGFBQWEsR0FBRyxLQUFLLENBQUM7Z0JBQzFCLElBQUksQ0FBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBRSxHQUN0RCxJQUFJ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