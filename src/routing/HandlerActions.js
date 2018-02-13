"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Observable_1 = require("rxjs/Observable");
class Routing extends Observable_1.Observable {
    constructor(subscribe) {
        super(subscribe);
        this.nested = [];
    }
    get nestedIsComplete() {
        let self = this;
        let complete = true;
        let newNested = [];
        this.nested.forEach((nested, index) => {
            if (nested[1].closed) {
                this.nested__.remove(nested[1]);
            }
            else {
                newNested.push(nested);
                complete = false;
            }
        });
        this.nested = newNested;
        if (complete && this.nested__ && !this.nested__.closed) {
            this.nested__.unsubscribe();
            delete this.nested__;
            this.nested = [];
        }
        return complete;
    }
    cancel() {
        if (this.nested.length > 0)
            this.nested.forEach(nested => {
                nested[0].cancel();
                this.nested__.remove(nested[1]);
                if (!nested[1].closed)
                    nested[1].unsubscribe();
            });
        if (this.nested__ && !this.nested__.closed)
            this.nested__.unsubscribe();
        delete this.nested;
        delete this.nested__;
        if (!this._observer.closed)
            this._observer.complete();
    }
    addNested(routing, observer) {
        let subscription = routing.subscribe(observer);
        this.nested.push([routing, subscription]);
        this.nested__
            ? this.nested__.add(subscription)
            : this.nested__ = subscription;
    }
}
exports.Routing = Routing;
class Mounting extends Routing {
    constructor(subscribe) {
        super(subscribe);
        this.methods = [];
    }
}
exports.Mounting = Mounting;
// export interface Routing extends Rx.Observable<RouteHandler> {
// 	public nested: Routing[];
// 	public nested__?: Rx.Subscription;
// 	public cancel: () => void;
// 	public add: (subscription: Rx.Subscription) => void
// }
// export class Mounting extends Routing {
// 	public path: Segment[]
// 	constructor(path: any, ...args: any[]): Mounting {
// 	}
// }
// export function routing(subscribe: (observer: Rx.Observer<RouteHandler>) => void): Routing {
// 	let observer = subscribe.arguments[0]
// 	let routing$ = <Routing>Rx.Observable.create(subscribe).take(1);
// 	routing$.nested = [];
// 	routing$.cancel = (): void => {
// 		if (routing$.nested) routing$.nested.forEach(routing => {
// 			routing.cancel();
// 		});
// 		if (routing$.nested__ && !routing$.nested__.closed) routing$.nested__.unsubscribe();
// 		if (!observer.closed) observer.complete();
// 	}
// 	routing$.add = (subscription: Rx.Subscription): void => {
// 		routing$.nested__
// 			? routing$.nested__.add(subscription)
// 			: routing$.nested__ = subscription;
// 	}
// 	return routing$;
// }
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSGFuZGxlckFjdGlvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJIYW5kbGVyQWN0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQU1BLGdEQUE2QztBQWU3QyxhQUFxQixTQUFRLHVCQUE0QjtJQXdEeEQsWUFBWSxTQUEwRztRQUNsSCxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUE7UUF0RGIsV0FBTSxHQUE4QixFQUFFLENBQUM7SUFzRHpCLENBQUM7SUFuRHRCLElBQUksZ0JBQWdCO1FBRW5CLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQztRQUNoQixJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUM7UUFFcEIsSUFBSSxTQUFTLEdBQThCLEVBQUUsQ0FBQztRQUU5QyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sRUFBRSxLQUFLO1lBQ2pDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNQLElBQUksQ0FBQyxRQUFTLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pELENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDUCxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUN2QixRQUFRLEdBQUcsS0FBSyxDQUFDO1lBQ2xCLENBQUM7UUFDRixDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDO1FBRXhCLEVBQUUsQ0FBQyxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ3hELElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUM7WUFFNUIsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO1lBRXJCLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO1FBQ2xCLENBQUM7UUFFRCxNQUFNLENBQUMsUUFBUSxDQUFDO0lBQ2pCLENBQUM7SUFDTSxNQUFNO1FBRVosRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1lBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTTtnQkFDckQsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUNKLElBQUksQ0FBQyxRQUFTLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO2dCQUMvQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7b0JBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ2hELENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO1lBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUV4RSxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDbkIsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBRXJCLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUM7WUFBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ3ZELENBQUM7SUFDTSxTQUFTLENBQUMsT0FBZ0IsRUFBRSxRQUFvQztRQUN0RSxJQUFJLFlBQVksR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQy9DLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUM7UUFDMUMsSUFBSSxDQUFDLFFBQVE7Y0FDVixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUM7Y0FDL0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxZQUFZLENBQUM7SUFDakMsQ0FBQztDQUlEO0FBM0RELDBCQTJEQztBQUVELGNBQXNCLFNBQVEsT0FBTztJQVVwQyxZQUFZLFNBQTBHO1FBQ2xILEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQTtRQVBiLFlBQU8sR0FBYSxFQUFFLENBQUM7SUFPVCxDQUFDO0NBSXRCO0FBZkQsNEJBZUM7QUFFRCxpRUFBaUU7QUFDakUsNkJBQTZCO0FBQzdCLHNDQUFzQztBQUN0Qyw4QkFBOEI7QUFDOUIsdURBQXVEO0FBQ3ZELElBQUk7QUFFSiwwQ0FBMEM7QUFDMUMsMEJBQTBCO0FBRTFCLHNEQUFzRDtBQUV0RCxLQUFLO0FBRUwsSUFBSTtBQUVKLCtGQUErRjtBQUUvRix5Q0FBeUM7QUFFekMsb0VBQW9FO0FBRXBFLHlCQUF5QjtBQUV6QixtQ0FBbUM7QUFDbkMsOERBQThEO0FBQzlELHVCQUF1QjtBQUN2QixRQUFRO0FBRVIseUZBQXlGO0FBRXpGLCtDQUErQztBQUMvQyxLQUFLO0FBRUwsNkRBQTZEO0FBQzdELHNCQUFzQjtBQUN0QiwyQ0FBMkM7QUFDM0MseUNBQXlDO0FBQ3pDLEtBQUs7QUFFTCxvQkFBb0I7QUFDcEIsSUFBSSJ9