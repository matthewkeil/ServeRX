

import * as stream from 'stream';

import { Subject } from 'rxjs/Subject';

import { HandleR, SocketStatus } from './HandleR';



export type PoolData = Object | stream.Stream | Buffer ;

export type PoolCount = number;



export class PoolR extends Subject<HandleR> {
	
	_pool: HandleR[];

	constructor() {
		super();
	 }

	next(socket: HandleR): void {
		this._pool.push(socket);
	 }

	error(err: Error) {

	 }

	complete() {

	 }

}