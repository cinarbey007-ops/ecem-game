class MenuScene extends Phaser.Scene {
  constructor() { super('MenuScene'); }

  create() {
    const W = this.scale.width, H = this.scale.height;

    // Background gradient — dark top, warm brown bottom
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x0A0600, 0x0A0600, 0x2A1200, 0x2A1200, 1);
    bg.fillRect(0, 0, W, H);

    // Sand dune at bottom
    const dune = this.add.graphics();
    dune.fillStyle(0x4A2E10, 0.6);
    dune.fillEllipse(W * 0.2, H + 10, W * 0.7, 80);
    dune.fillEllipse(W * 0.7, H + 5, W * 0.8, 70);
    dune.fillStyle(0x3A2008, 0.4);
    dune.fillRect(0, H - 18, W, 18);

    // Sand particles
    for (let i = 0; i < 40; i++) {
      const g = this.add.graphics();
      g.fillStyle(PALETTE.SAND_MID, 0.25 + Math.random() * 0.3);
      g.fillCircle(0, 0, 1 + Math.random() * 2);
      g.x = Math.random() * W;
      g.y = H - 5 - Math.random() * 30;
    }

    // Decorative top border
    const topBorder = this.add.graphics();
    topBorder.lineStyle(1, PALETTE.WARRIOR_GOLD, 0.4);
    topBorder.lineBetween(40, 130, W - 40, 130);
    topBorder.fillStyle(PALETTE.WARRIOR_GOLD, 0.4);
    topBorder.fillRect(40, 129, W - 80, 2);
    // Corner diamonds
    topBorder.fillTriangle(36, 131, 44, 131, 40, 126);
    topBorder.fillTriangle(36, 131, 44, 131, 40, 136);
    topBorder.fillTriangle(W - 44, 131, W - 36, 131, W - 40, 126);
    topBorder.fillTriangle(W - 44, 131, W - 36, 131, W - 40, 136);

    // Title
    const titleText = this.add.text(W / 2, 52, 'TOMB OF KHAMUN', {
      fontSize: '38px',
      fontFamily: 'monospace',
      color: PALETTE.TEXT_GOLD,
      stroke: '#1A0A00',
      strokeThickness: 6,
      letterSpacing: 6
    }).setOrigin(0.5);

    // Subtitle
    this.add.text(W / 2, 100, '♥   A Co-op Adventure for Cinar & Ecem   ♥', {
      fontSize: '13px', fontFamily: 'monospace', color: PALETTE.TEXT_SAND,
      alpha: 0.9
    }).setOrigin(0.5);

    // Character cards — perfectly centered
    const cardW = 170, cardH = 210;
    const gap = 20;
    const totalW = cardW * 2 + gap;
    const startX = W / 2 - totalW / 2;
    this._drawCharacterCard(startX, 148, 'warrior', cardW, cardH);
    this._drawCharacterCard(startX + cardW + gap, 148, 'archer', cardW, cardH);

    // Divider before controls
    const div = this.add.graphics();
    div.lineStyle(1, PALETTE.WARRIOR_GOLD, 0.25);
    div.lineBetween(W / 2 - 160, 376, W / 2 + 160, 376);

    // Controls — 2 columns to fit neatly
    const col1 = ['WASD — Move', 'LMB / SPACE — Attack', 'E — Special', 'R — Ultimate'];
    const col2 = ['SHIFT — Dodge', 'TAB — Inventory', 'ENTER — Dialogue', ''];

    this.add.text(W / 2, 388, '— CONTROLS —', {
      fontSize: '11px', fontFamily: 'monospace', color: PALETTE.WARRIOR_GOLD, alpha: 0.8
    }).setOrigin(0.5);

    col1.forEach((c, i) => {
      this.add.text(W / 2 - 20, 406 + i * 15, c, {
        fontSize: '11px', fontFamily: 'monospace', color: PALETTE.TEXT_SAND, alpha: 0.75
      }).setOrigin(1, 0);
    });

    col2.forEach((c, i) => {
      if (!c) return;
      this.add.text(W / 2 + 20, 406 + i * 15, c, {
        fontSize: '11px', fontFamily: 'monospace', color: PALETTE.TEXT_SAND, alpha: 0.75
      }).setOrigin(0, 0);
    });

    // Status text at the very bottom — clear area
    const statusBg = this.add.graphics();
    statusBg.fillStyle(0x000000, 0.45);
    statusBg.fillRect(0, H - 34, W, 34);

    this.statusText = this.add.text(W / 2, H - 16, 'Connecting to server...', {
      fontSize: '12px', fontFamily: 'monospace', color: PALETTE.TEXT_SAND
    }).setOrigin(0.5);

    this._setupSocket();

    // Pulse title
    this.tweens.add({
      targets: titleText,
      alpha: { from: 0.85, to: 1 },
      duration: 1800,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1
    });
  }

  _drawCharacterCard(x, y, cls, W, H) {
    const isWarrior = cls === 'warrior';
    const borderColor = isWarrior ? PALETTE.WARRIOR_GOLD : PALETTE.ARCHER_TEAL;
    const nameColor = isWarrior ? '#FFD700' : '#2DD4BF';

    // Card background
    const g = this.add.graphics();
    g.fillStyle(0x0E0700, 0.92);
    g.fillRect(x, y, W, H);

    // Glowing border (double line for thickness)
    g.lineStyle(3, borderColor, 0.9);
    g.strokeRect(x + 1, y + 1, W - 2, H - 2);
    g.lineStyle(1, borderColor, 0.3);
    g.strokeRect(x + 5, y + 5, W - 10, H - 10);

    // Corner accents
    const cs = 8; // corner size
    g.lineStyle(2, borderColor, 1);
    // top-left
    g.lineBetween(x, y + cs, x, y); g.lineBetween(x, y, x + cs, y);
    // top-right
    g.lineBetween(x + W - cs, y, x + W, y); g.lineBetween(x + W, y, x + W, y + cs);
    // bottom-left
    g.lineBetween(x, y + H - cs, x, y + H); g.lineBetween(x, y + H, x + cs, y + H);
    // bottom-right
    g.lineBetween(x + W - cs, y + H, x + W, y + H); g.lineBetween(x + W, y + H, x + W, y + H - cs);

    // Sprite
    const sprKey = `${cls}_idle`;
    if (this.textures.exists(sprKey)) {
      this.add.image(x + W / 2, y + 42, sprKey).setScale(2.5);
    }

    // Heart icon top-right
    if (this.textures.exists('heart')) {
      this.add.image(x + W - 14, y + 12, 'heart').setScale(0.85);
    }

    // Name
    const name = isWarrior ? 'CINAR' : 'ECEM';
    this.add.text(x + W / 2, y + 88, `♥  ${name}`, {
      fontSize: '17px', fontFamily: 'monospace',
      color: nameColor,
      stroke: '#000', strokeThickness: 3
    }).setOrigin(0.5);

    // Role
    const role = isWarrior ? 'Player 1  •  Warrior' : 'Player 2  •  Archer';
    this.add.text(x + W / 2, y + 108, role, {
      fontSize: '10px', fontFamily: 'monospace', color: PALETTE.TEXT_SAND, alpha: 0.7
    }).setOrigin(0.5);

    // Separator
    g.lineStyle(1, borderColor, 0.3);
    g.lineBetween(x + 14, y + 120, x + W - 14, y + 120);

    // Stats
    const desc = isWarrior
      ? ['HP: 120', 'Melee Combat', 'Khopesh Sweep', 'AOE Sand Slam', 'Rage Ultimate']
      : ['HP: 90', 'Ranged Combat', 'Arrow Storm', 'Spread Shot', 'Eye of Ra'];

    desc.forEach((line, i) => {
      const isFirst = i === 0;
      this.add.text(x + W / 2, y + 131 + i * 16, line, {
        fontSize: '11px', fontFamily: 'monospace',
        color: isFirst ? nameColor : PALETTE.TEXT_SAND,
        alpha: isFirst ? 1 : 0.85
      }).setOrigin(0.5);
    });
  }

  _setupSocket() {
    if (!window.gameSocket) {
      window.gameSocket = io();
    }
    this._bindSocketEvents();
  }

  _bindSocketEvents() {
    const socket = window.gameSocket;

    socket.on('connect', () => {
      this.statusText?.setText('Connected!  Waiting for partner to join...');
    });

    socket.on('lobby:waiting', (data) => {
      this.statusText?.setText(`Waiting for Ecem to connect...   You are ${data.playerName} (${data.className})`);
    });

    socket.on('room:joined', (data) => {
      window.myPlayerId = data.playerId;
      window.myPlayerIndex = data.playerIndex;
      window.myClass = data.className;
      this.statusText?.setText(`${data.playerName} joined!  Starting adventure...`);
      this.time.delayedCall(500, () => {
        Sound.init();
        this.scene.start('LobbyScene');
      });
    });

    socket.on('disconnect', () => {
      this.statusText?.setText('Disconnected.  Reload page to reconnect.');
    });
  }
}
