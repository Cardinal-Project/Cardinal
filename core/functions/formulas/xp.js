XPToLevelUp = function(level, expo) {
    expo = expo == undefined ? 2.1 : expo;
    return Math.round(15 * Math.pow(level + 1, expo) - 15 * Math.pow(level, expo));
}

totalXP = function(level, expo) {
    var totalXP = 0;
    do {
        totalXP += XPToLevelUp(level, expo);
        level--;
    } while (level > 0);
    return totalXP;
}

levelFromXP = function(xp) {
    var totalXP = xp;
    var computingLevel = 1;
    var stop = false;
    while (xp != 0 && computingLevel <= 500 && computingLevel != 'stop' && !stop) {
        if (xp >= XPToLevelUp(computingLevel)) {
            totalXP -= XPToLevelUp(computingLevel);
            computingLevel++;
        } else {
            stop = true;
        }
    }
    return [computingLevel, totalXP];
}

module.exports.XPToLevelUp = XPToLevelUp;
module.exports.totalXP = totalXP;
module.exports.levelFromXP = levelFromXP;