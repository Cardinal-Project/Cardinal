const similarity = require('./../../../functions/utils/stringsSimilarity');
const items = require('./../../../data/items.json');
module.exports = class Item {
    /**
     * Builds the Item object
     * @param item Name or ID of the item 
     */
    constructor(item) {
        if (typeof item == 'number') {
            this.id = item;
        } else {
            this.id = Item.findItem(item);
        }
        for (let [key, value] of Object.entries(this.fetchItem())) {
            this[key] = value;
        }
    }

    fetchItem() {
        var item = items[this.id];
        item.type = Object.keys(item)[2];
        item.id = this.id;
        return item;
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
}