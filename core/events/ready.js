module.exports = function(bot) {
    bot.user.setActivity('nothing');
    var guildsSize = bot.guilds.size;
    var gameNames = [
        new Object({type: 0, name: `In Development`})
    ];

    const changeGame = function() {
        guildsSize = bot.guilds.size;
        if (bot.user.presence.status == 'online') {
            game = gameNames[Math.floor(Math.random() * gameNames.length)];
            bot.user.setActivity(game.name, {type: game.type});
        }
    }

    setInterval(changeGame, 30000);
}