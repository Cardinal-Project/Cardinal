const Inventory = require('./../classes/Cardinal/Inventory');
const Discord = require('discord.js');
exports.run = function(bot, message, args, user) {
    args.removeArg(args.args[0]);
    if (!args.isEmpty()) {
        var item = Inventory.fetchItem(Inventory.findItem(args.string.trim()));
        
        // Checking Requirements
        var requirements = ``;
        for (let [attribute, number] of Object.entries(item.requirements)) {
            requirements += `**${attribute[0].toUpperCase() + attribute.slice(1)}** : ${number}\n`;
        }

        // Checking Item Type
        var effects = ``;
        var classBonus = ``;
        var raceBonus = ``;
        if (item.type == 'potion') {
            for (let [buff, number] of Object.entries(item.potion)) {
                effects += `**${buff[0].toUpperCase() + buff.slice(1)}** : ${number}\n`;
            }
        } else if (['weapon', 'shield', 'helmet', 'chestplate', 'pants', 'boots'].indexOf(item.type) != -1) {
            const checkAttribsBonus = function(classRace, attribsBonus) {
                var text = '';
                if (attribsBonus != undefined) {
                    for (let [attribute, number] of Object.entries(attribsBonus)) {
                        text += `**${classRace[0].toUpperCase() + classRace.slice(1)}** : ${number >= 0 ? '+' : '-'}${number}pts on ${attribute[0].toUpperCase() + attribute.slice(1)}\n`;
                    }
                }
                return text;
            }

            if (item[item.type].class != undefined) {
                for (let [_class, data] of Object.entries(item[item.type].class)) {
                    if (data.dmgBonus != undefined)
                        classBonus += `**${_class[0].toUpperCase() + _class.slice(1)}** : ${data.dmgBonus.humanReadable} on Damages\n`;

                    classBonus += checkAttribsBonus(_class, data.attribsBonus);
                }
            }
            if (item[item.type].race != undefined) {
                for (let [race, data] of Object.entries(item[item.type].race)) {
                    if (data.dmgBonus != undefined)
                        raceBonus += `**${race[0].toUpperCase() + race.slice(1)}** : ${data.dmgBonus.humanReadable} on Damages\n`;

                    raceBonus += checkAttribsBonus(race, data.attribsBonus);
                }
            }
        }

        var embed = new Discord.RichEmbed()
            .setAuthor(`Item Description`)
            .setTitle(item.name)
            .setDescription(item.description)
            .addField(`Item Type`, item.type[0].toUpperCase() + item.type.slice(1), true)
            .setColor(`BLUE`)
            .setFooter(`Item ID : ${Inventory.findItem(args.string)}`);

        if (requirements != ``)
            embed.addField('Requirements', requirements, true);

        if (effects != ``)
            embed.addField(`Effects`, effects, true);

        if (classBonus != ``)
            embed.addField(`Class Bonus`, classBonus, true);

        if (raceBonus != ``)
            embed.addField(`Class Bonus`, raceBonus, true);
        
        message.channel.send({embed});
    } else {
        const embed = new Discord.RichEmbed()
            .setTitle(`Missing Args`)
            .setDescription(`This command needs the name of an item in order to work.`)
            .setColor(`ORANGE`);
        message.channel.send({embed});
    }
}

exports.infos = {
    name: "Item Description",
    perms: {
        bot: 1,
        discord: null
    },
    enabled: null,
    category: "Items Management",
    description: "Shows item's informations",
    args: {
        1: {
            types: ['string'],
            desc: "`[*]` **Item Name**",
            size: Infinity
        }
    }
}