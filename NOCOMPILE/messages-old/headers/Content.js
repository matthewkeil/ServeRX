"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mime_types_1 = require("mime-types");
class Content {
    constructor(config) {
        this.CE = ['gzip', 'compress', 'deflate', 'identity', 'br'];
        config.headers.content.type ? this.type = true : this.type = false;
        config.headers.content.length ? this.length = true : this.length = false;
        config.headers.content.encoding ? this.encoding = true : this.encoding = false;
    }
    getFromRaw(headers) {
        let content;
        if (this.type)
            content.type = this.getTypes(headers);
        if (this.length)
            content.length = this.getLength(headers);
        if (this.encoding)
            content.encoding = this.getEncoding(headers);
        return content;
    }
    getTypes(headers) {
        let contentTypes = [];
        if (headers.contentType) {
            headers.contentType.forEach(ct => {
                let t = ct.split(';');
                let main = t[0].split('/');
                t[1] ? null : t[1] = '1';
                contentTypes.push({ type: main[0], subtype: main[1], q: +t[1] });
            });
            return contentTypes;
        }
        // RFC2616 section 7.2.1
        return [{ type: 'application', subtype: 'octet-stream', q: 1 }];
    }
    typeExists(type) {
        if (mime_types_1.mime.lookup(type.type.concat(type.subtype ?
            '/' + type.subtype :
            '')))
            return true;
        return false;
    }
    getLength(headers) {
        let length = headers.contentLength;
        if (length)
            return [parseInt(length[0], 10)];
        return [0];
    }
    getEncoding(headers) {
        let encoding = headers.contentEncoding;
        let contentEncoding = [];
        if (encoding) {
            encoding.forEach(enc => {
                let found = false;
                this.CE.forEach(ce => {
                    if (enc === ce)
                        found = true;
                });
                found ?
                    contentEncoding.push(enc) :
                    contentEncoding.push('ERROR');
            });
        }
        return contentEncoding;
    }
}
exports.Content = Content;
// public setTypes(...types: string[]): Header {
// 	let ct = [];
// 	types.forEach(type => {
// 		ct.push(type.indexOf('/') === -1
// 			? mime.lookup(type)
// 			: type);
// 	});
// 	return {'Content-Type': ct};
// };
// public setLength(res: ResponseRx): Header {
// 	return null // request body only, measured in octets (8-bit bytes) {'Content-Length': [res.length.toString()]};
// };
// public isType(...types: string[]): boolean {
// 	var contentType = types.forEach(type => this.getTypes(type));
// 	var matches = true;
// 	if (!contentType) {
// 		return (false);
// 	}
// 	if (type.indexOf('/') === -1) {
// 		type = mime.lookup(type);
// 	}
// 	if (type.indexOf('*') !== -1) {
// 		type = type.split('/');
// 		contentType = contentType.split('/');
// 		matches &= (type[0] === '*' || type[0] === contentType[0]);
// 		matches &= (type[1] === '*' || type[1] === contentType[1]);
// 	} else {
// 		matches = (contentType === type);
// 	}
// 	return (matches);
// };
// /**
//  * creates and sets negotiator on request if one doesn't already exist,
//  * then returns it.
//  * @private
//  * @function negotiator
//  * @param    {Object} req the request object
//  * @returns  {Object}     a negotiator
//  */
// function negotiator(req) {
//     var h = req.headers;
//     if (!req._negotiator) {
//         req._negotiator = new Negotiator({
//             headers: {
//                 accept: h.accept || '*/*',
//                 'accept-encoding': h['accept-encoding'] ||
//                     'identity'
//             }
//         });
//     }
//     return (req._negotiator);
// }
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29udGVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkNvbnRlbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFHQSwyQ0FBa0M7QUEyQmxDO0lBTUMsWUFBWSxNQUF5QjtRQXVEN0IsT0FBRSxHQUFHLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBdEQ5RCxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7UUFDbkUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ3pFLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztJQUNoRixDQUFDO0lBRU0sVUFBVSxDQUFDLE9BQW1CO1FBRXBDLElBQUksT0FBaUIsQ0FBQztRQUV0QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQUMsT0FBTyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3JELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7WUFBQyxPQUFPLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDMUQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUFDLE9BQU8sQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUVoRSxNQUFNLENB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