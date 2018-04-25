const Discord = require('discord.js');
const User = require('./../classes/Discord/User');
const Guild = require('./../classes/Discord/Guild');
const Command = require('./../classes/Command');
const Perms = require('./../classes/BotPerms');
const isEmpty = require('./../functions/utils/isEmpty');
module.exports = function(bot, message) {
    if (!message.author.bot) {
        const guild = new Guild(message.guild.id);
        guild.init(() => {
            if (message.content.indexOf(guild.prefix) == 0) {
                const user = new User(message.author);
                user.init(() => {
                    const args = message.content.slice(guild.prefix.length).split(' ');
                    const command = new Command(args.shift());
                    if (user.perms.has('ADMINISTRATOR')) {
                        require(`./../../${command.path}`)(bot, message);
                    } else {
                        if (user.perms.has('USE_BOT')) {
                            var isAllowed = [false, false];
                            var missingPerms = [[], []];
                            for (let element of Perms.decodePermsIntoArray(command.botPerms)) {
                                user.perms.has(element) ? isAllowed[0] = true : missingPerms[0].push(element);
                            }
    
                            for (let element of Perms.decodePermsIntoArray(command.discordPerms)) {
                                message.member.permissionsIn(message.channel).has(element) ? isAllowed[1] = true : missingPerms[1].push(element);
                            }
    
                            if (isAllowed[0] && isAllowed[1]) {
                                require(`./../../${command.path}`)(bot, message);
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
    }
}