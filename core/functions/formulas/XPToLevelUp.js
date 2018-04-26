module.exports = function(level, expo) {
    expo = expo == undefined ? 2.1 : expo;
    return Math.round(15 * Math.pow(level + 1, expo) - 15 * Math.pow(level, expo));
}