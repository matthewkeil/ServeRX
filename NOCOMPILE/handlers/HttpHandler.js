"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Rx = require("rxjs");
class HttpHandler extends Rx.BehaviorSubject {
    constructor(req, res) {
        super({ req, res });
        this.req = req;
        this.res = res;
        let self = this;
        this.req.parse();
        super.next({ req, res });
        let handler$ = req.getHandler()
            .do(routeHandler => {
            let pair = self.value;
            pair.req.routeHandler = routeHandler;
            return super.next(pair);
        });
        let headers$ = req.getHeaders(req, res)
            .combineAll(headers => { })
            .do(header => {
            switch (header.priority) {
                case 'pre':
                    header.value.subscribe();
                    break;
                case 'ordered':
                case 'info':
                default:
                    req.headers$[header.priority].push(header);
                    break;
            }
        })
            .filter(header => header.pre !== undefined)
            .flatMap(header => header.pre.observable);
        let runRequest$ = handler$.withLatestFrom(headers$)
            .flatMap(([routeHandler, header]) => {
            if (!self.value.req.routeHandler && routeHandler) {
                let pair = self.value;
                pair.req.auth.isRequired = routeHandler.config.auth.isRequired;
                if (!pair.req.auth.isRequired) {
                    pair.req.auth.isAuthorized = true;
                    super.next(pair);
                    return Rx.Observable.from([{
                            isRequired: false,
                            isAuthorized: true
                        }]);
                }
                super.next(pair);
                return req._user.authorization(req);
            }
        })
            .do(auth => {
            if (auth.isRequired && !auth.isAuthorized) {
                throw new Error('Not authorized');
            }
            let pair = self.value;
            pair.req.auth = auth;
            return super.next(pair);
        })
            .flatMap(auth => req.routeHandler.observable(req.routeHandler.config))
            .subscribe(res);
    }
    get id() {
        return this._id ?
            this._id :
            this._id = this.generateId();
    }
    generateId() {
        let id = this.req.socket.address();
        return Object.assign(this.req.id, id, {
            timestamp: Date.now(),
            insertId: (id.address + ' | ' + id.family)
        }).insertId;
    }
    _httpNext(value) { }
    _handleError(error) { }
}
exports.HttpHandler = HttpHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSHR0cEhhbmRsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJIdHRwSGFuZGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUlBLDJCQUEyQjtBQVkzQixpQkFBeUIsU0FBUSxFQUFFLENBQUMsZUFBeUI7SUFNNUQsWUFBbUIsR0FBWSxFQUFTLEdBQWE7UUFFcEQsS0FBSyxDQUFDLEVBQUMsR0FBRyxFQUFFLEdBQUcsRUFBQyxDQUFDLENBQUM7UUFGQSxRQUFHLEdBQUgsR0FBRyxDQUFTO1FBQVMsUUFBRyxHQUFILEdBQUcsQ0FBVTtRQUlwRCxJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7UUFDaEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUVqQixLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUMsR0FBRyxFQUFFLEdBQUcsRUFBQyxDQUFDLENBQUM7UUFFdkIsSUFBSSxRQUFRLEdBQUcsR0FBRyxDQUFDLFVBQVUsRUFBRTthQUM3QixFQUFFLENBQUMsWUFBWTtZQUNmLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUE7WUFDckIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLEdBQUcsWUFBWSxDQUFBO1lBQ3BDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ3hCLENBQUMsQ0FBQyxDQUFBO1FBRUgsSUFBSSxRQUFRLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDO2FBQ3JDLFVBQVUsQ0FBQyxPQUFPLE1BQUssQ0FBQyxDQUFDO2FBQ3pCLEVBQUUsQ0FBQyxNQUFNO1lBQ1QsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pCLEtBQUssS0FBSztvQkFDVCxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFBO29CQUN4QixLQUFLLENBQUE7Z0JBQ04sS0FBSyxTQUFTLENBQUM7Z0JB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