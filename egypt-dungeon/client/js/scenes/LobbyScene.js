class LobbyScene extends Phaser.Scene {
  constructor() { super('LobbyScene'); }

  create() {
    const W = this.scale.width, H = this.scale.height;

    this.add.rectangle(W/2, H/2, W, H, 0x0A0600);
    this.add.text(W/2, H/2 - 40, 'TOMB OF KHAMUN', {
      fontSize: '28px', fontFamily: 'monospace', color: PALETTE.TEXT_GOLD
    }).setOrigin(0.5);

    this.add.text(W/2, H/2, '♥  Cinar & Ecem — Together  ♥', {
      fontSize: '18px', fontFamily: 'monospace', color: PALETTE.TEXT_SAND
    }).setOrigin(0.5);

    this.statusText = this.add.text(W/2, H/2 + 50, 'Preparing the tomb...', {
      fontSize: '14px', fontFamily: 'monospace', color: PALETTE.TEXT_SAND
    }).setOrigin(0.5);

    // Dot animation
    let dots = 0;
    this.time.addEvent({
      delay: 400, repeat: -1, callback: () => {
        dots = (dots + 1) % 4;
        this.statusText?.setText('Preparing the tomb' + '.'.repeat(dots));
      }
    });

    const socket = window.gameSocket;
    if (!socket) return;

    socket.on('level:start', (data) => {
      window.currentLevelData = data;
      this.scene.start('GameScene');
    });

    socket.on('dialogue:start', (data) => {
      window.currentDialogue = data;
      window.currentLevelData = window.currentLevelData || {};
      this.scene.start('GameScene');
    });
  }
}
