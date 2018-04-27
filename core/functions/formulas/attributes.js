HPFromVitality = function(vitality) {
    return 10 + vitality * 7;
}

staminaFromVitality = function(vitality) {
    return 100 + vitality * 3;
}

module.exports.HPFromVitality = HPFromVitality;
module.exports.staminaFromVitality = staminaFromVitality;