// Main Phaser game configuration
const config = {
  type: Phaser.AUTO,
  width: 960,
  height: 600,
  backgroundColor: '#0A0600',
  parent: 'game-container',
  scene: [
    BootScene,
    MenuScene,
    LobbyScene,
    GameScene,
    GameOverScene
  ],
  render: {
    pixelArt: true,
    antialias: false
  },
  autoFocus: true
};

const game = new Phaser.Game(config);

// Global socket (created in MenuScene)
window.gameSocket = null;
window.myPlayerId = null;
window.myPlayerIndex = 0;
window.myClass = 'warrior';
