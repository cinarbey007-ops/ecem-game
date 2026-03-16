// Shows loot pickup notifications
class LootPopup {
  constructor(scene) {
    this.scene = scene;
    this.queue = [];
    this.active = null;
    this.timer = 0;
  }

  show(item) {
    this.queue.push(item);
  }

  update(dt) {
    if (this.active) {
      this.timer -= dt;
      if (this.timer <= 0) {
        this.active.bg.destroy();
        this.active.text.destroy();
        if (this.active.icon) this.active.icon.destroy();
        this.active = null;
      } else {
        // Fade out in last 0.3s
        if (this.timer < 0.3) {
          const a = this.timer / 0.3;
          this.active.bg.alpha = a;
          this.active.text.alpha = a;
          if (this.active.icon) this.active.icon.alpha = a;
        }
      }
    }

    if (!this.active && this.queue.length > 0) {
      this._display(this.queue.shift());
    }
  }

  _display(item) {
    const W = this.scene.scale.width;
    const x = W - 210;
    const y = 80;

    const rarColor = { common: PALETTE.COMMON, uncommon: PALETTE.UNCOMMON, rare: PALETTE.RARE, legendary: PALETTE.LEGENDARY };
    const color = rarColor[item.rarity] || PALETTE.COMMON;

    const bg = this.scene.add.graphics();
    bg.fillStyle(PALETTE.UI_BG, 0.85);
    bg.fillRect(x, y, 200, 40);
    bg.lineStyle(2, color);
    bg.strokeRect(x, y, 200, 40);
    bg.setScrollFactor(0).setDepth(150);

    const iconKey = ItemRenderer.getTextureKey(item.type);
    let icon = null;
    if (this.scene.textures.exists(iconKey)) {
      icon = this.scene.add.image(x + 20, y + 20, iconKey).setScrollFactor(0).setDepth(151).setScale(0.8);
    }

    const rarText = item.rarity === 'legendary' ? '★ ' : '';
    const text = this.scene.add.text(x + 36, y + 8, `${rarText}${item.name}\n${item.rarity?.toUpperCase()}`, {
      fontSize: '11px', fontFamily: 'monospace',
      color: PALETTE.RARITY_COLOR?.[item.rarity] || '#FFFFFF',
      lineSpacing: 2
    }).setScrollFactor(0).setDepth(151);

    this.active = { bg, text, icon };
    this.timer = 2.5;
  }

  destroy() {
    if (this.active) {
      this.active.bg.destroy();
      this.active.text.destroy();
      if (this.active.icon) this.active.icon.destroy();
    }
  }
}
