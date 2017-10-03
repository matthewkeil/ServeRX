import { HttpServerConfig } from './../ConfigRX';

import * as http from 'http';
import * as net from 'net';

export class Upgrade {

	constructor(protocol: string, config: HttpServerConfig, req: http.IncomingMessage, socket: net.Socket, head: Buffer) {}

}