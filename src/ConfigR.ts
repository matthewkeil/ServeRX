
import * as http from 'http';
import * as net from 'net';
import { SocketR } from './SocketR';

export class ServeRConfig {
	requestHandler: (socket__: SocketR) => void;
	name: 'ServeRx';
	protocol: string;
	handleCheckContinue: true;
	onListeningMessage: true;
	onCloseMessage: true;
	handleClientError: true;
	timeout: {
		ms: 2000;
		cb: (socket: net.Socket) => void;
	};
	env: {
		HOST: 'localhost';
		PORT: string | number;
		NODE_ENV: 'development'; 
	};
	resources: {
		auth:  { 
			dev: 'http://localhost:3002' };
		db: { 
			dev: 'mongo://localhost:21701' };
		cdn: {
			dev: './.build' } ;
	};

	constructor(config) {
		Object.assign(this, config);
	}

	onListening(type: string ='http', host: string = this.env.HOST, port: number = 3000) {
		console.log(`A ${type} server running on ${host}:${port} is listening`);
	}

	onClose(type: string ='http', host: string = this.env.HOST, port: number = 3000) {
		console.log(`A ${type} server running on ${host}:${port} just closed`);
	}
};

export class SecureServeRConfig extends ServeRConfig {

}


export class HttpServeRConfig extends ServeRConfig {
	allowUpgrade: true;
	enableCORS: true;
	allowFaviconReq: false;
	maxHeadersCount: 1000;
	cache: {
		maxAge: number;
		type: string; // default to 'public'
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
					secret: "NotYourSecret...JustSayin'...";
				}; 
			}; 
		}; 
	};
};

export class HttpsServeRConfig extends HttpServeRConfig implements SecureServeRConfig {

}

export class ServeRxConfig<T> {
	http: HttpServeRConfig;
	https: HttpsServeRConfig;
	ws: ServeRConfig;
	wss: SecureServeRConfig;
};

