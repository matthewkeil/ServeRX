
import * as http from 'http';

// import * as Rx from 'rxjs';


import { Configuration } from './../ConfigRX';


export class Handler {

	constructor(private _config: Configuration) {}

	public handle = function (incomingReq: http.IncomingMessage, serverRes: http.ServerResponse): void {
		// return res.end();// console.log(incomingReq, this._config);
	} 

}