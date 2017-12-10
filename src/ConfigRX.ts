
import * as http from 'http';
import * as net from 'net';

export type Configuration = ServerConfig| HttpServerConfig;

export class ServerConfig {
	name?: string;
	NODE_ENV?: string;
	port?: number;
	host?: string;
	exclusive?: boolean;
	onListening?: boolean | ((config: Configuration, address: {
			port: number;
			family: string;
			address: string;
		}) => void);
	onClosing?: boolean | ((config: Configuration) => void);
	logging?: {

	}
	
	constructor(private config?: Configuration) {
		this.name = 'ServeRX';
		this.onListening = true;
		this.onClosing = false;
		if (this.config) Object.assign(this, this.config);
	}
}

export class HttpServerConfig extends ServerConfig {
	maxHeadersCount?: number;
	timeout?: {
		ms?: number,
		cb?: (...args: any[]) => any;
	};
	backlog?: number;
	handleUpgrade?: boolean;
	handleCheckContinue?: ((req: http.IncomingMessage, res: http.ServerResponse) => void) | boolean;
	handleClientError?: ((err: Error, socket: net.Socket) => void) | boolean;
	headers?: {
		incoming: {
			acceptCharset?: boolean;
			customDirectives?: string[];
			acceptEncoding?: boolean;
			acceptLanguage?: boolean;
			acceptType?: boolean;
		},
		outgoing: {
			
		}
	}
	router?: {
		buildEntry?: string
		mountRootAt?: string
	}
	request?: {
		methodsHandled?: {
			get?: boolean
			put?: boolean
			post?: boolean
			patch?: boolean
			delete?: boolean
			head?: boolean
			connect?: boolean
			trace?: boolean
			options?: boolean
		}
	}
	response?: {
		stringify: {
			escape?: boolean;
			replacer?: (key: string, value: any) => any;
			spaces?: string | number;
		}
	}
	logging?: {
		completions: boolean;
	}
	
	constructor(config?: Configuration) {
		super(config);
		this.timeout = {};
		this.handleUpgrade = false;
		this.handleCheckContinue = false;
		this.handleClientError = false;
		this.router = {}
		this.headers = {
			incoming: {
				acceptCharset: true,
				acceptEncoding: true,
				acceptLanguage: true,
				acceptType: true
			},
			outgoing: {

			}
		}
		this.request = {
			methodsHandled: {
				get: true,
				put: true,
				post: true,
				patch: true,
				delete: true,
				head: true,
				connect: false,
				trace: false,
				options: true
			}
		}
	}
}







// export interface ServerConfigI {
// 	name?: string;
// 	NODE_ENV?: string;
// 	port?: number;
// 	host?: string;
// 	exclusive?: boolean;
// 	onListening?: boolean | ((config: Configuration) => void);
// 	onClosing?: boolean | ((config: Configuration) => void);
// }

// export interface HttpServerConfigI extends ServerConfigI {
// 	maxHeadersCount?: number;
// 	timeout?: {
// 		ms?: number;
// 		cb?: (...args: any[]) => any;
// 	};
// 	backlog?: number;
// 	handleUpgrage?: boolean;
// 	handleCheckContinue?: ((req: http.IncomingMessage, res: http.ServerResponse) => void) | boolean;
// 	handleClientError?: ((err: Error, socket: net.Socket) => () => void) | boolean;
// }



// 		config.env.backlog ? this. number;
// 	wantsPool: true;
// 	manualCheckContinue: true;
// 	onCloseMessage: () => void;
// 	requestHandler: (handler: Handler) => void;
// 	routes?: Route<any>[];
// 	allowedMethods?: METHOD[];
// 	allowedRouteOptions?: ROUTE_OPTION[];
// 	timeout: {
// 		ms: 2000;
// 		cb: (socket: Socket) => void;
// 	};
// 	resources: {
// 		auth:  { 
// 			dev: 'http://localhost:3002' };
// 		db: { 
// 			dev: 'mongo://localhost:21701' };
// 		cdn: {
// 			dev: './.build' } ;
// 	};

// 	onListening(protocol: string, host: string, port: number) {
// 		console.log(`An ${protocol} server running on ${host}:${port} is listening`);
// 	}

// 	onClose(type: string ='http', host: string = this.env.HOST, port: number = 3000) {
// 		console.log(`A ${type} server running on ${host}:${port} just closed`);
// 	}
// };

// export class HttpServerConfig extends ServerConfig {
// 	allowUpgrade = true;
// 	enableCORS = true;
// 	allowFaviconReq = false;
// 	maxHeadersCount = 1000;
// 	handleClientError: (err: Error, socket: Socket) => any;
// 	headers = {
// 		accept: {
// 			charset: true,
// 			encoding:  true,
// 			language: true,
// 			type: true
// 		},
// 		authorization: true,
// 		cache: true,
// 		client: true,
// 		content: {
// 			type: true,
// 			length: true,
// 			encoding: true
// 		},
// 		cookie: true,
// 		cors: true,
// 		dnt: true,
// 		etag: true,
// 		server: 'serveRx by Matthew Keil'
// 	};
// 	cache = {
// 		maxAge: number;
// 		type: string; // default to 'public'
// 	 };
// 	security: {
// 		jwt: {
// 			header: {
// 				['Authorization']: 'Bearer '; };
// 			token: {
// 				header: {
// 					alg: "HS256",
// 					typ: "JWT" },
// 				payload: {},
// 				signature: {
// 					secret: "NotYourSecret...JustSayin'...";
// 				}; 
// 			}; 
// 		}; 
// 	 };
// };

// export class SecureServeRConfig extends ServeRConfig {}

// export class HttpsServeRConfig extends HttpServeRConfig implements SecureServeRConfig {}

// export class ServeRXConfig {
// 	http: HttpServerConfig;
// 	ws: ServerConfig;
	// https: HttpsServeRConfig;
	// wss: SecureServeRConfig;
// };

