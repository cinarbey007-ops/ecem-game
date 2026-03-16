// Generates all enemy textures procedurally
class EnemyRenderer {
  static generate(scene) {
    EnemyRenderer._generateMummy(scene);
    EnemyRenderer._generateScarab(scene);
    EnemyRenderer._generateAnubis(scene);
    EnemyRenderer._generateWisp(scene);
    EnemyRenderer._generateStatue(scene);
    EnemyRenderer._generateGatekeeper(scene);
    EnemyRenderer._generateShade(scene);
    EnemyRenderer._generatePharaoh(scene);
    console.log('[EnemyRenderer] Enemy textures generated');
  }

  static _generateMummy(scene) {
    for (const state of ['idle', 'walk', 'attack', 'hurt', 'dead']) {
      const g = scene.add.graphics();
      EnemyRenderer._drawMummy(g, state);
      g.generateTexture(`mummy_${state}`, 28, 32);
      g.destroy();
    }
  }

  static _drawMummy(g, state) {
    if (state === 'dead') {
      g.fillStyle(PALETTE.MUMMY_WRAP);
      g.fillRect(2, 12, 24, 10);
      return;
    }
    const isHurt = state === 'hurt';
    const color = isHurt ? PALETTE.HIT_FLASH : PALETTE.MUMMY_WRAP;

    // Legs
    g.fillStyle(color);
    const la = state === 'walk' ? 2 : 0;
    g.fillRect(8, 22 + la, 5, 9);
    g.fillRect(15, 22 - la, 5, 9);

    // Body
    g.fillStyle(color);
    g.fillRect(7, 10, 14, 14);
    // Wrap lines
    g.fillStyle(PALETTE.MUMMY_DARK);
    g.fillRect(7, 13, 14, 1);
    g.fillRect(7, 16, 14, 1);
    g.fillRect(7, 19, 14, 1);
    // Torn edges
    g.fillTriangle(7, 23, 5, 26, 7, 26);
    g.fillTriangle(21, 22, 23, 25, 21, 25);

    // Head
    g.fillStyle(color);
    g.fillRect(9, 2, 10, 10);
    // Eye holes
    g.fillStyle(PALETTE.MUMMY_DARK);
    g.fillRect(11, 5, 2, 2);
    g.fillRect(16, 5, 2, 2);

    // Arms extended on attack
    if (state === 'attack') {
      g.fillStyle(color);
      g.fillRect(2, 10, 5, 4); // left arm extended
      g.fillRect(21, 10, 5, 4);
    } else {
      g.fillStyle(color);
      g.fillRect(4, 12, 3, 8);
      g.fillRect(21, 12, 3, 8);
    }
  }

  static _generateScarab(scene) {
    for (const state of ['idle', 'run', 'dead']) {
      const g = scene.add.graphics();
      EnemyRenderer._drawScarab(g, state);
      g.generateTexture(`scarab_${state}`, 18, 14);
      g.destroy();
    }
  }

  static _drawScarab(g, state) {
    if (state === 'dead') {
      g.fillStyle(PALETTE.SCARAB_GREEN);
      g.fillEllipse(9, 8, 14, 8);
      return;
    }
    const legY = state === 'run' ? 1 : 0;

    // Shell
    g.fillStyle(PALETTE.SCARAB_GREEN);
    g.fillEllipse(9, 7, 14, 9);
    // Shine
    g.fillStyle(PALETTE.SCARAB_SHINE, 0.6);
    g.fillEllipse(7, 5, 5, 4);
    // Wing line
    g.fillStyle(PALETTE.SCARAB_GREEN);
    g.fillStyle(0x0D4A20);
    g.fillRect(8, 3, 1, 8);

    // Antennae
    g.fillStyle(PALETTE.SCARAB_GREEN);
    g.fillRect(12, 1 + legY, 1, 4);
    g.fillRect(15, 2 + legY, 1, 3);

    // Legs (3 per side)
    g.fillStyle(0x0D4A20);
    for (let i = 0; i < 3; i++) {
      g.fillRect(1, 4 + i * 2 + legY, 3, 1);   // left
      g.fillRect(14, 4 + i * 2 + legY, 3, 1);  // right
    }
  }

  static _generateAnubis(scene) {
    for (const state of ['idle', 'walk', 'attack', 'hurt', 'dead']) {
      const g = scene.add.graphics();
      EnemyRenderer._drawAnubis(g, state);
      g.generateTexture(`anubis_${state}`, 32, 38);
      g.destroy();
    }
  }

  static _drawAnubis(g, state) {
    if (state === 'dead') {
      g.fillStyle(PALETTE.ANUBIS_BLACK);
      g.fillRect(4, 14, 24, 12);
      return;
    }
    const isHurt = state === 'hurt';
    const bodyColor = isHurt ? PALETTE.HIT_FLASH : PALETTE.ANUBIS_BLACK;
    const accentColor = isHurt ? PALETTE.HIT_FLASH : PALETTE.ANUBIS_GOLD;
    const walkOff = state === 'walk' ? 2 : 0;

    // Legs
    g.fillStyle(bodyColor);
    g.fillRect(10, 26 + walkOff, 5, 10);
    g.fillRect(17, 26 - walkOff, 5, 10);

    // Kilt
    g.fillStyle(accentColor);
    g.fillRect(9, 22, 14, 6);

    // Body
    g.fillStyle(bodyColor);
    g.fillRect(9, 12, 14, 12);
    // Chest armor
    g.fillStyle(accentColor);
    g.fillRect(9, 12, 14, 6);

    // Spear
    const spearX = state === 'attack' ? 28 : 26;
    g.fillStyle(0xCCCCCC);
    g.fillRect(spearX, 2, 2, 26);
    g.fillTriangle(spearX + 1, 0, spearX - 2, 8, spearX + 4, 8);

    // Shield (left)
    g.fillStyle(accentColor);
    g.fillRect(4, 14, 5, 10);
    g.fillStyle(bodyColor);
    g.fillRect(5, 15, 3, 8);
    g.fillStyle(accentColor);
    g.fillRect(6, 18, 1, 2);

    // Jackal head
    g.fillStyle(bodyColor);
    // Muzzle (elongated)
    g.fillRect(9, 8, 14, 8);
    g.fillRect(11, 4, 10, 8);
    g.fillRect(13, 1, 6, 8);
    // Ears (tall triangles)
    g.fillTriangle(10, 0, 8, 8, 12, 8);   // left ear
    g.fillTriangle(22, 0, 20, 8, 24, 8);  // right ear
    g.fillStyle(accentColor);
    g.fillTriangle(11, 1, 9, 7, 12, 7);   // inner ear
    g.fillTriangle(21, 1, 19, 7, 22, 7);
    // Eye
    g.fillStyle(0xFFAA00);
    g.fillCircle(17, 6, 2);
    g.fillStyle(0x000000);
    g.fillCircle(17, 6, 1);
  }

  static _generateWisp(scene) {
    for (let i = 0; i < 3; i++) {
      const g = scene.add.graphics();
      const radius = 12;
      g.fillStyle(PALETTE.CURSE_PURPLE, 0.8);
      g.fillCircle(radius, radius, radius);
      g.fillStyle(PALETTE.CURSE_GLOW, 0.6);
      g.fillCircle(radius, radius, radius - 4);
      g.fillStyle(0xFFFFFF, 0.8);
      g.fillCircle(radius - 2, radius - 2, 3);
      // Swirl effect per frame
      g.lineStyle(1, PALETTE.CURSE_GLOW, 0.5);
      g.strokeCircle(radius, radius, radius - 2 + i);
      g.generateTexture(`wisp_${i}`, 24, 24);
      g.destroy();
    }
  }

  static _generateStatue(scene) {
    const g = scene.add.graphics();
    // Large stone figure
    g.fillStyle(PALETTE.STONE_LIGHT);
    g.fillRect(6, 0, 20, 38);
    g.fillStyle(PALETTE.STONE_MID);
    g.fillRect(7, 1, 18, 36);
    // Head
    g.fillStyle(PALETTE.STONE_LIGHT);
    g.fillRect(9, 1, 14, 10);
    // Headdress
    g.fillStyle(PALETTE.GOLD);
    g.fillRect(8, 0, 16, 3);
    // Arms
    g.fillStyle(PALETTE.STONE_LIGHT);
    g.fillRect(2, 10, 6, 4);
    g.fillRect(24, 10, 6, 4);
    // Crack details
    g.fillStyle(PALETTE.STONE_DARK);
    g.fillRect(14, 12, 1, 14);
    g.fillRect(20, 8, 1, 6);
    g.generateTexture('statue_idle', 32, 38);
    g.destroy();
  }

  static _generateGatekeeper(scene) {
    // Large mummy boss (48x54)
    const g = scene.add.graphics();
    g.fillStyle(PALETTE.GATEKEEPER);
    g.fillRect(10, 12, 28, 28);
    g.fillStyle(PALETTE.MUMMY_DARK);
    g.fillRect(10, 18, 28, 2);
    g.fillRect(10, 26, 28, 2);
    g.fillRect(10, 34, 28, 2);
    // Head
    g.fillStyle(PALETTE.GATEKEEPER);
    g.fillRect(14, 2, 20, 12);
    g.fillStyle(PALETTE.MUMMY_DARK);
    g.fillRect(18, 6, 3, 3); // left eye
    g.fillRect(27, 6, 3, 3); // right eye
    // Arms
    g.fillStyle(PALETTE.GATEKEEPER);
    g.fillRect(2, 12, 8, 6);
    g.fillRect(38, 12, 8, 6);
    // Boss glow
    g.fillStyle(PALETTE.GOLD, 0.3);
    for (let i = 0; i < 3; i++) {
      g.lineStyle(1, PALETTE.GOLD, 0.2 + i * 0.1);
      g.strokeRect(10 - i * 2, 12 - i * 2, 28 + i * 4, 28 + i * 4);
    }
    g.generateTexture('gatekeeper_idle', 48, 54);
    g.destroy();
  }

  static _generateShade(scene) {
    // Ghostly shade boss (40x48)
    const g = scene.add.graphics();
    g.fillStyle(PALETTE.SHADE_BLUE, 0.8);
    g.fillEllipse(20, 28, 32, 40);
    g.fillStyle(PALETTE.SHADE_GLOW, 0.5);
    g.fillEllipse(20, 26, 24, 30);
    // Face
    g.fillStyle(0xFFFFFF, 0.9);
    g.fillEllipse(14, 20, 5, 5);
    g.fillEllipse(26, 20, 5, 5);
    g.fillStyle(0x000000, 0.8);
    g.fillEllipse(14, 20, 3, 3);
    g.fillEllipse(26, 20, 3, 3);
    // Crown
    g.fillStyle(PALETTE.SHADE_GLOW);
    g.fillTriangle(14, 10, 12, 18, 16, 18);
    g.fillTriangle(20, 8, 18, 16, 22, 16);
    g.fillTriangle(26, 10, 24, 18, 28, 18);
    // Wispy bottom
    g.fillStyle(PALETTE.SHADE_BLUE, 0.4);
    g.fillTriangle(8, 40, 4, 48, 12, 48);
    g.fillTriangle(20, 42, 16, 48, 24, 48);
    g.fillTriangle(32, 40, 28, 48, 36, 48);
    g.generateTexture('shade_idle', 40, 48);
    g.destroy();
  }

  static _generatePharaoh(scene) {
    // Pharaoh Khamun boss (60x68) — all phases
    for (const phase of [1, 2, 3]) {
      const g = scene.add.graphics();
      EnemyRenderer._drawPharaoh(g, phase);
      g.generateTexture(`pharaoh_p${phase}`, 60, 68);
      g.destroy();
    }
  }

  static _drawPharaoh(g, phase) {
    const curseColor = phase === 3 ? 0x3D006B : PALETTE.STONE_DARK;
    const goldColor = phase === 3 ? PALETTE.CURSE_GLOW : PALETTE.GOLD;

    // Curse aura
    if (phase >= 2) {
      g.fillStyle(PALETTE.CURSE_PURPLE, 0.15);
      g.fillCircle(30, 34, 28 + phase * 2);
      g.fillStyle(PALETTE.CURSE_PURPLE, 0.1);
      g.fillCircle(30, 34, 32 + phase * 2);
    }

    // Legs
    g.fillStyle(curseColor);
    g.fillRect(16, 50, 10, 16);
    g.fillRect(34, 50, 10, 16);
    // Kilt
    g.fillStyle(goldColor);
    g.fillRect(15, 44, 30, 8);
    g.fillStyle(curseColor);
    g.fillRect(17, 44, 4, 8);
    g.fillRect(22, 44, 4, 8);
    g.fillRect(27, 44, 4, 8);
    g.fillRect(32, 44, 4, 8);
    g.fillRect(37, 44, 4, 8);

    // Body
    g.fillStyle(curseColor);
    g.fillRect(14, 26, 32, 20);
    // Chest collar
    g.fillStyle(goldColor);
    g.fillRect(14, 26, 32, 8);
    g.fillStyle(PALETTE.LAPIS);
    g.fillRect(16, 28, 4, 4);
    g.fillRect(22, 28, 4, 4);
    g.fillRect(28, 28, 4, 4);
    g.fillRect(34, 28, 4, 4);

    // Arms
    g.fillStyle(curseColor);
    g.fillRect(4, 26, 10, 6);
    g.fillRect(46, 26, 10, 6);

    // Staff
    g.fillStyle(goldColor);
    g.fillRect(52, 4, 3, 36);
    // Ankh on staff
    g.fillStyle(goldColor);
    g.fillRect(50, 8, 7, 2); // horizontal
    g.fillEllipse(53, 6, 6, 6); // loop

    // Head (elongated)
    g.fillStyle(PALETTE.SKIN_TAN);
    g.fillRect(22, 14, 16, 14);

    // Double Crown
    // White inner crown
    g.fillStyle(0xF0F0F0);
    g.fillRect(24, 2, 12, 14);
    // Red outer crown
    g.fillStyle(0xCC2222);
    g.fillRect(20, 8, 20, 8);
    g.fillRect(20, 8, 4, 14);
    g.fillRect(36, 8, 4, 14);
    // Crown jewel
    g.fillStyle(goldColor);
    g.fillRect(27, 0, 6, 4);

    // Eyes
    const eyeColor = phase === 3 ? PALETTE.CURSE_GLOW : 0xFFAA00;
    g.fillStyle(eyeColor);
    g.fillEllipse(26, 20, 6, 4);
    g.fillEllipse(34, 20, 6, 4);
    g.fillStyle(0x000000);
    g.fillCircle(26, 20, 2);
    g.fillCircle(34, 20, 2);

    // Phase 3 dark aura spikes
    if (phase === 3) {
      g.fillStyle(PALETTE.CURSE_GLOW, 0.6);
      const spikes = 8;
      for (let i = 0; i < spikes; i++) {
        const angle = (i / spikes) * Math.PI * 2;
        const cx = 30 + Math.cos(angle) * 26;
        const cy = 34 + Math.sin(angle) * 26;
        g.fillTriangle(30, 34, cx - 3, cy - 3, cx + 3, cy + 3);
      }
    }
  }
}
