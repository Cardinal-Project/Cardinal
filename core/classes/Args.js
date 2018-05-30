module.exports = class Args {
    constructor(string, command) {
        this.separator = ' ';
        this.string = string;
        this.args = string.split(separator);
    }

    fetchData() {
        this.data = this.args;
        var requiredArgs = 0;
        var index = 0;
        const checkDash = function() {
            if (data.types != undefined) {
                this.data[key] = Args.checkArgsValidity(this.args[index + 1], data);
                index++;
            } else {
                this.data[key] = true;
            }
        }
        for (let [key, data] of Object.entries(command.args)) {
            if (this.args[index] != undefined) {
                if (this.args[index].indexOf('-') == 0) {
                    if (this.args[index].indexOf('--') == 0) {
                        const argsKey = this.args[index].replace('--', '');
                        if (command.args[argsKey] != undefined) checkDash();
                    } else {
                        var matchingKeys = [];
                        for (let [key, data] of Object.entries(command.args)) {
                            if (key[0] == this.args[index].replace('-', '')) {
                                matchingKeys.push(key);
                            }
                        }
                        if (matchingKeys.length == 1) checkDash();
                    }
                } else {
                    this.data[key] = Args.checkArgsValidity(this.args[index], data);
                    index++;
                }
            }
            if (data.required == true) requiredArgs++;
        }

        if (requiredArgs == Object.keys(this.data).length) {
            return this.data;
        } else {
            return new RangeError(`One or multiple required args are missing or do not match to the expected ones.`);
        }
    }

    static checkArgsValidity(args, data) {
        var returnData = null;
        if (data.allowedWords != undefined) {
            if (data.length[0] <= String(args).length <= data.length[1]) {
                if (data.types.indexOf('number') != -1 && !isNaN(args)) {
                    returnData = parseInt(args);
                } else if (data.types.indexOf('string') != -1) {
                    returnData = args;
                }
            }
        } else {
            if (data.allowedWords.indexOf(args) != -1)
                returnData = data.types.indexOf('number') != -1 ? parseInt(args) : args;
        }
        return returnData;
    }

    add(key, value) {
        key.length == 1 ? this.args.push(`-${key}`) : this.args.push(`--${key}`);
        value != null ? this.args.push(value) : null;
        this.string = this.args.join(this.separator);
        return this;
    }

    remove(key) {
        if (key.indexOf('-') != -1) {
            delete this.args[this.lookFor(key)];
            delete this.args[this.after(key)];
        } else {
            delete this.args[this.args.indexOf(key)]
        }
        this.string = this.args.join(this.separator);
        return this;
    }

    after(arg) {
        return this.args[this.args.indexOf(arg)+1];
    }
    
    before(arg) {
        return this.args[this.args.indexOf(arg)-1];
    }
    
    lookFor(arg) {
        var index = null;
        var i = 0;
        for (let element of this.args) {
            element.indexOf(arg) != -1 && index == null ? index = i : i++;
        }
        return index;
    }

    isEmpty() {
        return this.args.length > 0 ? false : true;
    }
}