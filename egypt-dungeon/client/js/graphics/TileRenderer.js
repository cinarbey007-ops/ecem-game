// Generates all tile textures procedurally using Phaser Graphics
class TileRenderer {
  static generate(scene) {
    const TS = 32; // tile size

    // --- Sand Floor ---
    let g = scene.add.graphics();
    g.fillStyle(PALETTE.SAND_MID);
    g.fillRect(0, 0, TS, TS);
    // Noise dots
    g.fillStyle(PALETTE.SAND_DARK);
    for (let i = 0; i < 6; i++) {
      const dx = Math.floor(Math.random() * TS);
      const dy = Math.floor(Math.random() * TS);
      g.fillRect(dx, dy, 2, 2);
    }
    // Highlight top/left edge
    g.fillStyle(PALETTE.SAND_LIGHT);
    g.fillRect(0, 0, TS, 1);
    g.fillRect(0, 0, 1, TS);
    g.generateTexture('tile_sand', TS, TS);
    g.destroy();

    // --- Stone Wall ---
    g = scene.add.graphics();
    g.fillStyle(PALETTE.STONE_MID);
    g.fillRect(0, 0, TS, TS);
    // Brick pattern
    g.fillStyle(PALETTE.STONE_DARK);
    g.fillRect(0, 10, TS, 1);
    g.fillRect(0, 21, TS, 1);
    g.fillRect(16, 0, 1, 10);
    g.fillRect(8, 11, 1, 10);
    g.fillRect(24, 11, 1, 10);
    g.fillRect(16, 22, 1, 10);
    // Top/left highlight
    g.fillStyle(PALETTE.STONE_LIGHT);
    g.fillRect(0, 0, TS, 1);
    g.fillRect(0, 0, 1, TS);
    g.generateTexture('tile_wall', TS, TS);
    g.destroy();

    // --- Dark Stone Wall (tomb palette) ---
    g = scene.add.graphics();
    g.fillStyle(PALETTE.STONE_DARK);
    g.fillRect(0, 0, TS, TS);
    g.fillStyle(0x2A1A0A);
    g.fillRect(0, 10, TS, 1);
    g.fillRect(0, 21, TS, 1);
    g.fillRect(16, 0, 1, 10);
    g.fillRect(8, 11, 1, 10);
    g.fillRect(24, 11, 1, 10);
    g.fillRect(16, 22, 1, 10);
    g.fillStyle(PALETTE.STONE_MID);
    g.fillRect(0, 0, TS, 1);
    g.generateTexture('tile_wall_dark', TS, TS);
    g.destroy();

    // --- Curse Wall (level 3) ---
    g = scene.add.graphics();
    g.fillStyle(0x1A0A2A);
    g.fillRect(0, 0, TS, TS);
    g.fillStyle(PALETTE.CURSE_PURPLE, 0.4);
    g.fillRect(0, 10, TS, 1);
    g.fillRect(0, 21, TS, 1);
    g.fillRect(16, 0, 1, 10);
    g.fillStyle(PALETTE.CURSE_GLOW, 0.3);
    g.fillRect(0, 0, TS, 1);
    g.generateTexture('tile_wall_curse', TS, TS);
    g.destroy();

    // --- Torch tile (floor with torch) ---
    g = scene.add.graphics();
    g.fillStyle(PALETTE.SAND_MID);
    g.fillRect(0, 0, TS, TS);
    g.fillStyle(PALETTE.STONE_MID);
    g.fillRect(13, 4, 6, 16);
    g.fillStyle(PALETTE.TORCH_ORANGE);
    g.fillTriangle(16, 2, 12, 10, 20, 10);
    g.fillStyle(PALETTE.TORCH_YELLOW);
    g.fillTriangle(16, 4, 14, 9, 18, 9);
    g.generateTexture('tile_torch', TS, TS);
    g.destroy();

    // --- Torch (dim frame) ---
    g = scene.add.graphics();
    g.fillStyle(PALETTE.SAND_MID);
    g.fillRect(0, 0, TS, TS);
    g.fillStyle(PALETTE.STONE_MID);
    g.fillRect(13, 4, 6, 16);
    g.fillStyle(PALETTE.SAND_DARK);
    g.fillTriangle(16, 2, 12, 10, 20, 10);
    g.generateTexture('tile_torch_dim', TS, TS);
    g.destroy();

    // --- Trap tile (floor with spikes) ---
    g = scene.add.graphics();
    g.fillStyle(PALETTE.STONE_MID);
    g.fillRect(0, 0, TS, TS);
    g.generateTexture('tile_trap_off', TS, TS);
    g.destroy();

    g = scene.add.graphics();
    g.fillStyle(PALETTE.STONE_MID);
    g.fillRect(0, 0, TS, TS);
    g.fillStyle(0xCCCCCC);
    for (let i = 0; i < 4; i++) {
      const sx = 4 + i * 7;
      g.fillTriangle(sx + 3, 2, sx, 30, sx + 6, 30);
    }
    g.generateTexture('tile_trap_on', TS, TS);
    g.destroy();

    // --- Decoration (sarcophagus / pillar) ---
    g = scene.add.graphics();
    g.fillStyle(PALETTE.STONE_LIGHT);
    g.fillRect(0, 0, TS, TS);
    g.fillStyle(PALETTE.GOLD);
    g.fillRect(4, 2, TS - 8, 4);
    g.fillRect(4, TS - 6, TS - 8, 4);
    g.fillStyle(PALETTE.STONE_MID);
    g.fillRect(6, 6, TS - 12, TS - 12);
    g.fillStyle(PALETTE.GOLD, 0.5);
    g.fillRect(13, 10, 6, 12); // ankh symbol simplification
    g.generateTexture('tile_deco', TS, TS);
    g.destroy();

    // --- Pressure plate ---
    g = scene.add.graphics();
    g.fillStyle(PALETTE.STONE_MID);
    g.fillRect(0, 0, TS, TS);
    g.fillStyle(PALETTE.GOLD, 0.6);
    g.fillRect(4, 4, TS - 8, TS - 8);
    g.fillStyle(PALETTE.STONE_DARK);
    g.fillRect(8, 8, TS - 16, TS - 16);
    g.generateTexture('tile_plate_off', TS, TS);
    g.destroy();

    g = scene.add.graphics();
    g.fillStyle(PALETTE.STONE_MID);
    g.fillRect(0, 0, TS, TS);
    g.fillStyle(PALETTE.GOLD);
    g.fillRect(4, 4, TS - 8, TS - 8);
    g.fillStyle(PALETTE.TORCH_YELLOW, 0.8);
    g.fillRect(8, 8, TS - 16, TS - 16);
    g.generateTexture('tile_plate_on', TS, TS);
    g.destroy();

    // --- Water tile ---
    g = scene.add.graphics();
    g.fillStyle(PALETTE.WATER_BLUE);
    g.fillRect(0, 0, TS, TS);
    g.fillStyle(PALETTE.WATER_LIGHT, 0.4);
    g.fillRect(2, 6, TS - 4, 3);
    g.fillRect(4, 16, TS - 8, 3);
    g.fillRect(0, 26, TS - 2, 3);
    g.generateTexture('tile_water', TS, TS);
    g.destroy();

    // --- Door (closed) ---
    g = scene.add.graphics();
    g.fillStyle(PALETTE.STONE_DARK);
    g.fillRect(0, 0, TS, TS);
    g.fillStyle(PALETTE.GOLD);
    g.fillRect(4, 0, TS - 8, TS);
    g.fillStyle(PALETTE.STONE_DARK);
    g.fillRect(8, 4, TS - 16, TS - 8);
    g.fillStyle(PALETTE.GOLD);
    g.fillRect(13, 12, 6, 8); // handle
    g.generateTexture('tile_door_closed', TS, TS);
    g.destroy();

    // --- Door (open, same as floor) ---
    g = scene.add.graphics();
    g.fillStyle(PALETTE.SAND_MID, 0.5);
    g.fillRect(0, 0, TS, TS);
    g.generateTexture('tile_door_open', TS, TS);
    g.destroy();

    // --- Hieroglyph wall decoration ---
    g = scene.add.graphics();
    g.fillStyle(PALETTE.STONE_MID);
    g.fillRect(0, 0, TS, TS);
    // Eye of Ra
    g.fillStyle(PALETTE.GOLD);
    g.fillEllipse(16, 8, 14, 8);
    g.fillStyle(PALETTE.STONE_DARK);
    g.fillCircle(16, 8, 3);
    g.fillStyle(PALETTE.GOLD);
    g.fillCircle(16, 8, 1);
    // Ankh below
    g.fillStyle(PALETTE.GOLD);
    g.fillRect(15, 14, 2, 12); // vertical
    g.fillRect(11, 18, 10, 2); // horizontal
    g.fillEllipse(16, 14, 6, 5); // loop
    g.generateTexture('tile_glyph', TS, TS);
    g.destroy();

    // --- Curse floor (level 3) ---
    g = scene.add.graphics();
    g.fillStyle(0x1A0A2A);
    g.fillRect(0, 0, TS, TS);
    g.fillStyle(PALETTE.CURSE_PURPLE, 0.5);
    for (let i = 0; i < 5; i++) {
      const x = Math.floor(Math.random() * (TS - 4));
      const y = Math.floor(Math.random() * (TS - 4));
      g.fillRect(x, y, 2, 2);
    }
    g.generateTexture('tile_curse_floor', TS, TS);
    g.destroy();

    console.log('[TileRenderer] All tile textures generated');
  }
}
