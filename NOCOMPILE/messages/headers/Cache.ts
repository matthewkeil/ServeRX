

// import { Header, HeadeRx } from './HeadeRx';
import { RequesteR } from '../RequesteR';


export class Cache {

	static setNo(req: RequesteR): RequestRx {

		if (req.httpVersion === '1.1') {
			req.headers.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
		} else if (req.httpVersion === '1.0') {
			req.headers.setHeader('Pragma', 'no-cache');
		} else {
			req.headers.setHeader('Expires', '0');
		}

		return req;

	};	

	static set(req: RequesteR): RequestRx {

		let type = req.config.cache.type + ', max-age=' + req.config.cache.maxAge; 
		
		req.headers.setHeader('Cache-Control', type);
		
		return req;
	};
}