import {
	isArray,
	isString,
	isError,
	isNull,
	isUndefined
} from 'util';

import {
	PathError,
	HandlerError
}             from './';
import {Path} from './Path';



type ISegment = Segment.ISegment;
type Identifier = Segment.Identifier;
type Value = Segment.Value;
type Match = Segment.Match;

export class Segment extends Array<Identifier | Value> implements ISegment {

	public static ValidIdentifier: RegExp = /^~|(?:\/?:?([-\w]+))$/;
	public static ValidValue: RegExp      = /=?([^\/]*)\/?$/;
	public static ValidSegment: RegExp    = /^(~)|(?:\/?(:?)([-\w]+)(?:=([^\/]*))?\/?)$/;

	public static validateId    = (arg: any): Identifier | PathError => {
		let id: null | RegExpExecArray;
		if (isString(arg))
			return (id = Segment.ValidIdentifier.exec(arg))
				? id[1]
				: new PathError('invalid identifier string', arg);

		return new PathError('invalid segment identifier type', arg);
	};
	public static validateValue = (arg: any): Value | PathError => {

		if (isUndefined(arg) || isNull(arg)) return arg;

		if (isString(arg)) {

			let results = Segment.ValidValue.exec(arg);

			if (isNull(results)) return new PathError('invalid segment value string', arg);

			let value = results[1];

			switch (value) {
				case '':
				case 'undef':
				case 'undefined':
					return undefined;
				case 'null':
					return null;
				default:
					return value;
			}
		}

		return new PathError('value must be a valid string, null or undefined', arg);
	};
	public static validate      = (arg: any): undefined | ISegment | PathError => {

		if (arg instanceof Segment) return [arg[0], arg[1]];

		if (isString(arg)) {

			let results = Segment.ValidSegment.exec(arg);

			if (results === null) return undefined;

			let [param, identifier, value] = <[string, string, undefined | string]>results.slice(1);

			if (param === '~') return ['~', null];

			let val: Value | PathError = null;

			if (value) val = Segment.validateValue(value);
			else if (param === ':') val = '*';

			return isError(val)
				? val
				: [param.concat(identifier), val];
		}

		if (isArray(arg) && (arg.length === 2)) {

			let id  = Segment.validateId(arg[0]);
			let val = Segment.validateValue(arg[1]);

			if (!isError(id)) {

				if (isError(val)) return val;

				if (id.startsWith(':') && isNull(val)) return new PathError('parameter values cannot be null');
				if (!id.startsWith(':') && !isNull(val)) return new PathError('route values must be null');

				return [id, val];
			}

			return undefined;
		}

		return undefined;
	};
	public static match         = (path: string | Segment, here: string | Segment): Match => {

		let results = Segment.validate(path);
		if (isError(results)) return new PathError('path is invalid', path);

		results = Segment.validate(here);
		if (isError(results)) return new PathError('here is invalid', here);

		if (path === here) return 'yes';

		if (isNull(path[1])) {

			// matches value param at end of here or a star handler that came in as a value
			if (here[1] === '*' || isUndefined(here[1])) return 'maybe';

			// matches value param mid-path
			if (path[0] === here[1]) return 'value';
		}

		return 'no';
	};

	private _update = (arg: any, id: boolean) => {

		let results = id
			? Segment.validateId(arg)
			: Segment.validateValue(arg);

		if (results instanceof Error)
			throw results;

		id
			? this[0] = <Identifier>results
			: this[1] = <Value>results;
	};

	public [0]: Identifier;

	public [1]: Value;

	get id(): Identifier {
		return this[0];
	};

	set id(arg: Identifier) {
		this._update(arg, true);
		if (this[0].startsWith(':') && isNull(this[1])) this[1] = undefined;
		if (!this[0].startsWith(':') && !isNull(this[1])) this[1] = null;
	};

	get val(): Value {
		return this[1];
	};

	set val(arg: Value) {
		this._update(arg, false);
		if (isNull(this[1]) && this[0].startsWith(':')) this[0] = this[0].substr(1);
		if (!isNull(this[1]) && !this[0].startsWith(':')) this[0] = `:${this[0]}`;
	};

	get isParam(): boolean {
		return !isNull(this[1]);
	};

	constructor(arg: any) {
		super();

		let results = Segment.validate(arg);

		if (!results || isError(results)) throw results || new PathError('cannot build an invalid segment', arg);

		[this[0], this[1]] = results;
	}

	public match = (path: string | Segment) => Segment.match(path, this);
}
export namespace Segment {
	export type ISegment = [Identifier, Value];
	export type Identifier = string;
	export type Value = null | undefined | string;
	export type Result = 'no' | 'yes' | 'maybe' | 'value';
	export type Match = Result | PathError;
}