"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
let error;
let tryCatchTarget;
function tryCatcher() {
    try {
        return tryCatchTarget.apply(this, arguments);
    }
    catch (e) {
        return util_1.isUndefined(error) ?
            new Error('unhandled try/catch exception') :
            error instanceof Error ?
                error :
                error(e);
    }
}
function TryCatch(fn, ifError) {
    tryCatchTarget = fn;
    error = ifError;
    return tryCatcher();
}
exports.TryCatch = TryCatch;
;
// let tryBuildTarget: any;
// let buildArgs: any[];
// function tryBuilder<T extends Object>(this: any): T | Error {
// 	try {
// 		let instance: T = tryBuildTarget.constructor.apply(this, buildArgs);
// 		if (instance instanceof Error) return instance;
// 		return instance;
// 	} catch (err) { return err }
// 	// try {
// 	// 	return Object.create(tryBuildTarget.constructor(...buildArgs));
// 	// } catch (e) {
// 	// 	return !error
// 	// 		? new ServerError('unhandled try/catch exception', e)
// 	// 		: error instanceof Error
// 	// 			? error
// 	// 			: (typeof error) === 'function'
// 	// 				? error(e)
// 	// 				: new ServerError('unhandled try/catch exception and bad error response', e, error);
// 	// }
// }
// export function tryBuild<T extends Object>(
// 	obj: [T, undefined | any],
// 	ifError: Error | ((e: Error) => Error) = new ServerError('unhandled try/catch exception'),
// ): Error | T {
// 	tryBuildTarget = obj[0];
// 	buildArgs = obj[1];
// 	error = ifError;
// 	return <any>tryBuilder;
// }
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHJ5QW5kLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiVHJ5QW5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsK0JBQStDO0FBSS9DLElBQUksS0FBa0QsQ0FBQztBQUl2RCxJQUFJLGNBQXdCLENBQUM7QUFFN0I7SUFDQyxJQUFJLENBQUM7UUFDSixNQUFNLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDOUMsQ0FBQztJQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDWixNQUFNLENBQUMsa0JBQVcsQ0FBQyxLQUFLLENBQUM7WUFDeEIsSUFBSSxLQUFLLENBQUMsK0JBQStCLENBQUM7WUFDMUMsS0FBSyxZQUFZLEtBQUs7Z0JBQ3JCLEtBQUs7Z0JBQ0wsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ1osQ0FBQztBQUNGLENBQUM7QUFDRCxrQkFDQyxFQUFZLEVBQ1osT0FBdUM7SUFFdkMsY0FBYyxHQUFHLEVBQUUsQ0FBQztJQUNwQixLQUFLLEdBQUcsT0FBTyxDQUFDO0lBRWhCLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQztBQUNyQixDQUFDO0FBUkQsNEJBUUM7QUFBQSxDQUFDO0FBSUYsMkJBQTJCO0FBQzNCLHdCQUF3QjtBQUV4QixnRUFBZ0U7QUFFaEUsU0FBUztBQUNULHlFQUF5RTtBQUN6RSxvREFBb0Q7QUFDcEQscUJBQXFCO0FBQ3JCLGdDQUFnQztBQUdoQyxZQUFZO0FBQ1osdUVBQXVFO0FBQ3ZFLG9CQUFvQjtBQUNwQixxQkFBcUI7QUFDckIsOERBQThEO0FBQzlELGlDQUFpQztBQUNqQyxpQkFBaUI7QUFDakIseUNBQXlDO0FBQ3pDLHFCQUFxQjtBQUNyQiwrRkFBK0Y7QUFDL0YsUUFBUTtBQUNSLElBQUk7QUFDSiw4Q0FBOEM7QUFDOUMsOEJBQThCO0FBQzlCLDhGQUE4RjtBQUM5RixpQkFBaUI7QUFFakIsNEJBQTRCO0FBQzVCLHVCQUF1QjtBQUN2QixvQkFBb0I7QUFFcEIsMkJBQTJCO0FBQzNCLElBQUkifQ==