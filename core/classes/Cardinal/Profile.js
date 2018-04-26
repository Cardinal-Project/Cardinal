const keygen = require('keygenerator');
const Player = require('./../Player');
const Cache = require('./../Cache');
module.exports = class CardinalProfile {
    constructor(profileId) {
        this.id = profileId;
    }

    async init(callback) {
        const cache = new Cache(this.id, 'profileData.json');
        if (cache.get('profileId') == undefined) {

        } else {
            this.userId = cache.get('userId');
            this.current = cache.get('current');
            this.banned = cache.get('banned');
            this.player = new Player(this.id);
        }
        callback.bind(this)();
    }

    async updateProfileCache() {
        const profileData = await poolQuery(`SELECT * FROM profiles WHERE profileId='${this.id}'`);
        const cache = new Cache(this.id, 'profileData.json');
        if (isEmpty(profileData)) {
            return new Error(`The Profile object cannot be created by itself.`)
        } else {
            for (let [key, value] of guildData[0]) {
                cache.set(key, value);
                this[key] = value;
            }
            this.job = this.skills.job;
            this.jobXP = this.skills.job.xp;
            this.jobLevel = this.skills.jobLevel;
        }
    }
}