const commands = require('./../data/commands.json');
const BotPerms = require('./../classes/BotPerms');
const Discord = require('discord.js');
exports.run = function(bot, message, args, user) {
    args.args.shift();
    if (!args.isEmpty()) {
        if (typeof commands[args.args[0]] != 'undefined') {
            const command = commands[args.args[0]];
            var embed = new Discord.RichEmbed()
                .setTitle(command.name)
                .setColor('GOLD')
                .setThumbnail(bot.user.avatarURL)
                .setDescription(command.shortDesc);
            
            const requiredBotPerms = new BotPerms(command.perms.bot);
            if (!requiredBotPerms.has('USE_BOT')) {
                embed.addField('Required Bots Permissions', requiredBotPerms.perms.join(' '), true);
            }
            
            if (command.perms.discord != '') {
                embed.addField('Required Discord Permissions', command.perms.discord.trim(), true);
            }

            if (typeof command.fields != 'undefined') {
                for (let [key, value] of Object.entries(command.fields)) {
                    embed.addField(key, value, true);
                }
            }

            message.channel.send({embed});
        } else {
            const embed = new Discord.RichEmbed()
                .setTitle(`Invalid Command Name`)
                .setDescription(`The command name you gave does not match with a valid ${bot.user.username} command.`)
                .setColor('ORANGE');
            message.channel.send({embed});
        }
    } else {
        var helpPage = {};
    
        for (let [key, value] of Object.entries(commands)) {
            if (typeof helpPage[value.category] == 'undefined') {
                helpPage[value.category] = `**${prefix}${key}** : ${value.shortDesc}\n`;
            } else {
                helpPage[value.category] += `**${prefix}${key}** : ${value.shortDesc}\n`
            }
        }
    
        var embed = new Discord.RichEmbed()
            .setTitle('Help Page')
            .setColor('BLUE');
    
        for (let [key, value] of Object.entries(helpPage)) {
            if (key == 'Admin') {
                if (user.perms.has('SHOW_ADMIN_COMMANDS')) {
                    embed.addField(key, value);
                }
            } else {
                embed.addField(key, value);
            }
        }
    
        message.channel.send({embed});
    }
}

exports.info = {
    name: "Help Pages",
    perms: {
        bot: 1,
        discord: null
    },
    enabled: `Command Re-Work In Progress`,
    category: "Bot",
    description: "Shows help pages",
    args: {
        1: {
            key: "command",
            types: ['string'],
            desc: "**Command Name**",
            required: false,
            size: 1
        }
    }
}