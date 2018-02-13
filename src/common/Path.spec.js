"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const chai_1 = require("chai");
const _1 = require("./");
const util_1 = require("util");
function throws(fn, error, message) {
    function processError(arg) {
        if (error && arg instanceof error) {
        }
        else if (arg instanceof Error)
            return true;
    }
    try {
        let results = fn();
        results = util_1.isArray(results)
            ? [_.flatten(results)]
            : [results];
        results.forEach((result) => {
            processError(result);
        });
    }
    catch (err) {
        processError(err);
    }
}
describe('Path', function () {
    describe('static functions', function () {
        describe('validateIdentifier()', function () {
            it('should only return a value for strings', function () {
                chai_1.expect(_1.Path.validateIdentifier(3)).to.equal(undefined);
                chai_1.expect(_1.Path.validateIdentifier({})).to.equal(undefined);
                chai_1.expect(_1.Path.validateIdentifier(['identifier'])).to.equal(undefined);
                chai_1.expect(_1.Path.validateIdentifier(true)).to.equal(undefined);
            });
            it('returns a valid string', function () {
                chai_1.expect(_1.Path.validateIdentifier(':A-Valid_Identifier0123'))
                    .to.equal(':A-Valid_Identifier0123');
                chai_1.expect(_1.Path.validateIdentifier('A-Valid_Identifier0123'))
                    .to.equal('A-Valid_Identifier0123');
            });
            it('return an error for invalid strings', function () {
                chai_1.expect(_1.Path.validateIdentifier('&34')).to.throw;
            });
        });
        describe('validateSegment()', function () {
            describe('recognizes strings', function () {
                it('should return the root identifier', function () {
                    chai_1.expect(_1.Path.validateSegment('~')).to.equal('~');
                });
                let results;
                let seg, SEG;
                it('should capture valid string identifiers', function () {
                    seg = 'users';
                    SEG = 'users';
                    results = _1.Path.validateSegment(seg);
                    chai_1.expect(results).to.equal(SEG);
                });
                it('should ignore preceding and trailing slashes', function () {
                    seg = '/users/';
                    SEG = 'users';
                    results = _1.Path.validateSegment(seg);
                    chai_1.expect(results).to.equal(SEG);
                });
                it('should recognize star parameters', function () {
                    seg = ':users';
                    SEG = [':users', null];
                    results = _1.Path.validateSegment(seg);
                    chai_1.expect(results).to.deep.equal(SEG);
                });
                it('should recognize parameters with values', function () {
                    seg = 'users=mkeil';
                    SEG = [':users', 'mkeil'];
                    results = _1.Path.validateSegment(seg);
                    chai_1.expect(results).to.deep.equal(SEG);
                    seg = '/:users=mkeil/';
                    SEG = [':users', 'mkeil'];
                    results = _1.Path.validateSegment(seg);
                    chai_1.expect(results).to.deep.equal(SEG);
                });
            });
            describe('recognizes parameters', function () {
                it('only takes arrays with two items', function () {
                    let SEG = [':users', null];
                    let seg = [':users', null];
                    chai_1.expect(_1.Path.validateSegment(seg)).to.deep.equal(SEG);
                    seg = [':users', null, 'booga'];
                    chai_1.expect(_1.Path.validateSegment(seg)).to.equal(undefined);
                    seg = [':users'];
                    chai_1.expect(_1.Path.validateSegment(seg)).to.equal(undefined);
                });
                it('allows for string, null and undefined as param values', function () {
                    let seg = [':users', null];
                    let SEG = [':users', null];
                    chai_1.expect(seg).to.deep.equal(SEG);
                    seg = [':users', undefined];
                    SEG = [':users', undefined];
                    chai_1.expect(seg).to.deep.equal(SEG);
                    seg = [':users', 'string'];
                    SEG = [':users', 'string'];
                    chai_1.expect(seg).to.deep.equal(SEG);
                });
            });
        });
        describe('validate', function () {
            let path = '~/';
            let PATH = ['~'];
            let results = _1.Path.validate(path, false);
            it('should recognize the root indicator', function () {
                chai_1.expect(results).to.deep.equal(PATH);
            });
            it('should only allow the root indicator to be first', function () {
                path = ['booga', '~', 'boo'];
                results = _1.Path.validate(path);
                chai_1.expect(results).to.throw;
            });
            it('should split segmented strings properly', function () {
                path = '~/booga/boo';
                PATH = ['~', 'booga', 'boo'];
                results = _1.Path.validate(path);
                chai_1.expect(results).to.deep.equal(PATH);
                path = '/booga/boo';
                PATH = ['booga', 'boo'];
                results = _1.Path.validate(path);
                chai_1.expect(results).to.deep.equal(PATH);
                path = '/booga/boo/';
                PATH = ['booga', 'boo'];
                results = _1.Path.validate(path);
                chai_1.expect(results).to.deep.equal(PATH);
                path = '/booga//boo/';
                PATH = ['booga', 'boo'];
                results = _1.Path.validate(path);
                chai_1.expect(results).to.throw;
                path = 'booga/boo/';
                PATH = ['booga', 'boo'];
                results = _1.Path.validate(path);
                chai_1.expect(results).to.deep.equal(PATH);
            });
            it('should return undefined if no valid segments are found', function () {
                path = ['bo#oga&"', '#?boo'];
                results = _1.Path.validate(path);
                chai_1.expect(results).to.equal(undefined);
            });
            it('should only throw if a valid segment is found as well', function () {
                path = ['valid1', 'bo#oga&"', '#?boo'];
                results = _1.Path.validate(path);
                chai_1.expect(results).to.throw;
            });
            it('should only throw if a valid segment is found as well', function () {
                path = ['bo#oga&"', { invalid: 'bummer' }, 'valid2'];
                results = _1.Path.validate(path);
                chai_1.expect(results).to.be.instanceof(_1.PathError);
            });
        });
    });
    describe('path.last', function () {
        let path = new _1.Path(['~', 'booga', [':boo', null]]);
        it('should return the last segment of the Path', function () {
            chai_1.expect(path.last).to.deep.equal([':boo', null]);
        });
        it('should only be able to be set to a valid segment', function () {
            let good = 'good';
            let bad = ['bad', { segment: true }];
            chai_1.expect(path.last = good).to.equal(good);
            chai_1.expect(path.last = bad).to.throw;
        });
    });
    describe('path.identifier', function () {
        let path = new _1.Path(['~', 'booga', [':boo', null]]);
        it('should return the last identifier of the Path', function () {
            chai_1.expect(path.identifier).to.equal(':boo');
        });
        it('should only be able to be set to a valid identifier', function () {
            let good = 'good';
            let bad = { booga: 'boo' };
            chai_1.expect(path.identifier = good).to.equal(good);
            chai_1.expect(path.identifier = bad).to.throw;
        });
    });
    describe('path.value', function () {
        let path = new _1.Path(['~', 'booga', [':boom', 'shakalaka']]);
        it('should return the last value of the Path', function () {
            chai_1.expect(path.value).to.equal('shakalaka');
        });
        it('should only be able to be set to a valid value', function () {
            let good = 'shaboom';
            let bad = { booga: 'boo' };
            chai_1.expect(path.value = good).to.equal(good);
            chai_1.expect(path.value = bad).to.throw;
        });
    });
    describe('path.isFromRoot', function () {
        let path = new _1.Path(['~', 'booga', [':boom', 'shakalaka']]);
        it('should only be true if from root', function () {
            chai_1.expect(path.isFromRoot).to.be.true;
            path = new _1.Path(['booga', [':boom', 'shakalaka']]);
            chai_1.expect(path.isFromRoot).to.be.false;
        });
    });
    describe('path.isHere()', function () {
        let path = new _1.Path(['~', 'booga', 'boo']);
        it('should only be able to match valid paths', function () {
            let bad = '~/Bad~Bad/path';
            console.log(_1.Path.match(bad, path)[1]);
            chai_1.expect(_1.Path.match(bad, path)[1].message).to.deep.equal(['path is invalid']);
            // expect((<Error>Path.match(bad, path)[1])).to.throw(Error)
            // 	.which.has.property('message', 'path is invalid');
            // result = [['no'], new PathError('here is invalid')];
            // expect((<Error>Path.match(path, bad)[1]).message).to.equal('here is invalid');
        });
        let isHere = new _1.Path(['~', 'booga', 'boo']);
        let notHere = new _1.Path(['~', 'boo']);
        it('should match routes along similar paths', function () {
            let good = [['yes', 'yes', 'yes'], path];
            let bad = [['yes', 'no']];
            chai_1.expect(_1.Path.match(path, isHere)).to.deep.equal(good);
            chai_1.expect(_1.Path.match(path, notHere)[1]).to.throw(_1.PathError, /path not along this path/);
        });
        let isStar = new _1.Path(['~', 'booga', [':boo', null], 'baby']);
        let star = new _1.Path(['~', 'booga', [':boo', null]]);
        let alsoStar = new _1.Path(['~', 'booga', 'shakalaka', 'baby']);
        let isValue = new _1.Path(['~', 'booga', [':boom', 'shakalaka'], [':badookie', undefined]]);
        let value = new _1.Path(['~', 'booga', 'shakalaka']);
        let alsoValue = new _1.Path(['~', 'booga', 'shakalaka', 'bam']);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGF0aC5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiUGF0aC5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsNEJBQTRCO0FBQzVCLCtCQUE4QjtBQUM5Qix5QkFBcUM7QUFFckMsK0JBQStCO0FBRS9CLGdCQUNDLEVBQUssRUFDTCxLQUFTLEVBQ1QsT0FBZ0I7SUFFaEIsc0JBQXNCLEdBQVE7UUFDN0IsRUFBRSxDQUFDLENBQUMsS0FBSyxJQUFJLEdBQUcsWUFBWSxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBRXBDLENBQUM7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxZQUFZLEtBQUssQ0FBQztZQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDOUMsQ0FBQztJQUVELElBQUksQ0FBQztRQUNKLElBQUksT0FBTyxHQUFHLEVBQUUsRUFBRSxDQUFDO1FBQ25CLE9BQU8sR0FBRyxjQUFPLENBQUMsT0FBTyxDQUFDO2NBQ3ZCLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztjQUNwQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRWIsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQVc7WUFDM0IsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3RCLENBQUMsQ0FBQyxDQUFDO0lBRUosQ0FBQztJQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7SUFBQyxDQUFDO0FBQ3JDLENBQUM7QUFHRCxRQUFRLENBQUMsTUFBTSxFQUFFO0lBRWhCLFFBQVEsQ0FBQyxrQkFBa0IsRUFBRTtRQUU1QixRQUFRLENBQUMsc0JBQXNCLEVBQUU7WUFDaEMsRUFBRSxDQUFDLHdDQUF3QyxFQUFFO2dCQUM1QyxhQUFNLENBQUMsT0FBSSxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FB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QUFDLENBQUMsQ0FBQztRQUNwRCxJQUFJLFFBQVEsR0FBRyxJQUFJLE9BQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFFN0QsSUFBSSxPQUFPLEdBQUcsSUFBSSxPQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLENBQUMsT0FBTyxFQUFFLFdBQVcsQ0FBQyxFQUFFLENBQUMsV0FBVyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN6RixJQUFJLEtBQUssR0FBRyxJQUFJLE9BQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQztRQUNsRCxJQUFJLFNBQVMsR0FBRyxJQUFJLE9BQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDOUQsQ0FBQyxDQUFDLENBQUM7QUFFSixDQUFDLENBQUMsQ0FBQyJ9