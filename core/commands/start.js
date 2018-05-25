exports.run = function(bot, message, args, user) {
    const poolQuery = require('./../functions/database/poolQuery');
    const formulas = require('./../functions/formulas/attributes');
    const classesRaces = require('./../data/classesRaces.json');
    const Profile = require('./../classes/Cardinal/Profile');
    const Cache = require('./../classes/Cache');
    const keygen = require('keygenerator');
    const Discord = require('discord.js');
    const regex = /([A-Z0-9-_.,& ])+\w+/gi;
    args.args.shift();
    function matchExact(r, str) {
        var match = str.match(r);
        return match != null && str == match[0];
    }

    var collectedData = [];
    const filter = m => { return m.author.id == message.author.id };
    const embed = new Discord.RichEmbed()
        .setTitle(`Creating Cardinal Profile`)
        .setDescription(`**${message.author.username}**, you are about to create a new Cardinal character. Please enter the following after this message : \n**\`1.\` Nickname** : No special characters, inferior to 256 characters\n**\`2.\` Class** : (Available Classes : ${Object.keys(classesRaces.classes).join(', ')})\n**\`3.\` Race** : (Available Races : ${Object.keys(classesRaces.races).join(', ')})\n**Example** : \`${message.author.username} ${Object.keys(classesRaces.classes)[Math.floor(Math.random() * Object.keys(classesRaces.classes).length)]} ${Object.keys(classesRaces.races)[Math.floor(Math.random() * Object.keys(classesRaces.races).length)]}\``)
        .setColor('BLUE');
    message.channel.send({embed});
    
    const collected = await message.channel.awaitMessages(filter, {time: 120000, max: 1});
    const collectedArgs = new Args(collected.first().content, ' ');
    var collectedData = {};
    const look = function(keys, type) {
        for (let element of keys) {
            element = element.toLowerCase();
            if (collectedArgs.args.indexOf(element) != -1) {
                collectedData[type] = element;
                collectedArgs.removeArg(element);
            }
        }
    }
    look(Object.keys(classesRaces.classes), 'class');
    look(Object.keys(classesRaces.races), 'race');

    collectedData.nickname = collectedArgs.args.join(' ').trim();
    if (matchExact(regex, collectedData.nickname)) {
        if (collectedData.class != undefined && collectedData.race != undefined) {
            const usedKeys = await poolQuery(`SELECT profileId FROM profiles`);
            const key = 'P' + keygen._({forceUppercase: true, length: 7, chars: false});
            var keyAlreadyFound = false;
            do {
                keyAlreadyFound = false;
                for (let value of Object.values(usedKeys)) {
                    if (value == key) {
                        key = 'P' + keygen._({forceUppercase: true, length: 7, chars: false});
                        keyAlreadyFound = true;
                    }
                }
            } while (keyAlreadyFound == true)
            const attributes = {
                availablePoints: 10,
                attributes: {
                    str: classesRaces.classes[collectedData.class].baseAttributes.str + classesRaces.races[collectedData.race].baseAttributes.str,
                    vit: classesRaces.classes[collectedData.class].baseAttributes.vit + classesRaces.races[collectedData.race].baseAttributes.vit,
                    dex: classesRaces.classes[collectedData.class].baseAttributes.dex + classesRaces.races[collectedData.race].baseAttributes.dex,
                    int: classesRaces.classes[collectedData.class].baseAttributes.int + classesRaces.races[collectedData.race].baseAttributes.int,
                    def: classesRaces.classes[collectedData.class].baseAttributes.def + classesRaces.races[collectedData.race].baseAttributes.def
                }
            };
            poolQuery(`INSERT INTO profiles (profileId, userId, nickname, class, race, location, hp, stamina, xp, gold, inventory, equipment, attributes, skills, banned) VALUES ('${key}', '${user.id}', '${collectedData.nickname}', '${collectedData.class}', '${collectedData.race}', 1, ${formulas.HPFromVitality(attributes.attributes.vit)}, ${formulas.staminaFromVitality(attributes.attributes.vit)}, 0, 0, '{}', '{}', '${JSON.stringify(attributes)}', '{}', 0 )`).then(async success => {
                const profile = new Profile(key);
                profile.init(async () => {
                    const embed = new Discord.RichEmbed()
                        .setTitle('Profile Created')
                        .setDescription(`Your character has been successfully created. Below are some infos about it.\n**Nickname** : ${collectedData.nickname}\n**Type**: ${collectedData.class[0].toUpperCase() + collectedData.class.slice(1)} ${collectedData.race[0].toUpperCase() + collectedData.race.slice(1)}`)
                        .setFooter(`Profile ID : ${key}`, message.author.avatarURL)
                        .setColor('GREEN');
                    message.channel.send({embed});
                    const cache = new Cache(user.id, 'userSettings.json').set('activeProfile', key);
                    await poolQuery(`UPDATE users SET activeProfile='${key}' WHERE userId='${user.id}'`)
                })
            }).catch(err => {
                const embed = new Discord.RichEmbed()
                    .setTitle('An internal error occured')
                    .setDescription(`Please report the following error the development team of **${message.author.username}**.\n\`\`\`xl\n${err}\`\`\``)
                    .setColor('RED');
                message.channel.send({embed});
            });
        } else {
            const embed = new Discord.RichEmbed()
                .setTitle('Invalid Data Given')
                .setDescription(`The data you gave is invalid somewhere, please review it before retrying to create a character.`)
                .setColor('ORANGE');
            message.channel.send({embed});
        }
    } else {
        const embed = new Discord.RichEmbed()
            .setTitle('Invalid Nickname Given')
            .setDescription(`The nickname you gave is invalid and contain special characters. It has to match the following RegEx : ${String(regex)}`)
            .setColor('ORANGE');
        message.channel.send({embed});
    }
}

exports.infos = {
    name: "Character Creation",
    perms: {
        bot: 1,
        discord: null
    },
    enabled: null,
    category: "Game",
    description: "Starts character creation wizard"
}