import { expect } from 'chai';
import * as CC from './CaseChange';


describe('CaseChange method ', function () {
	let testString = ['this', 'is', 'just', 'a', 'test', 'yo'];
	describe('separateWords()', function () {
		it('should break words at lower to upper case transitions', function () {
			expect(CC.separateWords('firstTest')).to.deep.equal(['first', 'test']);
		});
		it('should break words and numbers apart', function () {
			expect(CC.separateWords('test123test456Test')).to.deep.equal(['test', '123', 'test', '456', 'test']);
		});
		it('should recognize all separators and multiples of each', function () {
			expect(CC.separateWords('this-is____just |||a.test:yo')).to.deep.equal(testString);
		});
		it('should strip unknown characters as separators', function () {
			expect(CC.separateWords('this-is____just!!¶•¶•a.test:yo')).to.deep.equal(testString);
		});
	});
	describe('handleCapsAndJoin()', function () {
		it('should properly output capitalization and add separators', function () {
			expect(CC.handleCapsAndJoin(testString, ' ', CC.To.upper)).to.equal('THIS IS JUST A TEST YO');
			expect(CC.handleCapsAndJoin(testString, '', CC.To.title)).to.equal('ThisIsJustATestYo');
			expect(CC.handleCapsAndJoin(testString, ' booga ', CC.To.title)).to.equal('This booga Is booga Just booga A booga Test booga Yo');
		});
	});
});