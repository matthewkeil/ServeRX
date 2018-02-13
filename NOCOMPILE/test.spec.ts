import { spy } from 'sinon';
import { expect } from 'chai';

describe('console spy', function () {
	let logSpy = spy(console, 'log');
	let num = 123;
	console.log(`testing${num}`);
	expect(logSpy.calledWith('testing123')).to.be.true;
});