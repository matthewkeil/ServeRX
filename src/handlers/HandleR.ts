import { HttpPair, HttpHandler } from './HttpHandler';



import * as http from 'http';
// import * as Rx from 'rxjs';



import { Configuration, HttpServerConfig } from './../ConfigRX';
import { Request } from './../messages/Request';
import { Response } from '../messages/Response';
import * as Rx from 'rxjs';




export class Handler {

	http?: { 
		[insertId: string]: {
			[timestamp: number]: {
				handler$: HttpHandler,
				subscription__: Rx.Subscription
			}
		}
	}

	constructor(private _config: HttpServerConfig) {}

	public handleHttp(req: Request, res: Response) {

		let self = this

		Object.assign(req.id, 
			req.socket.address(), 
			{
				insertId: (req.id.address + ' | ' + req.id.family),
				timestamp: Date.now() 
			}
		)

		res.id = req.id

		let handler$ = new HttpHandler(req, res)

		let subscription__: Rx.Subscription
		
		let complete = () => {

			subscription__.unsubscribe();

			// delete this.http[req.id.insertId][req.id.timestamp]

			// if (Object.keys(this.http[req.id.insertId]).length === 0) {
			// 	delete this.http[req.id.insertId]
			// }

		}

		subscription__ = handler$.subscribe(
			self._httpNext, 
			self._handleError,
			complete
		)

		Object.assign(this.http[req.id.insertId], {
			[req.id.timestamp]: {
				handler: handler$,
				subscription: subscription__
			}
		})
			
		return
	}


	private _httpNext(value: any): void {}

	private _handleError(error: Error): void {}

}