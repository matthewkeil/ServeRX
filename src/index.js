let ApiError = function ApiError() {
	Array.prototype.slice.call(arguments).forEach(arg => {
		
		switch(typeof arg) {
			case 'string':
				this.apiError = arg;
				break;
			case 'number':
				this.code = arg;
				break;
			default:
				if (arg instanceof Error) this.error = arg;
				else this[arg] = arg;
		}
	})
}



let url = require('url')

// let origin = /^http(s?):\/\/([\w\.]*)\.(\w*\.\w*):?(\d{1,5})?\/?([\w\/]*)?/


let URL = 'https://www.api.ifindmwslf.com:80/garbage/bull/shit#hash'


// let results = origin.exec(url)

// let [ arg, secure, subDomain, domain, port, path ] = results



console.log(new ApiError('booga', 324, new Error('boo'), {sha:'zamm'}))