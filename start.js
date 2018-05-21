const Discord = require('discord.js');
const shardManager = new Discord.ShardingManager('./bot.js');
const config = require('./config.json');
shardManager.spawn(config.bot.shards);