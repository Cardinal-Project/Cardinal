const poolQuery = require('./../functions/database/poolQuery');
const isEmpty = require('./../functions/utils/isEmpty');
const BotPerms = require('./../classes/BotPerms');
const config = require('./../../config.json');
const Cache = require('./../classes/Cache');
const Args = require('./../classes/Args');
const Discord = require('discord.js');
module.exports = async function(bot, message) {
    const sendInvalidArgsEmbed = function() {
        const embed = new Discord.RichEmbed()
            .setTitle('Invalid Arguments')
            .setDescription(`There is a problem with your args.`)
            .setColor('ORANGE');
        message.channel.send({embed});
    }

    const args = new Args(message.content, ' ');
    args.args.shift();
    if (args.args.length == 3) {
        var userid = message.mentions.members.size == 1 ? message.mentions.members.first().id : args[1];
        const cache = new Cache(userid, 'userSettings.json');
        const botPerms = new BotPerms(cache.get('perms'));
        if (['add', 'remove', 'set'].indexOf(args.args[0]) != -1) {
            var newBotPerms = botPerms;
            if (args.args[0] == 'add') {
                newBotPerms = new BotPerms(botPerms.add(args.args[2]));
            } else if (args.args[0] == 'remove') {
                newBotPerms = new BotPerms(botPerms.remove(args.args[2]));
            } else if (args.args[0] == 'set') {
                newBotPerms = new BotPerms(args.args[2]);
            }
            await poolQuery(`UPDATE users SET perms=${newBotPerms.bitfield} WHERE userId='${userid}'`);
            cache.set('perms', newBotPerms.bitfield);

            const user = await bot.fetchUser(userid);
            const embed = new Discord.RichEmbed()
                .setAuthor(user.username, user.avatarURL)
                .setTitle('Permissions modified')
                .setDescription(`The permissions changes have been successfully done on **${user.username}**.`)
                .setColor('GREEN')
            message.channel.send({embed});
        } else {
            sendInvalidArgsEmbed();
        }
    } else {
        sendInvalidArgsEmbed();
    }
}