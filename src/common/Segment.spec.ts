import 'mocha';
import {expect}    from 'chai';
import {PathError} from './';
import {Segment}   from './index';



describe('Segment', function () {

	describe('RegExp', function () {

		describe('ValidIdentifier', function () {

			let seg: string = '~';

			let result: {
				root?: string;
				seg?: string;
			} = {root: '~'};

			let results = (index: number = 0) => {
				let _results   = <RegExpExecArray>[seg, result.root, result.seg];
				_results.index = index;
				_results.input = seg;
				return _results;
			};

			it('should recognize the root character', function () {
				expect(Segment.ValidIdentifier.exec(seg)).to.deep.equal(results());
			});
			it('should allow for a leading "/"', function () {
				seg    = '/booga';
				result = {seg: 'booga'};
				expect(Segment.ValidIdentifier.exec(seg)).to.deep.equal(results());
			});
			it('should allow for the ":" parameter denotation', function () {
				seg    = '/:booga';
				result = {seg: ':booga'};
				expect(Segment.ValidIdentifier.exec(seg)).to.deep.equal(results());
			});
			it('should only allow valid object JS property names', function () {
				seg    = '-ooga_Booga_boo03453';
				result = {seg};
				expect(Segment.ValidIdentifier.exec(seg)).to.deep.equal(results());
			});
			it('should stop capturing if "=" is encountered', function () {
				seg    = 'booga=';
				result = {seg: 'booga'};
				expect(Segment.ValidIdentifier.exec(seg)).to.deep.equal(results());
			});
		});

		describe('ValidValue', function () {

			let index = 0;
			let val   = 'stringValue';
			let result: {
				eq?: string;
				val?: string;
			};

			let results = () => {
				let _results   = <RegExpExecArray>[val, result.val];
				_results.index = index;
				_results.input = val;
				return _results;
			};

			it('should recognize valid string values', function () {
				result = {val};
				expect(Segment.ValidValue.exec(val)).to.deep.equal(results());
			});

			it('should return a valid result for an empty string', function () {
				val    = '';
				result = {val};
				expect(Segment.ValidValue.exec('')).to.deep.equal(results());
			});

			it('should start at an equal sign if it passes a valid identifier', function () {
				val    = 'wham=bam';
				result = {val: 'bam'};
				expect(Segment.ValidValue.exec(val)).to.deep.equal(results());
			});

			it('should stop at a trailing slash', function () {
				let input = 'wham=bam/boom';
				val       = 'wham=bam/';
				result    = {val: 'bam'};
				expect(Segment.ValidValue.exec(input)).to.deep.equal(results());
			});

		});

		describe('ValidSegment', function () {

			let input        = '~';
			let root         = '~';
			let noParam: any = undefined;
			let param        = ':';
			let id;
			let eq           = '=';
			let val;
			let index        = 0;

			type Result = {
				root?: string;
				noParam?: string;
				param?: string;
				id?: string | undefined;
				eq?: string;
				val?: string;
			};
			let result: Result = {root, param: undefined};

			let results = (_result: Result = result) => {
				let _results = <RegExpExecArray>[input];
				(<any>_results).push(
					_result.root,
					_result.param
						? param
						: noParam,
					_result.id,
					_result.eq,
					_result.val);
				_results.index = index;
				_results.input = input;
				return _results;
			};

			it('should recognize the root character', function () {
				let _results       = results();
				(<any>_results)[2] = undefined;
				expect(Segment.ValidSegment.exec(input)).to.deep.equal(_results);
			});
			it('should allow for a leading "/"', function () {
				input  = '/booga';
				result = {id: 'booga'};
				expect(Segment.ValidSegment.exec(input)).to.deep.equal(results());
			});
			it('should allow for a trailing "/"', function () {
				input  = 'booga/';
				result = {id: 'booga'};
				expect(Segment.ValidSegment.exec(input)).to.deep.equal(results());
			});
			it('should recognize the ":" parameter denotation', function () {
				input  = ':booga';
				result = {param, id: 'booga'};
				expect(Segment.ValidSegment.exec(input)).to.deep.equal(results());
			});
			it('should only allow valid object JS property names', function () {
				input  = '-ooga_Booga_boo03453';
				result = {id: input};
				expect(Segment.ValidSegment.exec(input)).to.deep.equal(results());
			});

			it('should recognize value params', function () {
				input  = 'booga=boo';
				result = {id: 'booga', eq, val: 'boo'};
				expect(Segment.ValidSegment.exec(input)).to.deep.equal(results());

				input  = ':booga=boo';
				result = {param, id: 'booga', eq, val: 'boo'};
				expect(Segment.ValidSegment.exec(input)).to.deep.equal(results());

				input  = '/:booga=boo/';
				result = {param, id: 'booga', eq, val: 'boo'};
				expect(Segment.ValidSegment.exec(input)).to.deep.equal(results());
			});

			it('shouldn\'t recognize values without an id', function () {
				input = '=boo';
				expect(Segment.ValidSegment.exec(input)).to.be.null;
			});
		});
	});

	describe('static methods', function () {

		describe('validId()', function () {

			it('should recognize the root character', function () {
				expect(Segment.validId('~')).to.equal('~');
			});

			it('should only return a value for strings', function () {
				try {
					expect(Segment.validId(3)).to.throw;
					expect(Segment.validId({})).to.throw;
					expect(Segment.validId(['identifier'])).to.throw;
					expect(Segment.validId(true)).to.throw;
				} catch (err) {
					expect(err).to.be.an.instanceof(PathError);
				}
			});

			it('return an error for invalid strings', function () {
				try {
					expect(Segment.validId('&34')).to.throw;
				} catch (err) {
					expect(err).to.be.an.instanceof(PathError);
				}
			});

			it('should return params with the ":" param denominator', function () {
				expect(Segment.validId(':users')).to.equal(':users');
			});
		});

		describe('validValue()', function () {
			it('should return an error for invalid values', function () {
				try {
					expect(Segment.validValue(3)).to.throw;
					expect(Segment.validValue({})).to.throw;
					expect(Segment.validValue(['identifier'])).to.throw;
					expect(Segment.validValue(true)).to.throw;
				} catch (err) {
					expect(err).to.be.an.instanceof(PathError);
				}
			});

			it('return null for null and string value of "null', function () {
				expect(Segment.validValue('null')).to.be.null;
				expect(Segment.validValue(null)).to.be.null;
			});

			it('return undefined for undefined and string value of "undef" and "undefined"', function () {
				expect(Segment.validValue('undef')).to.be.undefined;
				expect(Segment.validValue('undefined')).to.be.undefined;
				expect(Segment.validValue(undefined)).to.be.undefined;
			});
		});

		describe('valid()', function () {

			it('should recognize Segment instance', function () {
				expect(Segment.valid(new Segment(['~', null]))).to.deep.equal(['~', null]);
			});

			describe('should recognize strings', function () {
				let seg: string    = 'users';
				let SEG: Segment.I = ['users', null];

				it('should capture valid string identifiers', function () {
					expect(Segment.valid(seg)).to.deep.equal(SEG);
				});

				it('should recognize the root "~" identifier', function () {
					seg = '~';
					SEG = ['~', null];
					expect(Segment.valid(seg)).to.deep.equal(SEG);
				});

				it('should return an error if anything other than "~" is found', function () {
					try {
						expect(Segment.valid('~=error')).to.throw;
					} catch (err) {
						expect(err).to.be.an.instanceof(PathError);
					}
				});

				it('should ignore preceding and trailing slashes', function () {
					seg = '/users/';
					SEG = ['users', null];
					expect(Segment.valid(seg)).to.deep.equal(SEG);
				});

				it('should recognize star parameters', function () {
					seg = ':users';
					SEG = [':users', '*'];
					expect(Segment.valid(seg)).to.deep.equal(SEG);
				});

				it('should recognize parameters with values', function () {
					seg = 'users=mkeil';
					SEG = [':users', 'mkeil'];
					expect(Segment.valid(seg)).to.deep.equal(SEG);

					seg = '/:users=mkeil/';
					SEG = [':users', 'mkeil'];
					expect(Segment.valid(seg)).to.deep.equal(SEG);

					seg = 'users=';
					SEG = [':users', undefined];
					expect(Segment.valid(seg)).to.deep.equal(SEG);
				});

				/**
				 *
				 *
				 * Placeholder for more advanced value recognition
				 *
				 *
				 */
				// it('should return an error if a valid id is found but there is an invalid value', function () {
				// 	try {
				// 		expect((<any>Segment).valid('/:users', {invalid: 'value'})).to.throw;
				// 	} catch (err) {
				// 		expect(err).to.be.an.instanceof(PathError);
				// 	}
				// });
			});

			describe('should recognize Segment.I\'s', function () {

				it('should return undefined if no valid id (ie. not a Segment Array)', function () {
					expect((<any>Segment).valid([{}, 'validValue'])).to.be.undefined;
				});

				it('should return an error if there is a valid id but invalid value', function () {
					try {
						expect(Segment.valid(3)).to.throw;
					} catch (err) {
						expect(err).to.be.an.instanceof(PathError);
					}
				});
				it('should return an error if a valid id is found but there is an invalid value', function () {
					try {
						expect((<any>Segment).valid('/:users', {invalid: 'value'})).to.throw;
					} catch (err) {
						expect(err).to.be.an.instanceof(PathError);
					}
				});

				it('should return an error if there is a id/val isParam mismatch', function () {
					try {
						expect(Segment.valid([':badParam', null])).to.throw;
					} catch (err) {
						expect(err).to.be.an.instanceof(PathError);
					}

					try {
						expect(Segment.valid(['badRoute', 'undefined'])).to.throw;
					} catch (err) {
						expect(err).to.be.an.instanceof(PathError);
					}
				});
			});
		});

		describe('match()', function () {
			it('should return an error for invalid parameters', function () {
				let here = 3;
				let path = 'valid/path';

				try {
					expect((<any>Segment).match(path, here)).to.throw;
				} catch (err) {
					expect(err).to.be.an.instanceof(PathError);
				}

				try {
					expect((<any>Segment).match(here, path)).to.throw;
				} catch (err) {
					expect(err).to.be.an.instanceof(PathError);
				}
			});

			describe('should return "yes" for exact matches', function () {
				/**
				 * Exact matches
				 *      path         here
				 *      users         ['users', null]      internal or external routing
				 *      :users      [':users', '*']      internal routing
				 *      users=mkeil   [':users', 'mkeil]   internal or external routing
				 */
				it('internal path routing', function () {
					expect(Segment.match(['users', null], ['users', null])).to.equal('yes');
				});
				it('external path routing', function () {
					expect(Segment.match('users', ['users', null])).to.equal('yes');
				});
				it('internal star param routing', function () {
					expect(Segment.match(':users', [':users', '*'])).to.equal('yes');
				});
				it('internal value param routing', function () {
					expect(Segment.match(':users=mkeil', [':users', 'mkeil'])).to.equal('yes');
				});
				it('external value param routing', function () {
					expect(Segment.match('users=mkeil', [':users', 'mkeil'])).to.equal('yes');
				});
			});

			describe('should recognize values that come in as parameter strings', function () {

				/** Value Matches
				 *   // value specific parameter handler
				 *   path         here
				 *   mkeil         [':users', 'mkeil']
				 */
				it('should return "value" if the path.id equals the here.val', function () {
					expect(Segment.match('mkeil', [':users', 'mkeil'])).to.equal('value');
				});

				/** Loose Matches
				 *   // star parameter that passes value to handler function
				 *   path         here
				 *   mkeil         [':users', '*']
				 *
				 *   // handler containing value parameters that need to be searched
				 *   path         here
				 *   mkeil         [':users', undefined]
				 */
				it('should return "maybe" if here is a star or value param', function () {
					expect(Segment.match('mkeil', [':users', '*'])).to.equal('maybe');
					expect(Segment.match('mkeil', [':users', undefined])).to.equal('maybe');
				});
			});
		});
	});

	describe('instance', function () {

		describe('segment.id', function () {

			let seg = new Segment('users');

			it('may only be updated with a valid identifier', function () {
				try {
					expect((<any>seg).id = {invalid: 'id'}).to.throw;
				} catch (err) {
					expect(err).to.be.instanceof(PathError);
				}
			});

			it('updates segment value if id switches from route to param', function () {
				expect(seg.val).to.be.null;
				seg.id = ':users';
				expect(seg.val).to.be.undefined;
			});

			it('updates segment value if id switches from param to route', function () {
				seg.id = 'users';
				expect(seg.val).to.be.null;
			});
		});

		describe('segment.val', function () {

			let seg = new Segment('users');

			it('may only be updated with a valid value', function () {
				try {
					expect((<any>seg).val = {invalid: 'val'}).to.throw;
				} catch (err) {
					expect(err).to.be.instanceof(PathError);
				}
			});

			it('updates segment id if val switches from route to param', function () {
				expect(seg.id.startsWith(':')).to.be.false;
				seg.val = undefined;
				expect(seg.id.startsWith(':')).to.be.true;
			});

			it('updates segment id if val switches from param to route', function () {
				seg.val = null;
				expect(seg.id.startsWith(':')).to.be.false;
			});
		});

		describe('segment.isParam', function () {
			it('should correctly identify if a param or route', function () {
				expect(new Segment('users').isParam).to.be.false;
				expect(new Segment(':users').isParam).to.be.true;
			});
		});

		describe('segment.is()', function () {
			it('should return "no" if there is an error', function () {
				expect(new Segment('users').is(<any>['bad', {param: 'value'}])).to.equal('no')
			});
		});
	});
});