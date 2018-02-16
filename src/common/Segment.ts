import {
	isArray,
	isString,
	isError,
	isNull,
	isUndefined
} from 'util';

import {PathError} from './Errors';



type ISegment = Segment.ISegment;
type Identifier = Segment.Identifier;
type Value = Segment.Value;
type Match = Segment.Match;

export class Segment extends Array<Identifier | Value> implements ISegment {

	public static ValidIdentifier: RegExp = /^(~)|(?:\/?:?([-\w]+)=?)/;
	public static ValidValue: RegExp      = /^(?:\/?:?[-\w]+=)?([^\/]*)\/?/;
	public static ValidSegment: RegExp    = /^(~)|^(?:\/?(:)?([-\w]+)(?:(=)([^\/]*))?)\/?$/;

	public static validId    = (arg: any): Identifier | PathError => {
		let id: null | RegExpExecArray;
		if (isString(arg)) {
			return (id = Segment.ValidIdentifier.exec(arg))
				? id[1]
						 ? id[1]
						 : id[2]
				: new PathError('invalid identifier string', arg);
		}
		return new PathError('invalid segment identifier type', arg);
	};
	public static validValue = (arg: any): Value | PathError => {

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
	public static valid      = (arg: any): undefined | Segment.I | PathError => {

		if (arg instanceof Segment) return [arg[0], arg[1]];

		if (isString(arg)) {

			let results = Segment.ValidSegment.exec(arg);

			if (results === null) return undefined;

			let [root, param, id, eq, value] = <Segment.RegExp.Results>results.slice(1);

			if (root) return (param || id || eq || value)
				? new PathError('root segment cannot have an id or value')
				: ['~', null];

			let val = eq
				? Segment.validValue(value)
				: null;

			if (param && isNull(val)) val = '*';

			return isError(val)
				? val
				: [param || eq
						? `:{id}`
						: <string>id,
					val];
		}

		if (isArray(arg) && (arg.length === 2)) {

			let id = Segment.validId(arg[0]);
			if (isError(id)) return undefined;

			let val = Segment.validValue(arg[1]);
			if (isError(val)) return val;

			if (id.startsWith(':') && isNull(val)) return new PathError('parameter values cannot be null');
			if (!id.startsWith(':') && !isNull(val)) return new PathError('route values must be null');

			return [id, val];
		}

		return undefined;
	};
	public static match      = (path: string | Segment, here: string | Segment): Match => {

		let results = Segment.valid(path);
		if (isError(results)) return new PathError('path is invalid', path);

		results = Segment.valid(here);
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
			? Segment.validId(arg)
			: Segment.validValue(arg);

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

		let results = Segment.valid(
			arguments.length > 1
				? [...arguments]
				: arguments[0]);

		if (!results || isError(results)) throw results || new PathError('cannot build an invalid segment', arg);

		[this[0], this[1]] = results;
	}

	public is = (here: string | Segment): Segment.Result => {
		let result = Segment.match(this, here);
		return isError(result)
			? 'no'
			: result;
	};
}
export namespace Segment {
	export type ISegment = [Identifier, Value];
	export type I = ISegment;
	export type Identifier = string;
	export type Value = null | undefined | string;
	export type Result = 'no' | 'yes' | 'maybe' | 'value';
	export type Match = Result | PathError;

	export namespace RegExp {

		export type IdResults = [string, string];

		export type ValResults = [string, string];

		export type Results =
			SegmentResult.Root |
			SegmentResult.Route |
			SegmentResult.Star |
			SegmentResult.Value;

		export namespace SegmentResult {
			export type Root = [
				string,
				undefined,
				undefined,
				undefined,
				undefined]
			export type Route = [
				undefined,
				undefined,
				string,
				undefined,
				undefined]
			export type Star = [
				undefined,
				string,
				string,
				undefined,
				undefined]
			export type Value = [
				undefined,
				string,
				string,
				string,
				string
				] | [
				undefined,
				undefined,
				string,
				string,
				string];
		}

	}
}