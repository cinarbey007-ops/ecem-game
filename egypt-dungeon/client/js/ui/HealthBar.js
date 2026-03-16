// Reusable health bar UI component
class HealthBar {
  constructor(scene, x, y, width = 80, height = 8) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.bg = scene.add.graphics();
    this.bar = scene.add.graphics();
    this.stamBar = null;
    this.setScrollFactor(0);
  }

  setScrollFactor(f) {
    this.bg.setScrollFactor(f);
    this.bar.setScrollFactor(f);
    return this;
  }

  setDepth(d) {
    this.bg.setDepth(d);
    this.bar.setDepth(d);
    return this;
  }

  addStaminaBar() {
    this.stamBar = this.scene.add.graphics();
    this.stamBar.setScrollFactor(0);
    return this;
  }

  update(hp, maxHp, stamina, maxStamina, x, y) {
    if (x !== undefined) { this.x = x; this.y = y; }
    const pct = Math.max(0, Math.min(1, hp / maxHp));

    // Background
    this.bg.clear();
    this.bg.fillStyle(0x000000, 0.6);
    this.bg.fillRect(this.x - 1, this.y - 1, this.width + 2, this.height + 2);

    // HP bar
    this.bar.clear();
    const color = pct > 0.5 ? PALETTE.HP_GREEN : pct > 0.25 ? 0xFFAA00 : PALETTE.HP_RED;
    this.bar.fillStyle(color);
    this.bar.fillRect(this.x, this.y, Math.round(this.width * pct), this.height);

    // Stamina bar
    if (this.stamBar && stamina !== undefined) {
      const sPct = Math.max(0, Math.min(1, stamina / maxStamina));
      this.stamBar.clear();
      this.stamBar.fillStyle(0x000000, 0.5);
      this.stamBar.fillRect(this.x - 1, this.y + this.height + 2, this.width + 2, 4);
      this.stamBar.fillStyle(PALETTE.STAMINA_BLUE);
      this.stamBar.fillRect(this.x, this.y + this.height + 3, Math.round(this.width * sPct), 3);
    }
  }

  destroy() {
    this.bg.destroy();
    this.bar.destroy();
    if (this.stamBar) this.stamBar.destroy();
  }
}
