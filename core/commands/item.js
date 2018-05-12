const Inventory = require('./../classes/Cardinal/Inventory');
const Args = require('./../classes/Args');
const Discord = require('discord.js');
module.exports = function(bot, message) {
    const args = new Args(message.content, ' ');
    if (!args.isEmpty()) {
        args.args.shift();
        var item = Inventory.fetchItem(Inventory.findItem(args.string));
        
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
        } else if (item.type == 'weapon') {
            if (item.weapon.class != undefined) {
                for (let [_class, data] of Object.entries(item.weapon.class)) {
                    classBonus += `**${_class[0].toUpperCase() + _class.slice(1)}** : ${data.dmgBonus.humanReadable}\n`;
                }
            }
            if (item.weapon.race != undefined) {
                for (let [race, data] of Object.entries(item.weapon.race)) {
                    raceBonus += `**${race[0].toUpperCase() + race.slice(1)}** : ${data.dmgBonus.humanReadable}\n`;
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