import { Response } from './../messages/Response';
import { Request } from './../messages/Request';


import { Store, State, Reducer, Dispatcher, Action } from '@ngrx/store';





export type HttpPair = {
	id?: string;
	req: Request;
	res: Response;
}


export class HttpHandler extends Store<HttpPair> {

	constructor(req: Request, res: Response) {

		let dispatcher = new Dispatcher;
		let reducer = new Reducer(dispatcher, HttpHandler.reducer)
		
		super(
			dispatcher,
			reducer,
			new State({req, res}, dispatcher, reducer)
		);

		

	}

	static reducer(state: HttpPair, action: Action ): HttpPair {

		switch(action.type) {


			default: 
				return state
		}

	}

	public complete() {
		super.complete();
	}


}