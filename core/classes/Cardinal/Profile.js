const poolQuery = require('./../../functions/database/poolQuery');
const isEmpty = require('./../../functions/utils/isEmpty');
const Player = require('./Player');
const Cache = require('./../Cache');
module.exports = class CardinalProfile {
    constructor(profileId) {
        this.id = profileId;
    }

    async init(callback) {
        const cache = new Cache(this.id, 'profileData.json');
        this.player = new Player(this.id);
        if (cache.get('profileId') == undefined) {
            await this.updateProfileCache();
        } else {
            this.userId = cache.get('userId');
            this.current = cache.get('current');
            this.banned = cache.get('banned');
            this.createdTimestamp = cache.get('createdTimestamp');
        }
        callback.bind(this)();
    }

    async updateProfileCache() {
        const profileData = await poolQuery(`SELECT * FROM profiles WHERE profileId='${this.id}'`);
        const cache = new Cache(this.id, 'profileData.json');
        if (isEmpty(profileData)) {
            console.log(cache.get('profileId'))
            return new Error(`The Profile object cannot be created by itself.`);
        } else {
            for (let [key, value] of Object.entries(profileData[0])) {
                cache.set(key, value);
                this[key] = value;
            }
        }
    }
}