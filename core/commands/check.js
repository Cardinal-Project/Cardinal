exports.run = function(bot, message, args, user) {
    const usability = require('./../functions/helpers/usability');
    const Item = require('./../classes/Cardinal/items/Item');
    const Discord = require('discord.js');
    if (user.activeProfile != null) {
        user.activeProfile.init(async () => {
            const player = user.activeProfile.player;
            player.init(() => {
                message.channel.send(player.inventory.fetchItem(Item.findItem(args.args.join(' '))).usability);
            });
        });
    }
    const profile = user.activeProfile;
    if (profile != null) {
    } else {
        const embed = new Discord.RichEmbed()
            .setTitle('No Profile Found')
            .setDescription(`No active profile from you has been found. Make sure you have one.`)
            .setColor('ORANGE');
        message.channel.send({embed});
    }
}

exports.infos = {
    name: "Item Usability Check",
    perms: {
        bot: 1,
        discord: null
    },
    enabled: null,
    category: "Items Management",
    description: "Checks the equipability or the usability of an item",
    args: {
        1: {
            key: "item",
            types: ['string'],
            desc: "**Item Name**",
            required: true,
            size: Infinity
        }
    }
}