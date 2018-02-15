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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGF0aC5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiUGF0aC5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNEJBQWtDO0FBQ2xDLCtCQUFnQztBQUNoQyx5QkFJOEI7QUFFOUIsK0JBQWdDO0FBSWhDLGdCQUFvRSxFQUFLLEVBQ2pELEtBQVMsRUFDVCxPQUFnQjtJQUV2QyxzQkFBc0IsR0FBUTtRQUM3QixFQUFFLENBQUMsQ0FBQyxLQUFLLElBQUksR0FBRyxZQUFZLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFFcEMsQ0FBQztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLFlBQVksS0FBSyxDQUFDO1lBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztJQUM5QyxDQUFDO0lBRUQsSUFBSSxDQUFDO1FBQ0osSUFBSSxPQUFPLEdBQUcsRUFBRSxFQUFFLENBQUM7UUFDbkIsT0FBTyxHQUFPLGNBQU8sQ0FBQyxPQUFPLENBQUM7Y0FDM0IsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2NBQ3BCLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFYixPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBVztZQUMzQixZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdEIsQ0FBQyxDQUFDLENBQUM7SUFFSixDQUFDO0lBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNkLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNuQixDQUFDO0FBQ0YsQ0FBQztBQUVELFFBQVEsQ0FBQyxNQUFNLEVBQUU7SUFFaEIsUUFBUSxDQUFDLFVBQVUsRUFBRTtRQUVwQixJQUFJLElBQUksR0FBcUIsSUFBSSxDQUFDO1FBQ2xDLElBQUksSUFBSSxHQUFxQixDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ25DLElBQUksT0FBTyxHQUFrQixPQUFJLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxLQUFLLENB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SSxPQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN4RCxJQUFJLFFBQVEsR0FBRyxJQUFJLE9BQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFFN0QsSUFBSSxPQUFPLEdBQUssSUFBSSxPQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLENBQUMsT0FBTyxFQUFFLFdBQVcsQ0FBQyxFQUFFLENBQUMsV0FBVyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzRixJQUFJLEtBQUssR0FBTyxJQUFJLE9BQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQztRQUN0RCxJQUFJLFNBQVMsR0FBRyxJQUFJLE9BQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDOUQsQ0FBQyxDQUFDLENBQUM7QUFFSixDQUFDLENBQUMsQ0FBQyJ9