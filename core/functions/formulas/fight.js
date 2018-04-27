fightTimeFromStamina = function(stamina) {
    return stamina * 6;
}

turnNumber = function(fightTime, turnSpeed) {
    return fightTime / turnSpeed;
}

turnSpeed = function(dex) {
    const result = 20 - 20 * ((dex/40)/100);
    return result >= 0.5 ? result : 0.5;
}

module.exports.fightTimeFromStamina = fightTimeFromStamina;
module.exports.turnNumber = turnNumber;
module.exports.turnSpeed = turnSpeed;