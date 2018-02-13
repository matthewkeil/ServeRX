"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
const common_1 = require("../common");
const _1 = require("./");
class Mounted {
    constructor(config) {
        this.config = config;
        this[Symbol.iterator] = () => {
            let searchOrder = [];
            for (let valHandler of this.param.inOrder) {
                for (let val of valHandler[1]) {
                    val
                        ? searchOrder.push(val)
                        : null;
                }
            }
            Object.keys(this.param.stars).forEach(identifier => {
                searchOrder.push(['*', this.param.stars[identifier]]);
            });
            return {
                next: () => {
                    let current = searchOrder.shift();
                    return current
                        ? {
                            value: current,
                            done: false
                        }
                        : {
                            value: undefined,
                            done: true
                        };
                }
            };
        };
        this._add = {
            methods: (resource, methods = ['all'], supported = this.config.supportedMethods) => {
                let self = this;
                if (_1.HandlerConfig.validate.methods(methods, supported))
                    methods.forEach(method => {
                        if (method === 'all')
                            return supported.forEach(METHOD => {
                                self.methods[METHOD] = resource;
                            });
                        else
                            self.methods[method] = resource;
                    });
                else
                    throw new MountError('Cannot mount a resource to an unsupported method');
                return this.config;
            },
            paramValues: (values, replaceExisting = false) => {
                if (util_1.isArray(this.segment)
                    && this.segment[0].startsWith(':')
                    && (this.segment[1] === undefined)) {
                    let test = _1.HandlerConfig.validate.param.values(values);
                    if (!test || util_1.isError(test))
                        return test || new MountError('cannon mount invalid param values');
                    replaceExisting
                        ? this.param.values = test
                        : this.param.values.concat(test);
                    return this.config;
                }
                return new MountError('param values can only be added to segments that are value params');
            },
            paramCheck: (check) => {
                if (util_1.isArray(this.segment)
                    && this.segment[0].startsWith(':')
                    && (this.segment[1] === undefined)) {
                    let test = _1.HandlerConfig.validate.param.check(check);
                    if (!test || util_1.isError(test))
                        return test || new MountError('cannon mount invalid check function');
                    this.param.check = test;
                    return this.config;
                }
                return new MountError('check function can only be added to segments that are value params');
            },
            paramInOrder: (params, replaceExisting = false) => {
                let test = _1.HandlerConfig.validate.param.inOrder(params);
                if (!test || util_1.isError(test))
                    return test || new MountError('cannon mount invalid segment params');
                replaceExisting
                    ? this.param.inOrder = test
                    : this.param.inOrder.concat(test);
                return this.config;
            },
            paramStars: (params, replaceExisting = false) => {
                let test = _1.HandlerConfig.validate.param.stars(params);
                if (!test || util_1.isError(test))
                    return test || new MountError('cannon mount invalid star params');
                replaceExisting
                    ? this.param.stars = test
                    : this.param.stars.concat(test);
                return this.config;
            },
            param: (param) => {
                let valid = _1.HandlerConfig.validate.param(param);
                if (!valid || util_1.isError(valid))
                    return valid || new MountError('cannon mount invalid params');
                let error;
                let original = Object.assign({}, this.param);
                function checkResults(results) {
                    if (util_1.isError(results) && !error)
                        error = results;
                }
                if (valid.check)
                    checkResults(this._add.paramCheck(valid.check));
                if (valid.values)
                    checkResults(this._add.paramValues(valid.values));
                if (valid.inOrder)
                    checkResults(this._add.paramInOrder(valid.inOrder));
                if (valid.stars)
                    checkResults(this._add.paramStars(valid.stars));
                if (error) {
                    this.param = original;
                    return error;
                }
                return this.config;
            },
            all: (config) => {
                if (config.resource && !config.param) {
                    let results = this.add.methods(config.resource, config.methods, this.supportedMethods);
                    if (util_1.isError(results))
                        return results;
                }
                else if (!config.resource && config.param) {
                }
                else if (config.resource && config.param) {
                }
                return this.config;
            }
        };
        this._remove = {
            methods: (remove) => {
                if (util_1.isArray(remove) && this.methods)
                    remove.forEach(method => {
                        if (util_1.isString(method) && this.methods[method])
                            delete this.methods[method];
                    });
                return this.config;
            },
            paramValues: (remove) => {
                if (this.param && this.param.values) {
                    let self = this;
                    let original = Object.assign({}, this.param.values);
                    (util_1.isArray(remove) ? remove : [remove]).forEach(value => {
                        let newValues = [];
                        let found = false;
                        self.param.values.forEach(val => {
                            if (value === val[0])
                                found = true;
                            else
                                newValues.push(val);
                        });
                        if (!found) {
                            this.param.values = original;
                            return new MountError(`couldnt find param value ${value}`);
                        }
                        self.param.values = newValues;
                    });
                    return this.config;
                }
                return new MountError('no param values found');
            },
            paramCheck: () => {
                if (this.param && this.param.check) {
                    delete this.param.check;
                    return this.config;
                }
                return new MountError('no param check function found');
            },
            paramInOrder: (remove) => {
                let self = this;
                let original = Object.assign({}, this.param.inOrder);
                (util_1.isArray(remove) ? remove : [remove]).forEach(identifier => {
                    if (!common_1.Path.ValidIdentifier.test(identifier)) {
                        this.param.inOrder = original;
                        return new MountError(`${identifier} is not a valid identifier`);
                    }
                    let newValues = [];
                    let found = false;
                    self.param.inOrder.forEach(val => {
                        if (identifier === val[0])
                            found = true;
                        else
                            newValues.push(val);
                    });
                    if (!found) {
                        this.param.inOrder = original;
                        return new MountError(`couldnt find param identifier ${identifier}`);
                    }
                    self.param.values = newValues;
                });
                return this.config;
            },
            paramStars: (remove) => {
                let self = this;
                let original = Object.assign({}, this.param.stars);
                (util_1.isArray(remove) ? remove : [remove]).forEach(identifier => {
                    if (!common_1.Path.ValidIdentifier.test(identifier)) {
                        this.param.stars = original;
                        return new MountError(`${identifier} is not a valid identifier`);
                    }
                    if (!identifier.startsWith(':'))
                        identifier = `:${identifier}`;
                    if (self.param.stars.hasOwnProperty(identifier))
                        delete self.param.stars[identifier];
                    else {
                        this.param.stars = original;
                        return new MountError(`couldnt find param identifier ${identifier}`);
                    }
                });
                return this.config;
            },
            param: () => {
                if (this.param)
                    delete this.param;
                else
                    return new MountError('no param to remove');
                return this.config;
            },
            all: () => { }
        };
        this.methods = this.routes = {};
        this.param = {
            values: [],
            inOrder: [],
            stars: {}
        };
        this.add = this._add.all;
        this.add.methods = this._add.methods;
        this.add.param = this._add.param;
        this.add.param.values = this._add.paramValues;
        this.add.param.check = this._add.paramCheck;
        this.add.param.inOrder = this._add.paramInOrder;
        this.add.param.stars = this._add.paramStars;
        this.remove = this._remove.all;
        this.remove.methods = this._remove.methods;
        this.remove.param = this._remove.param;
        this.remove.param.values = this._remove.paramValues;
        this.remove.param.check = this._remove.paramCheck;
        this.remove.param.inOrder = this._remove.paramInOrder;
        this.remove.param.stars = this._remove.paramStars;
    }
}
exports.Mounted = Mounted;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTW91bnRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIk1vdW50ZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSwrQkFBa0Q7QUFHbEQsc0NBR21CO0FBRW5CLHlCQUlZO0FBS1o7SUFTQyxZQUFvQixNQUFxQjtRQUFyQixXQUFNLEdBQU4sTUFBTSxDQUFlO1FBd0J6QyxLQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRztZQUVuQixJQUFJLFdBQVcsR0FBK0IsRUFBRSxDQUFDO1lBRWpELEdBQUcsQ0FBQyxDQUFDLElBQUksVUFBVSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDM0MsR0FBRyxDQUFDLENBQUMsSUFBSSxHQUFHLElBQUksVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDL0IsR0FBRzswQkFDQSxXQUFXLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQzswQkFDckIsSUFBSSxDQUFDO2dCQUNULENBQUM7WUFDRixDQUFDO1lBRUQsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVO2dCQUMvQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFZLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBRSxDQUFDLENBQUMsQ0FBQztZQUNsRSxDQUFDLENBQUMsQ0FBQztZQUVILE1BQU0sQ0FBQztnQkFDTixJQUFJLEVBQUU7b0JBQ0wsSUFBSSxPQUFPLEdBQUcsV0FBVyxDQUFDLEtBQUssRUFBRSxDQUFDO29CQUNsQyxNQUFNLENBQUMsT0FBTzswQkFDWDs0QkFDRCxLQUFLLEVBQUUsT0FBTzs0QkFDZCxJQUFJLEVBQUUsS0FBSzt5QkFDWDswQkFDQzs0QkFDRCxLQUFLLEVBQUUsU0FBUzs0QkFDaEIsSUFBSSxFQUFFLElBQUk7eUJBQ1YsQ0FBQTtnQkFDSCxD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