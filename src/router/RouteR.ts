import { HttpServeRConfig } from './../ConfigR';



export class Methods {

	constructor(config?: HttpServeRConfig) {

		let options = config.supportedMethods;
		
		if (!options) {
			options = this.METHODS;
		}

		options.forEach(allowed => {
			for (let method of this.METHODS) {
				if (method === allowed) {
					this[method.toUpperCase()] =
					this[method.toLowerCase()] = 
					this[method.toLowerCase().substr(0,1).toUpperCase()] = 
					allowed.toUpperCase();
				}
			} 
		});
	}
}