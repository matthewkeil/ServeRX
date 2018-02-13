"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Rx = require("rxjs");
const Headers_1 = require("./Headers");
class Content {
    constructor(_config) {
        this._config = _config;
        this.acceptCharset = this._config.headers.incoming.acceptCharset ?
            Content.acceptCharset : Headers_1.Headers.notRead;
        this.acceptEncoding = this._config.headers.incoming.acceptEncoding ?
            Content.acceptEncoding(this._config) : Headers_1.Headers.notRead;
        this.acceptLanguage = this._config.headers.incoming.acceptLanguage ?
            Content.acceptLanguage : Headers_1.Headers.notRead;
        this.acceptType = this._config.headers.incoming.acceptType ?
            Content.acceptType : Headers_1.Headers.notRead;
        this.ContentType = Content.contentType;
    }
    static acceptEncoding(config) {
        return {
            get: (encodings) => {
                return Rx.Observable.from(encodings.map(set => {
                    let values = set.split(';');
                    return { directive: values[0], q: +values[1] };
                }));
            }
        };
    }
}
Content.directives = [
    '*',
    'compress',
    'deflate',
    'br',
    'identity',
    'gzip'
];
Content.acceptCharset = {
    get: (charsets) => {
        return Rx.Observable.from(charsets.map(set => {
            let values = set.split(';');
            return { charset: values[0], q: +values[1] };
        }));
    }
};
Content.acceptLanguage = {
    get: (languages) => {
        return Rx.Observable.from(languages.map(lang => {
            let values = lang.split(';');
            let language = values[0].split('-');
            return { language: language[0], locale: language[1], q: +values[1] };
        }));
    }
};
Content.acceptType = {
    get: (types) => {
        return Rx.Observable.from(types.map(type => {
            let values = type.split(';');
            let mime = values[0].split('/');
            return { mime: mime[0], subType: mime[1], q: +values[1] };
        }));
    }
};
Content.contentType = {
    set: (type) => { }
};
exports.Content = Content;
// static getEncoding(config: HttpServerConfig): (encodings: string[]) => Rx.Observable<AcceptEncoding> {
// 	return (encodings: string[]) => {
// 		let acceptedDirectives = Accept.directives.concat(config.headers.accept.acceptedDirectives);
// 		return new Rx.Observable(observer => {
// 			encodings.forEach(encoding => {
// 				let values = encoding.split(';');
// 				acceptedDirectives.forEach(dir => {
// 					let found = false;
// 					if (values[0] === dir) {
// 						let found = true;
// 						observer.next({directive: <Directive>values[0], q: +values[1]});
// 						return;
// 					}
// 					observer.error(new Error('Accept-Encoding Directive not recognized'))
// 				});
// 			});
// 			observer.complete();
// 		});
// 	}
// } 
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29udGVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkNvbnRlbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFJQSwyQkFBMkI7QUFJM0IsdUNBQXlEO0FBNkN6RDtJQVlDLFlBQW9CLE9BQXlCO1FBQXpCLFlBQU8sR0FBUCxPQUFPLENBQWtCO1FBQzVDLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLGFBQWE7WUFDL0QsT0FBTyxDQUFDLGFBQWEsR0FBRyxpQkFBTyxDQUFDLE9BQU8sQ0FBQztRQUN6QyxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxjQUFjO1lBQ2pFLE9BQU8sQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLGlCQUFPLENBQUMsT0FBTyxDQUFDO1FBQ3hELElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLGNBQWM7WUFDakUsT0FBTyxDQUFDLGNBQWMsR0FBRSxpQkFBTyxDQUFDLE9BQU8sQ0FBQztRQUN6QyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxVQUFVO1lBQ3pELE9BQU8sQ0FBQyxVQUFVLEdBQUcsaUJBQU8sQ0FBQyxPQUFPLENBQUM7UUFFdEMsSUFBSSxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDO0lBQ3hDLENBQUM7SUFzQkQsTUFBTSxDQUFDLGNBQWMsQ0FBQyxNQUF3QjtRQUM3QyxNQUFNLENBQUM7WUFDTixHQUFHLEVBQUUsQ0FBQyxTQUFtQjtnQkFDeEIsTUFBTSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQ3RDLEdBQUc7b0JBQ0YsSUFBSSxNQUFNLEdBQUcsR0FB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