import * as http from 'http';
import * as net from 'net';

import * as _ from 'lodash';

import { Cors } from "./messages/headers/Cors";
import CORSDomains = Cors.CORSDomains;
import { Method, RouteAuth, RouteMiddleware, Router } from "./routing/Router";
import { MatchString } from "./common/MatchString";



export interface Configuration {
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
	logging?: {}
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
		acceptCharset?: boolean;
		customDirectives?: string[];
		acceptEncoding?: boolean;
		acceptLanguage?: boolean;
		acceptType?: boolean;
		origin?: {
			allowed?: CORSDomains
			blacklist?: CORSDomains
		}
	};
	router?: {
		buildEntry?: string
		mountRootAt?: string
	}
	request?: {
		methodsHandled: Method[];
	}
	response?: {
		stringify: {
			escape?: boolean;
			replacer?: (key: string, value: any) => any;
			spaces?: string | number;
		}
	}
}


export class ServerConfig implements Configuration {

	name?: string;
	port?: number;
	host?: string;
	backlog?: number;
	path?: string;
	exclusive?: boolean;
	maxHeadersCount?: number;
	handleUpgrade?: boolean;
	handleCheckContinue?: ((req: http.IncomingMessage, res: http.ServerResponse) => void) | boolean;
	handleClientError?: ((err: Error, socket: net.Socket) => void) | boolean;
	timeout: {
		ms?: number,
		cb?: (err: Error, results: any) => void;
	}
	onListening?: boolean | ((config: ServerConfig, address: {
		port: number;
		family: string;
		address: string;
	}) => void);
	onClosing?: boolean | ((config: ServerConfig, address: {
		port: number;
		family: string;
		address: string;
	}) => void);
	request: {
		methodsHandled: Method[];
	};
	router: {
		obj?: Router;
		fileEntry?: string,
		mountAt?: string,
		auth?: RouteAuth,
		middleware?: RouteMiddleware
	};


	constructor(config: Configuration = <Configuration>{}) {

		_.defaultsDeep(config, ServerConfig.defaultServerConfiguration)
	}


	static check = function (obj: any): boolean {
		return true;
	}


	private static defaultServerConfiguration = <ServerConfig> {
		name: 'ServeRX',
		onListening: true,
		onClosing: false,
		request: {
			methodsHandled: ['get', 'put', 'post', 'patch', 'delete', 'options', 'head']
		},
		timeout: {},
		handleUpgrade: false,
		handleCheckContinue: false,
		handleClientError: false,
		headers: {
			origin: {
				allowed: {},
				blacklist: {}
			}
		},
		router: {},
		response: {}
	}
}


if (require.main !== module) {

}