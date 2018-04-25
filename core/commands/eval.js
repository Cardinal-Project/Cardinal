const Discord = require('discord.js');
const Cache = require('./../classes/Cache');
module.exports = function(bot, message) {
    const prefix = new Cache(message.guild.id, 'guildSettings.json').get('prefix');
    try {
        const messageContentLengthReduced = message.content.length - (4 + prefix.length);
        const code = message.content.substr(prefix.length + 4, messageContentLengthReduced);
        let evaled = eval(code);
        
        if (typeof evaled !== "string") {
            evaled = require("util").inspect(evaled);
        }
        
        message.channel.send(evaled, {code:"xl"});
    } catch (err) {
        message.channel.send(`An error occured.\n\`\`\`xl\n${require('util').inspect(err, false, null)}\n\`\`\``);
    }
}