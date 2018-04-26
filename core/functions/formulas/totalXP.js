const XPToLevelUp = require('./XPToLevelUp');
module.exports = function(level, expo) {
    var totalXP = 0;
    do {
        totalXP += XPToLevelUp(level, expo);
        level--;
    } while (level > 0);
    return totalXP;
}