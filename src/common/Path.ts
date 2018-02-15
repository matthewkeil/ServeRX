import {
	isArray,
	isString,
	isError
} from 'util';

import {Segment} from './Segment';
import {	PathError} from './Errors';

type Input = Path.Input;
type Match = Path.Match;
type Results = Path.Results;

export class Path extends Array<Segment> {

	public static ValidIdentifier = Segment.ValidIdentifier;
	public static ValidValue      = Segment.ValidValue;
	public static ValidSegment    = Segment.ValidSegment;
	public static validId         = Segment.validId;
	public static validValue      = Segment.validValue;
	public static validSegment    = Segment.valid;

	public static ValidPath = /^(~?)(?:\/?([^~?#\/]*))*$/;

	public static validate(arg: any, create: boolean = true): PathError | Segment.I[] | Path | undefined {

		let finalize = (path: Segment.I[]) => create
			? new Path(path.map(seg => new Segment(seg)))
			: [...path].map(seg => [...seg]);

		if (arg instanceof Path) return <Path>finalize(arg);

		let error: undefined | PathError;
		let test: undefined | string[];
		let valid: Segment.I[] = [];

		if (isString(arg))
			if (Path.ValidPath.test(arg))
				test = arg.split('/').filter(value => value !== '');
			else return undefined;

		test = test
			? test
			: arg;

		if (isArray(test)) {
			test.forEach((segment, index) => {
				let results = Path.validSegment(segment);

				if (!results || isError(results))
					error = error || new PathError('invalid segment found', segment);
				else valid.push(results);

				if (segment[0] === '~' && (index !== 0))
					error = new PathError('root segment must be at the beginning of a path', arg);
			});
		}

		return valid.length === 0
			? undefined
			: error
					 ? error
					 : <Path | Segment.I[]>finalize(valid);
	}

	public static match(_path: Input, _here: Input): Match {

		let results: Results = [];
		let match: any = [results, undefined];

		let path = <Path>Path.validate(_path);
		if (!path || isError(path))
			return [results.concat('no'), path || new PathError('path is invalid', _path)];

		let here = <Path>Path.validate(_here);
		if (!here || isError(here))
			return [results.concat('no'), here || new PathError('here is invalid', _here)];

		if (path.length >= here.length) {

			for (let i = 0; i < here.length; i++) {
				let result = path[i].is(here[i]);

				results.push(result);

				if (result === 'no') {
					match[1] = new PathError('path not along this path', [_path, _here]);
					break;
				}
			}

		} else match[1] = new PathError('path is shorter than the route here', [_path, _here]);

		match[1] = match[1] || path;

		return <Match>match;
	}

	get last(): Segment {
		return this[this.length - 1];
	}

	set last(arg: Segment) {

		let valid = Path.validSegment(arg);

		if (!valid || isError(valid))
			throw new PathError('cannot set path.last to an invalid segment', arg);

		this[this.length - 1] = new Segment(valid);
	}

	get isFromRoot(): boolean {
		return this[0] && (this[0][0] === '~');
	}

	public id = this.last.id;

	public val = this.last.val;

	constructor(arg: any) {
		super();

		let results = <Segment.I[]>Path.validate(arg, false);
		if (!results || (results instanceof Error))
			throw results || new PathError('cannot built Path with an invalid Input', arg);

		this.concat(results.map(seg => new Segment(seg)));
	}

	public is = (here: Input) => Path.match(this, here);
}
export namespace Path {
	export type Input = string | Segment.I | Segment[] | Path;
	export type Results = Segment.Result[];
	export type Match = [Results, Path | Error];
	// export type OverlapIndex = number;
	// export type BranchIndex = number;
}