import { IncomingMessage } from 'http';
 

export class Helpers {

	static JSONify(value: Object) {
		// v8 checks arguments.length for optimizing simple call
		// https://bugs.chromium.org/p/v8/issues/detail?id=4730
		let replacer = this.config.http.replacer;
		let spaces = this.config.http.spaces;
		return replacer || spaces ?
			JSON.stringify(value, replacer, spaces) :
			JSON.stringify(value);
	}
	
	static hasBody(req: IncomingMessage): boolean {}

	static parseBody(req: IncomingMessage): Buffer | string {}

}