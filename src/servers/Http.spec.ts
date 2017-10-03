import { expect } from 'chai';
import { spy } from 'sinon';

// import * as HTTP from 'http';
// import { Subscription } from 'rxjs/Subscription';


import { HttpServerConfigI } from '../ConfigRX';
import { Http } from './Http';


let config1: HttpServerConfigI = {
	NODE_ENV: 'testing',
	backlog: undefined,
	onListening: true,
	onClosing: true
};

// let config2: HttpServerConfigI = {
// 	NODE_ENV: 'testing',
// 	host: 'notyourlocalhost',
// 	port: 6969,
// 	onListening: (config: HttpServerConfigI) => console.log(`listening on ${config.host}:${config.port}`),
// 	onClosing: (config: HttpServerConfigI) => console.log(`closing on ${config.host}:${config.port}`)
// };

// let config3: HttpServerConfigI = {
// 	onListening: false,
// 	onClosing: false
// }

describe('Http', function () {
	
	let http: Http;
	// let http__: Subscription;
	let config: HttpServerConfigI;
	let logSpy: sinon.SinonSpy;
	
	describe('', function () {
		// beforeEach(function () {
		// });
		// afterEach(function () {
			// 	http.complete();
			// });
			
		config = config1;
		describe('', function () {
			it('should have a default listening message', function () {
				logSpy = spy(console, 'log');
				http = new Http(config);
				expect(logSpy.calledWith('Listening on localhost:3000...')).to.be.true			
			});
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
		});
	});
});

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