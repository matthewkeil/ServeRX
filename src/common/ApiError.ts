






export class ApiError extends Error {

	fatal?: boolean;
	apiError?: string;
	code?: number;
	error?: Error; // if another error was passed from somewhere it goes here
	req?: Request;
	res?: Response;
	other?: any[]; // anything passed other than the first string and number

	constructor(message?: string, code?: number, error?: Error, fatal?: boolean, other?: any) {

		super('ApiError - Failing Safely');

		this.other = [];

		Array.prototype.slice.call(arguments)
			.forEach(arg => {
				
				switch(typeof arg) {
					case 'boolean':
						this.hasOwnProperty('fatal') ? 
							this.other.push(arg) : this.fatal = arg;
						break;
					case 'string':
						this.apiError ? this.other.push(arg) : this.apiError = arg;
						break;
					case 'number':
						this.code ? this.other.push(arg) : this.code = arg;
						break;
					default:
						if (arg instanceof Error) this.error = arg;
						else this.other.push(arg)
				}
			})
	}
}