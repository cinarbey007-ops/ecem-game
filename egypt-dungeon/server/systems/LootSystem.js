const Utils = require('../../shared/utils');
const C = require('../../shared/constants');

class LootSystem {
  constructor() {
    this.groundLoot = []; // {id, x, y, item}
    this.events = [];
  }

  dropLoot(item, x, y) {
    if (!item) return;
    const lootId = Utils.generateId();
    this.groundLoot.push({ id: lootId, x, y, item });
    this.events.push({ type: 'loot_dropped', id: lootId, x, y, item });
  }

  tryPickup(player) {
    if (player.dead) return;
    for (let i = this.groundLoot.length - 1; i >= 0; i--) {
      const loot = this.groundLoot[i];
      if (Utils.distance(player.x, player.y, loot.x, loot.y) <= C.LOOT_PICKUP_RANGE) {
        if (player.inventory.length < 14) {
          player.inventory.push(loot.item);
          this.groundLoot.splice(i, 1);
          this.events.push({ type: 'loot_collected', id: loot.id, playerId: player.id, item: loot.item });
          // Auto-equip if slot is empty
          const slot = loot.item.type === 'weapon' ? 'weapon' : loot.item.type;
          if (C.EQUIP_SLOTS.includes(slot) && !player.equipped[slot]) {
            // Check class restriction
            if (loot.item.forClass && loot.item.forClass !== player.class) continue;
            player.equipItem(loot.item);
            player.inventory = player.inventory.filter(it => it.id !== loot.item.id);
            this.events.push({ type: 'item_auto_equipped', playerId: player.id, item: loot.item });
          }
        } else {
          this.events.push({ type: 'inventory_full', playerId: player.id });
        }
      }
    }
  }

  equipItem(player, itemId, slot) {
    const item = player.inventory.find(i => i.id === itemId);
    if (!item) return false;
    // Validate slot
    const validSlot = item.type === 'weapon' ? 'weapon' : item.type;
    if (validSlot !== slot && slot !== 'offhand') return false;
    // Class restriction
    if (item.forClass && item.forClass !== player.class) return false;
    const old = player.equipItem(item);
    player.inventory = player.inventory.filter(i => i.id !== itemId);
    if (old) player.inventory.push(old);
    this.events.push({ type: 'item_equipped', playerId: player.id, item, slot });
    return true;
  }

  getAndClearEvents() {
    const evts = this.events;
    this.events = [];
    return evts;
  }

  serialize() {
    return this.groundLoot.map(l => ({
      id: l.id,
      x: l.x,
      y: l.y,
      itemType: l.item.type,
      rarity: l.item.rarity,
      name: l.item.name
    }));
  }
}

module.exports = LootSystem;
