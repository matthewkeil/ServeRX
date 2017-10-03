
import * as http from 'http';

// import * as Rx from 'rxjs';


import { Configuration } from './../ConfigRX';
// import { Upgrade } from './Upgrade';


export class Handler {

	constructor(private config: Configuration) {
	}

	public handle(incomingReq: http.IncomingMessage, serverRes: http.ServerResponse): void {
	} 

}