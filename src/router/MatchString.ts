export const MSRegEx = /^\/?((\:?[-\w]*)\/?)*$/;

export type MatchString = {
	path: string[];
	params: string[];
}

export function extractMS(ms: string): MatchString {
	
	if (ms.startsWith('/')) ms = ms.substring(1);
	if (ms.endsWith('/')) ms = ms.slice(0, ms.length-1);
	
	let path = [];
	let params = [];
	let segments = ms.split('/');

	for (let segment of segments) {
		if (!segment.startsWith(':')) path.push(segment);
		else params.push(segment.substring(1));
	}

	return { path, params }
}