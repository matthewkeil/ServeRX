///< />
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
let { should, expect } = chai;
const sinon = require("sinon");
const axios = require("axios");
const Rx = require("rxjs");
const Http_1 = require("./Http");
describe('Http', function () {
    let http;
    let error = undefined;
    let complete = false;
    // let logSpy = sinon.spy(console,'log');
    http = new Http_1.Http({
        onListening: false,
        onClosing: true
    });
    // let http__ = http.subscribe(
    // 	() => {},
    // 	err => error = err,
    // 	() => complete = true
    // )
    // it('the default listening message should be "Listening on localhost:3000..."', function () {
    // 	expect(logSpy.calledWith('Listening on localhost:3000...')).to.be.true;			
    // });
    // logSpy.restore()
    it('should return an Rx.Subject', function () {
        expect(http instanceof Rx.Subject).to.be.true;
    });
    it('should start listening on port 3000 by default', function () {
        expect(http.server.address().port).to.equal(3000);
    });
    // it('should listen for the \'error\' event', function () {
    // 	(<any>http.server).emit('error', new Error('holy schmoly'));
    // 	expect((<Error>error).message).to.equal('holy schmoly');
    // 	error = undefined;
    // });
    it('should listen for the \'request\' event', function (done) {
        return __awaiter(this, void 0, void 0, function* () {
            sinon.stub(http.handler, 'handle').value(function (req, res) { return res.end(); });
            let response = yield (axios.get('http://localhost:3000/'));
            expect(http.handler.handle.calledOnce).to.be.true;
            http.handler.handle.restore();
            done();
        });
    });
    // expect((<sinon.SinonSpy>http.handler.handle).calledWith(true, null)).to.be.true;
    // http__.unsubscribe(); 
});
// http = new Http({
// 	NODE_ENV: 'testing',
// 	host: 'notyourlocalhost',
// 	port: 6969,
// 	onListening: (config: HttpServerConfigI) => console.log(`listening on ${config.host}:${config.port}`),
// 	onClosing: (config: HttpServerConfigI) => console.log(`closing on ${config.host}:${config.port}`)
// })
// let config3: HttpServerConfigI = {
// 	onListening: false,
// 	onClosing: false
// }
// it('should listen for requests', function () {
// 	let handlerSpy = sinon.spy(http.handler, 'handle')
// 	http.server.emit('request', {req: true}, {res: true} );
// 	expect(handlerSpy.withArgs({req: true}, {res: true})).to.be.true;
// });
// it('should have a default closing message', function () {
// 	http.server.emit('close')
// 	expect(logSpy.calledWith('Closing server on localhost:3000...')).to.be.true	
// 	expect(http.isStopped).to.be.true;
// });
// 	});
// });
// config = config2;
// describe('', function () {
// 	it('should accept a custom listening function', function () {
// 		expect(logSpy.calledWith('listening on notyourlocalhost:6969...')).to.be.true
// 	});
// 	it('closing function', function () {
// 		expect(logSpy.calledWith('closing on notyourlocalhost:6969...')).to.be.true
// 	});
// });
// config = config3;
// describe('', function () {
// 	it('should display no listening message', function () {
// 	});
// 	it('should display no closing message', function () {
// 	});
// });
// 	describe('should construct the object', function () {
// 		let http = new Http({ NODE_ENV: 'testing', port: 3000 });
// 		describe('with a property at', function () {
// 			it('.server of type http.Server', function () {
// 				expect(http.server.listen).to.be.a('function');
// 				expect(http.server.address).to.be.a('function');
// 			});
// 		});
// 	});
// }); 
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSHR0cC5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiSHR0cC5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU87Ozs7Ozs7Ozs7O0FBR1AsNkJBQTZCO0FBQzdCLG1EQUFtRDtBQUNuRCxJQUFJLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ3pCLElBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDO0FBQzlCLCtCQUErQjtBQUUvQiwrQkFBK0I7QUFHL0IsMkJBQTJCO0FBRzNCLGlDQUE4QjtBQUc5QixRQUFRLENBQUMsTUFBTSxFQUFFO0lBRWhCLElBQUksSUFBVSxDQUFDO0lBQ2YsSUFBSSxLQUFLLEdBQXNCLFNBQVMsQ0FBQztJQUN6QyxJQUFJLFFBQVEsR0FBWSxLQUFLLENBQUM7SUFFOUIseUNBQXlDO0lBRXpDLElBQUksR0FBRyxJQUFJLFdBQUksQ0FBQztRQUNmLFdBQVcsRUFBRSxLQUFLO1FBQ2xCLFNBQVMsRUFBRSxJQUFJO0tBQ2YsQ0FBQyxDQUFDO0lBRUgsK0JBQStCO0lBQy9CLGFBQWE7SUFDYix1QkFBdUI7SUFDdkIseUJBQXlCO0lBQ3pCLElBQUk7SUFDSiwrRkFBK0Y7SUFDL0YsOEVBQThFO0lBQzlFLE1BQU07SUFFTixtQkFBbUI7SUFFbkIsRUFBRSxDQUFDLDZCQUE2QixFQUFFO1FBQ2pDLE1BQU0sQ0FBQyxJQUFJLFlBQVksRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDO0lBQy9DLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLGdEQUFnRCxFQUFFO1FBQ3BELE1BQU0sQ0FBTyxJQUFJLENBQUMsTUFBTyxDQUFDLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDMUQsQ0FBQyxDQUFDLENBQUM7SUFFSCw0REFBNEQ7SUFFNUQsZ0VBQWdFO0lBRWhFLDREQUE0RDtJQUU1RCxzQkFBc0I7SUFDdEIsTUFBTTtJQUdOLEVBQUUsQ0FBQyx5Q0FBeUMsRUFBRSxVQUFnQixJQUFJOztZQUVqRSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVMsR0FBRyxFQUFFLEdBQUcsSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFBLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFbEYsSUFBSSxRQUFRLEdBQUcsTUFBTSxDQUFzQixLQUFNLENBQUMsR0FBRyxDQUFDLHdCQUF3QixDQUFFLENBQUMsQ0FBQztZQUVsRixNQUFNLENBQWtCLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDO1lBRW5ELElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBRWhELElBQUksRUFBRSxDQUFDO1FBRVIsQ0FBQztLQUFBLENBQUMsQ0FBQztJQUVILG1GQUFtRjtJQUVuRix5QkFBeUI7QUFHMUIsQ0FBQyxDQUFDLENBQUM7QUFJSCxvQkFBb0I7QUFDcEIsd0JBQXdCO0FBQ3hCLDZCQUE2QjtBQUM3QixlQUFlO0FBQ2YsMEdBQTBHO0FBQzFHLHFHQUFxRztBQUNyRyxLQUFLO0FBR0wscUNBQXFDO0FBQ3JDLHVCQUF1QjtBQUN2QixvQkFBb0I7QUFDcEIsSUFBSTtBQUlELGlEQUFpRDtBQUNqRCxzREFBc0Q7QUFDdEQsMkRBQTJEO0FBQzNELHFFQUFxRTtBQUNyRSxNQUFNO0FBQ04sNERBQTREO0FBQzVELDZCQUE2QjtBQUM3QixnRkFBZ0Y7QUFDaEYsc0NBQXNDO0FBQ3RDLE1BQU07QUFDVCxPQUFPO0FBQ1AsTUFBTTtBQUVKLG9CQUFvQjtBQUNwQiw2QkFBNkI7QUFDN0IsaUVBQWlFO0FBQ2pFLGtGQUFrRjtBQUNsRixPQUFPO0FBQ1Asd0NBQXdDO0FBQ3hDLGdGQUFnRjtBQUNoRixPQUFPO0FBQ1AsTUFBTTtBQUVOLG9CQUFvQjtBQUNwQiw2QkFBNkI7QUFDN0IsMkRBQTJEO0FBRTNELE9BQU87QUFDUCx5REFBeUQ7QUFFekQsT0FBTztBQUNQLE1BQU07QUFHUix5REFBeUQ7QUFDekQsOERBQThEO0FBQzlELGlEQUFpRDtBQUNqRCxxREFBcUQ7QUFDckQsc0RBQXNEO0FBQ3RELHVEQUF1RDtBQUN2RCxTQUFTO0FBQ1QsUUFBUTtBQUNSLE9BQU87QUFDUCxNQUFNIn0=