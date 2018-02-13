"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Cors_1 = require("./Cors");
const Rx = require("rxjs");
const CC = require("../../common/CaseChange");
class Header {
}
exports.Header = Header;
class Headers {
    constructor(_config) {
        this._config = _config;
        this[Symbol.iterator] = function* () {
            let keys = Object.keys(this);
            for (let key in keys) {
                yield key;
            }
        };
        [Cors_1.Cors]
            .forEach(category => Object.getOwnPropertyNames(category)
            .forEach(prop => Object.assign(this, {
            [prop]: category[prop](this._config)
        })));
    }
    static notRead(headerName, args) {
        return new Rx.Observable(observer => {
            Rx.Observable.from(args).subscribe({
                next: arg => observer.next(arg),
                complete: () => observer.error(new Error(`Header ${headerName} not handled`))
            });
        });
    }
    /*
       * parse() normalizes Node provided raw headers such that all names are
       * converted to camel case and values are split into an array. Values
       * are assigned to an observable if the header is read otherwise an error
       * observable is returned with the args attached to the error object.
       *
       * https://nodejs.org/dist/latest-v8.x/docs/api/http.html#http_message_headers
       */
    static parseIncoming(req, res) {
        return new Rx.Observable(observer => {
            let _headers = req._headers;
            let headers = req.headers;
            let headers$ = req.headers$;
            Object.keys(req.headers).forEach(key => {
                //  Convert names to camelCase. also verifies no problematic characters
                let headerName = CC.of(key, CC.To.camel);
                // Normalize 'referer' tag name
                if (headerName === 'referrer' || headerName === 'referer') {
                    headerName = 'referer';
                }
                /**
                 * Check for an array of values and if not an array split on the ','
                 * and push values into array. Node already checks for duplicate
                 * values hence no need to check for duplicates again
                 */
                let rawVal = Array.isArray(headers[headerName]) ?
                    headers[headerName].map(val => val.trim()) :
                    headers[headerName].split(',').map(val => val.trim());
                let headerVal = { [headerName]: _headers.hasOwnProperty(headerName) ? {
                        value: _headers[headerName].get(rawVal, req, res),
                        priority: _headers[headerName].priority,
                        req,
                        res
                    } : {
                        value: Headers.notRead(headerName, rawVal),
                        priority: 'info',
                        req,
                        res
                    }
                };
                Object.assign(headers$, headerVal);
                observer.next(headerVal);
            });
            return observer.complete();
        });
    }
}
exports.Headers = Headers;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSGVhZGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkhlYWRlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSxpQ0FBOEI7QUFLOUIsMkJBQTJCO0FBSTNCLDhDQUE4QztBQWlDOUM7Q0FJQztBQUpELHdCQUlDO0FBbUJEO0lBVUMsWUFBb0IsT0FBeUI7UUFBekIsWUFBTyxHQUFQLE9BQU8sQ0FBa0I7UUFSN0MsS0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUc7WUFDbkIsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM3QixHQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUN0QixNQUFNLEdBQUcsQ0FBQTtZQUNWLENBQUM7UUFDRixDQUFDLENBQUE7UUFLQSxDQUFDLFdBQUksQ0FBQzthQUNMLE9BQU8sQ0FBQyxRQUFRLElBQUksTUFBTSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsQ0FBQzthQUN2RCxPQUFPLENBQUMsSUFBSSxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFO1lBQ3BDLENBQUMsSUFBSSxDQUFDLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7U0FDcEMsQ0FBQyxDQUFDLENBQ0gsQ0FBQztJQUVILENBQUM7SUFFRCxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQWtCLEVBQUUsSUFBUztRQUMzQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDLFFBQVE7WUFDaEMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDO2dCQUNsQyxJQUFJLEVBQUUsR0FBRyxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO2dCQUMvQixRQUFRLEVBQUUsTUFBTSxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxDQUFDLFVBQVUsVUFBVSxjQUFjLENBQUMsQ0FBQzthQUM3RSxDQUFDLENBQUE7UUFDSCxDQUFDLENBQUMsQ0FBQTtJQUNILENBQUM7SUFFQTs7Ozs7OztTQU9FO0lBRUgsTUFBTSxDQUFDLGFBQWEsQ0FBQyxHQUFZLEVBQUUsR0FBYTtRQUUvQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFrQixRQUFRO1lBRWpELElBQUksUUFBUSxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUM7WUFDNUIsSUFBSSxPQUFPLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQztZQUMxQixJQUFJLFFBQVEsR0FBRyxHQUFHLENBQUMsUUFBUSxDQUFDO1lBRTVCLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHO2dCQUVuQyx1RUFBdUU7Z0JBQ3ZFLElBQUksVUFBVSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBRXpDLCtCQUErQjtnQkFDL0IsRUFBRSxDQUFDLENBQUMsVUFBVSxLQUFLLFVBQVUsSUFBSSxVQUFVLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztvQkFDM0QsVUFBVSxHQUFHLFNBQVMsQ0FBQTtnQkFDdkIsQ0FBQztnQkFDRDs7OzttQkFJRztnQkFDSCxJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztvQkFDbkMsT0FBTyxDQUFDLFVBQVUsQ0FBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO29CQUM3QyxPQUFPLENBQUMsVUFBVSxDQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7Z0JBRWpFLElBQUksU0FBUyxHQUFHLEVBQUMsQ0FBQyxVQUFVLENBQUMsRUFDNUIsUUFBUSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsR0FBRzt3QkFDckMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUM7d0JBQ2pELFFBQVEsRUFBRSxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsUUFBUTt3QkFDdkMsR0FBRzt3QkFDSCxHQUFHO3FCQUNILEdBQUc7d0JBQ0gsS0FBSyxFQUFFLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQzt3QkFDMUMsUUFBUSxFQUFrQixNQUFNO3dCQUNoQyxHQUFHO3dCQUNILEdBQUc7cUJBQ0g7aUJBQ0QsQ0FBQTtnQkFFRCxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQztnQkFDbkMsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUMxQixDQUFDLENBQUMsQ0FBQTtZQUVGLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDNUIsQ0FBQyxDQUFDLENBQUE7SUFDSCxDQUFDO0NBR0Q7QUF4RkQsMEJBd0ZDIn0=