import Route from '../../src/routing/Route';

import * as Rx from 'rxjs';



let getByID = Rx.Observable.from(['booga', 'boo']);


let insertUser = {
	observable: Rx.Observable.from(['diggity', 'dangnabbit'])
};

let etc = 'use your imagination';



module.exports = Route('users')
	.get(new Rx.Observable<any>(observer => {
		observer.next('all users');
	}))
	.nest(
		Route(':id')
			.get('auth', getByID)
			.post(insertUser),
		Route(':jiggityJam')
			.get(etc)
			.delete(etc)
			.options(etc)
	)

