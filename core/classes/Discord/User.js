const poolQuery = require('./../../functions/database/poolQuery');
const isEmpty = require('./../../functions/utils/isEmpty');
const config = require('./../../../config.json');
const Cache = require('./../../classes/Cache');
const Perms = require('./../BotPerms');
module.exports = class DiscordUser {
    constructor(userId) {
        this.id = userId;
    }

    async init(callback) {
        const cache = new Cache(this.id, 'userSettings.json');
        if (cache.get('perms') == undefined) {
            await this.updateUserCache();
        } else {
            this.perms = Perms.decodePermsIntoArray(cache.get('perms'));
        }
        callback.bind(this)();
    }

    async updateUserCache() {
        const userData = await poolQuery(`SELECT * FROM users WHERE userId='${this.id}'`);
        const cache = new Cache(this.id, 'userSettings.json');
        if (isEmpty(userData)) {
            await poolQuery(`INSERT INTO users (userId, perms) VALUES ('${this.id}', ${config.bot.defaultPerms})`);
            cache.set('perms', config.bot.defaultPerms);
            this.perms = Perms.decodePermsIntoArray(config.bot.defaultPerms);
        } else {
            cache.set('perms', userData[0].perms);
            this.perms = Perms.decodePermsIntoArray(userData[0].perms);
        }
    }
}