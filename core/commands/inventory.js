const usability = require('./../functions/helpers/usability');
const User = require('./../classes/Discord/User');
const Args = require('./../classes/Args');
const Discord = require('discord.js');
module.exports = function(bot, message) {
    const user = new User(message.author);
    user.init(async () => {
        const profile = user.activeProfile;
        if (profile != null) {
            profile.init(() => {
                const player = profile.player;
                player.init(async () => {
                    const args = new Args(message.content, ' ');
                    args.args.shift();
                    var chunks = [];
                    var currentChunk = 0;
                    var index = 0;
                    for (let [id, number] of Object.entries(player.inventory.rawInventory)) {
                        let itemInfo = `- \`${usability(id, player) ? `\✅` : `\❌`}\` \`${number}x\` ${player.inventory.fetchItem(id).name}\n`;
                        index++;
                        if (20 / index == 0) {
                            currentChunk++;
                            index = 0;
                        }
                        chunks[currentChunk] = chunks[currentChunk] == undefined ? itemInfo : chunks[currentChunk] += itemInfo;
                    }
                    if (chunks[args.isEmpty() ? 0 : args.args[0]-1] != undefined) {
                        const embed = new Discord.RichEmbed()
                            .setAuthor(player.nickname, message.author.avatarURL)
                            .setTitle(`Inventory`)
                            .setDescription(chunks[args.isEmpty() ? 0 : args.args[0]-1])
                            .setFooter(`${index} Items / ${Object.keys(player.inventory.rawInventory).length} Items Showed`)
                            .setColor('BLUE');
                        message.channel.send({embed});
                    } else {
                        const embed = new Discord.RichEmbed()
                            .setTitle('Inventory Too Small')
                            .setDescription(`The inventory page you are looking for does not exist. Make sure you have enough items to display it.`)
                            .setColor('ORANGE');
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