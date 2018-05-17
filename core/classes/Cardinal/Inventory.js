const similarity = require('./../../functions/utils/stringsSimilarity');
const poolQuery = require('./../../functions/database/poolQuery');
const items = require('./../../data/items.json');
const Cache = require('./../Cache');
module.exports = class Inventory {
    constructor(profileId, inventoryObject) {
        this.profileId = profileId;
        this.rawInventory = JSON.parse(inventoryObject);
        this.inventory = this.fetchItems();
    }

    refreshRawInv() {
        for (let [id, item] of Object.entries(this.inventory)) {
            this.rawInventory[id] = item.gotNumber;
        }
    }

    fetchItem(itemId) {
        var item = items[itemId];
        item.gotNumber = this.rawInventory[itemId] != undefined ? this.rawInventory[itemId] : 0;
        return item;
    }

    static fetchItem(itemId) {
        var item = items[itemId];
        item.type = Object.keys(item)[2];
        item.id = itemId;
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

    static findItem(itemName) {
        var allItems = new Map();
        for (let [id, item] of Object.entries(items)) {
            allItems.set(id, similarity(itemName, item.name));
        }

        allItems[Symbol.iterator] = function* () {
            yield* [...this.entries()].sort((a, b) => b[1] - a[1]);
        }

        var itemFound = 0;
        for (let [key, value] of allItems) {
            if (itemFound == 0) {
                itemFound = key;
            }
        }

        return itemFound;
    }

    /** 
    * Add items to the player's inventory
    * @param items Array of the items ID to change
    * @param quantities Array of the items quantities to change
    */ 
    add(items, quantities) {
        const cache = new Cache(this.profileId, 'profileData.json');
        if (items.length === quantities.length) {
            for (let i = 0; i < items.length; i++) {
                items[i] = String(items[i]);
                if (this.inventory[items[i]] == undefined) {
                    this.inventory[items[i]] = this.fetchItem(items[i]);
                }
                this.inventory[items[i]].gotNumber += quantities[i];
            }
            this.refreshRawInv();
            poolQuery(`UPDATE profiles SET inventory='${JSON.stringify(this.rawInventory)}' WHERE profileId='${this.profileId}'`).then(() => {
                cache.set('inventory', JSON.stringify(this.rawInventory));
            });
        } else {
            return new RangeError(`The items and the quantities arrays length are not the same`);
        }
    }

    /** 
    * Remove items to the player's inventory
    * @param items Array of the items ID to change
    * @param quantities Array of the items quantities to change
    */ 
    remove(items, quantities) {
        const cache = new Cache(this.profileId, 'profileData.json');
        if (items.length === quantities.length) {
            for (let i = 0; i < items.length; i++) {
                items[i] = String(items[i]);
                if (this.inventory[items[i]] != undefined) {
                    if (this.inventory[items[i]].gotNumber >= quantities[i]) {
                        this.inventory[items[i]].gotNumber -= quantities[i];
                        this.refreshRawInv();
                        poolQuery(`UPDATE profiles SET inventory='${JSON.stringify(this.rawInventory)}' WHERE profileId='${this.profileId}'`).then(() => {
                            cache.set('inventory', JSON.stringify(this.rawInventory));
                        });
                    } else {
                        return new RangeError(`The user does not have an equal or higher quantity of the item than the quantity to remove.`);
                    }
                } else {
                    return new RangeError(`The user does not have an equal or higher quantity of the item than the quantity to remove.`);
                }
            }
        }
    }
}