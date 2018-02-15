"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
const Segment_1 = require("./Segment");
const Errors_1 = require("./Errors");
class Path extends Array {
    constructor(arg) {
        super();
        this.id = this.last.id;
        this.val = this.last.val;
        this.is = (here) => Path.match(this, here);
        let results = Path.validate(arg, false);
        if (!results || (results instanceof Error))
            throw results || new Errors_1.PathError('cannot built Path with an invalid Input', arg);
        this.concat(results.map(seg => new Segment_1.Segment(seg)));
    }
    static validate(arg, create = true) {
        let finalize = (path) => create
            ? new Path(path.map(seg => new Segment_1.Segment(seg)))
            : [...path].map(seg => [...seg]);
        if (arg instanceof Path)
            return finalize(arg);
        let error;
        let test;
        let valid = [];
        if (util_1.isString(arg))
            if (Path.ValidPath.test(arg))
                test = arg.split('/').filter(value => value !== '');
            else
                return undefined;
        test = test
            ? test
            : arg;
        if (util_1.isArray(test)) {
            test.forEach((segment, index) => {
                let results = Path.validSegment(segment);
                if (!results || util_1.isError(results))
                    error = error || new Errors_1.PathError('invalid segment found', segment);
                else
                    valid.push(results);
                if (segment[0] === '~' && (index !== 0))
                    error = new Errors_1.PathError('root segment must be at the beginning of a path', arg);
            });
        }
        return valid.length === 0
            ? undefined
            : error
                ? error
                : finalize(valid);
    }
    static match(_path, _here) {
        let results = [];
        let match = [results, undefined];
        let path = Path.validate(_path);
        if (!path || util_1.isError(path))
            return [results.concat('no'), path || new Errors_1.PathError('path is invalid', _path)];
        let here = Path.validate(_here);
        if (!here || util_1.isError(here))
            return [results.concat('no'), here || new Errors_1.PathError('here is invalid', _here)];
        if (path.length >= here.length) {
            for (let i = 0; i < here.length; i++) {
                let result = path[i].is(here[i]);
                results.push(result);
                if (result === 'no') {
                    match[1] = new Errors_1.PathError('path not along this path', [_path, _here]);
                    break;
                }
            }
        }
        else
            match[1] = new Errors_1.PathError('path is shorter than the route here', [_path, _here]);
        match[1] = match[1] || path;
        return match;
    }
    get last() {
        return this[this.length - 1];
    }
    set last(arg) {
        let valid = Path.validSegment(arg);
        if (!valid || util_1.isError(valid))
            throw new Errors_1.PathError('cannot set path.last to an invalid segment', arg);
        this[this.length - 1] = new Segment_1.Segment(valid);
    }
    get isFromRoot() {
        return this[0] && (this[0][0] === '~');
    }
}
Path.ValidIdentifier = Segment_1.Segment.ValidIdentifier;
Path.ValidValue = Segment_1.Segment.ValidValue;
Path.ValidSegment = Segment_1.Segment.ValidSegment;
Path.validId = Segment_1.Segment.validId;
Path.validValue = Segment_1.Segment.validValue;
Path.validSegment = Segment_1.Segment.valid;
Path.ValidPath = /^(~?)(?:\/?([^~?#\/]*))*$/;
exports.Path = Path;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGF0aC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIlBhdGgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQkFJYztBQUVkLHVDQUFrQztBQUNsQyxxQ0FBb0M7QUFNcEMsVUFBa0IsU0FBUSxLQUFjO0lBMkd2QyxZQUFZLEdBQVE7UUFDbkIsS0FBSyxFQUFFLENBQUM7UUFMRixPQUFFLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7UUFFbEIsUUFBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO1FBWXBCLE9BQUUsR0FBRyxDQUFDLElBQVcsS0FBSyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQVBuRCxJQUFJLE9BQU8sR0FBZ0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDckQsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxPQUFPLFlBQVksS0FBSyxDQUFDLENBQUM7WUFDMUMsTUFBTSxPQUFPLElBQUksSUFBSSxrQkFBUyxDQUFDLHlDQUF5QyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBRWhGLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksSUFBSSxpQkFBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNuRCxDQUFDO0lBeEdNLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBUSxFQUFFLFNBQWtCLElBQUk7UUFFdEQsSUFBSSxRQUFRLEdBQUcsQ0FBQyxJQUFpQixLQUFLLE1BQU07Y0FDekMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksSUFBSSxpQkFBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Y0FDM0MsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLEdB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