const poolQuery = require('./../../../functions/database/poolQuery');
const usability = require('./../../../functions/helpers/usability');
const Cache = require('./../../Cache');
const Item = require('./Item');
module.exports = class Equipment {
    /**
     * Builds the Equipment Object
     * @param player Player Object
     * @param equipment Object of the player's equipment
     */
    constructor(player, equipment) {
        this.rawEquipment = JSON.parse(equipment);
        this.equipment = this.fetchItems();
        this.player = player;
        this.supportedEquipmentTypes = ['weapon', 'shield', 'helmet', 'chestplate', 'pants', 'boots'];
    }

    refreshRawEquipment(callback) {
        var equipment = {};
        for (let [itemType, item] of this.equipment) {
            equipment[itemType] = item.id;
        }
        poolQuery(`UPDATE profiles SET equipment='${this.rawEquipment}' WHERE profileId='${this.player.id}'`).then(() => {
            const cache = new Cache(this.player.id, 'profileData.json');
            cache.set('equipment', this.rawEquipment);
            callback();
        });
        return equipment;
    }

    fetchItem() {
        var item = items[this.id];
        item.type = Object.keys(item)[2];
        item.id = itemId;
        item.usability = usability(item.id, this.player);
        return item;
    }

    fetchItems() {
        var allItems = {};
        if (this.rawEquipment != null) {
            for (let [type, itemId] of Object.entries(this.rawEquipment)) {
                allItems[type] = this.fetchItem(id);
            }
        }
        return allItems;
    }

    equip(itemId) {
        var item = Item.fetchItem(itemId);
        if (item.usability) {
            if (this.equipment[item.type] == undefined) {
                this.equipment[item.type] = itemId;
                this.rawEquipment = this.refreshRawEquipment(() => {
                    this.player.inventory.remove(new Map([itemId, 1]));
                });
            } else {
                return this.unEquip(itemId);
            }
        } else {
            return new RangeError(`The Player specified cannot equip the item specified.`);
        }
    }

    unEquip(itemId) {
        var item = Item.fetchItem(itemId);
        if (this.equipment[item.type] != undefined) {
            delete this.equipment[item.type];            
            this.rawEquipment = this.refreshRawEquipment(() => {
                this.player.inventory.add(new Map([itemId, 1]));
            });
        } else {
            return this.equip(itemId);
        }
    }
}