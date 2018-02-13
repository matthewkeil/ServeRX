"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const CaseChange_1 = require("./CaseChange");
describe('CaseChange', function () {
    let testString = ['this', 'is', 'just', 'a', 'test', 'yo'];
    describe('separateWords()', function () {
        it('should break words at lower to upper case transitions', function () {
            chai_1.expect(CaseChange_1.CaseChange.separateWords('firstTest')).to.deep.equal(['first', 'test']);
        });
        it('should break words and numbers apart', function () {
            chai_1.expect(CaseChange_1.CaseChange.separateWords('test123test456Test')).to.deep.equal(['test', '123', 'test', '456', 'test']);
        });
        it('should recognize all separators and multiples of each', function () {
            chai_1.expect(CaseChange_1.CaseChange.separateWords('this-is____just |||a.test:yo')).to.deep.equal(testString);
        });
        it('should strip unknown characters as separators', function () {
            chai_1.expect(CaseChange_1.CaseChange.separateWords('this-is____just!!¶•¶•a.test:yo')).to.deep.equal(testString);
        });
    });
    describe('handleCapsAndJoin()', function () {
        it('should properly output capitalization and add separators', function () {
            chai_1.expect(CaseChange_1.CaseChange.handleCapsAndJoin(testString, ' ', CaseChange_1.CaseChange.To.upper)).to.equal('THIS IS JUST A TEST YO');
            chai_1.expect(CaseChange_1.CaseChange.handleCapsAndJoin(testString, '', CaseChange_1.CaseChange.To.title)).to.equal('ThisIsJustATestYo');
            chai_1.expect(CaseChange_1.CaseChange.handleCapsAndJoin(testString, ' booga ', CaseChange_1.CaseChange.To.title)).to.equal('This booga Is booga Just booga A booga Test booga Yo');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2FzZUNoYW5nZS5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiQ2FzZUNoYW5nZS5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsK0JBQThCO0FBQzlCLDZDQUFnRDtBQUdoRCxRQUFRLENBQUMsWUFBWSxFQUFFO0lBQ3RCLElBQUksVUFBVSxHQUFHLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztJQUMzRCxRQUFRLENBQUMsaUJBQWlCLEVBQUU7UUFDM0IsRUFBRSxDQUFDLHVEQUF1RCxFQUFFO1lBQzNELGFBQU0sQ0FBQyx1QkFBRSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDeEUsQ0FBQyxDQUFDLENBQUM7UUFDSCxFQUFFLENBQUMsc0NBQXNDLEVBQUU7WUFDMUMsYUFBTSxDQUFDLHVCQUFFLENBQUMsYUFBYSxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ3RHLENBQUMsQ0FBQyxDQUFDO1FBQ0gsRUFBRSxDQUFDLHVEQUF1RCxFQUFFO1lBQzNELGFBQU0sQ0FBQyx1QkFBRSxDQUFDLGFBQWEsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDcEYsQ0FBQyxDQUFDLENBQUM7UUFDSCxFQUFFLENBQUMsK0NBQStDLEVBQUU7WUFDbkQsYUFBTSxDQUFDLHVCQUFFLENBQUMsYUFBYSxDQUFDLGdDQUFnQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUN0RixDQUFDLENBQUMsQ0FBQztJQUNKLENBQUMsQ0FBQyxDQUFDO0lBQ0gsUUFBUSxDQUFDLHFCQUFxQixFQUFFO1FBQy9CLEVBQUUsQ0FBQywwREFBMEQsRUFBRTtZQUM5RCxhQUFNLENBQUMsdUJBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLEVBQUUsR0FBRyxFQUFFLHVCQUFFLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1lBQzlGLGFBQU0sQ0FBQyx1QkFBRSxDQUFDLGlCQUFpQixDQUFDLFVBQVUsRUFBRSxFQUFFLEVBQUUsdUJBQUUsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLENBQUM7WUFDeEYsYUFBTSxDQUFDLHVCQUFFLENBQUMsaUJBQWlCLENBQUMsVUFBVSxFQUFFLFNBQVMsRUFBRSx1QkFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsc0RBQXNELENBQUMsQ0FBQztRQUNuSSxDQUFDLENBQUMsQ0FBQztJQUNKLENBQUMsQ0FBQyxDQUFDO0FBQ0osQ0FBQyxDQUFDLENBQUMifQ==