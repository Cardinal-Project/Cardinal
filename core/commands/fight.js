exports.run = function(bot, message, args, user) {
    const Discord = require('discord.js');
    const profile = user.activeProfile;
    if (profile != null) {
        profile.init(() => {
            const player = profile.player;
            player.init(async () => {
                args.args.shift();
                var stamina = player.stamina;
                if (!args.isEmpty()) {
                    if (args.args[0] <= stamina) {
                        stamina = args.args[0];
                    } else {
                        stamina = 'no u';
                    }
                }

                if (stamina != 'no u') {
                    const fightData = player.fightData(stamina);
                    const embed = new Discord.RichEmbed()
                        .setAuthor(player.nickname, message.author.avatarURL)
                        .setTitle(`Preparing for an Adventure`)
                        .setDescription(`Start your adventure with **${stamina} Stamina** by reacting with \`\✅\`. If you want to use less stamina for this adventure, specify the number of stamina to use in args by typing again the command.`)
                        .addField(`Stamina`, `${player.stamina} ST / ${player.attributes.stamina} ST`, true)
                        .addField(`Number of Turns`, `${fightData.turnNumber} Turns`, true)
                        .addField(`Fight Time`, `${fightData.fightTime} Minutes`, true)
                        .addField(`Turn Speed`, `${fightData.turnSpeed} Seconds`, true)
                        .setColor('BLUE');
                    const msg = await message.channel.send({embed});
                    msg.react('✅');

                    const filter = (reaction, user) => reaction.emoji.name === '✅' && user.id === message.author.id;
                    msg.createReactionCollector(filter, {time: 30000, max: 1}).on('end', (collected, reason) => {
                        msg.clearReactions().catch(() => {});
                    });;
                } else {
                    const embed = new Discord.RichEmbed()
                        .setTitle(`Stamina Number Invalid`)
                        .setDescription(`The number of Stamina to use specified is invalid, you do not have enough stamina to use.`)
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
}

exports.infos = {
    name: "Adventure",
    perms: {
        bot: 1,
        discord: null
    },
    enabled: null,
    category: "Game",
    description: "Starts an adventure",
    args: {
        1: {
            key: "stamina",
            types: ['number'],
            desc: "**Stamina Points**",
            required: true,
            size: 1
        }
    }
}