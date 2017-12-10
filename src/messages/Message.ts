



export interface Message {
	http?: {
		major?: number;
		minor?: number;
	};
	statusCode?: number;
	statusMessage?: string;
	headers?: { [header: string]: string[] };
	body?: any;
}