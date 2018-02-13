"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Rx = require("rxjs");
const ApiError_1 = require("../../common/ApiError");
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
                let blacklist, allowed;
                if (config.headers && config.headers.origin && config.headers.origin.blacklist) {
                    blacklist = config.headers.origin.blacklist || {};
                }
                if (config.headers && config.headers.origin && config.headers.origin.allowed) {
                    allowed = config.headers.origin.allowed || {};
                }
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
                switch (req.method) {
                    case 'GET':
                    case 'HEAD':
                        // Set Access-Control-Expose-Headers ???
                        break;
                    case 'POST':
                        // only content types with the following values are supported: text/plain, application/x-www-form-urlencoded and multipart/form-data.
                        if (req.headers$.hasOwnProperty('contentType')) {
                            let acceptable = false;
                            let badTypes = [];
                            req.headers$.contentType.value.filter(type => {
                                if (!(type.type === 'text' && type.subType === 'plain') &&
                                    !(type.type === 'application' && type.subType === 'x-www-form-urlencoded') &&
                                    !(type.type === 'multipart' && type.subType === 'form-data')) {
                                    return type;
                                }
                                else
                                    badTypes.push(type);
                            }).subscribe(type => observer.error(new ApiError_1.ApiError(`POST of Content-Type ${type.type}/${type.subType} is not authorized without CORS preflight`)), err => observer.error(err));
                        }
                        break;
                    case 'OPTIONS':
                        if (req.headers$.hasOwnProperty('accessControlRequestMethod')) {
                            Cors._runPreFlight(req, res).subscribe(observer);
                        }
                        else {
                            // Set Access-Control-Expose-Headers ???
                        }
                        break;
                    case 'PATCH':
                    case 'PUT':
                    case 'DELETE':
                        observer.error(new Error(`${req.method} requires CORS pre-flight`));
                        break;
                    case 'CONNECT':
                    case 'TRACE':
                    default:
                        observer.error(new Error(`${req.method} not CORS supported`));
                        break;
                }
                // Set Access-Control-Allow-Origin
                // Set Access-Control-Allow-Credentials
                observer.complete();
            });
        }
    };
};
exports.Cors = Cors;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkNvcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwyQkFBMEI7QUFPMUIsb0RBQWlEO0FBSWpEO0lBK0VTLE1BQU0sQ0FBQyxhQUFhLENBQUMsR0FBWSxFQUFFLEdBQWE7UUFDdkQsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQyxRQUFRO1lBQ2hDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQTtRQUNwQixDQUFDLENBQUMsQ0FBQTtJQUNILENBQUM7O0FBekNNLCtCQUEwQixHQUNoQyxDQUFDLE1BQXdCO0lBRXhCLE1BQU0sQ0FBQztRQUNOLEdBQUcsRUFBRSxDQUFDLEdBQUcsV0FBcUI7WUFDN0IsZ0NBQWdDO1lBQ2hDLE1BQU0sQ0FBQTtRQUNQLENBQUM7S0FDRCxDQUFBO0FBQ0YsQ0FBQyxDQUFDO0FBRUg7Ozs7R0FJRztBQUVIOzs7O0dBSUc7QUFFSDs7OztHQUlHO0FBRUg7Ozs7R0FJRztBQUNZLGlCQUFZLEdBQUcsOERBQThELENBQUE7QUFZckYsV0FBTSxHQUErQixDQUFDLE1BQXdCO0lBQ3BFLE1BQU0sQ0FBQztRQUNOLFFBQVEsRUFBRSxLQUFLO1FBQ2YsR0FBRyxFQUFFLENBQUMsSUFBYyxFQUFFLEdBQVksRUFBRSxHQUFhO1lBRWhELE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxVQUFVLENBQVEsUUFBUTtnQkFFdkMsSUFBSSxTQUFTLEVBQUUsT0FBTyxDQUFDO2dCQUV2QixFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7b0JBQ2hGLFNBQVMsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxTQUFTLElBQUksRUFBRSxDQUFDO2dCQUNuRCxDQUFDO2dCQUVELEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztvQkFDOUUsT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUM7Z0JBQy9DLENBQUM7Z0JBRUQsSUFBSSxhQUFhLEdBQUcsS0FBSyxDQUFDO2dCQUUxQixJQUFJLENBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUUsR0FDdEQsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRWpDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN0QyxJQUFJLElBQUksR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsVUFBVSxDQUFBO29CQUN2QyxNQUFNLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUM7d0JBQ3JCLEtBQUssU0FBUzs0QkFDYixJQUFJO2dDQUNILFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLENBQUMsNEJBQTRCLENBQUMsQ0FBQztnQ0FDdkQsYUFBYSxHQUFHLElBQUksQ0FBQTs0QkFDckIsS0FBSyxDQUFBO3dCQUNOLEtBQUssUUFBUTs0QkFDWixJQUFJLEtBQUssU0FBUztnQ0FDakIsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO2dDQUN0RCxhQUFhLEdBQUcsSUFBSSxDQUFBOzRCQUNyQixLQUFLLENBQUE7d0JBQ047NEJBQ0MsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7Z0NBQ2xCLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxJQUFJLEdBQUcsS0FBSyxTQUFTO29DQUNwQyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxDQUFDLDJCQUEyQixDQUFDLENBQUM7b0NBQ3RELGFBQWEsR0FBRyxJQUFJLENBQUM7Z0NBQ3RCLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFBOzRCQUNqRCxLQUFLLENBQUE7b0JBQ1AsQ0FBQztnQkFDRixDQUFDO2dCQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDeEMsYUFBYSxHQUFHLElBQUksQ0FBQTtnQkFDckIsQ0FBQztnQkFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzNDLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxVQUFVLENBQUE7b0JBQ3JDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQzt3QkFDckIsS0FBSyxTQUFTOzRCQUNiLElBQUk7Z0NBQ0gsYUFBYSxHQUFHLElBQUk7Z0NBQ3BCLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLENBQUMsNEJBQTRCLENBQUMsQ0FBQyxDQUFBOzRCQUN4RCxLQUFLLENBQUE7d0JBQ04sS0FBSyxRQUFROzRCQUNaLElBQUksS0FBSyxTQUFTO2dDQUNqQixhQUFhLEdBQUcsSUFBSTtnQ0FDcEIsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssQ0FBQywyQkFBMkIsQ0FBQyxDQUFDLENBQUE7NEJBQ3ZELEtBQUssQ0FBQTt3QkFDTjs0QkFDQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztnQ0FDbEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLElBQUksR0FBRyxLQUFLLFNBQVM7b0NBQ3BDLGFBQWEsR0FBRyxJQUFJO29DQUNwQixRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxDQUFDLDBCQUEwQixDQUFDLENBQUMsQ0FBQztnQ0FDdkQsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUE7NEJBQ2pELEtBQUssQ0FBQTtvQkFDUCxDQUFDO2dCQUNGLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ1AsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUE7Z0JBQ25ELENBQUM7Z0JBRUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUM7b0JBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO2dCQUVyRSxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztvQkFDcEIsS0FBSyxLQUFLLENBQUM7b0JBQ1gsS0FBSyxNQUFNO3dCQUNWLHdDQUF3Qzt3QkFDeEMsS0FBSyxDQUFDO29CQUNQLEtBQUssTUFBTTt3QkFDVixxSUFBcUk7d0JBQ3JJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFFaEQsSUFBSSxVQUFVLEdBQUcsS0FBSyxDQUFDOzRCQUN2QixJQUFJLFFBQVEsR0FBRyxFQUFFLENBQUM7NEJBRWxCLEdBQUcsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQ3BDLElBQUk7Z0NBQ0gsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssTUFBTSxJQUFJLElBQUksQ0FBQyxPQUFPLEtBQUssT0FBTyxDQUFDO29DQUN0RCxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxhQUFhLElBQUksSUFBSSxDQUFDLE9BQU8sS0FBSyx1QkFBdUIsQ0FBQztvQ0FDMUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssV0FBVyxJQUFJLElBQUksQ0FBQyxPQUFPLEtBQUssV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO29DQUMvRCxNQUFNLENBQUMsSUFBSSxDQUFDO2dDQUNiLENBQUM7Z0NBQUMsSUFBSTtvQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDOzRCQUM1QixDQUFDLENBQUMsQ0FBQyxTQUFTLENBQ1osSUFBSSxJQUFJLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxtQkFBUSxDQUFDLHdCQUF3QixJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxPQUFPLDJDQUEyQyxDQUFDLENBQUMsRUFDbEksR0FBRyxJQUFJLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQzFCLENBQUE7d0JBQ0YsQ0FBQzt3QkFDRCxLQUFLLENBQUM7b0JBQ1AsS0FBSyxTQUFTO3dCQUNiLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLDRCQUE0QixDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUMvRCxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7d0JBQ2xELENBQUM7d0JBQUMsSUFBSSxDQUFDLENBQUM7NEJBQ1Asd0NBQXdDO3dCQUN6QyxDQUFDO3dCQUNELEtBQUssQ0FBQztvQkFDUCxLQUFLLE9BQU8sQ0FBQztvQkFDYixLQUFLLEtBQUssQ0FBQztvQkFDWCxLQUFLLFFBQVE7d0JBQ1osUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLDJCQUEyQixDQUFDLENBQUMsQ0FBQzt3QkFDcEUsS0FBSyxDQUFDO29CQUNQLEtBQUssU0FBUyxDQUFDO29CQUNmLEtBQUssT0FBTyxDQUFDO29CQUNiO3dCQUNDLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxxQkFBcUIsQ0FBQyxDQUFDLENBQUM7d0JBQzlELEtBQUssQ0FBQztnQkFDUixDQUFDO2dCQUVELGtDQUFrQztnQkFFbEMsdUNBQXVDO2dCQUV2QyxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUE7WUFDcEIsQ0FBQyxDQUFDLENBQUE7UUFDSCxDQUFDO0tBQ0QsQ0FBQTtBQUNGLENBQUMsQ0FBQTtBQXBORixvQkFxTkMifQ==