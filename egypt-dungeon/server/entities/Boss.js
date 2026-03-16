const Enemy = require('./Enemy');
const Utils = require('../../shared/utils');

// Base boss class with phase system
class Boss extends Enemy {
  constructor(type, x, y, floor = 0) {
    super(type, x, y, floor);
    this.isBoss = true;
    this.phase = 1;
    this.maxPhase = 3;
    this.phaseEvents = []; // emitted to game room
    this._phaseTransitioned = {};
    this._specialTimer = 0;
    this._specialCooldown = 6;
  }

  update(dt, players, mapSystem) {
    if (this.dead) return;
    this._specialTimer -= dt;
    this._checkPhaseTransition();
    super.update(dt, players, mapSystem);
    if (this._specialTimer <= 0) {
      this._specialTimer = this._specialCooldown;
      this._doSpecial(players, mapSystem);
    }
  }

  _checkPhaseTransition() {
    const pct = this.hp / this.maxHp;
    if (this.phase === 1 && pct < 0.66 && !this._phaseTransitioned[2]) {
      this._phaseTransitioned[2] = true;
      this.phase = 2;
      this._onPhase2();
    }
    if (this.phase === 2 && pct < 0.33 && !this._phaseTransitioned[3]) {
      this._phaseTransitioned[3] = true;
      this.phase = 3;
      this._onPhase3();
    }
  }

  _onPhase2() {}
  _onPhase3() {}
  _doSpecial(players, mapSystem) {}

  serialize() {
    const s = super.serialize();
    s.isBoss = true;
    return s;
  }
}

module.exports = Boss;
