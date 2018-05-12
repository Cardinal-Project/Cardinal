const attributes = require('./../../functions/formulas/attributes');
const fight = require('./../../functions/formulas/fight');
const xp = require('./../../functions/formulas/xp');
const Inventory = require('./Inventory');
const Cache = require('./../Cache');
const Guild = require('./Guild');
module.exports = class Player {
    constructor(profileId) {
        this.profileId = profileId;
    }

    async init(callback) {
        const cache = new Cache(this.profileId, 'profileData.json');
        if (cache.get('profileId') == undefined) {

        } else {
            // this.guild = new Guild(cache.get('guildId'));
            this.nickname = cache.get('nickname');
            this.class = cache.get('class');
            this.race = cache.get('race');
            this.title = cache.get('title');

            this.xp = cache.get('xp');
            this.level = xp.levelFromXP(xp)[0];
            this.xpEndLevel = xp.XPToLevelUp(this.level);
            this.prestige = cache.get('prestige');
            this.gold = cache.get('gold');
            this.hp = cache.get('hp');
            this.stamina = cache.get('stamina');

            this.inventory = new Inventory(this.profileId, cache.get('inventory'));

            this.availablePoints = JSON.parse(cache.get('attributes')).availablePoints;
            this.attributes = JSON.parse(cache.get('attributes')).attributes;
            this.attributes.hp = attributes.HPFromVitality(this.attributes.vit);
            this.attributes.stamina = attributes.staminaFromVitality(this.attributes.vit);

            this.fight = {
                fightTime : fight.fightTimeFromStamina(this.attributes.stamina),
                turnSpeed : fight.turnSpeed(this.attributes.dexterity)
            }
            this.fight.turnNumber = fight.turnNumber(this.fight.fightTime, this.fight.turnSpeed);

            this.skills = cache.get('skills');
            /*this.job = this.skills.job;
            this.jobXP = this.skills.job.xp;
            this.jobLevel = this.skills.jobLevel;*/
        }
        callback.bind(this)();
    }
}