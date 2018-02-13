
import { 
	createServer,
	Server,
	IncomingMessage,
	ServerResponse } from 'http';
import * as net from 'net';



export interface HttpSocketUpgrade {
	req: IncomingMessage;
	socket: net.Socket;
	head: Buffer;
}

export type HttpClientError = {
	err: Error;
	socket: net.Socket;
};

export type HttpEvent = HttpClientError | HttpSocketUpgrade;
