const Discord = require('discord.js');
const bot = new Discord.Client();
const config = require('./config.json');
bot.login(config.bot.token);

bot.on('ready', () => {
    require('./core/events/ready')(bot);
});

bot.on('message', message => {
    message.reply('In Development.');
});