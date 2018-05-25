exports.run = function(bot, message, args, user) {
    const Item = require('./../classes/Cardinal/items/Item');
    const Discord = require('discord.js');
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
}

exports.infos = {
    name: "Item Equipment",
    perms: {
        bot: 1,
        discord: null
    },
    enabled: null,
    category: "Game",
    description: "Equips the item specified",
    args: {
        1: {
            types: ['string'],
            desc: "`[*]` **Item Name**",
            size: Infinity
        }
    }
}