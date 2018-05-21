const User = require('./../classes/Discord/User');
const Discord = require('discord.js');
module.exports = function(bot, message) {
    const user = new User(message.author);
    user.init(async () => {
        const profile = user.activeProfile;
        if (profile != null) {
            profile.init(() => {
                const player = profile.player;
                player.init(async () => {
                    const embed = new Discord.RichEmbed()
                        .setAuthor(`${player.nickname}${player.title == null ? '' : `, ${player.title}`}`, user.discord.avatarURL)
                        .addField(`Type`, `${player.race[0].toUpperCase() + player.race.slice(1)} ${player.class[0].toUpperCase() + player.class.slice(1)}`, true)
                        .addField(`Level`, `\`[P${player.prestige}]\` **Lv${player.level}**`, true)
                        .addField(`Experience`, `${player.xp} XP / ${player.xpEndLevel} XP`, true)
                        .addField(`Health`, `${player.hp} HP / ${player.attributes.hp} HP`, true)
                        .addField(`Money`, `${player.gold} Silver`, true)
                        .addField(`Stamina`, `${player.stamina} ST / ${player.attributes.stamina} ST`, true)
                        .addField(`Attributes`, `**Available Points** : ${player.availablePoints}\n**Strength** : ${player.attributes.str} | **Defense** : ${player.attributes.def} | **Dexterity** : ${player.attributes.dex} | **Vitality** : ${player.attributes.vit} | **Intelligence** : ${player.attributes.int}`, true)
                        .setFooter(`Account Created`)
                        .setTimestamp(new Date(profile.createdTimestamp))
                        .setColor('BLUE');
                    message.channel.send({embed});
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