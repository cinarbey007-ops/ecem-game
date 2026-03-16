class GameOverScene extends Phaser.Scene {
  constructor() { super('GameOverScene'); }

  init(data) {
    this.victory = data.victory;
    this.stats = data.stats || [];
  }

  create() {
    const W = this.scale.width, H = this.scale.height;
    Sound.stopBGM();

    const bg = this.add.graphics();
    bg.fillGradientStyle(0x000000, 0x000000, this.victory ? 0x1A1400 : 0x0A0000, this.victory ? 0x1A1400 : 0x0A0000, 1);
    bg.fillRect(0, 0, W, H);

    if (this.victory) {
      // Victory screen
      this.add.text(W/2, 60, '♥ VICTORY ♥', {
        fontSize: '40px', fontFamily: 'monospace', color: PALETTE.TEXT_GOLD,
        stroke: '#000', strokeThickness: 4
      }).setOrigin(0.5);

      this.add.text(W/2, 110, 'The Pharaoh\'s curse is broken.', {
        fontSize: '16px', fontFamily: 'monospace', color: PALETTE.TEXT_SAND
      }).setOrigin(0.5);

      this.add.text(W/2, 140, 'Made with love for Cinar & Ecem ♥', {
        fontSize: '14px', fontFamily: 'monospace', color: '#FF4499'
      }).setOrigin(0.5);

      // Gold star burst
      const starG = this.add.graphics();
      starG.lineStyle(2, PALETTE.GOLD, 0.7);
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        starG.strokeLineShape(new Phaser.Geom.Line(W/2, 80, W/2 + Math.cos(angle) * 60, 80 + Math.sin(angle) * 60));
      }
      this.tweens.add({ targets: starG, angle: 360, duration: 8000, repeat: -1 });

    } else {
      // Game over
      this.add.text(W/2, 80, 'GAME OVER', {
        fontSize: '40px', fontFamily: 'monospace', color: PALETTE.TEXT_RED,
        stroke: '#000', strokeThickness: 4
      }).setOrigin(0.5);

      this.add.text(W/2, 130, 'The tomb claims you...', {
        fontSize: '16px', fontFamily: 'monospace', color: PALETTE.TEXT_SAND
      }).setOrigin(0.5);

      this.add.text(W/2, 158, 'But your story is not over.', {
        fontSize: '14px', fontFamily: 'monospace', color: PALETTE.TEXT_SAND
      }).setOrigin(0.5);
    }

    // Stats panel
    const panelY = this.victory ? 200 : 210;
    this.add.text(W/2, panelY, '— STATS —', {
      fontSize: '14px', fontFamily: 'monospace', color: PALETTE.TEXT_GOLD
    }).setOrigin(0.5);

    this.stats.forEach((stat, i) => {
      const y = panelY + 24 + i * 36;
      const color = i === 0 ? PALETTE.TEXT_GOLD : '#0D9488';
      const icon = i === 0 ? '⚔' : '🏹';
      this.add.text(W/2 - 100, y, `♥ ${stat.name}`, {
        fontSize: '14px', fontFamily: 'monospace', color
      }).setOrigin(0, 0.5);
      this.add.text(W/2 + 20, y, `Lv.${stat.level}   ${stat.kills} kills`, {
        fontSize: '12px', fontFamily: 'monospace', color: PALETTE.TEXT_SAND
      }).setOrigin(0, 0.5);
    });

    // Play again button
    const btnY = panelY + 120;
    const btn = this.add.graphics();
    btn.fillStyle(PALETTE.UI_BG, 0.9);
    btn.fillRect(W/2 - 80, btnY, 160, 36);
    btn.lineStyle(2, PALETTE.GOLD);
    btn.strokeRect(W/2 - 80, btnY, 160, 36);
    btn.setInteractive(new Phaser.Geom.Rectangle(W/2 - 80, btnY, 160, 36), Phaser.Geom.Rectangle.Contains);

    this.add.text(W/2, btnY + 18, 'PLAY AGAIN', {
      fontSize: '16px', fontFamily: 'monospace', color: PALETTE.TEXT_GOLD
    }).setOrigin(0.5);

    btn.on('pointerdown', () => {
      window.location.reload();
    });

    // Fade in
    this.cameras.main.fadeIn(600);
  }
}
