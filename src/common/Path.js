"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
const _1 = require("./");
class Path extends Array {
    constructor(arg) {
        super();
        let results = Path.validate(arg, false);
        if (!results || (results instanceof Error))
            throw results || new _1.PathError('cannot built Path with an invalid MatchString', arg);
        this.push(...results);
    }
    /**     */
    static validate(arg, create = true) {
        if (arg instanceof Path)
            return arg;
        let test;
        let valid = [];
        let error;
        if (util_1.isString(arg)) {
            test = Path.ValidPath.exec(arg);
            let split = (arg) => arg.split('/').filter(value => value !== '');
            if (test) {
                if (test[1] === '~') {
                    valid.push('~');
                    test = split(arg.substr(1));
                }
                else
                    test = split(arg);
            }
            else
                return undefined;
        }
        test = test ? test : arg;
        if (util_1.isArray(test)) {
            test.forEach((segment, index) => {
                if (util_1.isString(segment) && (segment === '~') && (index !== 0))
                    error = error ||
                        new _1.PathError('root segment must be at the beginning of a path', arg);
                let results = Path.validateSegment(segment);
                if (results)
                    valid.push(results);
                else
                    error = error ? error : new _1.PathError('invalid segment found', segment);
            });
        }
        return valid.length === 0
            ? undefined
            : error
                ? error
                : create
                    ? new Path(valid)
                    : valid;
    }
    static match(_path, _here) {
        let results = [];
        let path = Path.validate(_path);
        if (!path || util_1.isError(path))
            return [results.concat('no'), path || new _1.PathError('path is invalid', _path)];
        let here = Path.validate(_here);
        if (!here || util_1.isError(here))
            return [results.concat('no'), here || new _1.PathError('here is invalid', _here)];
        if (path.length >= here.length) {
            for (let i = 0; i < here.length; i++) {
                let pathSeg = path[i];
                let hereSeg = here[i];
                /**
                 *1 ./this/is/an/input				./this/is/a/route
                 *2										./this/[ is, undefined  ]/a/star/param
                 *3										./this/[ anyParam, 'is' ]/a/value/param
                 *4 ./this/:is/an/input				./this/[ is, undefined  ]/a/star/param
                 *5 ./this/is=anyValue/an/input	./this/[ is, 'anyValue' ]/a/parameter
                 */
                // matches 1, 4, 5
                if (pathSeg === hereSeg) {
                    results.push('yes');
                    continue;
                }
                if (util_1.isArray(hereSeg)) {
                    // matches value param at end of here or a star handler that came in as a value
                    if (!hereSeg[1] || (hereSeg[1] === '*')) {
                        results.push('maybe');
                        continue;
                    }
                    // matches value param mid-path
                    if (util_1.isString(pathSeg) && (pathSeg === hereSeg[1])) {
                        results.push('value');
                        continue;
                    }
                }
                results.push('no');
                path = new _1.PathError('path not along this path', [_path, _here]);
                break;
            }
        }
        else
            path = new _1.PathError('path is shorter than the route here', _path);
        return [results, path];
    }
    get last() { return this[this.length - 1]; }
    set last(arg) {
        let valid = Path.validateSegment(arg);
        if (!valid && util_1.isError(valid))
            throw new _1.PathError('cannot set path.last to an invalid segment', arg);
        this[this.length - 1] = valid;
    }
    get identifier() {
        return util_1.isArray(this.last)
            ? this.last[0]
            : this.last;
    }
    set identifier(arg) {
        if (util_1.isArray(this.last)) {
            let [param, value] = this.last;
            this.last = [arg, value];
        }
        else
            this.last = arg;
    }
    get value() {
        return util_1.isArray(this.last)
            ? this.last[1]
            : null;
    }
    set value(arg) {
        if (util_1.isArray(this.last)) {
            let [param, value] = this.last;
            this.last = [param, arg];
        }
        else
            throw new _1.PathError('cannot set the value for a string segment', this.last);
    }
    get isFromRoot() {
        return util_1.isString(this[0]) && (this[0] === '~');
    }
    isHere(path) { return Path.match(path, this); }
}
Path.ValidPath = /^(~?)(?:\/?([^~?#/\/]*))*$/;
exports.Path = Path;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGF0aC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIlBhdGgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSwrQkFBdUU7QUFJdkUseUJBR1k7QUFZWixVQUFrQixTQUFRLEtBQWM7SUErSXZDLFlBQVksR0FBUTtRQUNuQixLQUFLLEVBQUUsQ0FBQztRQUVSLElBQUksT0FBTyxHQUFjLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ25ELEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsT0FBTyxZQUFZLEtBQUssQ0FBQyxDQUFDO1lBQzFDLE1BQU0sT0FBTyxJQUFJLElBQUksWUFBUyxDQUFDLCtDQUErQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBRXRGLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQztJQUN2QixDQUFDO0lBbEpELFVBQVU7SUFFVixNQUFNLENBQUMsUUFBUSxDQUFDLEdBQVEsRUFBRSxNQUFNLEdBQUcsSUFBSTtRQUV0QyxFQUFFLENBQUMsQ0FBQyxHQUFHLFlBQVksSUFBSSxDQUFDO1lBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQztRQUVwQyxJQUFJLElBQWlDLENBQUM7UUFDdEMsSUFBSSxLQUFLLEdBQWMsRUFBRSxDQUFDO1FBQzFCLElBQUksS0FBNEIsQ0FBQztRQUVqQyxFQUFFLENBQUMsQ0FBQyxlQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRW5CLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUVoQyxJQUFJLEtBQUssR0FBRyxDQUFDLEdBQVcsS0FBSyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLElBQUksS0FBSyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBRTFFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENB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