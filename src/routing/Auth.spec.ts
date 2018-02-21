import {expect} from 'chai';
import {Auth}   from './';



describe('Auth', function () {
	describe('statics', function () {
		describe('create()', function () {
			it('should default to here and nested to true', function () {
				let auth: Auth;
				expect(() => auth = Auth.create()).to.not.throw();
				expect(auth.here).to.be.true;
				expect(auth.nested).to.be.true;
				expect(auth.source).to.be.undefined;
				expect((auth.created - Date.now())).to.be.lessThan(5);

				expect(() => auth = Auth.create(false)).to.not.throw();
				expect(auth.here).to.be.false;
				expect(auth.nested).to.be.true;
				expect(auth.source).to.be.undefined;
				expect((auth.created - Date.now())).to.be.lessThan(5);

				expect(() => auth = Auth.create(false, false)).to.not.throw();
				expect(auth.here).to.be.false;
				expect(auth.nested).to.be.false;
				expect(auth.source).to.be.undefined;
				expect((auth.created - Date.now())).to.be.lessThan(5);
				//
				expect(() => auth = Auth.create(undefined, false)).to.not.throw();
				expect(auth.here).to.be.true;
				expect(auth.nested).to.be.false;
				expect(auth.source).to.be.undefined;
				expect((auth.created - Date.now())).to.be.lessThan(5);
			});
		});

		describe('from(\n)', function () {
			it('should merge a stack of auths', function () {
				let auth: Auth;
				let auth1 = Auth.create(false, false);
				let auth2 = Auth.create(false, false);
				expect(() => { auth = Auth.from([auth1, auth2]) }).to.not.throw();
				expect(auth.here).to.be.false;
				expect(auth.nested).to.be.false;
				expect(auth.source[1]).to.be.equal(auth1);
				expect(auth.source[2]).to.be.equal(auth2);
			});

		});

		describe('instances', function () {

		});
	});
});