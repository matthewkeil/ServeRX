
import { 
	createServer,
	Server,
	IncomingMessage,
	ServerResponse } from 'http';
import { Socket } from 'net';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export class UpgradeRequest {
	public req: IncomingMessage; 
	public socket: Socket; 
	public head: Buffer;
}

export class UpgradeR extends BehaviorSubject<UpgradeRequest> {
	constructor(){
		super(null);
	}
}