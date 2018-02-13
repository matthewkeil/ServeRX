import { expect } from 'chai';
import { TryCatch } from './TryAnd';

describe('TryCatch', function () {

	type _good<T> = (arg: T) => T;

	let goodNumber: _good<number> = (arg: number = 3) => arg;
	let goodString: _good<string> = (arg: string = 'booga') => arg;
	let goodArray: _good<number[]> = (arg: number[] = [1, 2]) => arg;

	let bad = (arg = 7, err: Error = new Error) => { throw err }

	let error = new Error('parameter')

	let errFunc = (e: Error) => {
		let err = new Error('func');
		(<any>err).error = e;
		return err;
	}

	it('should return correct values if no error', function () {
		expect(TryCatch(goodNumber)).to.equal(3);
		expect(TryCatch(goodString)).to.equal('booga');
		expect(TryCatch(goodArray)).to.deep.equal([1, 2]);
	});

	describe('should return an error if one is thrown', function () {
		it('should return a default error if one is thrown', function () {
			let test = <Error>TryCatch(bad);
			expect(test).to.throw;
			expect(test.message).to.equal('unhandled try/catch exception');
		});

		describe('should take an error parameter for return in failures', function () {
			it('should except an error for return', function () {
				expect((<Error>TryCatch(bad, error)).message).to.equal('parameter');
			});

		});

		it('should return an error with the thrown error attached as an error')

	});
});