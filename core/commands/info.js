exports.run = function(bot, message, args, user) {const Discord = require('discord.js');
    module.exports = function(bot, message) {
        const embed = new Discord.RichEmbed()
            .setAuthor(`Bot Informations`, bot.user.avatarURL)
            .addField(`Shard Count`, bot.shard.count, true)
            .addField(`Memory Usage`, `${Math.round(10 * process.memoryUsage().heapUsed / 1024 / 1024)/10} MB`, true)
            .addField(`Uptime`, `${Math.floor(bot.uptime / 1000 / 60)} minutes`, true)
            .addField(`Server Count`, bot.guilds.size, true)
            .addField(`Member Count`, bot.users.size, true)
            .setColor(`BLUE`);
        message.channel.send({embed});
    }
}

exports.infos = {
    name: "Bot Informations",
    perms: {
        bot: 1,
        discord: null
    },
    enabled: null,
    category: "Bot",
    description: "Displays Bot's Informations"
}