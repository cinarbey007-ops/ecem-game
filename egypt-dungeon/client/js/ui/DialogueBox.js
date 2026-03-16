// Typewriter dialogue box UI
class DialogueBox {
  constructor(scene) {
    this.scene = scene;
    this.visible = false;
    this._typeTimer = 0;
    this._charIndex = 0;
    this._fullText = '';
    this._currentLine = null;

    const W = scene.scale.width;
    const H = scene.scale.height;
    const boxH = 110;
    const boxY = H - boxH - 10;

    // Background
    this.bg = scene.add.graphics();
    this.bg.fillStyle(PALETTE.UI_BG, 0.92);
    this.bg.fillRect(10, boxY, W - 20, boxH);
    this.bg.lineStyle(2, PALETTE.UI_BORDER);
    this.bg.strokeRect(10, boxY, W - 20, boxH);
    this.bg.setScrollFactor(0).setDepth(100);

    // Gold border decoration
    this.deco = scene.add.graphics();
    this.deco.fillStyle(PALETTE.GOLD);
    this.deco.fillRect(14, boxY + 4, W - 28, 2);
    this.deco.fillRect(14, boxY + boxH - 6, W - 28, 2);
    this.deco.setScrollFactor(0).setDepth(101);

    // Speaker name
    this.speakerText = scene.add.text(24, boxY + 12, '', {
      fontSize: '14px', fontFamily: 'monospace', color: PALETTE.TEXT_GOLD,
      stroke: '#000', strokeThickness: 2
    }).setScrollFactor(0).setDepth(101);

    // Dialogue text
    this.dialogueText = scene.add.text(24, boxY + 34, '', {
      fontSize: '15px', fontFamily: 'monospace', color: PALETTE.TEXT_SAND,
      wordWrap: { width: W - 60 }, lineSpacing: 4
    }).setScrollFactor(0).setDepth(101);

    // Continue prompt
    this.prompt = scene.add.text(W - 30, boxY + boxH - 20, '▶ ENTER/SPACE', {
      fontSize: '11px', fontFamily: 'monospace', color: PALETTE.TEXT_GOLD
    }).setOrigin(1, 1).setScrollFactor(0).setDepth(101);

    this.setVisible(false);
  }

  show(line) {
    this._currentLine = line;
    this._fullText = line.text || '';
    this._charIndex = 0;
    this._typeTimer = 0;
    this.visible = true;
    this.setVisible(true);

    const speaker = line.speaker || '';
    this.speakerText.setText(speaker ? `— ${speaker} —` : '');
    this.dialogueText.setText('');
    this.prompt.setVisible(false);
  }

  update(dt) {
    if (!this.visible || this._charIndex >= this._fullText.length) {
      if (this.visible && this._charIndex >= this._fullText.length) {
        this.prompt.setVisible(true);
        // Blink prompt
        this.prompt.alpha = 0.5 + Math.abs(Math.sin(Date.now() / 400)) * 0.5;
      }
      return;
    }
    this._typeTimer += dt;
    const charsPerSec = 40;
    while (this._typeTimer >= 1 / charsPerSec && this._charIndex < this._fullText.length) {
      this._charIndex++;
      this._typeTimer -= 1 / charsPerSec;
    }
    this.dialogueText.setText(this._fullText.slice(0, this._charIndex));
  }

  skipToEnd() {
    this._charIndex = this._fullText.length;
    this.dialogueText.setText(this._fullText);
    this.prompt.setVisible(true);
  }

  isComplete() {
    return this._charIndex >= this._fullText.length;
  }

  setVisible(v) {
    this.bg.setVisible(v);
    this.deco.setVisible(v);
    this.speakerText.setVisible(v);
    this.dialogueText.setVisible(v);
    this.prompt.setVisible(v && this.isComplete());
  }

  hide() {
    this.visible = false;
    this.setVisible(false);
  }

  destroy() {
    this.bg.destroy();
    this.deco.destroy();
    this.speakerText.destroy();
    this.dialogueText.destroy();
    this.prompt.destroy();
  }
}
