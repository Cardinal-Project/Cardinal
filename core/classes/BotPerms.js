module.exports = class BotPerms {
    constructor(bitfield) {
        this.bitfield = bitfield;
        this.perms = BotPerms.decodePermsIntoArray(this.bitfield);
    }

    has(perm) {
        const perms = BotPerms.decodePermsIntoArray(this.bitfield);
        if (perms.indexOf('ADMINISTRATOR') != -1) {
            return true;
        } else {
            return perms.indexOf(perm) != -1 ? true : false;
        }
    }

    static decodePermsIntoArray(bitfield) {
        var computing = bitfield;
        var permsArray = [];
        const perms = {
            "ADMINISTRATOR": {
                name: "ADMINISTRATOR",
                number: 64
            },
            "ACCESS_SUDO_MODE": {
                name: "ACCESS_SUDO_MODE",
                number: 32
            },
            "QUERY_DB_FULL": {
                name: "QUERY_DB_FULL",
                number: 16
            },
            "QUERY_DB_SELECT": {
                name: "QUERY_DB_SELECT",
                number: 8
            },
            "EVAL_CODE": {
                name: "EVAL_CODE",
                number: 4
            },
            "SHOW_ADMIN_COMMANDS": {
                name: "SHOW_ADMIN_COMMANDS",
                number: 2
            },
            "USE_BOT": {
                name: "USE_BOT",
                number: 1
            }
        };

        var maxBitfield = 0;
        Object.keys(perms).forEach(element => {
            maxBitfield += perms[element].number;
        })

        if (bitfield <= maxBitfield) {
            while (computing > 0) {
                Object.keys(perms).forEach(element => {
                    if (computing >= perms[element].number) {
                        permsArray.push(perms[element].name);
                        computing -= perms[element].number;
                    }
                })
            }
            
            return permsArray;
        } else {
            return new RangeError(`Bitfield given is above the max allowed`);
        }
    }
}