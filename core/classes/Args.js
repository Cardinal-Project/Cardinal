module.exports = class Args {
    constructor(string, separator) {
        this.separator = separator;
        this.string = string;
        this.args = string.split(separator);
    }
    
    /**
       * @param key Key to add
       * @param value Value to add with key
    */
    addArg(key, value) {
        key.length == 1 ? this.args.push(`-${key}`) : this.args.push(`--${key}`);
        value != null ? this.args.push(value) : null;
    }
    
    /**
       * @param key Key to remove
    */
    removeArg(key) {
        if (key.indexOf('-') != -1) {
            delete this.args[this.lookFor(key)];
            delete this.args[this.after(key)];
        } else {
            delete this.args[this.args.indexOf(key)]
        }
    }
    
    /**
       * @param arg Arg to look after
    */
    after(arg) {
        return this.args[this.args.indexOf(arg)+1];
    }
    
    /**
       * @param arg Arg to look before
    */
    before(arg) {
        return this.args[this.args.indexOf(arg)-1];
    }
    
    /**
       * @param arg Part of the arg you are looking for
    */
    lookFor(arg) {
        var index = null;
        var i = 0;
        for (let element of this.args) {
            element.indexOf(arg) != -1 && index == null ? index = i : i++;
        }
        return index;
    }

    isEmpty() {
        return this.args.length > 1 ? true : false;
    }
}