// Inventory grid UI (Tab to open/close)
class InventoryUI {
  constructor(scene, socket, playerState) {
    this.scene = scene;
    this.socket = socket;
    this.playerState = playerState;
    this.open = false;
    this.selectedItem = null;
    this.elements = [];
    this._build();
  }

  _build() {
    const W = this.scene.scale.width;
    const H = this.scene.scale.height;
    const iW = 300, iH = 380;
    const iX = Math.round(W / 2 - iW / 2);
    const iY = Math.round(H / 2 - iH / 2);

    // Panel background
    const panel = this.scene.add.graphics();
    panel.fillStyle(PALETTE.UI_BG, 0.95);
    panel.fillRect(iX, iY, iW, iH);
    panel.lineStyle(2, PALETTE.UI_BORDER);
    panel.strokeRect(iX, iY, iW, iH);
    panel.setScrollFactor(0).setDepth(200);
    this.elements.push(panel);

    // Title
    const title = this.scene.add.text(iX + iW / 2, iY + 14, '— INVENTORY —', {
      fontSize: '14px', fontFamily: 'monospace', color: PALETTE.TEXT_GOLD
    }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(201);
    this.elements.push(title);

    const closeTip = this.scene.add.text(iX + iW / 2, iY + iH - 14, '[TAB] close', {
      fontSize: '11px', fontFamily: 'monospace', color: PALETTE.TEXT_SAND
    }).setOrigin(0.5, 1).setScrollFactor(0).setDepth(201);
    this.elements.push(closeTip);

    // Equipment slots section
    const equipLabel = this.scene.add.text(iX + 10, iY + 34, 'EQUIPPED', {
      fontSize: '11px', fontFamily: 'monospace', color: PALETTE.TEXT_SAND
    }).setScrollFactor(0).setDepth(201);
    this.elements.push(equipLabel);

    // Equipment slot positions
    const EQUIP_SLOTS = ['weapon', 'offhand', 'helmet', 'chest', 'amulet', 'ring'];
    this.equipSlots = {};
    EQUIP_SLOTS.forEach((slot, i) => {
      const sx = iX + 10 + (i % 3) * 90;
      const sy = iY + 50 + Math.floor(i / 3) * 60;
      const sg = this.scene.add.graphics();
      sg.lineStyle(1, PALETTE.GOLD);
      sg.strokeRect(sx, sy, 26, 26);
      sg.fillStyle(PALETTE.STONE_DARK, 0.8);
      sg.fillRect(sx + 1, sy + 1, 24, 24);
      sg.setScrollFactor(0).setDepth(201);
      const label = this.scene.add.text(sx + 13, sy + 28, slot.slice(0, 3).toUpperCase(), {
        fontSize: '9px', fontFamily: 'monospace', color: PALETTE.TEXT_SAND
      }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(201);
      this.elements.push(sg, label);
      this.equipSlots[slot] = { x: sx, y: sy, icon: null, bg: sg };
    });

    // Storage grid (14 slots, 7x2)
    const storLabel = this.scene.add.text(iX + 10, iY + 180, 'STORAGE', {
      fontSize: '11px', fontFamily: 'monospace', color: PALETTE.TEXT_SAND
    }).setScrollFactor(0).setDepth(201);
    this.elements.push(storLabel);

    this.storageSlots = [];
    for (let i = 0; i < 14; i++) {
      const sx = iX + 10 + (i % 7) * 40;
      const sy = iY + 196 + Math.floor(i / 7) * 40;
      const sg = this.scene.add.graphics();
      sg.lineStyle(1, PALETTE.UI_BORDER, 0.6);
      sg.strokeRect(sx, sy, 36, 36);
      sg.fillStyle(PALETTE.STONE_DARK, 0.6);
      sg.fillRect(sx + 1, sy + 1, 34, 34);
      sg.setScrollFactor(0).setDepth(201);
      sg.setInteractive(new Phaser.Geom.Rectangle(sx, sy, 36, 36), Phaser.Geom.Rectangle.Contains);
      const idx = i;
      sg.on('pointerdown', () => this._onSlotClick(idx));
      this.elements.push(sg);
      this.storageSlots.push({ x: sx, y: sy, bg: sg, icon: null });
    }

    // Tooltip
    this.tooltip = this.scene.add.text(0, 0, '', {
      fontSize: '11px', fontFamily: 'monospace', color: '#FFFFFF',
      backgroundColor: '#000000CC',
      padding: { x: 6, y: 4 },
      wordWrap: { width: 200 }
    }).setScrollFactor(0).setDepth(210).setVisible(false);
    this.elements.push(this.tooltip);

    this.setVisible(false);
  }

  _onSlotClick(idx) {
    if (!this.playerState) return;
    const item = this.playerState.inventory?.[idx];
    if (!item) return;
    const slot = item.type === 'weapon' ? 'weapon' : item.type;
    this.socket.emit('player:equip', { itemId: item.id, slot });
  }

  refresh(playerState) {
    if (!playerState || !this.open) return;
    this.playerState = playerState;

    // Clear old icons
    for (const slot of Object.values(this.equipSlots)) {
      if (slot.icon) { slot.icon.destroy(); slot.icon = null; }
    }
    for (const slot of this.storageSlots) {
      if (slot.icon) { slot.icon.destroy(); slot.icon = null; }
      if (slot.label) { slot.label.destroy(); slot.label = null; }
    }

    // Draw equipped items
    for (const [slotName, slotInfo] of Object.entries(this.equipSlots)) {
      const equipped = playerState.equipped?.[slotName];
      if (equipped) {
        const iconKey = ItemRenderer.getTextureKey(slotName);
        if (this.scene.textures.exists(iconKey)) {
          const icon = this.scene.add.image(slotInfo.x + 13, slotInfo.y + 13, iconKey)
            .setScrollFactor(0).setDepth(202);
          slotInfo.icon = icon;
        }
      }
    }

    // Draw inventory items
    const inventory = playerState.inventory || [];
    for (let i = 0; i < this.storageSlots.length && i < inventory.length; i++) {
      const item = inventory[i];
      const slot = this.storageSlots[i];
      const iconKey = ItemRenderer.getTextureKey(item.type);
      if (this.scene.textures.exists(iconKey)) {
        const icon = this.scene.add.image(slot.x + 18, slot.y + 18, iconKey)
          .setScrollFactor(0).setDepth(202).setTint(PALETTE[item.rarity?.toUpperCase()] || 0xFFFFFF);
        slot.icon = icon;
      }
      // Rarity indicator dot
      const rarColor = { common: 0xFFFFFF, uncommon: PALETTE.UNCOMMON, rare: PALETTE.RARE, legendary: PALETTE.LEGENDARY };
      const dot = this.scene.add.graphics();
      dot.fillStyle(rarColor[item.rarity] || 0xFFFFFF);
      dot.fillCircle(slot.x + 32, slot.y + 4, 3);
      dot.setScrollFactor(0).setDepth(203);
      slot.label = dot;
    }
  }

  toggle(playerState) {
    this.open = !this.open;
    this.setVisible(this.open);
    if (this.open) this.refresh(playerState);
  }

  setVisible(v) {
    for (const el of this.elements) el.setVisible(v);
    for (const slot of Object.values(this.equipSlots)) {
      if (slot.icon) slot.icon.setVisible(v);
    }
    for (const slot of this.storageSlots) {
      if (slot.icon) slot.icon.setVisible(v);
      if (slot.label) slot.label.setVisible(v);
    }
  }

  destroy() {
    for (const el of this.elements) el.destroy();
    for (const s of Object.values(this.equipSlots)) if (s.icon) s.icon.destroy();
    for (const s of this.storageSlots) {
      if (s.icon) s.icon.destroy();
      if (s.label) s.label.destroy();
    }
  }
}
