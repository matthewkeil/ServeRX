"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BehaviorSubject_1 = require("rxjs/BehaviorSubject");
const Accept_1 = require("./Accept");
const Content_1 = require("./Content");
class Headers {
    constructor(config) {
        Object.assign(this.categories.base, new Base(config));
        if (config.headers.accept)
            Object.assign(this.categories.accept, new Accept_1.Accept(config));
        if (config.headers.content)
            Object.assign(this.categories.content, new Content_1.Content(config));
        // if (config.headers.authorization) Object.assign(this.categories.auth, new Authorization(config));
        // if (config.headers.cors) Object.assign(this.categories.cors, new Cors(config));
        // if (config.headers.cache) Object.assign(this.categories, { cache: new Cache(config) });
        // if (config.headers.client) Object.assign(this.categories, { client: new Client(config) });
        // if (config.headers.cookie) Object.assign(this.categories, { cookie: new Cookie(config) });
        // if (config.headers.dnt) Object.assign(this.categories, { dnt: new Dnt(config) });
        // if (config.headers.etag) Object.assign(this.categories, { etag: new Etag(config) });
    }
    processRaw(req) {
    }
    getFrom(raw) {
        let headers$ = new BehaviorSubject_1.BehaviorSubject({});
        let categories = ['base'].concat(Object.getOwnPropertyNames(this.categories));
        Rx.Observable.from(categories)
            .map(category => {
            headers$.next(Object.assign(headers$.value[category], null)); // allows initialization timer for subscribers
            return { name: category, cat: this.categories[category].getFromRaw(raw) };
        })
            .take(categories.length)
            .subscribe(category => headers$.next(Object.assign(headers$.value[category.name], category.cat)), err => headers$.error(err), () => headers$.complete());
        return headers$;
    }
}
exports.Headers = Headers;
class Base {
    constructor(config) { }
    getFromRaw(raw) {
        return {};
    }
}
exports.Base = Base;
// public findRaw(name: string): Header<any> {
// 	name = toCamelCase(name);
// 	if (name === 'referer' || name === 'referrer') name = 'referer';
// 	let value = this.raw[name];
// 	name = toKebabCase(name);
// 	return { name: this.list[name], value };
//  }
// public find(...names: string[]): Header[] {
// 	let headers = [];
// 	for (let name of names) {
// 		name = toCamelCase(name);
// 		if (name === 'referer' || name ==='referrer') name = 'referer';
// 		if(this.list[name]) {
// 			name = toKebabCase(name);
// 			headers.push({name: this.list[name]})
// 		}
// 	}
// 	if (!names) headers = this.list;
// 	return headers;
// }
// public set(name: string, value: string): this {
// 	name = toCamelCase(name);
// 	if (name === 'referer' || name ==='referrer') name = 'referer';
// 	this.list[name] = value;
// 	return this;
// }
// public setHeaders(headers: Header[]): this {
// 	for (let name in headers) {
// 		name = toCamelCase(name);
// 		let value = this.list[name];
// 		name = toKebabCase(name);
// 		Object.assign(this.list, {name: value});
// 	}
// 	return this;
// }
// public appendHeader(name: string, ...args: string[]): this {
// 	let append = Array.isArray(args) ? args : [args];
// 	let header = this.getHeader(toCamelCase(name));
// 	if (header) for(let arg of append) header.value.push(arg);
// 	else header.value = append;
// 	this.list[name] = header.value;
// 	return this;
//  }
// public addLink(links: any): this {
// 	let formatedLinks = '';
// 	formatedLinks.concat((this.getHeader('Link') + ', ') || '');
// 	for (let link of links) {
// 		formatedLinks.concat(`<${link}>; rel="` + links[link] + '", ');
// 	}
// 	Object.assign(this.list, {'Link': formatedLinks.substr(0, formatedLinks.length - 2)});
// 	return this;
// }
// public isChunked(): boolean {
// 	return (this.getHeader('transfer-encoding').value.join() === 'chunked');
// }
// public isKeepAlive(version: string): boolean {
// 	if (this.list['connection'] === /keep-alive/) {
// 		return true
// 	} else {
// 		version === '1.0' ? false : true;
// 	}
// }
// export type Connection = 'keep-alive' | 'close'; // comma separated list if transmission artifacts remain
// 	content: ContentR;
// 	accept: AcceptR;
// 		this.content.next(this.headers);
// 		let { types: contentTypes, length } = this.content;
// 		this.accept.next(this.headers);
// 		let { types: acceptTypes, encodings, charsets, languages } = this.accept
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSGVhZGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkhlYWRlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFLQSwwREFBdUQ7QUFZdkQscUNBQXVEO0FBQ3ZELHVDQUE4QztBQWtEOUM7SUFJQyxZQUFZLE1BQXlCO1FBQ3BDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUN0RCxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztZQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsSUFBSSxlQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNyRixFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQztZQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxpQkFBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDeEYsb0dBQW9HO1FBQ3BHLGtGQUFrRjtRQUNsRiwwRkFBMEY7UUFDMUYsNkZBQTZGO1FBQzdGLDZGQUE2RjtRQUM3RixvRkFBb0Y7UUFDcEYsdUZBQXVGO0lBQ3hGLENBQUM7SUFHTSxVQUFVLENBQUMsR0FBb0I7SUFHdEMsQ0FBQztJQUVNLE9BQU8sQ0FBQyxHQUFlO1FBRTdCLElBQUksUUFBUSxHQUFHLElBQUksaUNBQWUsQ0FBVyxFQUFFLENBQUMsQ0FBQztRQUVqRCxJQUFJLFVBQVUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFFOUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO2FBQzVCLEdBQUcs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