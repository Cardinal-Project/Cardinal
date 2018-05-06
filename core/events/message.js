const Discord = require('discord.js');
const User = require('./../classes/Discord/User');
const Guild = require('./../classes/Discord/Guild');
const Command = require('./../classes/Command');
const Perms = require('./../classes/BotPerms');
const isEmpty = require('./../functions/utils/isEmpty');
module.exports = function(bot, message) {
    if (!message.author.bot) {
        try {
            const guild = new Guild(message.guild.id);
            guild.init(() => {
                if (message.content.indexOf(guild.prefix) == 0) {
                    const user = new User(message.author);
                    user.init(() => {
                        const args = message.content.slice(guild.prefix.length).split(' ');
                        const command = new Command(args.shift());
    
                        if (command.botPerms != undefined) {
                            const execute = function(path) {
                                try {
                                    require(`./../../${path}`)(bot, message);
                                } catch (err) {
                                    var modifiedErr = require('util').inspect(err, false, null).split('\n');
                                    modifierErr = modifiedErr.pop();
                                    modifierErr = modifiedErr.pop();
                                    modifierErr = modifiedErr.pop();
                                    modifierErr = modifiedErr.pop();
                                    modifierErr = modifiedErr.pop();
                                    modifierErr = modifiedErr.pop();
                                    const embed = new Discord.RichEmbed()
                                        .setTitle('An internal error occured')
                                        .setDescription(`Please report the following error to the development team of **${message.author.username}**.\n\`\`\`xl\n${modifiedErr.join('\n')}\`\`\``)
                                        .setColor('RED');
                                    message.channel.send({embed});
                                }
                            }
        
                            if (user.perms.has('ADMINISTRATOR')) {
                                execute(command.path);
                            } else {
                                var isAllowed = [false, false];
                                var missingPerms = [[], []];
                                for (let element of Perms.decodePermsIntoArray(command.botPerms)) {
                                    user.perms.has(element) ? isAllowed[0] = true : missingPerms[0].push(element);
                                }
        
                                if (command.discordPerms == '') {
                                    isAllowed[1] = true;
                                } else {
                                    for (let element of command.discordPerms.split(' ')) {
                                        if (message.member.permissionsIn(message.channel).has(element)) {
                                            isAllowed[1] = true;
                                        }
                                    }
                                }
        
                                if (isAllowed[0] && isAllowed[1]) {
                                    execute(command.path);
                                } else {
                                    const stringMissingPerms = `${!isEmpty(missingPerms[0]) ? `**${bot.user.username} Permissions : **` + missingPerms[0].join(' ') + '\n' : ''}${!isEmpty(missingPerms[1]) ? '**Discord Permissions : **' + missingPerms[1].join(' ') : ''}`;
                                    const embed = new Discord.RichEmbed()
                                        .setAuthor(message.author.username, message.author.avatarURL)
                                        .setTitle('Missing Permissions')
                                        .setDescription(`This command needs you to have permissions which you do not have, including the following : \n${stringMissingPerms}`)
                                        .setColor('ORANGE');
                                    message.channel.send({embed});
                                }
                            }
                        }
                    })
                }
            });
        } catch(err) {
            const embed = new Discord.RichEmbed()
                .setTitle('An internal error occured')
                .setDescription(`**Error Code** : 3011UE\nPlease report the following error the development team of **${message.author.username}**.\n\`\`\`xl\n${err}\`\`\``)
                .setColor('RED');
            message.channel.send({embed});
        }
    }
}