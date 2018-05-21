const poolQuery = require('./../../functions/database/poolQuery');
const isEmpty = require('./../../functions/utils/isEmpty');
const Profile = require('./../Cardinal/Profile');
const config = require('./../../../config.json');
const Cache = require('./../../classes/Cache');
const Perms = require('./../BotPerms');
module.exports = class DiscordUser {
    constructor(user) {
        this.id = user.id;
        this.discord = user;
    }

    async init(callback) {
        const cache = new Cache(this.id, 'userSettings.json');
        if (cache.get('perms') == undefined) {
            await this.updateUserCache();
        } else {
            this.perms = new Perms(cache.get('perms'));
            this.activeProfile = cache.get('activeProfile') != null ? new Profile(cache.get('activeProfile')) : null;
        }
        callback.bind(this)();
    }

    async updateUserCache() {
        const userData = await poolQuery(`SELECT * FROM users WHERE userId='${this.id}'`);
        const cache = new Cache(this.id, 'userSettings.json');
        if (isEmpty(userData)) {
            await poolQuery(`INSERT INTO users (userId, perms) VALUES ('${this.id}', ${config.bot.defaultPerms})`);
            cache.set('perms', config.bot.defaultPerms);
            this.perms = new Perms(config.bot.defaultPerms);
        } else {
            cache.set('perms', userData[0].perms);
            this.perms = new Perms(userData[0].perms);
            cache.set('activeProfile', userData[0].activeProfile);
            this.activeProfile = userData[0].activeProfile != null ? new Profile(userData[0].activeProfile) : null;
        }
    }
}