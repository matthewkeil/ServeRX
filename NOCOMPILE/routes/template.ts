

import { Route } from '../../src/routing/Route';

import { RouteObserver } from './RouteObserver';

const GET = 'GET';
const POST = 'POST';
const DELETE = 'DELETE';

function login(observer: RouteObserver<any>) {}

function logout(observer: RouteObserver<any>) {}

function getUser(observer: RouteObserver<any>) {}

function deleteUser(observer: RouteObserver<any>) {}

function postFooBarNoFixedParam(observer: RouteObserver<any>) {}


let usersRoute = Route.nest({})


module.exports = Route.root('/').nest({
	['users']: userRouter,
	['snippets']: snippetsRouter
})


export default users;