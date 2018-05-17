const poolQuery = require('./../functions/database/poolQuery');
const usability = require('./../functions/helpers/usability');
const Inventory = require('./../classes/Cardinal/Inventory');
const User = require('./../classes/Discord/User');
const Cache = require('./../classes/Cache');
const Args = require('./../classes/Args');
const Discord = require('discord.js');
module.exports = function(bot, message) {
    const args = new Args(message.content, ' ').args;
    args.shift();
    const user = new User(message.author);
    user.init(() => {
        if (user.activeProfile != null) {
            const profile = user.activeProfile;
            profile.init(() => {
                const player = profile.player;
                player.init(() => {
                    var item = Inventory.fetchItem(Inventory.findItem(args.join(' ')));
                    if (usability(item.id, player)) {
                        if (item.type == 'potion') {
                            const cache = new Cache(profile.id, 'profileData.json');
                            var changes = '';
                            for (let [buff, number] of Object.entries(item.potion)) {
                                if (buff == 'hp') {
                                    if (player.hp + number > player.attributes.hp)
                                    player.hp = player.attributes.hp - number;
                                }
                                changes += `${buff}=${player[buff]+number}`;
                                cache.set(buff, player[buff]+number);
                                player[buff] = player[buff]+number;
                                changes += ' ';
                            }
                            poolQuery(`UPDATE profiles SET ${changes} WHERE profileId='${profile.id}'`).then(() => {
                                player.inventory.remove([item.id], [1]);
                                const embed = new Discord.RichEmbed()  
                                    .setTitle(`Success`)
                                    .setDescription(`You successfully used 1x **${item.name}**.`)
                                    .setColor(`GREEN`);
                                message.channel.send({embed});
                            }).catch(err => {
                                const embed = new Discord.RichEmbed()
                                    .setTitle(`A Database Error Occured`)
                                    .setDescription(`Please report the following to the development team of **Cardinal**.\n\`\`\`xl\n${err}\`\`\``)
                                    .setColor(`RED`);
                                message.channel.send({embed});
                            });
                        } else {
                            const embed = new Discord.RichEmbed()
                                .setTitle(`Invalid Item Type`)
                                .setDescription(`You are trying to use an item which has a type which does not correspond to the command you are using. Please use the appropriate command.`)
                                .setColor(`ORANGE`);
                            message.channel.send({embed});
                        }
                    } else {
                        const embed = new Discord.RichEmbed()
                            .setTitle(`Unable to Use`)
                            .setDescription(`This items requires a certain level or prestige which you do not have, to be used.`)
                            .setColor(`ORANGE`);
                        message.channel.send({embed});
                    }
                });
            });
        } else {
            const embed = new Discord.RichEmbed()
                .setTitle('No Profile Found')
                .setDescription(`No active profile from you has been found. Make sure you have one.`)
                .setColor('ORANGE');
            message.channel.send({embed});
        }
    });
}