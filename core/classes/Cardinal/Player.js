const attributes = require('./../../functions/formulas/attributes');
const fight = require('./../../functions/formulas/fight');
const xp = require('./../../functions/formulas/xp');
const Inventory = require('./items/Inventory');
const Equipment = require('./items/Equipment');
const Cache = require('./../Cache');
const poolQuery = require(`./../../functions/database/poolQuery`)
// const Guild = require('./Guild');
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
            this.level = xp.levelFromXP(this.xp)[0];
            this.xpEndLevel = xp.XPToLevelUp(this.level);
            this.prestige = cache.get('prestige');

            this.gold = cache.get('gold');
            this.hp = cache.get('hp');
            this.stamina = cache.get('stamina');
            this.inventory = new Inventory(this, cache.get('inventory'));
            this.equipment = new Equipment(this, cache.get('equipment'));

            this.availablePoints = JSON.parse(cache.get('attributes')).availablePoints;
            this.attributes = JSON.parse(cache.get('attributes')).attributes;
            this.attributes.hp = attributes.HPFromVitality(this.attributes.vit);
            this.attributes.stamina = attributes.staminaFromVitality(this.attributes.vit);

            this.fight = this.fightData(this.attributes.stamina);
            this.skills = cache.get('skills');
            /*this.job = this.skills.job;
            this.jobXP = this.skills.job.xp;
            this.jobLevel = this.skills.jobLevel;*/
        }
        callback.bind(this)();
    }


    fightData(stamina) {
        var fightInfo = {
            fightTime : Math.floor(fight.fightTimeFromStamina(stamina) / 60),
            turnSpeed : fight.turnSpeed(this.attributes.dex)
        }
        fightInfo.turnNumber = Math.floor(fight.turnNumber(fightInfo.fightTime, fightInfo.turnSpeed) * 60);
        return fightInfo;
    }

    assignPoints(attribute, quantity) {
        const cache = new Cache(this.profileId, 'profileData.json');
        if (this.availablePoints >= quantity){
            this.attributes[attribute] += quantity
            this.availablePoints -= quantity
            var attributes = {
                availablePoints: this.availablePoints,
                attributes: this.attributes
            }
            cache.set('attributes', JSON.stringify(attributes));
            poolQuery(`UPDATE profiles SET attributes='${JSON.stringify(attributes)}' WHERE profileId='${this.profileId}'`);
            messageChannel.send(`You assigned ${quantity} points to ${attribute}.`)
        } else {
            return new RangeError(`You can not asssign greater than ${this.availablePoints} points.`)
        }
    }
}