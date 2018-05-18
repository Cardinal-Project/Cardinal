const similarity = require('./../../../functions/utils/stringsSimilarity');
const poolQuery = require('./../../../functions/database/poolQuery');
const usability = require('./../../../functions/helpers/usability');
const items = require('./../../../data/items.json');
const Cache = require('./../../Cache');
module.exports = class Inventory {
    constructor(player, inventoryObject) {
        this.player = player;
        this.rawInventory = JSON.parse(inventoryObject);
        this.inventory = this.fetchItems();
    }

    refreshRawInv() {
        for (let [id, item] of Object.entries(this.inventory)) {
            this.rawInventory[id] = item.gotNumber;
        }

        poolQuery(`UPDATE profiles SET inventory='${JSON.stringify(this.rawInventory)}' WHERE profileId='${this.player.id}'`).then(() => {
            const cache = new Cache(this.player.id, "profileData.json");
            cache.set('inventory', JSON.stringify(this.rawInventory));
        });
    }

    cleanUp() {
        let zeroFound = false;
        for (let [id, quantity] of Object.entries(this.rawInventory)) {
            if (quantity == 0) {
                delete this.rawInventory[id];
                zeroFound = true;
            }
        }
        zeroFound == true ? this.refreshRawInv() : null;
        this.refreshRawInv();
    }

    fetchItem(itemId) {
        var item = items[itemId];
        item.gotNumber = this.rawInventory[itemId] != undefined ? this.rawInventory[itemId] : 0;
        item.usability = usability(itemId, this.player);
        return item;
    }

    fetchItems() {
        var allItems = {};
        if (this.rawInventory != null) {
            for (let id of Object.keys(this.rawInventory)) {
                allItems[id] = this.fetchItem(id);
            }
        }
        return allItems;
    }

    /** 
    * Add items to the player's inventory
    * @param items Map of the Items ID with their quantity
    */ 
    add(items) {
        for (let [item, quantity] of items) {
            item = String(item);
            if (this.inventory[item] == undefined) {
                this.inventory[item] = this.fetchItem(item);
            }
            this.inventory[item].gotNumber += quantity;
        }
        this.refreshRawInv();
    }

    /** 
    * Remove items from the player's inventory
    * @param items Map of the Items ID with their quantity
    */ 
    remove(items) {
        for (let [item, quantity] of items) {
            item = String(item);
            if (this.inventory[item] != undefined) {
                if (this.inventory[item].gotNumber >= quantity) {
                    this.inventory[item].gotNumber -= quantity;
                    this.refreshRawInv();
                } else {
                    return new RangeError(`The user does not have an equal or higher quantity of the item than the quantity to remove.`);
                }
            } else {
                return new RangeError(`The user does not have an equal or higher quantity of the item than the quantity to remove.`);
            }
        }
    }
}