// Generates character sprite textures procedurally
class CharacterRenderer {
  static generate(scene) {
    CharacterRenderer._generateWarrior(scene);
    CharacterRenderer._generateArcher(scene);
    CharacterRenderer._generateCat(scene);
    console.log('[CharacterRenderer] Character textures generated');
  }

  static _generateWarrior(scene) {
    // Warrior: Cinar — stocky, gold/white armor, khopesh
    const states = ['idle', 'run0', 'run1', 'run2', 'run3', 'attack0', 'attack1', 'attack2', 'hurt', 'dead'];
    for (const state of states) {
      const g = scene.add.graphics();
      CharacterRenderer._drawWarrior(g, state);
      g.generateTexture(`warrior_${state}`, 32, 36);
      g.destroy();
    }
  }

  static _drawWarrior(g, state) {
    const isDead = state === 'dead';
    const isHurt = state === 'hurt';
    const isAttack = state.startsWith('attack');
    const isRun = state.startsWith('run');
    const runFrame = isRun ? parseInt(state.slice(3)) : 0;
    const attackFrame = isAttack ? parseInt(state.slice(6)) : 0;

    // Body color (flash red when hurt)
    const bodyColor = isHurt ? PALETTE.HIT_FLASH : PALETTE.WARRIOR_WHITE;
    const armorColor = isHurt ? PALETTE.HIT_FLASH : PALETTE.WARRIOR_GOLD;

    if (isDead) {
      // Lying flat
      g.fillStyle(PALETTE.WARRIOR_WHITE);
      g.fillRect(4, 14, 24, 10);
      g.fillStyle(PALETTE.WARRIOR_GOLD);
      g.fillEllipse(5, 19, 10, 10);
      return;
    }

    // Legs
    const legOffset = isRun ? [Math.sin(runFrame * 1.57) * 4, -Math.sin(runFrame * 1.57) * 4] : [0, 0];
    g.fillStyle(PALETTE.SAND_MID);
    g.fillRect(9, 24 + legOffset[0], 6, 10);
    g.fillRect(17, 24 + legOffset[1], 6, 10);

    // Body
    g.fillStyle(bodyColor);
    g.fillRect(8, 14, 16, 12);
    // Chest armor
    g.fillStyle(armorColor);
    g.fillRect(8, 14, 16, 8);
    // Gold trim line
    g.fillStyle(PALETTE.GOLD);
    g.fillRect(8, 21, 16, 1);

    // Head
    g.fillStyle(PALETTE.SKIN_TAN);
    g.fillEllipse(16, 10, 12, 12);
    // Helmet
    g.fillStyle(armorColor);
    g.fillRect(10, 5, 12, 6);
    g.fillRect(9, 9, 2, 3); // cheekguard left
    g.fillRect(21, 9, 2, 3); // cheekguard right

    // Weapon arm
    const armX = isAttack ? (attackFrame === 1 ? 26 : 22) : 22;
    const armY = isAttack ? (attackFrame === 1 ? 12 : 15) : 15;
    g.fillStyle(PALETTE.SKIN_TAN);
    g.fillRect(22, 15, 4, 8);

    // Khopesh weapon
    if (!isDead) {
      const wx = isAttack && attackFrame === 1 ? 28 : 24;
      const wy = isAttack && attackFrame === 1 ? 10 : 14;
      g.fillStyle(PALETTE.STONE_LIGHT);
      g.fillRect(wx, wy, 3, 14); // handle
      g.fillStyle(0xCCCCCC);
      // Curved blade (simplified as angled rect)
      g.fillTriangle(wx + 1, wy, wx + 8, wy + 6, wx + 3, wy + 8);

      // Shield (off-hand)
      g.fillStyle(armorColor);
      g.fillRect(4, 14, 5, 8);
      g.fillStyle(PALETTE.STONE_MID);
      g.fillRect(5, 15, 3, 6);
    }
  }

  static _generateArcher(scene) {
    const states = ['idle', 'run0', 'run1', 'run2', 'run3', 'attack0', 'attack1', 'attack2', 'hurt', 'dead'];
    for (const state of states) {
      const g = scene.add.graphics();
      CharacterRenderer._drawArcher(g, state);
      g.generateTexture(`archer_${state}`, 32, 36);
      g.destroy();
    }
  }

  static _drawArcher(g, state) {
    const isDead = state === 'dead';
    const isHurt = state === 'hurt';
    const isAttack = state.startsWith('attack');
    const isRun = state.startsWith('run');
    const runFrame = isRun ? parseInt(state.slice(3)) : 0;
    const attackFrame = isAttack ? parseInt(state.slice(6)) : 0;

    const bodyColor = isHurt ? PALETTE.HIT_FLASH : PALETTE.ARCHER_TEAL;

    if (isDead) {
      g.fillStyle(PALETTE.ARCHER_TEAL);
      g.fillRect(4, 14, 24, 10);
      g.fillStyle(PALETTE.SKIN_TAN);
      g.fillEllipse(5, 19, 10, 10);
      return;
    }

    // Legs
    const legOffset = isRun ? [Math.sin(runFrame * 1.57) * 4, -Math.sin(runFrame * 1.57) * 4] : [0, 0];
    g.fillStyle(PALETTE.SAND_MID);
    g.fillRect(10, 24 + legOffset[0], 5, 10);
    g.fillRect(17, 24 + legOffset[1], 5, 10);

    // Quiver (back)
    g.fillStyle(PALETTE.SAND_DARK);
    g.fillRect(5, 12, 4, 10);
    g.fillStyle(PALETTE.STONE_LIGHT);
    g.fillRect(6, 11, 1, 4);
    g.fillRect(7, 10, 1, 4);
    g.fillRect(8, 11, 1, 4);

    // Body
    g.fillStyle(bodyColor);
    g.fillRect(10, 14, 12, 12);
    // Sash
    g.fillStyle(PALETTE.ARCHER_GOLD);
    g.fillRect(10, 19, 12, 2);

    // Head
    g.fillStyle(PALETTE.SKIN_TAN);
    g.fillEllipse(16, 10, 10, 11);
    // Headband
    g.fillStyle(bodyColor);
    g.fillRect(11, 7, 10, 2);

    // Bow (draw in front)
    const bowX = isAttack && attackFrame === 1 ? 20 : 22;
    g.lineStyle(2, PALETTE.SAND_DARK);
    g.strokeCircle(bowX, 16, 8); // simplified circle bow

    // Arrow (notched when attacking)
    if (isAttack && attackFrame <= 1) {
      g.fillStyle(PALETTE.STONE_LIGHT);
      g.fillRect(18, 15, 8, 1);
      g.fillTriangle(26, 15, 28, 14, 28, 16);
    }

    // Drawing arm
    const drawX = isAttack ? (attackFrame === 0 ? 20 : 14) : 18;
    g.fillStyle(PALETTE.SKIN_TAN);
    g.fillRect(drawX, 15, 4, 6);
  }

  static _generateCat(scene) {
    // Small grey cat — idle and trot frames
    for (let frame = 0; frame < 2; frame++) {
      const g = scene.add.graphics();
      CharacterRenderer._drawCat(g, frame);
      g.generateTexture(`cat_${frame}`, 18, 14);
      g.destroy();
    }
  }

  static _drawCat(g, frame) {
    const legY = frame === 0 ? 10 : 11;

    // Body
    g.fillStyle(PALETTE.CAT_GREY);
    g.fillEllipse(9, 7, 14, 9);

    // Stripes
    g.fillStyle(PALETTE.CAT_DARK);
    g.fillRect(5, 5, 1, 4);
    g.fillRect(8, 4, 1, 5);
    g.fillRect(11, 5, 1, 4);

    // Head
    g.fillStyle(PALETTE.CAT_GREY);
    g.fillEllipse(15, 5, 8, 7);
    // Ears
    g.fillStyle(PALETTE.CAT_DARK);
    g.fillTriangle(13, 2, 12, 6, 14, 6);
    g.fillTriangle(17, 2, 16, 6, 18, 6);
    // Eyes
    g.fillStyle(PALETTE.CAT_EYE);
    g.fillCircle(14, 5, 1);
    g.fillCircle(17, 5, 1);
    // Nose
    g.fillStyle(0xFF9999);
    g.fillRect(15, 6, 1, 1);

    // Legs
    g.fillStyle(PALETTE.CAT_DARK);
    g.fillRect(4, legY, 2, 4);
    g.fillRect(7, legY, 2, 4);
    g.fillRect(12, frame === 0 ? 10 : 9, 2, 4);
    g.fillRect(15, frame === 0 ? 10 : 11, 2, 4);

    // Tail
    g.lineStyle(2, PALETTE.CAT_GREY);
    g.strokeCircle(3, 6, 4); // curved tail suggestion
  }
}
