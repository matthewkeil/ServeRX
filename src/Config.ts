
import * as http from 'http';
import * as net from 'net';
import { RequestRx } from './Request';

export class ServeRxConfig<T> {
	http: {
		requestHandler: (req__: RequestRx) => void;
		name: 'ServeRx';
		handleCheckContinue: true;
		onListeningMessage: true;
		onCloseMessage: true;
		handleClientError: true;
		allowUpgrade: true;
		enableCORS: true;
		allowFaviconReq: false;
		maxHeadersCount: 1000;
		timeout: {
			ms: 2000;
			cb: (socket: net.Socket) => void;
		};
		security: {
			jwt: {
				header: {
					['Authorization']: 'Bearer '; };
				token: {
					header: {
						alg: "HS256",
						typ: "JWT" },
					payload: {},
					signature: {
						secret: "NotYourSecret...JustSayin'..."; }; }; }; };
		env: {
			HOST: 'localhost';
			PORT: string | number;
			NODE_ENV: 'development'; };
		resources: {
			auth:  { 
				dev: 'http://localhost:3002' };
			db: { 
				dev: 'mongo://localhost:21701' };
			cdn: {
				dev: './.build' } }; };
	https: false;
	ws: false;
	wss: false;

	constructor(config) {
		Object.assign(this, config);
	}

	onListening(type: string ='http', host: string = this.http.env.HOST, port: number = 3000) {
		console.log(`A ${type} server running on ${host}:${port} is listening`);
	}

	onClose(type: string ='http', host: string = this.http.env.HOST, port: number = 3000) {
		console.log(`A ${type} server running on ${host}:${port} just closed`);
	}
};

