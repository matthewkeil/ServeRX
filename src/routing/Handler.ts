import {
	isString,
	isError,
} from 'util';

import * as _  from 'lodash';
import * as Rx from 'rxjs';

// import {Observer}     from 'rxjs/Observer';
// import {Subscription} from 'rxjs/Subscription';
// import {Observable}   from 'rxjs/Observable';
// import {
// 	AnonymousSubject,
// 	Subject
// }                     from 'rxjs/Subject';

import {
	Segment,
	Path,
	ApiError,
	AuthError,
	HandlerError,
	ServerError,
	PathError,
	StackError
} from '../common';

import {
	HandlerConfig,
	Valid,
	IValid,
	Mounted,
	Stack,
	Routing,
	RouteAuth
} from './';



export class Handler extends HandlerConfig {

	public static create(args: any): Handler | Error {
		try {
			let config = Handler.decipherArgs(args);
			return new Handler(<Handler.Config>config);
		} catch (err) {
			return err;
		}
	}

	private constructor(config: Handler.Config) {
		super(config);
	}

	public isHere(input: Path.Input): Handler.Match {

		let [results, path] = this.path.isHere(input);
		let handler: undefined | Handler | Error;

		if (!path || isError(path)) {
			path = path || new PathError('input is not a Path.MatchString', input);
			return <Handler.Match>[results, path, handler];
		}

		if (path.length === this.path.length) handler = this;

		let length = this.path.length - 1; // array index for current segment under scrutiny

		if (!handler || results[length] === 'maybe') {

			if (!handler) length++;

			let identifier: Path.Identifier = isString(path[length])
				? <string>path[length]
				: <string>path[length][0];

			let value: Handler.Value = isString(path[length])
				? null
				: path[length][1];

			if (handler || this._mounted.routes.hasOwnProperty(identifier)) {

				if (handler) results.pop();

				handler = handler || (<any>this)._mounted.routes[identifier];

				if (value) {

					let valHandler: undefined | Handler;

					for (let val of (<Handler>handler)) {
						if (val && value === val[0]) {
							results.concat('value');
							valHandler = val[1];
						}
					}

					if (!valHandler) {

						if ((<Handler>handler)._mounted.param.check) {
							valHandler = (<any>handler)._mounted.param.check(value);
							if (valHandler) results.concat('check');
						}

						if (!valHandler) results.push('no');
					}

					handler = valHandler;

				}

			}

		}

		return <Handler.Match>[results, path, handler];
	}

	public resolve(input: Path.Input,
						make: boolean = false,
						stack: Stack  = new Stack): Routing {

		let self = this;

		let routing$ = new Routing(observer => {

			let results: Path.Results[];
			let path: Path;
			let handler: undefined | Handler;
			let error: undefined | Error;
			let orderedStackResults = <[number, Stack][]>[];

			let next = (stack: Stack) => {

				let rating = 0;
				let no     = false;

				stack.results.forEach(result => {
					switch (result) {
						case 'no':
							rating = 0;
							no     = true;
							break;
						case 'yes':
							rating += 5;
							break;
						case 'value':
							rating += 4;
							break;
						case 'star':
							rating += 3;
							break;
						case 'check':
							rating += 2.5;
							break;
						case 'maybe':
							rating += 2;
							break;
					}
				});

				if (!no) {
					if (make) observer.next([rating, stack]);
					else {
						orderedStackResults.unshift([rating, stack]);

						orderedStackResults.sort((a, b) => {
							if (a[0] < b[0]) return -1;
							if (a[0] > b[0]) return 1;
							return 0;
						});

						observer.next(orderedStackResults[0][1]);
					}
				}
				// if (routing$.nestedIsComplete) observer.complete();
			};

			let complete = () => routing$.nestedIsComplete && !observer.closed
				? observer.complete()
				: undefined;

			[results, path, handler] = <any>self.isHere(input);

			if (isError(path)) return self.root
				? void self.root.resolve(path, make, stack).subscribe(observer)
				: void observer.error(new PathError('invalid path', path));

			if (isError(handler)) return observer.error(handler); // only throws for bad catch function

			if (handler) {
				// if (!stack) stack = new Stack({ results, path, handlers: [self] });
				if (isError(error = stack.push(results, handler))) observer.error(error);

				if (path.length === handler._path.length) {
					next(stack);
					complete();
				}
				else routing$.addNested(handler.resolve(path, make, stack), observer);
			}

			if (!isString(path[self.path.length])) complete();

			let valueFound    = false;
			let valueToSearch = <string>path[self.path.length];

			for (let valHandler of this._mounted) {

				let star = false;

				if (valHandler &&
					(valHandler[0] === valueToSearch || (star = (valHandler[0] === '*')))) {

					if (make && star) {
						break;
					} else if (!make && valueFound || !star) {
						valueFound = true;
						break;
					}

					routing$.addNested(
						valHandler[1].resolve(path, false, stack.copy),
						{
							next,
							error: (err: Error) => {
							},
							complete
						});
				}
			}

			complete();
		});

		return routing$;
	}

	public mount(path: any, ...args: any[]): Mounting {

		let self = this;

		let mounting$ = new Mounting(observer => {


		});

		return mounting$;

	}

	public [Symbol.iterator] = () => {

		let valuesInSearchOrder = this._mounted.param.values.slice();

		return {
			next() {
				return valuesInSearchOrder.length > 0
					? {
						value: <Mounted.Param.Value>valuesInSearchOrder.shift(),
						done : false
					}
					: {
						value: undefined,
						done : true
					};
			}
		};
	};
}
export namespace Handler {
	export type Config = HandlerConfig.I;
	export type Resolver = Rx.AnonymousSubject<Stack>;
	export type Methods =
		| 'all'
		| 'get'
		| 'put'
		| 'post'
		| 'patch'
		| 'delete'
		| 'options'
		| 'head'
		| 'connect';
	export type Observable<T> = (stack: Stack) => Rx.Observable<T>;
	export type Match = [Path.Match[0], Error | Path, Error | Handler | undefined];
	export type Value = null | Segment.Value;

	// array of sync handler groups to run in parallel
	export type Middleware = Handler.Observable<any>[][];
	export type Resource<T> = (stack: Stack) => Observable<T>;
	type Array<T> = [T, Handler][];
	export type ArrayByValue = Array<Value>;
	export type ArrayByIdentifier = Array<Path.Identifier>;
	export type IndexByIdentifier = { [identifier: string]: Handler };
}

// if (path.length > here.length) handler.resolve(path).subscribe(observer)

// 	let remaining = ms.slice(current.length - 1);

// 	while (remaining.length > 0) {
// 		let foundPath.Segment = false;
// 		let madeNew = false;
// 		let segment = remaining.shift();
// 		let isString: boolean;
// 		current = current.concat(segment);

// 		if (!madeNew) {
// 			if (
// 				(isString = isString(segment)) &&
// 				handler.routes.hasOwnProperty(<string>segment)
// 			) {
// 				handler = handler.routes[<string>segment];
// 				foundPath.Segment = true;
// 			}

// 			if (
// 				!foundPath.Segment &&
// 				handler.routes.hasOwnProperty(`:${Object.keys(segment)[0]}`)
// 			) {
// 				handler = handler.routes[`:${Object.keys(segment)[0]}`];
// 				foundPath.Segment = true;
// 			}
// 		}

// 		if (!foundPath.Segment || madeNew) {
// 			let name = isString
// 				? <string>segment
// 				: `:${Object.keys(segment)[0]}`;

// 			handler = handler.routes[name] = new Handler({
// 				path: current,
// 				root: this.root ? this.root : undefined,
// 				supportedMethods: this.supportedMethods
// 					? this.supportedMethods
// 					: undefined
// 			});

// 			madeNew = true;
// 		}
// 	}

// 	return handler;
// }
