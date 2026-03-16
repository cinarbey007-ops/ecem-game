// Generates item icon textures procedurally
class ItemRenderer {
  static generate(scene) {
    ItemRenderer._generateWeapons(scene);
    ItemRenderer._generateArmor(scene);
    ItemRenderer._generateAccessories(scene);
    console.log('[ItemRenderer] Item textures generated');
  }

  static _generateWeapons(scene) {
    // Khopesh
    let g = scene.add.graphics();
    g.fillStyle(PALETTE.STONE_MID);
    g.fillRect(9, 18, 4, 10); // handle
    g.fillStyle(PALETTE.WARRIOR_GOLD);
    g.fillRect(7, 16, 8, 3); // guard
    g.fillStyle(0xCCCCCC);
    g.fillTriangle(11, 0, 5, 14, 17, 10); // blade curve
    g.fillStyle(0xEEEEEE);
    g.fillRect(10, 2, 1, 12); // edge
    g.generateTexture('item_khopesh', 24, 28);
    g.destroy();

    // Bow
    g = scene.add.graphics();
    g.lineStyle(2, PALETTE.SAND_DARK);
    g.beginPath();
    g.arc(12, 12, 10, -0.8, 0.8, false);
    g.strokePath();
    g.lineStyle(1, PALETTE.STONE_LIGHT);
    // String
    g.beginPath();
    g.moveTo(12 + 10 * Math.cos(-0.8), 12 + 10 * Math.sin(-0.8));
    g.lineTo(12 + 10 * Math.cos(0.8), 12 + 10 * Math.sin(0.8));
    g.strokePath();
    // Arrow
    g.fillStyle(PALETTE.STONE_LIGHT);
    g.fillRect(4, 11, 16, 1);
    g.fillTriangle(20, 11, 24, 12, 20, 13);
    g.generateTexture('item_bow', 24, 24);
    g.destroy();

    // Staff
    g = scene.add.graphics();
    g.fillStyle(PALETTE.SAND_DARK);
    g.fillRect(11, 8, 3, 20);
    g.fillStyle(PALETTE.CURSE_GLOW);
    g.fillCircle(12, 5, 5);
    g.fillStyle(PALETTE.STONE_DARK);
    g.fillCircle(12, 5, 3);
    g.fillStyle(PALETTE.CURSE_GLOW);
    g.fillCircle(12, 5, 1);
    g.generateTexture('item_staff', 24, 28);
    g.destroy();
  }

  static _generateArmor(scene) {
    // Helmet
    let g = scene.add.graphics();
    g.fillStyle(PALETTE.WARRIOR_GOLD);
    g.fillRect(4, 8, 16, 12);
    g.fillStyle(PALETTE.STONE_LIGHT);
    g.fillRect(6, 8, 12, 8);
    g.fillStyle(PALETTE.WARRIOR_GOLD);
    g.fillRect(4, 6, 16, 4); // rim
    g.fillRect(4, 16, 3, 4); // cheek guard
    g.fillRect(17, 16, 3, 4);
    g.generateTexture('item_helmet', 24, 24);
    g.destroy();

    // Chest
    g = scene.add.graphics();
    g.fillStyle(PALETTE.WARRIOR_GOLD);
    g.fillRect(4, 4, 16, 16); // body
    g.fillRect(2, 6, 4, 8);   // shoulder L
    g.fillRect(18, 6, 4, 8);  // shoulder R
    g.fillStyle(PALETTE.STONE_MID);
    g.fillRect(8, 8, 8, 8); // center
    g.fillStyle(PALETTE.GOLD);
    g.fillRect(10, 10, 4, 4);
    g.generateTexture('item_chest', 24, 24);
    g.destroy();

    // Off-hand shield
    g = scene.add.graphics();
    g.fillStyle(PALETTE.WARRIOR_GOLD);
    g.fillRect(4, 2, 16, 20);
    g.fillStyle(PALETTE.STONE_MID);
    g.fillRect(6, 4, 12, 16);
    g.fillStyle(PALETTE.WARRIOR_GOLD);
    g.fillCircle(12, 12, 4);
    g.generateTexture('item_offhand', 24, 24);
    g.destroy();
  }

  static _generateAccessories(scene) {
    // Amulet (ankh)
    let g = scene.add.graphics();
    g.fillStyle(PALETTE.GOLD);
    g.fillRect(10, 10, 4, 14); // vertical
    g.fillRect(5, 14, 14, 4);  // horizontal
    g.fillEllipse(12, 8, 8, 8); // loop
    g.fillStyle(PALETTE.STONE_DARK);
    g.fillEllipse(12, 8, 4, 4); // hole in loop
    g.generateTexture('item_amulet', 24, 28);
    g.destroy();

    // Ring
    g = scene.add.graphics();
    g.lineStyle(3, PALETTE.GOLD);
    g.strokeCircle(12, 12, 8);
    g.fillStyle(PALETTE.RARE);
    g.fillCircle(12, 4, 4);
    g.generateTexture('item_ring', 24, 24);
    g.destroy();

    // Generic fallback
    g = scene.add.graphics();
    g.fillStyle(PALETTE.UNCOMMON);
    g.fillRect(4, 4, 16, 16);
    g.generateTexture('item_unknown', 24, 24);
    g.destroy();
  }

  static getTextureKey(itemType) {
    const map = {
      weapon: 'item_khopesh',
      bow: 'item_bow',
      staff: 'item_staff',
      helmet: 'item_helmet',
      chest: 'item_chest',
      offhand: 'item_offhand',
      amulet: 'item_amulet',
      ring: 'item_ring'
    };
    return map[itemType] || 'item_unknown';
  }
}
