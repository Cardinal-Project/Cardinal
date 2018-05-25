exports.run = function(bot, message, args) {
    try {
        let evaled = eval(args.args.join(' '));
        if (typeof evaled !== "string") {
            evaled = require("util").inspect(evaled);
        }
        message.channel.send(evaled, {code:"xl"});
    } catch (err) {
        message.channel.send(`An error occured.\n\`\`\`xl\n${require('util').inspect(err, false, null)}\n\`\`\``);
    }
}

exports.infos = {
    name: "Code Evaluation",
    perms: {
        bot: 4,
        discord: null
    },
    enabled: null,
    category: "Admin",
    description: "Evaluates node.js code",
    args: {
        1: {
            types: ['string'],
            desc: "`[*]` **Code**",
            size: Infinity
        }
    }
}