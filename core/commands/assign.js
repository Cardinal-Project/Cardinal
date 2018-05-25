const User = require('./../classes/Discord/User');
const Discord = require('discord.js');
const Args = require('./../classes/Args');
module.exports = function(bot, message) {
    const user = new User(message.author);
    user.init(async () => {
        const profile = user.activeProfile;
        profile.init(async () => {
            if (profile != null) {
                const player = profile.player;
                player.init(async () => {
                    const args = new Args(message.content, ' ').args;
                    args.shift();
                    if(player.availablePoints != 0){
                        if(args.length == 2){
                            player.assignPoints(args[0], parseInt(args[1]));
                        } else {
                            const embed = new Discord.RichEmbed()
                                .setTitle(`Assigning Attribute Points`)
                                .setDescription('You must state the attribute and ammount you would like to assign')
                                .setColor('ORANGE')
                            message.channel.send({embed})
                        }
                    } else {
                        const embed = new Discord.RichEmbed()
                            .setTitle('Available Attribute Points')
                            .setDescription('You currently have 0 unassigned attribute points')
                            .setColor('ORANGE');
                            message.channel.send({embed});
                    }
                });
            } else {
                const embed = new Discord.RichEmbed()
                    .setTitle('No Profile Found')
                    .setDescription(`No active profile from you has been found. Make sure you have one.`)
                    .setColor('ORANGE');
                message.channel.send({embed});            
            }
        });
    });
}