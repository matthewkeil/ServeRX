///< />


import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
let { should, expect } = chai;
import * as sinon from 'sinon';

import * as axios from 'axios';

import * as HTTP from 'http';
import * as Rx from 'rxjs';


import { Http } from './Http';


describe('Http', function () {
	
	let http: Http;
	let error: Error | undefined = undefined;
	let complete: boolean = false;
	
	// let logSpy = sinon.spy(console,'log');
	
	http = new Http({
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
		expect((<any>http.server).address().port).to.equal(3000);
	});
	
	// it('should listen for the \'error\' event', function () {

	// 	(<any>http.server).emit('error', new Error('holy schmoly'));
		
	// 	expect((<Error>error).message).to.equal('holy schmoly');
		
	// 	error = undefined;
	// });
	
	
	it('should listen for the \'request\' event', async function (done) {

		sinon.stub(http.handler, 'handle').value(function(req, res) { return res.end() });
		
		let response = await ((<Promise<any>>(<any>axios).get('http://localhost:3000/')));

		expect((<sinon.SinonSpy>http.handler.handle).calledOnce).to.be.true;

		(<sinon.SinonSpy>http.handler.handle).restore();

		done();
		
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