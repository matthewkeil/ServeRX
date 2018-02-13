"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function _stringify(objToStringify, replacer, spaces, escape) {
    // v8 checks arguments.length for optimizing simple call
    // https://bugs.chromium.org/p/v8/issues/detail?id=4730
    let json = replacer || spaces
        ? JSON.stringify(objToStringify, replacer, spaces)
        : JSON.stringify(objToStringify);
    if (escape) {
        json = json.replace(/[<>&]/g, function (c) {
            switch (c.charCodeAt(0)) {
                case 0x3c:
                    return '\\u003c';
                case 0x3e:
                    return '\\u003e';
                case 0x26:
                    return '\\u0026';
                default:
                    return c;
            }
        });
    }
    return json;
}
function ResponsePatcher(config, Response, _headers) {
    Object.keys(ResponsePatcher).forEach(method => {
        Object.assign(Response.prototype[method], ResponsePatcher[method](config));
    });
    Response.headers = _headers;
    Response.headers.que = Response.headers.sent = [];
}
exports.ResponsePatcher = ResponsePatcher;
/** _send(
       args: {
           statusCode?: number;
           message?: string;
           headers?: OutgoingHeaders;
           body?: any;
       }): void {

       let message = <any>{};

       if (args.statusCode && util.isNumber(args.statusCode)) {
           message.statusCode = args.statusCode;
       }

       (<any>this).setStatus(message.statusCode).send(args.body)

   }

   static sendJSON(config: HttpServerConfig): (objToSend: Object) => void {

       return (objToSend: Object): void => {
           
           // settings
           let replacer = config.response.stringify.replacer;
           let spaces = config.response.stringify.spaces;
           let escape = config.response.stringify.escape;

           let jsonToSend = _stringify(objToSend, replacer, spaces, escape)

           // content-type
           if (!(<any>this).headers.contentType) {
               (<any>this).headers.contentType.set({
                   mime: 'application', sub: 'json'});
           }
       
           return (<any>this)._send({
               statusCode: 200,
               body: jsonToSend
           })
       }
   }
} 
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVzcG9uc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJSZXNwb25zZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQWNBLG9CQUNDLGNBQW1CLEVBQ25CLFFBQTRDLEVBQzVDLE1BQXdCLEVBQ3hCLE1BQWdCO0lBR2hCLHdEQUF3RDtJQUN4RCx1REFBdUQ7SUFDdkQsSUFBSSxJQUFJLEdBQUcsUUFBUSxJQUFJLE1BQU07VUFDMUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQztVQUNoRCxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBRWxDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDWixJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsVUFBVSxDQUFDO1lBQ3hDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMxQixLQUFLLElBQUk7b0JBQ1IsTUFBTSxDQUFDLFNBQVMsQ0FBQTtnQkFDakIsS0FBSyxJQUFJO29CQUNSLE1BQU0sQ0FBQyxTQUFTLENBQUE7Z0JBQ2pCLEtBQUssSUFBSTtvQkFDUixNQUFNLENBQUMsU0FBUyxDQUFBO2dCQUNqQjtvQkFDQyxNQUFNLENBQUMsQ0FBQyxDQUFBO1lBQ1QsQ0FBQztRQUNGLENBQUMsQ0FBQyxDQUFBO0lBQ0gsQ0FBQztJQUVELE1BQU0sQ0FBQyxJQUFJLENBQUE7QUFDWixDQUFDO0FBdUJELHlCQUFnQyxNQUF3QixFQUFFLFFBQWEsRUFBRSxRQUFpQjtJQUd4RixNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNO1FBQzFDLE1BQU0sQ0FBQyxNQUFNLENBQ1osUUFBUSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFDMUIsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUMvQixDQUFBO0lBQ0YsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQztJQUM1QixRQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7QUFFbkQsQ0FBQztBQWJGLDBDQWFFO0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBeUNBIn0=