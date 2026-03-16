const Enemy = require('./Enemy');
const Utils = require('../../shared/utils');

class Mummy extends Enemy {
  constructor(x, y, floor = 0) {
    super('mummy', x, y, floor);
    this.maxHp = 60 + floor * 20;
    this.hp = this.maxHp;
    this.speed = 70;
    this.damage = 12 + floor * 3;
    this.attackRange = 45;
    this.alertRange = 200;
    this.attackCooldown = 1.8;
    this.lootType = 'mummy';
    this.xp = 15;
    this.knockbackForce = 100;

    // Mummy-specific: bandage grab
    this._grabTimer = 0;
    this._grabTarget = null;
  }

  update(dt, players, mapSystem) {
    super.update(dt, players, mapSystem);

    // Bandage grab: if adjacent for 0.5s, slow player
    if (this.state === 'chasing' || this.state === 'attacking') {
      const nearby = players.find(p => !p.dead && Utils.distance(this.x, this.y, p.x, p.y) < 30);
      if (nearby) {
        this._grabTimer += dt;
        if (this._grabTimer >= 0.5 && this._grabTarget !== nearby.id) {
          this._grabTarget = nearby.id;
          nearby.slowTimer = 2;
          nearby.slowAmount = 0.4;
        }
      } else {
        this._grabTimer = 0;
        this._grabTarget = null;
      }
    }
  }

  _getWindupTime() { return 0.7; }
}

module.exports = Mummy;
