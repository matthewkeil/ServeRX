	

import { ServeRConfig } from './../ConfigR';
import { RespondeR } from '../messages/RespondeR';
import { MatchString, MSRegEx, extractMS } from './MatchString';
import { RouteObserver, ObservableRoute } from './RouteObserver';



export type ROUTE_OPTION = 'protected' | 'internal';

export type METHOD = 'GET' | 'PUT' | 'POST' | 'PATCH' | 'DELETE' | 'HEAD' | 'CONNECT' | 'TRACE' | 'OPTIONS';

export interface Route<T> {
	matchString?: MatchString;
	methods?: METHOD[];
	options?: ROUTE_OPTION[];
	stack: ObservableRoute<T>[];
	nested?: Route<T>; 
}

export type Routes = Route<any>[]