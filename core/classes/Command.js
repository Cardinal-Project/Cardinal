module.exports = class Command {
    constructor(commandName) {
        for (let [key, value] of Object.entries(require(`./../commands/${commandName}`).infos)) {
            this[key] = value;
        }
        this.command = commandName;
    }
}