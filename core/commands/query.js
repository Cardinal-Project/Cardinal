const poolQuery = require('./../functions/database/poolQuery');
const Cache = require('./../classes/Cache');
const util = require('util');
module.exports = function(bot, message) {
    const prefix = new Cache(message.guild.id, 'guildSettings.json').get('prefix');
    try {
        messageContentLengthReduced = message.content.length - (5 + prefix.length);
        poolQuery(message.content.substr(6 + prefix.length, messageContentLengthReduced)).then(result => {
            message.channel.send(util.inspect(result, false, null), {code:"xl"});
        }).catch(err => {
            message.channel.send(`An error occured.\n\`\`\`xl\n${err}\n\`\`\``);
        })
    } catch (err) {
        message.channel.send(`An error occured.\n\`\`\`xl\n${err}\n\`\`\``);
    }
}