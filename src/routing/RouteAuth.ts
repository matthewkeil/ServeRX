
import { isArray } from "util";
import * as _ from 'lodash';


import { AuthError } from "../common";


export type AuthSource = (RouteAuth | RouteAuth[])[];
export class RouteAuth {

	private static empty() {
		return new RouteAuth();
	}
	static create(here?: boolean, nested?: boolean) {
		return new RouteAuth(here || true, nested || true);
	}
	static from(arg: any): RouteAuth {

		let auth;
		try {
			auth = RouteAuth.empty().merge(arg);
		} catch (err) { return err }

		return <RouteAuth>auth;
	}

	private constructor(
		here?: boolean,
		nested?: boolean,
		from?: AuthSource) {

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
				set: (...args: any[]) => {
					throw new AuthError('cannot manually set an auth', args);
				}
			},
			nested: {
				value: nested,
				configurable: false,
				enumerable: true,
				set: (...args: any[]) => {
					throw new AuthError('cannot manually set an auth', args);
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


	readonly created: number;
	readonly here: boolean;
	readonly nested: boolean;
	readonly from?: AuthSource;

	private _validateFrom(from?: any) {

		if (!from) return undefined;

		let flat = _.flattenDeep([from]);

		flat.forEach(auth => {
			if (!(auth instanceof RouteAuth))
				throw new AuthError('from contains an invalid RoutAuth', auth);
		});

		return <AuthSource>from;
	}
	public merge(arg?: any): RouteAuth {

		let source = isArray(arg) ? arg : [arg];

		if (!arg || source.length === 0) return this;

		let here = false;
		let nested = false;
		let from = [this as RouteAuth];

		source.forEach(auth => {
			if (!(auth instanceof RouteAuth)) throw new AuthError('can only merge a valid Auth', auth);
			if (auth.here) here = auth.here;
			if (auth.nested) nested = auth.nested;
			from.push(auth);
		});

		return new RouteAuth(here, nested, from)
	}

}