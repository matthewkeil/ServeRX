

import { isArray, isString, isError, isNull, isUndefined } from 'util';


import { Handler } from '../routing';

import {
	PathError,
	HandlerError
} from './';



type Identifier = Path.Identifier;
type ParamValue = Path.ParamValue;
type Parameter = Path.Parameter;
type Segment = Path.Segment;
type MatchString = Path.MatchString;
type Match = Path.Match;


export class Path extends Array<Segment> {

	static ValidIdentifier = /^:?[-\w]*$/;
	static ValidSegment = /^\/?(:?)([-\w]+)(?:=([^\/]*))?\/?$/;
	static ValidPath = /^(~?)(?:\/?([^~?#/\/]*))*$/;

	/**     */
	static validateIdentifier = (arg: any): PathError | Identifier | undefined => {
		if (isString(arg)) {
			return Path.ValidIdentifier.test(arg)
				? <Identifier>arg
				: new PathError('invalid identifier', arg);
		}
		return undefined;
	}
	static validateSegment(arg: any): PathError | Segment | undefined {

		if (isString(arg)) {

			if (arg === '~') return '~';

			let results = <null | [string, string, string, string]>Path.ValidSegment.exec(arg);

			if (results === null) return undefined

			let [input, param, identifier, value] = results;

			return !(param === ':') && !value
				? <Identifier>identifier
				: value
					? <Parameter>[`:${identifier}`, value]
					: <Parameter>[`:${identifier}`, null];
		}

		if (isArray(arg) && (arg.length === 2)) {

			let identifier = arg[0];
			let value = arg[1];

			if (isString(identifier)
				&& identifier.startsWith(':')
				&& (isNull(value) || isUndefined(value) || isString(value))) {

				let test = Path.validateIdentifier(identifier);

				return test && !(test instanceof Error)
					? [test, value]
					: test || new PathError('invalid identifier', identifier);
			}

			return undefined
		}

		return undefined
	}
	static validate(arg: any, create = true): PathError | Segment[] | Path | undefined {

		if (arg instanceof Path) return arg;

		let test: undefined | null | string[];
		let valid: Segment[] = [];
		let error: undefined | PathError;

		if (isString(arg)) {

			test = Path.ValidPath.exec(arg);

			let split = (arg: string) => arg.split('/').filter(value => value !== '');

			if (test) {
				if (test[1] === '~') {
					valid.push('~');
					test = split(arg.substr(1));
				} else test = split(arg);
			} else return undefined;
		}

		test = test ? test : arg

		if (isArray(test)) {

			test.forEach((segment, index) => {

				if (isString(segment) && (segment === '~') && (index !== 0)) error = error ||
					new PathError('root segment must be at the beginning of a path', arg);

				let results = Path.validateSegment(segment);

				if (results) valid.push(<Segment>results)
				else error = error ? error : new PathError('invalid segment found', segment);
			});
		}

		return valid.length === 0
			? undefined
			: error
				? error
				: create
					? new Path(valid)
					: valid;
	}
	static match(_path: MatchString, _here: MatchString): Match {

		let results = <Path.Results[]>[];

		let path = Path.validate(_path);
		if (!path || isError(path))
			return [results.concat('no'), path || new PathError('path is invalid', _path)];

		let here = Path.validate(_here);
		if (!here || isError(here))
			return [results.concat('no'), here || new PathError('here is invalid', _here)];


		if (path.length >= here.length) {

			for (let i = 0; i < here.length; i++) {
				let pathSeg = path[i];
				let hereSeg = here[i];
				/**
				 *1 ./this/is/an/input				./this/is/a/route
				 *2										./this/[ is, undefined  ]/a/star/param
				 *3										./this/[ anyParam, 'is' ]/a/value/param
				 *4 ./this/:is/an/input				./this/[ is, undefined  ]/a/star/param
				 *5 ./this/is=anyValue/an/input	./this/[ is, 'anyValue' ]/a/parameter
				 */

				// matches 1, 4, 5
				if (pathSeg === hereSeg) {
					results.push('yes');
					continue;
				}

				if (isArray(hereSeg)) {
					// matches value param at end of here or a star handler that came in as a value
					if (!hereSeg[1] || (hereSeg[1] === '*')) {
						results.push('maybe');
						continue;
					}
					// matches value param mid-path
					if (isString(pathSeg) && (pathSeg === hereSeg[1])) {
						results.push('value')
						continue;
					}
				}

				results.push('no');
				path = new PathError('path not along this path', [_path, _here]);
				break;
			}

		} else path = new PathError('path is shorter than the route here', _path);

		return <Path.Match>[results, path];
	}


	get last(): Segment { return this[this.length - 1] }
	set last(arg: Segment) {
		let valid = Path.validateSegment(arg);
		if (!valid && isError(valid))
			throw new PathError('cannot set path.last to an invalid segment', arg);

		this[this.length - 1] = <Segment>valid;
	}
	get identifier(): Identifier {
		return isArray(this.last)
			? this.last[0]
			: this.last;
	}
	set identifier(arg: Identifier) {
		if (isArray(this.last)) {
			let [param, value] = this.last;
			this.last = [arg, value];
		} else this.last = arg;
	}
	get value(): Handler.Value {
		return isArray(this.last)
			? this.last[1]
			: null;
	}
	set value(arg: Handler.Value) {
		if (isArray(this.last)) {
			let [param, value] = this.last;
			this.last = [param, arg];
		} else throw new PathError('cannot set the value for a string segment', this.last);
	}
	get isFromRoot() {
		return isString(this[0]) && (this[0] === '~');
	}

	constructor(arg: any) {
		super();

		let results = <Segment[]>Path.validate(arg, false);
		if (!results || (results instanceof Error))
			throw results || new PathError('cannot built Path with an invalid MatchString', arg);

		this.push(...results);
	}

	public isHere(path: MatchString) { return Path.match(path, this) }

}
export namespace Path {
	export type OverlapIndex = number;
	export type BranchIndex = number;
	export type Identifier = string;
	export type ParamValue = null | undefined | string;
	export type Parameter = [Identifier, ParamValue];
	export type Segment = Identifier | Parameter;
	export type MatchString = string | Parameter | Segment[] | Path;
	export type Results = 'no' | 'yes' | 'maybe' | 'value' | 'check' | 'star';
	export type Match = [Results[], undefined | Path | Error];

}