const poolQuery = require('./../functions/database/poolQuery');
const BotPerms = require('./../classes/BotPerms');
const Cache = require('./../classes/Cache');
const Discord = require('discord.js');
exports.run = function(bot, message, args) {
    const sendInvalidArgsEmbed = function() {
        const embed = new Discord.RichEmbed()
            .setTitle('Invalid Arguments')
            .setDescription(`There is a problem with your args.`)
            .setColor('ORANGE');
        message.channel.send({embed});
    }

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

exports.infos = {
    name: "User Permissions Management",
    perms: {
        bot: 64,
        discord: null
    },
    enabled: null,
    category: "Admin",
    description: "Manages the permissions of a Cardinal user",
    args: {
        1: {
            key: "action",
            types: ['string'],
            desc: "**Action**",
            required: true,
            allowedWords = ['add', 'remove', 'set']
        },
        2: {
            key: "user",
            types: ['user'],
            desc: "**User** (UserID, UserMention)",
            required: true,
            size: 1,
            length: [16, 19]
        },
        3: {
            key: "value",
            types: ['string', 'number'],
            desc: "**Value** (add, remove: permName | set: bitfield)",
            required: true,
            size: 1
        }
    }
}