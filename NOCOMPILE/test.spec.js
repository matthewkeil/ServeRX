"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sinon_1 = require("sinon");
const chai_1 = require("chai");
describe('console spy', function () {
    let logSpy = sinon_1.spy(console, 'log');
    let num = 123;
    console.log(`testing${num}`);
    chai_1.expect(logSpy.calledWith('testing123')).to.be.true;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidGVzdC5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsaUNBQTRCO0FBQzVCLCtCQUE4QjtBQUU5QixRQUFRLENBQUMsYUFBYSxFQUFFO0lBQ3ZCLElBQUksTUFBTSxHQUFHLFdBQUcsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDakMsSUFBSSxHQUFHLEdBQUcsR0FBRyxDQUFDO0lBQ2QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDN0IsYUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQztBQUNwRCxDQUFDLENBQUMsQ0FBQyJ9