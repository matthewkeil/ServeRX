import {expect} from 'chai';

import {
	Segment,
	Path,
	PathError
} from './';



describe('Path', function () {

	describe('ValidPath RegExp', function () {

		let input: string;
		let results: any;

		it('should recognize the root "~" denotation', function () {
			input   = '~';
			results = ['~', '~', undefined];
			expect(Path.ValidPath.exec(input)).to.deep.equal(results);

			input   = '~/';
			results = ['~/', '~', ''];
			expect(Path.ValidPath.exec(input)).to.deep.equal(results);
		});

		it('should recognize routes', function () {
			input   = '/booga=boo/boom/:bam';
			results = ['/booga=boo/boom/:bam', '', ':bam'];
			expect(Path.ValidPath.exec(input)).to.deep.equal(results);
		});
	});

	describe('valid()', function () {
		describe('should recognize strings', function () {

			let path: Path.Input = '~';
			let PATH: Path.I     = [['~', null]];

			describe('recognize the root indicator', function () {
				it('should recognize the root indicator', function () {
					expect(Path.valid(path, false)).to.deep.equal(PATH);
				});

				it('should only allow the root indicator to be first', function () {
					path = '/booga/~/boo/';
					expect(Path.valid(path)).to.be.undefined;
				});


				it('root indicator must be followed by a slash', function () {
					path = '~booga/boo/';
					try {
						expect(Path.valid(path)).to.throw;
					} catch (err) {
						expect(err).to.be.instanceof(PathError);
					}
				});
			});

			it('should split strings while not being affected by "/"', function () {
				path = '/booga/boo';
				PATH = [['booga', null], ['boo', null]];
				expect(Path.valid(path)).to.deep.equal(PATH);

				path = '/booga/boo/';
				PATH = [['booga', null], ['boo', null]];
				expect(Path.valid(path)).to.deep.equal(PATH);

				path = '/booga//boo/';
				PATH = [['booga', null], ['boo', null]];
				expect(Path.valid(path)).to.deep.equal(PATH);

				path = 'booga/boo/';
				PATH = [['booga', null], ['boo', null]];
				expect(Path.valid(path)).to.deep.equal(PATH);

				path = '~/booga/boo';
				PATH = [['~', null], ['booga', null], ['boo', null]];
				expect(Path.valid(path)).to.deep.equal(PATH);
			});
		});

		describe('should recognize Segment.I[]', function () {

			let path: Segment.I[] = [['bo#oga&"', null], ['#?boo', null]];

			it('should return undefined if no valid segments are found', function () {
				expect(Path.valid(path)).to.be.undefined;
			});

			it('should only throw if a valid segment is found as well', function () {
				path = [['valid', null], ['bo#oga&"', null], ['#?boo', null]];
				try {
					expect(Path.valid(path)).to.throw;
				} catch (err) {
					expect(err).to.be.instanceof(PathError);
				}
			});

			it('should only allow the root indicator to be first', function () {
				path     = [['~', null], ['booga', null], ['boo', null]];
				let PATH = [['~', null], ['booga', null], ['boo', null]];
				expect(Path.valid(path, false)).to.deep.equal(PATH);

				path = [['booga', null], ['~', null], ['boo', null]];
				try {
					expect(Path.valid(path)).to.throw;
				} catch (err) {
					expect(err).to.be.instanceof(PathError);
				}
			});
		});
	});

	describe('match()', function () {
		it('should return an error for invalid parameters', function () {
			let bad  = [['~', null], ['invalid', {path: 'value'}]];
			let good = '~/valid/path';

			try {
				expect((<any>Path).match(good, bad)).to.throw;
			} catch (err) {
				expect(err).to.be.an.instanceof(PathError);
			}

			try {
				expect((<any>Path).match(bad, good)).to.throw;
			} catch (err) {
				expect(err).to.be.an.instanceof(PathError);
			}
		});

		let path = '~/valid';
		let here = '~/valid/path';
		it('should return an error if path to short to reach "here"', function () {

			try {
				expect(Path.match(path, here)).to.throw;
			} catch (err) {
				expect(err).to.be.an.instanceof(PathError);
			}
		});

		it('should return an error if paths don\'t match', function () {
			path = '~/path/not/to/here';
			here = '~/path/to/here';

			try {
				expect(Path.match(path, here)).to.throw;
			} catch (err) {
				expect(err).to.be.an.instanceof(PathError);
			}
		});

		it('should return valid results array if paths overlap', function () {
			path        = '/valid/path/to/there';
			here        = 'valid/path/to';
			let results = ['yes', 'yes', 'yes'];
			expect(Path.match(path, here)).to.deep.equal(results);
		});
	});

	describe('path.last', function () {

		let path = new Path('~/booga/:boo');
		it('should return the last segment of the Path', function () {
			expect(path.last).to.deep.equal([':boo', '*']);
		});

		it('should only be able to be set to a valid segment', function () {
			let good     = 'good';
			let bad: any = ['bad', {segment: true}];

			expect(path.last = good).to.equal(good);
			expect(path.last).to.deep.equal(['good', null]);

			try {
				expect(path.last = bad).to.throw;
			} catch (err) {
				expect(err).to.be.an.instanceof(PathError);
			}
		});
	});

	describe('path.isFromRoot', function () {

		it('should only be true if from root', function () {
			let path = new Path('~/booga/boom=shakalaka');
			expect(path.isFromRoot).to.be.true;

			path = new Path('booga/boom=shakalaka');
			expect(path.isFromRoot).to.be.false;
		});
	});

});