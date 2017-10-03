

const camelBreakRegEx = /[a-z][A-Z\d]/g;
const endOfDigitRegEx = /\d\D/g;
const nonAlphaNumericRegEx = /[^a-zA-Z\d]+/g;
// const separatorBreakRegEx = /[-_\s\.\W]+/g;
const capitalBreakRegEx = /[A-Z][A-Z]/g;

export enum To {
	camel,
	pascal,
	kebab,
	snake,
	dot,
	space,
	upper,
	title,
	lower
}

export function of(original: string, toCase?: To, capitalize?: To.upper | To.title | To.lower): string {
		
	let words = separateWords(original);

	switch (toCase) {
		case To.pascal:
			return handleCapsAndJoin(words);
		case To.kebab:
			return handleCapsAndJoin(words, '-', capitalize);
		case To.snake:
			return handleCapsAndJoin(words, '_', capitalize);
		case To.dot:
			return handleCapsAndJoin(words, '.', capitalize);
		case To.space:
			return handleCapsAndJoin(words, ' ', capitalize);
		case To.camel:
		default:
			let changed = handleCapsAndJoin(words);
			return changed.substr(0, 1).toLowerCase() + changed.substr(1)
	}
}

export function separateWords(original: string): string[] {

	let input = original;
	let breaks: RegExpExecArray | null;
	let words: string[] = [];
	
	input = input.replace(nonAlphaNumericRegEx, '|')

	while ((breaks = endOfDigitRegEx.exec(input)) !== null) {
		input = input.substring(0, breaks.index + 1) + '|' + input.substring(breaks.index + 1);
	}

	if(/[a-z]/.test(input)) {
		[camelBreakRegEx, capitalBreakRegEx].forEach(regex => {
			while ((breaks = regex.exec(input)) !== null) {
				input = input.substring(0, breaks.index + 1) + '|' + input.substring(breaks.index + 1);
		}});
	}

	words = input.toLowerCase().split(/\|+/);
			
	return words;
}

export function handleCapsAndJoin(words: string[], separator: string = '', capitalize: To.upper | To.title | To.lower = To.title): string {

	switch (capitalize) {
		case To.upper : 
			words = words.map(word => word.toUpperCase());
			break;
		case To.lower:
			break;
		case To.title :
		default : 
			words = words.map(word => word.substr(0, 1).toUpperCase() + word.substr(1));
			break;
	}
	
	return words.join(separator);
}
