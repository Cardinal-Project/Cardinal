const Item = require('./../classes/Cardinal/items/Item');
const User = require('./../classes/Discord/User');
const Args = require('./../classes/Args');
const Discord = require('discord.js');
module.exports = function(bot, message) {
    const user = new User(message.author);
    user.init(() => {
        if (user.activeProfile != null) {
            user.activeProfile.init(() => {
                user.activeProfile.player.init(() => {
                    const args = new Args(message.content, ' ').args;
                    args.shift();
                    message.reply(user.activeProfile.player.equipment.equip(1));
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