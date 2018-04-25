const permissions = require('./../data/permissions.json')
module.exports = class BotPerms {
    constructor(bitfield) {
        this.setBitfield(bitfield);
    }

    has(perm) {
        if (this.perms.indexOf('ADMINISTRATOR') != -1) {
            return true;
        } else {
            return this.perms.indexOf(perm) != -1 ? true : false;
        }
    }
    
    add(perm) {
        const supportedPerms = Object.keys(permissions);
        if (supportedPerms.indexOf(perm) != -1) {
            return this.perms.indexOf(perm) != -1 ? new TypeError('Perm already exists') : this.bitfield + permissions[perm].number;
        }
    }

    remove(perm) {
        const supportedPerms = Object.keys(permissions);
        if (supportedPerms.indexOf(perm) != -1) {
            return this.perms.indexOf(perm) != -1 ? this.bitfield - permissions[perm].number : new TypeError('Perm does not exist yet');
        }
    }

    setBitfield(bitfield) {
        this.bitfield = bitfield;
        this.perms = BotPerms.decodePermsIntoArray(this.bitfield);
    }

    static decodePermsIntoArray(bitfield) {
        var computing = bitfield;
        var permsArray = [];

        var maxBitfield = 0;
        Object.keys(permissions).forEach(element => {
            maxBitfield += permissions[element].number;
        })

        if (bitfield <= maxBitfield) {
            while (computing > 0) {
                Object.keys(permissions).forEach(element => {
                    if (computing >= permissions[element].number) {
                        permsArray.push(permissions[element].name);
                        computing -= permissions[element].number;
                    }
                })
            }
            
            return permsArray;
        } else {
            return new RangeError(`Bitfield given is above the max allowed`);
        }
    }
}