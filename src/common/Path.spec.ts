import * as _       from 'lodash';
import {expect}     from 'chai';
import {
	Segment,
	Path,
	PathError
}                   from './';
import {StackError} from './Errors';
import {isArray}    from 'util';



function throws<T extends Function, U extends Error['constructor']>(fn: T,
																						  error?: U,
																						  message?: string) {

	function processError(arg: any) {
		if (error && arg instanceof error) {

		} else if (arg instanceof Error) return true;
	}

	try {
		let results = fn();
		results     = isArray(results)
			? [_.flatten(results)]
			: [results];

		results.forEach((result: any) => {
			processError(result);
		});

	} catch (err) {
		processError(err);
	}
}

describe('Path', function () {

	describe('validate', function () {

		let path: Path.MatchString = '~/';
		let PATH: Path.MatchString = ['~'];
		let results                = Path.validate(path, false);

		it('should recognize the root indicator', function () {
			expect(results).to.deep.equal(PATH);
		});

		it('should only allow the root indicator to be first', function () {
			path    = ['booga', '~', 'boo'];
			results = Path.validate(path);
			expect(results).to.throw;
		});

		it('should split segmented strings properly', function () {
			path    = '~/booga/boo';
			PATH    = ['~', 'booga', 'boo'];
			results = Path.validate(path);
			expect(results).to.deep.equal(PATH);

			path    = '/booga/boo';
			PATH    = ['booga', 'boo'];
			results = Path.validate(path);
			expect(results).to.deep.equal(PATH);

			path    = '/booga/boo/';
			PATH    = ['booga', 'boo'];
			results = Path.validate(path);
			expect(results).to.deep.equal(PATH);

			path    = '/booga//boo/';
			PATH    = ['booga', 'boo'];
			results = Path.validate(path);
			expect(results).to.throw;

			path    = 'booga/boo/';
			PATH    = ['booga', 'boo'];
			results = Path.validate(path);
			expect(results).to.deep.equal(PATH);
		});

		it('should return undefined if no valid segments are found', function () {
			path    = ['bo#oga&"', '#?boo'];
			results = Path.validate(path);
			expect(results).to.equal(undefined);
		});

		it('should only throw if a valid segment is found as well', function () {
			path    = ['valid1', 'bo#oga&"', '#?boo'];
			results = Path.validate(path);
			expect(results).to.throw;
		});

		it('should only throw if a valid segment is found as well', function () {
			(<any>path) = ['bo#oga&"', {invalid: 'bummer'}, 'valid2'];
			results     = Path.validate(path);
			expect(results).to.be.instanceof(PathError);
		});

	});

	describe('path.last', function () {

		let path = new Path(['~', 'booga', [':boo', null]]);
		it('should return the last segment of the Path', function () {
			expect(path.last).to.deep.equal([':boo', null]);
		});

		it('should only be able to be set to a valid segment', function () {
			let good     = 'good';
			let bad: any = ['bad', {segment: true}];

			expect(path.last = good).to.equal(good);
			expect(path.last = bad).to.throw;
		});
	});

	describe('path.identifier', function () {

		let path = new Path(['~', 'booga', [':boo', null]]);
		it('should return the last identifier of the Path', function () {
			expect(path.identifier).to.equal(':boo');
		});

		it('should only be able to be set to a valid identifier', function () {
			let good     = 'good';
			let bad: any = {booga: 'boo'};

			expect(path.identifier = good).to.equal(good);
			expect(path.identifier = bad).to.throw;
		});
	});

	describe('path.value', function () {

		let path = new Path(['~', 'booga', [':boom', 'shakalaka']]);
		it('should return the last value of the Path', function () {
			expect(path.value).to.equal('shakalaka');
		});

		it('should only be able to be set to a valid value', function () {
			let good     = 'shaboom';
			let bad: any = {booga: 'boo'};

			expect(path.value = good).to.equal(good);
			expect(path.value = bad).to.throw;
		});
	});

	describe('path.isFromRoot', function () {

		let path = new Path(['~', 'booga', [':boom', 'shakalaka']]);
		it('should only be true if from root', function () {
			expect(path.isFromRoot).to.be.true;

			path = new Path(['booga', [':boom', 'shakalaka']]);
			expect(path.isFromRoot).to.be.false;
		});
	});

	describe('path.isHere()', function () {

		let path = new Path(['~', 'booga', 'boo']);

		it('should only be able to match valid paths', function () {
			let bad = '~/Bad~Bad/path';
			console.log(Path.match(bad, path)[1]);
			expect((<Error>Path.match(bad, path)[1]).message).to.deep.equal(['path is invalid']);
			// expect((<Error>Path.match(bad, path)[1])).to.throw(Error)
			// 	.which.has.property('message', 'path is invalid');
			// result = [['no'], new PathError('here is invalid')];
			// expect((<Error>Path.match(path, bad)[1]).message).to.equal('here is invalid');
		});

		let isHere  = new Path(['~', 'booga', 'boo']);
		let notHere = new Path(['~', 'boo']);

		it('should match routes along similar paths', function () {
			let good = [['yes', 'yes', 'yes'], path];
			let bad  = [['yes', 'no']];

			expect(Path.match(path, isHere)).to.deep.equal(good);
			expect(Path.match(path, notHere)[1]).to.throw(PathError, /path not along this path/);
		});

		let isStar   = new Path(['~', 'booga', [':boo', null], 'baby']);
		let star     = new Path(['~', 'booga', [':boo', null]]);
		let alsoStar = new Path(['~', 'booga', 'shakalaka', 'baby']);

		let isValue   = new Path(['~', 'booga', [':boom', 'shakalaka'], [':badookie', undefined]]);
		let value     = new Path(['~', 'booga', 'shakalaka']);
		let alsoValue = new Path(['~', 'booga', 'shakalaka', 'bam']);
	});

});
