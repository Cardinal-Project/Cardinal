const items = require('./../../data/items.json')
module.exports = function(itemId, player) {
    const item = items[itemId];
    return item.requirements.level != undefined ? item.requirements.level <= player.level : true && item.requirements.prestige != undefined ? item.requirements.prestige <= player.prestige : true;
}