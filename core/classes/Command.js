const commands = require('./../data/commands.json');
module.exports = class Command {
    constructor(commandName) {
        if (commands[commandName] != undefined) {
            for (let [key, value] of Object.entries(commands[commandName])) {
                this[key] = value;
            }
        } else {
            return new TypeError(`Unknown Command`);
        }
    }
}