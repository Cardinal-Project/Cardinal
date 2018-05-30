const isEmpty = require('./../functions/utils/isEmpty');
const CardinalError = require('./../classes/BotError');
const Guild = require('./../classes/Discord/Guild');
const User = require('./../classes/Discord/User');
const Command = require('./../classes/Command');
const Perms = require('./../classes/BotPerms');
const Args = require('./../classes/Args');
const Discord = require('discord.js');
module.exports = function(bot, message) {
    if (!message.author.bot) {
        try {
            const guild = new Guild(message.guild.id);
            guild.init(() => {
                if (message.content.indexOf(guild.prefix) == 0) {
                    const user = new User(message.author);
                    user.init(() => {
                        const commandName = message.content.slice(guild.prefix.length).split(' ')[0];
                        const command = new Command(commandName);

                        if (command.args != undefined) {
                            const args = new Args(message.content.slice(guild.prefix.length), command);
                        }
                        
                        if (command.perms.bot != undefined) {
                            const execute = function(path) {
                                try {
                                    require(`./../commands/${command.command}`).run(bot, message, args, user);
                                } catch (err) {
                                    const error = new CardinalError(err);
                                    const embed = new Discord.RichEmbed()
                                        .setTitle('An internal error occured')
                                        .setDescription(`Please report the following error to the development team of **${bot.user.username}**.\n\`\`\`xl\n${error.string}\`\`\``)
                                        .setColor('RED');
                                    message.channel.send({embed});
                                }
                            }
        
                            if (user.perms.has('ADMINISTRATOR')) {
                                execute(command.command);
                            } else {
                                var isAllowed = [false, false];
                                var missingPerms = [[], []];
                                for (let element of Perms.decodePermsIntoArray(command.perms.bot)) {
                                    user.perms.has(element) ? isAllowed[0] = true : missingPerms[0].push(element);
                                }
        
                                if (command.perms.discord == '') {
                                    isAllowed[1] = true;
                                } else {
                                    for (let element of command.perms.discord.split(' ')) {
                                        if (message.member.permissionsIn(message.channel).has(element)) {
                                            isAllowed[1] = true;
                                        }
                                    }
                                }
        
                                if (isAllowed[0] && isAllowed[1]) {
                                    execute(command.command);
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
                .setDescription(`Please report the following error the development team of **${message.author.username}**.\n\`\`\`xl\n${err}\`\`\``)
                .setColor('RED');
            message.channel.send({embed});
        }
    }
}