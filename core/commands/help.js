const Discord = require('discord.js');
const commands = require('./../data/commands.json');
const config = require('./../../config.json');
const GuildSettings = require('./../classes/Cache/GuildSettings');
const permissions = require('./../data/permissions.json');
const isEmpty = require('./../functions/utils/isEmpty');
const UserPerms = require('./../classes/UserPerms');
module.exports = function(bot, message) {
    const cache = new GuildSettings();
    const args = require('./../functions/utils/args')(message.content, message.guild.id);

    if (!isEmpty(args)) {
        if (typeof commands[args[0]] != 'undefined') {
            var embed = new Discord.RichEmbed()
                .setTitle(commands[args[0]].command)
                .setColor('GOLD')
                .setDescription(commands[args[0]].shortDesc);
            
            if (commands[args[0]].botPerms != '' && commands[args[0]].botPerms.indexOf('USE_BOT') == -1) {
                embed.addField('Required Bots Permissions', commands[args[0]].botPerms.replace('ADMINISTRATOR', '').trim(), true);
            }
            
            if (commands[args[0]].discordPerms != '') {
                embed.addField('Required Discord Permissions', commands[args[0]].discordPerms.replace('ADMINISTRATOR', '').trim(), true);
            }

            if (typeof commands[args[0]].fields != 'undefined') {
                for (let [key, value] of Object.entries(commands[args[0]].fields)) {
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
        var helpPage = {};
    
        for (let [key, value] of Object.entries(commands)) {
            if (typeof helpPage[value.category] == 'undefined') {
                helpPage[value.category] = `**${prefix}${value.command}** : ${value.shortDesc}\n`;
            } else {
                helpPage[value.category] += `**${prefix}${value.command}** : ${value.shortDesc}\n`
            }
        }
    
        var embed = new Discord.RichEmbed()
            .setAuthor(bot.user.username, bot.user.avatarURL)
            .setTitle('Help Page')
            .setColor('BLUE');
        
    
        var bitfield = 0;
        if (typeof permissions[message.author.id] != 'undefined') {
            bitfield = permissions[message.author.id];
        } else {
            bitfield = permissions.everyone;
        }
    
        for (let [key, value] of Object.entries(helpPage)) {
            if (key == 'Admin') {
                if (UserPerms.decodePermsIntoArray(bitfield).indexOf('SHOW_ADMIN_COMMANDS') != -1) {
                    embed.addField(key, value);
                }
            } else {
                embed.addField(key, value);
            }
    
        }
    
        message.channel.send({embed});
    }
}