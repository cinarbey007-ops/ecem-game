// Top-corner minimap
class Minimap {
  constructor(scene) {
    this.scene = scene;
    this.mapData = null;
    this.g = scene.add.graphics();
    this.g.setScrollFactor(0).setDepth(120);
    this.playerDots = [];
    this.scale = 0.04; // world pixels to minimap pixels
    this.ox = scene.scale.width - 110; // top right corner
    this.oy = 10;
    this.mW = 100;
    this.mH = 80;
  }

  setMap(mapData) {
    this.mapData = mapData;
    this._drawBase();
  }

  _drawBase() {
    if (!this.mapData) return;
    this.g.clear();

    // Background
    this.g.fillStyle(PALETTE.UI_BG, 0.8);
    this.g.fillRect(this.ox - 2, this.oy - 2, this.mW + 4, this.mH + 4);
    this.g.lineStyle(1, PALETTE.UI_BORDER);
    this.g.strokeRect(this.ox - 2, this.oy - 2, this.mW + 4, this.mH + 4);

    // Draw rooms
    for (const room of this.mapData.rooms) {
      const rx = this.ox + room.tileOffX * 32 * this.scale;
      const ry = this.oy + room.tileOffY * 32 * this.scale;
      const rw = room.w * 32 * this.scale;
      const rh = room.h * 32 * this.scale;

      const fillColor = room.cleared ? PALETTE.SAND_MID : PALETTE.STONE_DARK;
      this.g.fillStyle(fillColor, room.cleared ? 0.8 : 0.4);
      this.g.fillRect(rx, ry, rw, rh);
      this.g.lineStyle(0.5, PALETTE.UI_BORDER, 0.5);
      this.g.strokeRect(rx, ry, rw, rh);
    }
  }

  update(players) {
    // Redraw base then player dots
    this._drawBase();

    for (const player of players) {
      if (player.dead) continue;
      const px = this.ox + player.x * this.scale;
      const py = this.oy + player.y * this.scale;
      const color = player.class === 'warrior' ? PALETTE.WARRIOR_GOLD : PALETTE.ARCHER_TEAL;
      this.g.fillStyle(color);
      this.g.fillCircle(px, py, 3);
      this.g.lineStyle(1, 0xFFFFFF);
      this.g.strokeCircle(px, py, 3);
    }
  }

  destroy() {
    this.g.destroy();
  }
}
