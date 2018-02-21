import {
	isArray,
	isError,
	isUndefined
} from 'util';

import * as shortid from 'shortid';
import * as _       from 'lodash';

import {AuthError} from '../common';



export class Auth {

	public static create = (here: boolean = true, nested: boolean = true): Auth => new Auth(here, nested);

	public static from = (from: Auth[]): Auth => Auth.merge(new Auth(undefined as any, undefined as any), ...from);

	private static merge(target: Auth, ..._from: Auth[]): Auth {

		let from = _from
			? _.flatten(_from, false)
			: undefined;

		if (!from || (from.length === 0)) throw new AuthError('nothing to merge');

		let here = isUndefined(target.here)
			? false
			: target.here;

		let nested = isUndefined(target.nested)
			? false
			: target.nested;

		let source = <Auth[]>(target.source
			? [...target.source]
			: []).concat(target);

		from.forEach(auth => {

			if (!(auth instanceof Auth)) throw new AuthError('can only merge a valid Auth', auth);

			here   = nested || auth.here;
			nested = nested || auth.nested;

			source.push(auth);
		});

		return new Auth(here, nested, source);
	}

	private constructor(private _here: boolean,
							  private _nested: boolean,
							  private _source?: Auth[]) {
	}

	get here() {
		return this._here;
	}

	get nested() {
		return this._nested;
	}

	get source() {
		return this._source;
	}

	public readonly id: string      = shortid.generate();
	public readonly created: number = Date.now();

	public stack(...auth: Auth[]) {
		return Auth.merge(this, ...auth);
	};


}