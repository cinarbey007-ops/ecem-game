const Enemy = require('./Enemy');
const Utils = require('../../shared/utils');

class Scarab extends Enemy {
  constructor(x, y, floor = 0) {
    super('scarab', x, y, floor);
    this.maxHp = 20 + floor * 5;
    this.hp = this.maxHp;
    this.speed = 160;
    this.damage = 8 + floor * 2;
    this.attackRange = 25;
    this.alertRange = 240;
    this.attackCooldown = 0.8;
    this.lootType = 'scarab';
    this.xp = 5;
    this.knockbackForce = 60;

    // Scatter timer
    this._scatterTimer = 0;
    this._scatterVx = 0;
    this._scatterVy = 0;
  }

  update(dt, players, mapSystem) {
    // Scatter behavior: random dash after taking damage
    if (this._scatterTimer > 0) {
      this._scatterTimer -= dt;
      const nx = this.x + this._scatterVx * dt;
      const ny = this.y + this._scatterVy * dt;
      if (mapSystem) {
        if (!mapSystem.isSolid(nx, this.y)) this.x = nx;
        if (!mapSystem.isSolid(this.x, ny)) this.y = ny;
      } else {
        this.x = nx; this.y = ny;
      }
      return;
    }
    super.update(dt, players, mapSystem);
  }

  takeDamage(amount, kbx, kby) {
    const result = super.takeDamage(amount, kbx, kby);
    // 20% chance to scatter
    if (result && !result.died && Math.random() < 0.2) {
      this._scatterTimer = 0.4;
      const angle = Math.random() * Math.PI * 2;
      this._scatterVx = Math.cos(angle) * 200;
      this._scatterVy = Math.sin(angle) * 200;
    }
    return result;
  }

  _getWindupTime() { return 0.2; }
}

module.exports = Scarab;
