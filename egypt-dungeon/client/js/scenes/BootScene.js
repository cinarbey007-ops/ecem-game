class BootScene extends Phaser.Scene {
  constructor() { super('BootScene'); }

  preload() {
    // Nothing to preload — all assets are generated procedurally in create()
  }

  create() {
    const W = this.scale.width, H = this.scale.height;
    // Clear preload screen
    this.children.removeAll(true);

    // Background
    this.add.rectangle(W/2, H/2, W, H, 0x0A0600);
    const loadText = this.add.text(W/2, H/2, 'Generating world...', {
      fontSize: '16px', fontFamily: 'monospace', color: '#C4A265'
    }).setOrigin(0.5);

    try {
      // Generate all procedural textures
      TileRenderer.generate(this);
      CharacterRenderer.generate(this);
      EnemyRenderer.generate(this);
      ItemRenderer.generate(this);
    } catch(e) {
      loadText.setText('ERROR: ' + e.message + '\n\nCheck browser console (F12)');
      loadText.setColor('#FF4444');
      console.error('BootScene error:', e);
      return;
    }

    // Generate attack arc indicator texture
    const g = this.add.graphics();
    g.fillStyle(0xFFFFFF, 0.3);
    g.fillCircle(40, 40, 38);
    g.generateTexture('attack_arc', 80, 80);
    g.destroy();

    // Arrow projectile texture
    const ag = this.add.graphics();
    ag.fillStyle(PALETTE.STONE_LIGHT);
    ag.fillRect(0, 1, 14, 2);
    ag.fillTriangle(14, 0, 18, 2, 14, 4);
    ag.generateTexture('arrow', 18, 4);
    ag.destroy();

    // Wisp projectile
    const wg = this.add.graphics();
    wg.fillStyle(PALETTE.CURSE_GLOW, 0.9);
    wg.fillCircle(6, 6, 6);
    wg.fillStyle(0xFFFFFF, 0.5);
    wg.fillCircle(4, 4, 3);
    wg.generateTexture('wisp_bolt', 12, 12);
    wg.destroy();

    // Loot glow
    const lg = this.add.graphics();
    lg.fillStyle(PALETTE.GOLD, 0.8);
    lg.fillCircle(10, 10, 8);
    lg.fillStyle(0xFFFFFF, 0.6);
    lg.fillCircle(8, 8, 4);
    lg.generateTexture('loot_glow', 20, 20);
    lg.destroy();

    // HP bar texture (small, for above enemies)
    const hg = this.add.graphics();
    hg.fillStyle(PALETTE.HP_RED);
    hg.fillRect(0, 0, 24, 3);
    hg.generateTexture('hpbar_fill', 24, 3);
    hg.destroy();

    // Rage aura
    const rg = this.add.graphics();
    rg.lineStyle(2, PALETTE.TORCH_ORANGE, 0.7);
    rg.strokeCircle(20, 20, 18);
    rg.lineStyle(1, PALETTE.TORCH_YELLOW, 0.4);
    rg.strokeCircle(20, 20, 22);
    rg.generateTexture('rage_aura', 40, 40);
    rg.destroy();

    // Curse zone texture
    const cg = this.add.graphics();
    cg.fillStyle(PALETTE.CURSE_PURPLE, 0.3);
    cg.fillCircle(32, 32, 30);
    cg.generateTexture('curse_zone', 64, 64);
    cg.destroy();

    // Anubis shadow texture
    const asg = this.add.graphics();
    asg.fillStyle(PALETTE.ANUBIS_BLACK, 0.8);
    asg.fillEllipse(24, 24, 40, 40);
    asg.fillStyle(0xFF0000, 0.8);
    asg.fillCircle(16, 18, 5);
    asg.fillCircle(32, 18, 5);
    asg.generateTexture('anubis_shadow', 48, 48);
    asg.destroy();

    // Heart icon (for names)
    const hti = this.add.graphics();
    hti.fillStyle(0xFF4499);
    hti.fillCircle(5, 4, 4);
    hti.fillCircle(10, 4, 4);
    hti.fillTriangle(1, 6, 15, 6, 8, 14);
    hti.generateTexture('heart', 16, 16);
    hti.destroy();

    console.log('[BootScene] All textures generated, starting menu...');
    this.scene.start('MenuScene');
  }
}
