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
    static validateSegment(arg) {
        if (util_1.isString(arg)) {
            if (arg === '~')
                return '~';
            let results = Path.ValidSegment.exec(arg);
            if (results === null)
                return undefined;
            let [input, param, identifier, value] = results;
            return !(param === ':') && !value
                ? identifier
                : value
                    ? [`:${identifier}`, value]
                    : [`:${identifier}`, null];
        }
        if (util_1.isArray(arg) && (arg.length === 2)) {
            let identifier = arg[0];
            let value = arg[1];
            if (util_1.isString(identifier)
                && identifier.startsWith(':')
                && (util_1.isNull(value) || util_1.isUndefined(value) || util_1.isString(value))) {
                let test = Path.validateIdentifier(identifier);
                return test && !(test instanceof Error)
                    ? [test, value]
                    : test || new _1.PathError('invalid identifier', identifier);
            }
            return undefined;
        }
        return undefined;
    }
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
Path.ValidIdentifier = /^:?[-\w]*$/;
Path.ValidSegment = /^\/?(:?)([-\w]+)(?:=([^\/]*))?\/?$/;
Path.ValidPath = /^(~?)(?:\/?([^~?#/\/]*))*$/;
/**     */
Path.validateIdentifier = (arg) => {
    if (util_1.isString(arg)) {
        return Path.ValidIdentifier.test(arg)
            ? arg
            : new _1.PathError('invalid identifier', arg);
    }
    return undefined;
};
exports.Path = Path;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGF0aC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIlBhdGgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSwrQkFBdUU7QUFLdkUseUJBR1k7QUFZWixVQUFrQixTQUFRLEtBQWM7SUErTHZDLFlBQVksR0FBUTtRQUNuQixLQUFLLEVBQUUsQ0FBQztRQUVSLElBQUksT0FBTyxHQUFjLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ25ELEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsT0FBTyxZQUFZLEtBQUssQ0FBQyxDQUFDO1lBQzFDLE1BQU0sT0FBTyxJQUFJLElBQUksWUFBUyxDQUFDLCtDQUErQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBRXRGLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQztJQUN2QixDQUFDO0lBeExELE1BQU0sQ0FBQyxlQUFlLENBQUMsR0FBUTtRQUU5QixFQUFFLENBQUMsQ0FBQyxlQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRW5CLEVBQUUsQ0FBQyxDQUFDLEdBQUcsS0FBSyxHQUFHLENBQUM7Z0JBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQztZQUU1QixJQUFJLE9BQU8sR0FBNEMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7WUFFbkYsRUFBRSxDQUFDLENBQUMsT0FBTyxLQUFLLElBQUksQ0FBQztnQkFBQyxNQUFNLENBQUMsU0FBUyxDQUFBO1lBRXRDLElBQUksQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxLQUFLLENBQUMsR0FBRyxPQUFPLENBQUM7WUFFaEQsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLEtBQUssR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLO2tCQUNsQixVQUFVO2tCQUN0QixLQUFLO3NCQUNPLENBQUMsSUFBSSxVQUFVLEVBQUUsRUFB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