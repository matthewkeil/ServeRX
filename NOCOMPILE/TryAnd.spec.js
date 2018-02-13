"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const TryAnd_1 = require("./TryAnd");
describe('TryCatch', function () {
    let goodNumber = (arg = 3) => arg;
    let goodString = (arg = 'booga') => arg;
    let goodArray = (arg = [1, 2]) => arg;
    let bad = (arg = 7, err = new Error) => { throw err; };
    let error = new Error('parameter');
    let errFunc = (e) => {
        let err = new Error('func');
        err.error = e;
        return err;
    };
    it('should return correct values if no error', function () {
        chai_1.expect(TryAnd_1.TryCatch(goodNumber)).to.equal(3);
        chai_1.expect(TryAnd_1.TryCatch(goodString)).to.equal('booga');
        chai_1.expect(TryAnd_1.TryCatch(goodArray)).to.deep.equal([1, 2]);
    });
    describe('should return an error if one is thrown', function () {
        it('should return a default error if one is thrown', function () {
            let test = TryAnd_1.TryCatch(bad);
            chai_1.expect(test).to.throw;
            chai_1.expect(test.message).to.equal('unhandled try/catch exception');
        });
        describe('should take an error parameter for return in failures', function () {
            it('should except an error for return', function () {
                chai_1.expect(TryAnd_1.TryCatch(bad, error).message).to.equal('parameter');
            });
        });
        it('should return an error with the thrown error attached as an error');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHJ5QW5kLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJUcnlBbmQuc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtCQUE4QjtBQUM5QixxQ0FBb0M7QUFFcEMsUUFBUSxDQUFDLFVBQVUsRUFBRTtJQUlwQixJQUFJLFVBQVUsR0FBa0IsQ0FBQyxNQUFjLENBQUMsS0FBSyxHQUFHLENBQUM7SUFDekQsSUFBSSxVQUFVLEdBQWtCLENBQUMsTUFBYyxPQUFPLEtBQUssR0FBRyxDQUFDO0lBQy9ELElBQUksU0FBUyxHQUFvQixDQUFDLE1BQWdCLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQztJQUVqRSxJQUFJLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUUsTUFBYSxJQUFJLEtBQUssT0FBTyxNQUFNLEdBQUcsQ0FBQSxDQUFDLENBQUMsQ0FBQTtJQUU1RCxJQUFJLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQTtJQUVsQyxJQUFJLE9BQU8sR0FBRyxDQUFDLENBQVE7UUFDdEIsSUFBSSxHQUFHLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdEIsR0FBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7UUFDckIsTUFBTSxDQUFDLEdBQUcsQ0FBQztJQUNaLENBQUMsQ0FBQTtJQUVELEVBQUUsQ0FBQywwQ0FBMEMsRUFBRTtRQUM5QyxhQUFNLENBQUMsaUJBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekMsYUFBTSxDQUFDLGlCQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQy9DLGFBQU0sQ0FBQyxpQkFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNuRCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyx5Q0FBeUMsRUFBRTtRQUNuRCxFQUFFLENBQUMsZ0RBQWdELEVBQUU7WUFDcEQsSUFBSSxJQUFJLEdBQVUsaUJBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNoQyxhQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQztZQUN0QixhQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsK0JBQStCLENBQUMsQ0FBQztRQUNoRSxDQUFDLENBQUMsQ0FBQztRQUVILFFBQVEsQ0FBQyx1REFBdUQsRUFBRTtZQUNqRSxFQUFFLENBQUMsbUNBQW1DLEVBQUU7Z0JBQ3ZDLGFBQU0sQ0FBUyxpQkFBUSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ3JFLENBQUMsQ0FBQyxDQUFDO1FBRUosQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsbUVBQW1FLENBQUMsQ0FBQTtJQUV4RSxDQUFDLENBQUMsQ0FBQztBQUNKLENBQUMsQ0FBQyxDQUFDIn0=