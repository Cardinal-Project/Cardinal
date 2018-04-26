const isEmpty = require('./../functions/utils/isEmpty');
const commands = require('./../data/commands.json');
const User = require('./../classes/Discord/User');
const BotPerms = require('./../classes/BotPerms');
const config = require('./../../config.json');
const Cache = require('./../classes/Cache');
const Args = require('./../classes/Args');
const Discord = require('discord.js');
module.exports = function(bot, message) {
    const args = new Args(message.content, ' ');
    args.args.shift();
    const prefix = new Cache(message.guild.id, 'guildSettings.json').get('prefix');

    if (!isEmpty(args.args)) {
        if (typeof commands[args.args[0]] != 'undefined') {
            const command = commands[args.args[0]];
            var embed = new Discord.RichEmbed()
                .setTitle(command.name)
                .setColor('GOLD')
                .setThumbnail(bot.user.avatarURL)
                .setDescription(command.shortDesc);
            
            const requiredBotPerms = new BotPerms(command.botPerms);
            if (!requiredBotPerms.has('USE_BOT')) {
                embed.addField('Required Bots Permissions', requiredBotPerms.perms.join(' '), true);
            }
            
            if (command.discordPerms != '') {
                embed.addField('Required Discord Permissions', command.discordPerms.trim(), true);
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
                .setDescription(`The command name you gave does not match with a valid ${bot.user.username} command. Check **${prefix}help** to have a list of all commands.`)
                .setColor('ORANGE');
            message.channel.send({embed});
        }
    } else {
        const user = new User(message.author);
        user.init(() => {
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
        })
    }
}