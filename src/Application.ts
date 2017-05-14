import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as EventEmitter from 'events';
import * as http from 'http';
import * as net from 'net';
import * as Rx from 'rxjs';

import { Subject } from 'rxjs/Subject';
import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { merge } from 'rxjs/operator/merge';


import * as Store from '@ngrx/store';

import { ServeRxConfig } from './Config';
import { RequestRx } from './Request';




export class ServeRx<T> extends Observable<T> implements Rx.Observer<Event> {

	httpServers: HttpRx[];

	constructor(config: ServeRxConfig<T>) {
		super();

		// look for environment notification and ask to display it
		if(config.http) {
			this.httpServers.push(new HttpRx(config));
		}
	}


	// _setNetListeners(server$: Observable<>)

}



        // server.on('connect', event => {});
        // server.on('listening', event=> {});
        // server.on('close', event => {});
        // server.on('error', event => {});
        // server.on('clientError', event => {});
        // server.on('request', event => {});
        // server.on('upgrade', event => {})


    // PORT: string, NODE_ENV: string) {};
