"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
const common_1 = require("../common");
class Stack {
    constructor(base) {
        this.results = [];
        if (base && !util_1.isObject(base))
            throw new common_1.StackError('base stack invalid', base);
        Object.keys(base || {}).forEach(key => this[key] = base[key]);
    }
    get copy() {
        return new Stack(this);
    }
    push(results, handler) {
        if (results.length > this.results.length)
            this.results.concat(results.slice(this.results.length - 1));
        function push(arg) {
            this.handlers = (this.handlers || []).push(arg);
        }
        if (handler)
            try {
                push(handler);
                if (handler.auth)
                    this.auth
                        ? this.auth.merge(handler.auth)
                        : this.auth = handler.auth;
                if (handler.middleware)
                    this.middleware = (this.middleware || []).push(handler.middleware);
            }
            catch (err) {
                return err;
            }
        else
            push(undefined);
        return undefined;
    }
}
exports.Stack = Stack;
// 	static concat(target: Stack, source: Stack): Stack | Error {
// 		if (!(target instanceof Stack)) return new StackError('target is not a stack', target);
// 		if (!(source instanceof Stack)) return new StackError('source is not a stack', source);
// 		let result = new Stack;
// 		let pathResult: undefined | Path | PathError | number;
// 		let insertAt: undefined | number;
// 		if (target.path && target.path.isFromRoot)
// 			pathResult = !source.path
// 				? target.path
// 				: source.path.isFromRoot
// 					? Path.oneExtendsTheOther(target, source)
// 					: source.isABranchOf(target);
// 		if (!pathResult && source.path && source.path.isFromRoot) {
// 			if (!target.path) pathResult = source.path;
// 			else
// 				if (!target.path.isFromRoot) pathResult = target.isABranchOf(source);
// 				else return Stack.concat(source, target);
// 		}
// 		if (!pathResult || pathResult instanceof Path) {
// 			return target.results.length > source.results.length
// 				? Stack.insertAt(target, source, 0)
// 				: Stack.insertAt(source, target, 0);
// 		} else if (isError(pathResult)) return pathResult
// 		return Stack.insertAt(target, source, insertAt);
// 	}
// 	static insertAt(target: Stack, source: Stack, index: number = (target.results.length - 1)): Stack | Error {
// 		// 	stack.handlers = (target.handlers || []).concat(source.handlers || []);
// 		// 	stack.middleware = (target.middleware || []).concat(source.middleware || []);
// 		// 	stack.auth = !target.auth
// 		// 		? source.auth
// 		// 		: source.auth
// 		// 			? target.auth.merge(source.auth)
// 		// 			: target.auth;
// 		// 		return results;
// 		// 	}
// 	}
// } 
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJTdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLCtCQUFtRDtBQUVuRCxzQ0FJbUI7QUFPbkI7SUFjQyxZQUFZLElBQWM7UUFabkIsWUFBTyxHQUFxQixFQUFFLENBQUM7UUFjckMsRUFBRSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsZUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQUMsTUFBTSxJQUFJLG1CQUFVLENBQUMsb0JBQW9CLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFOUUsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsSUFBVSxJQUFLLENBQUMsR0FBRyxDQUFDLEdBQVMsSUFBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFFN0UsQ0FBQztJQVRELElBQUksSUFBSTtRQUNQLE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN4QixDQUFDO0lBU00sSUFBSSxDQUFDLE9BQXlCLEVBQUUsT0FBaUI7UUFFdkQsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztZQUN4QyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFN0QsY0FBYyxHQUFRO1lBQ2YsSUFBSyxDQUFDLFFBQVEsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQ3ZELENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUM7WUFDWCxJQUFJLENBQUM7Z0JBQ0osSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUVkLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7b0JBQUMsSUFBSSxDQUFDLElBQUk7MEJBQ3hCLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7MEJBQzdCLElBQUksQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQztnQkFFNUIsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQztvQkFDaEIsSUFBSyxDQUFDLFVBQVUsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUU1RSxDQUFDO1lBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFBQyxNQUFNLENBQUMsR0FBRyxDQUFBO1lBQUMsQ0FBQztRQUU3QixJQUFJO1lBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRXJCLE1BQU0sQ0FBQyxTQUFTLENBQUM7SUFDbEIsQ0FBQztDQUNEO0FBaERELHNCQWdEQztBQWdCRCxnRUFBZ0U7QUFFaEUsNEZBQTRGO0FBQzVGLDRGQUE0RjtBQUU1Riw0QkFBNEI7QUFFNUIsMkRBQTJEO0FBQzNELHNDQUFzQztBQUV0QywrQ0FBK0M7QUFDL0MsK0JBQStCO0FBQy9CLG9CQUFvQjtBQUNwQiwrQkFBK0I7QUFDL0IsaURBQWlEO0FBQ2pELHFDQUFxQztBQUVyQyxnRUFBZ0U7QUFDaEUsaURBQWlEO0FBQ2pELFVBQVU7QUFDViw0RUFBNEU7QUFDNUUsZ0RBQWdEO0FBQ2hELE1BQU07QUFHTixxREFBcUQ7QUFDckQsMERBQTBEO0FBQzFELDBDQUEwQztBQUMxQywyQ0FBMkM7QUFDM0Msc0RBQXNEO0FBRXRELHFEQUFxRDtBQUVyRCxLQUFLO0FBRUwsK0dBQStHO0FBSS9HLGdGQUFnRjtBQUNoRixzRkFBc0Y7QUFDdEYsa0NBQWtDO0FBQ2xDLHVCQUF1QjtBQUN2Qix1QkFBdUI7QUFDdkIsMkNBQTJDO0FBQzNDLHlCQUF5QjtBQUl6Qix5QkFBeUI7QUFDekIsVUFBVTtBQUlWLEtBQUs7QUFDTCxJQUFJIn0=