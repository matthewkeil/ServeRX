"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HttpHandler_1 = require("./HttpHandler");
class ConnectionHandler {
    constructor() {
        this.httpObserver = {
            next: (pair) => { },
            error: (error) => { },
            complete: () => { }
        };
        this.http = {};
    }
    handle(req, res) {
        req.url;
        /**
         * all tasks are async. once the call is ready to be decoded, it
         * will be handled below
         * 	- parse path and return observable handler
         * 	- parse headers and return observables for each
         * 		= while returning observables insert them into hierarchical
         * 		  decode order
         * 	- assign body/input stream to observable
         *
         * if (!handler) return 404 Error
         * else	async {
         * 	headers.subscribe(requirements => handler(requirements))
         * 	if(!preAuth && handler.needs.auth) return auth
         * 		if(auth)
         * 			body.subscribe(body => handler)
         * 			handler.subscribe((req, res) => res.send())
         * }
         */
        let handler = new HttpHandler_1.HttpHandler(req, res);
        let subscription = handler.subscribe(this.httpObserver);
        let id = handler.id;
        Object.assign(this.http, { [id]: [handler, subscription] });
    }
}
exports.ConnectionHandler = ConnectionHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29ubmVjdGlvbkhhbmRsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJDb25uZWN0aW9uSGFuZGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQVdBLCtDQUEyQztBQU8zQztJQUlDO1FBb0NPLGlCQUFZLEdBQUc7WUFDckIsSUFBSSxFQUFFLENBQUMsSUFBYyxPQUFNLENBQUM7WUFDNUIsS0FBSyxFQUFFLENBQUMsS0FBWSxPQUFNLENBQUM7WUFDM0IsUUFBUSxFQUFFLFFBQU8sQ0FBQztTQUNsQixDQUFBO1FBdkNBLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFBO0lBRWYsQ0FBQztJQUVNLE1BQU0sQ0FBQyxHQUFZLEVBQUUsR0FBYTtRQUd4QyxHQUFHLENBQUMsR0FBRyxDQUFBO1FBQ1A7Ozs7Ozs7Ozs7Ozs7Ozs7O1dBaUJHO1FBRUgsSUFBSSxPQUFPLEdBQUcsSUFBSSx5QkFBVyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQTtRQUN2QyxJQUFJLFlBQVksR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQTtRQUN2RCxJQUFJLEVBQUUsR0FBRyxPQUFPLENBQUMsRUFBRSxDQUFBO1FBRW5CLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsWUFBWSxDQUFDLEVBQUMsQ0FBQyxDQUFBO0lBRTFELENBQUM7Q0FRRDtBQTlDRCw4Q0E4Q0MifQ==