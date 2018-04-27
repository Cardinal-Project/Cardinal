const poolQuery = require('./../functions/database/poolQuery');
const classesRaces = require('./../data/classesRaces.json');
const Profile = require('./../classes/Cardinal/Profile');
const isEmpty = require('./../functions/utils/isEmpty');
const User = require('./../classes/Discord/User');
const Cache = require('./../classes/Cache');
const Args = require('./../classes/Args');
const keygen = require('keygenerator');
const Discord = require('discord.js');
module.exports = function(bot, message) {
    const args = new Args(message.content, ' ');
    args.args.shift();
    const user = new User(message.author);
    user.init(async () => {
        if (!isEmpty(args.args)) {
            if (args.args[0] == 'new') {
                function matchExact(r, str) {
                    var match = str.match(r);
                    return match != null && str == match[0];
                }
                
                function capitalizeFirstLetter(string) {
                    return string[0].toUpperCase() + string.slice(1);
                }

                var collectedData = [];
                const filter = m => { return m.author.id == message.author.id };
                const embed = new Discord.RichEmbed()
                    .setTitle(`Creating Cardinal Profile`)
                    .setDescription(`**${message.author.username}**, you are about to create a new Cardinal character. Please take care of the following, you will need to put the nickname you want your character to have, it has to be valid, not contain special characters and has a length inferior to 256 characters. You will also have to choose between the available classes and races for your character. The command you are about to send after this message (you will have 2 minutes) should looks like \`Cardinal warrior human\`.\n**Available Classes** : ${Object.keys(classesRaces.classes).join(', ')}\n**Available Races** : ${Object.keys(classesRaces.races).join(', ')}`)
                    .setColor('BLUE');
                message.channel.send({embed});
                
                const collected = await message.channel.awaitMessages(filter, {time: 120000, max: 1});
                collectedData = new Args(collected.first().content, ' ').args;
                collectedData[0] = matchExact(/([A-Z0-9-_])\w+/gi, collectedData[0]) ? collectedData[0] : null;
                collectedData[1] = Object.keys(classesRaces.classes).indexOf(collectedData[1].toLowerCase()) != -1 ? collectedData[1].toLowerCase() : 'null';
                collectedData[2] = Object.keys(classesRaces.races).indexOf(collectedData[2].toLowerCase()) != -1 ? collectedData[2].toLowerCase() : 'null';

                if (collectedData.indexOf('null') != -1) {
                    const embed = new Discord.RichEmbed()
                        .setTitle('Invalid Data Given')
                        .setDescription(`The data you gave is invalid somewhere, please review it before retrying to create a character.`)
                        .setColor('ORANGE');
                    message.channel.send({embed});
                } else {
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
                            str: classesRaces.classes[collectedData[1]].baseAttributes.str + classesRaces.races[collectedData[2]].baseAttributes.str,
                            vit: classesRaces.classes[collectedData[1]].baseAttributes.vit + classesRaces.races[collectedData[2]].baseAttributes.vit,
                            dex: classesRaces.classes[collectedData[1]].baseAttributes.dex + classesRaces.races[collectedData[2]].baseAttributes.dex,
                            int: classesRaces.classes[collectedData[1]].baseAttributes.int + classesRaces.races[collectedData[2]].baseAttributes.int,
                            def: classesRaces.classes[collectedData[1]].baseAttributes.def + classesRaces.races[collectedData[2]].baseAttributes.def
                        }
                    };
                    poolQuery(`INSERT INTO profiles (profileId, userId, nickname, class, race, hp, stamina, xp, gold, inventory, attributes, skills, createdTimestamp, banned) VALUES ('${key}', '${user.id}', '${collectedData[0]}', '${collectedData[1]}', '${collectedData[2]}', ${require('./../functions/formulas/attributes').HPFromVitality(attributes.attributes.vit)}, ${require('./../functions/formulas/attributes').staminaFromVitality(attributes.attributes.vit)}, 0, 0, '{}', '${JSON.stringify(attributes)}', '{}', ${new Date().getTime()}, 0 )`).then(async success => {
                        const profile = new Profile(key);
                        profile.init(async () => {
                            const embed = new Discord.RichEmbed()
                                .setTitle('Profile Created')
                                .setDescription(`Your character has been successfully created. Below are some infos about it.\n**Profile ID** : ${key}\n**Nickname** : ${collectedData[0]}\n**Type**: ${collectedData[1][0].toUpperCase() + collectedData[1].slice(1)} ${collectedData[2][0].toUpperCase() + collectedData[2].slice(1)}`)
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
                }
            } else {
                const embed = new Discord.RichEmbed()
                    .setTitle('Invalid Arguments')
                    .setDescription(`There is a problem with your args.`)
                    .setColor('ORANGE');
                message.channel.send({embed});
            }
        } else {
            const profile = new Profile(user.activeProfile);
            profile.init(() => {
                const player = profile.player;
                player.init(() => {
                    if (user.activeProfile != undefined) {
                        const embed = new Discord.RichEmbed()
                            .setTitle(`Cardinal Character Statistics of ${player.nickname}`)
                            .addField(`Type`, `${player.race[0].toUpperCase() + player.race.slice(1)} ${player.class[0].toUpperCase() + player.class.slice(1)}`, true)
                            .addField(`Level`, `\`[P1]\` **Lv${player.level}**`, true)
                            .addField(`Experience`, `${player.xp} XP / ${player.xpEndLevel} XP`, true)
                            .addField(`HP`, `${player.hp} HP / ${player.attributes.hp} HP`, true)
                            .addField(`Silver`, `${player.gold} Silver`, true)
                            .addField(`Stamina`, `${player.stamina} ST / ${player.attributes.stamina} ST`, true)
                            .addField(`Attributes`, `**Available Points** : ${player.availablePoints}\n**Strength** : ${player.attributes.str} | **Defense** : ${player.attributes.def} | **Dexterity** : ${player.attributes.dex} | **Vitality** : ${player.attributes.vit} | **Intelligence** : ${player.attributes.int}`, true)
                            .setFooter(`Account Created`, message.author.avatarURL)
                            .setTimestamp(new Date(profile.createdTimestamp))
                            .setColor('BLUE');
                        message.channel.send({embed});
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
    });
}