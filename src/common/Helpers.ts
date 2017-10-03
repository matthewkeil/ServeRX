import * as ChangeCase from './CaseChange';

 
export class Helpers {

	// static JSONify(value: Object) {
	// 	// v8 checks arguments.length for optimizing simple call
	// 	// https://bugs.chromium.org/p/v8/issues/detail?id=4730
	// 	let replacer = this.config.http.replacer;
	// 	let spaces = this.config.http.spaces;
	// 	return replacer || spaces ?
	// 		JSON.stringify(value, replacer, spaces) :
	// 		JSON.stringify(value);
	// }
	
	
	public toCamelCase(input: string): string {
		return ChangeCase.of(input);
	}

	public toKebabCase(input: string): string {
		return ChangeCase.of(input, ChangeCase.To.kebab, ChangeCase.To.title);
	}
	
}