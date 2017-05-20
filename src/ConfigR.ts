
import * as http from 'http';
import { Socket }from 'net';


import { Subscriber } from 'rxjs/Subscriber';

import { HttpEvent } from './servers/events';
import { PoolCount } from './servers/PoolR';
import { Route, METHOD, ROUTE_OPTION } from './routes/Route';

export class ServeRConfig {
	requestHandler: (socket__: Socket) => void;
	name: 'ServeRx';
	protocol: string;
	env: {
		HOST: 'localhost';
		PORT: number;
		NODE_ENV: 'development'; 
	};
	backlog: number;
	handleCheckContinue: true;
	onListeningMessage: true;
	onCloseMessage: true;
	routes?: Route<any>[];
	allowedMethods?: METHOD[];
	allowedRouteOptions?: ROUTE_OPTION[];
	timeout: {
		ms: 2000;
		cb: (socket: Socket) => void;
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

export class SecureServeRConfig extends ServeRConfig {}

export class HttpServeRConfig extends ServeRConfig {
	allowUpgrade: true;
	enableCORS: true;
	allowFaviconReq: false;
	maxHeadersCount: 1000;
	handleClientError: (err: Error, socket: Socket) => any;
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

export class HttpsServeRConfig extends HttpServeRConfig implements SecureServeRConfig {}

export class ServeRxConfig<T> {
	http: HttpServeRConfig;
	https: HttpsServeRConfig;
	ws: ServeRConfig;
	wss: SecureServeRConfig;
};

