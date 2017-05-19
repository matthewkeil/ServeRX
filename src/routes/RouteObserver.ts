
import { Observer } from 'rxjs/Observer';
import { RequestR } from '../messages/RequestR';
import { RespondeR } from '../messages/RespondeR';


export type ObservableRoute<T> = (observer: RouteObserver<T>) => void;

export interface RouteObserver<T> extends Observer<T> {
	req: RequestR;
	res: RespondeR;
	closed?: boolean;
	next: (value: T) => void;
	error: (err: any) => void;
	complete: () => void;
}