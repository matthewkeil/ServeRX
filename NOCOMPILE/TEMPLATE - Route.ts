

import { otherRoute } from './otherRoute';

import { RouteObserver } from '../../../../ServeRx/src/routes/RouteObserver';

const GET = 'GET';
const POST = 'POST';
const DELETE = 'DELETE';

function login(observer: RouteObserver<any>) {}

function logout(observer: RouteObserver<any>) {}

function getUser(observer: RouteObserver<any>) {}

function deleteUser(observer: RouteObserver<any>) {}

function postFooBarNoFixedParam(observer: RouteObserver<any>) {}

const index = [
	'users', 
		['login', GET, login],
		['logout', logout],
		[':id', GET, getUser],
		[':id', DELETE, deleteUser],
		[POST,
			[':foo/:bar/fixedParam', otherRoute],
			[':foo/:bar', postFooBarNoFixedParam]
]];

export default index;