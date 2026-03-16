const Enemy = require('./Enemy');
const Utils = require('../../shared/utils');

class AnubisGuard extends Enemy {
  constructor(x, y, floor = 0) {
    super('anubis', x, y, floor);
    this.maxHp = 100 + floor * 30;
    this.hp = this.maxHp;
    this.speed = 90;
    this.damage = 20 + floor * 5;
    this.attackRange = 90;
    this.alertRange = 220;
    this.attackCooldown = 2.0;
    this.lootType = 'anubis';
    this.xp = 30;
    this.knockbackForce = 180;
    this.phase = 1;

    // Patrol waypoints (set by WaveSystem)
    this.patrolPoints = [];
  }

  update(dt, players, mapSystem) {
    // Phase 2 transition
    if (this.phase === 1 && this.hp < this.maxHp * 0.5) {
      this.phase = 2;
      this.speed = 120;
      this.damage = Math.round(this.damage * 1.3);
    }
    super.update(dt, players, mapSystem);
  }

  takeDamage(amount, kbx, kby) {
    // Shield: 30% damage reduction from front
    // (simplified: 30% reduction always in phase 1)
    let reducedAmount = this.phase === 1 ? Math.round(amount * 0.7) : amount;
    return super.takeDamage(reducedAmount, kbx, kby);
  }

  _getWindupTime() { return 0.8; }
}

module.exports = AnubisGuard;
