


import { Observer } from "rxjs/Observer";
import { Subscriber } from 'rxjs/Subscriber';
import { Subscription, TeardownLogic } from "rxjs/Subscription";
import { Observable } from "rxjs/Observable";
import { AnonymousSubject, Subject } from "rxjs/Subject";


import { Path } from "../common";

import {
	Handler,
	HandlerConfig,
	Stack
} from "./";




export class Routing extends Observable<Stack.Resolution> {

	private _observer: Observer<Stack.Resolution>;
	public nested: [Routing, Subscription][] = [];
	public nested__?: Subscription;

	get nestedIsComplete() {

		let self = this;
		let complete = true;

		let newNested = <[Routing, Subscription][]>[];

		this.nested.forEach((nested, index) => {
			if (nested[1].closed) {
				(<Subscription>this.nested__).remove(nested[1]);
			} else {
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
	public cancel(): void {

		if (this.nested.length > 0) this.nested.forEach(nested => {
			nested[0].cancel();
			(<Subscription>this.nested__).remove(nested[1])
			if (!nested[1].closed) nested[1].unsubscribe();
		});

		if (this.nested__ && !this.nested__.closed) this.nested__.unsubscribe();

		delete this.nested;
		delete this.nested__;

		if (!this._observer.closed) this._observer.complete();
	}
	public addNested(routing: Routing, observer: Observer<Stack.Resolution>): void {
		let subscription = routing.subscribe(observer);
		this.nested.push([routing, subscription]);
		this.nested__
			? this.nested__.add(subscription)
			: this.nested__ = subscription;
	}
	constructor(subscribe: (this: Observable<Stack.Resolution>, subscriber: Subscriber<Stack.Resolution>) => TeardownLogic
	) { super(subscribe) }

}

export class Mounting extends Routing implements Handler.Config {

	public root?: Router;
	public path: MatchString;
	public methods: Method[] = [];
	public supportedMethods?: Method[];
	public param?: SegmentParams;
	public auth?: RouteAuth;
	public middleware?: Middleware;
	public handler?: RequestHandler<any>;
	constructor(subscribe: (this: Observable<Stack.Resolution>, subscriber: Subscriber<Stack.Resolution>) => TeardownLogic
	) { super(subscribe) }



}

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
