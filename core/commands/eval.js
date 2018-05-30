exports.run = function(bot, message, args) {
    try {
        const code = args.args.join(' ');
        let evaled = eval(code);
        
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
    category: "Game",
    description: "Evaluates node.js code",
    args: {
        1: {
            key: "code",
            types: ['string'],
            desc: "**node.js Code**",
            required: true,
            size: Infinity
        }
    }
}