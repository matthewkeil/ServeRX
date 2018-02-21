import {
	isArray,
	isString,
	isError
} from 'util';

import {Segment}   from './Segment';
import {PathError} from './Errors';

type ISegment = Segment.ISegment;
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

	public static valid(arg: any, create: boolean = true): PathError | ISegment[] | Path | undefined {

		let finalize = (path: Segment.I[]) => create
			? new Path(path.map(seg => new Segment(seg)))
			: [...path].map(seg => [...seg]);

		if (arg instanceof Path) return <Path>finalize(arg);

		let error: undefined | PathError;
		let test: undefined | string[];
		let valid: Segment.I[] = [];

		if (isString(arg)) {
			let results = Path.ValidPath.exec(arg);
			if (results)
				test = arg.split('/').filter(value => value !== '');
			else return undefined;
		}

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
					 : <Path | ISegment[]>finalize(valid);
	}

	public static match(_path: Input, _here: Input): Match {

		let results: Results = [];

		let path = <Path>Path.valid(_path);
		if (!path || isError(path))
			return new PathError('path is invalid', _path, path);

		let here = <Path>Path.valid(_here);
		if (!here || isError(here))
			return new PathError('here is invalid', _here, here);

		if (path.length >= here.length) {

			for (let i = 0; i < here.length; i++) {

				let result = path[i].is(here[i]);
				results.push(result);

				if (result === 'no')
					return new PathError('path not along this path', [_path, _here]);
			}

		} else return new PathError('path is shorter than the route here', [_path, _here]);

		return results;
	}


	get last() {
		return this.length === 0
			? ['', null]
			: this[this.length - 1];
	}

	set last(arg: Segment.I) {

		let seg: Segment;

		try {
			seg = new Segment(arg);
		}
		catch (err) {
			throw new PathError('cannot set path.last to an invalid segment', arg);
		}

		this[this.length - 1] = seg;
	}

	public id = this.last[0];
	public val = this.last[1];

	get isFromRoot(): boolean {
		return this[0] && (this[0][0] === '~');
	}


	constructor(arg: any) {
		super();

		let results = <Segment.I[]>Path.valid(arg, false);
		if (!results || (results instanceof Error))
			throw results || new PathError('cannot built Path with an invalid Input', arg);

		this.push(...results.map(seg => new Segment(seg)));
	}


	public is = (here: Input) => Path.match(this, here);
}
export namespace Path {
	export type IPath = ISegment[];
	export type I = IPath;
	export type Input = string | Segment.I | Segment.I[] | Path.I | Path;
	export type Results = Segment.Result[];
	export type Match = Results | Error;
	// export type OverlapIndex = number;
	// export type BranchIndex = number;
}