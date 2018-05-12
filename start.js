const Discord = require('discord.js');
const shardManager = new Discord.ShardingManager('./bot.js');
shardManager.spawn(1);