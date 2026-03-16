const Boss = require('./Boss');
const Utils = require('../../shared/utils');

// Level 3 boss: Pharaoh Khamun
class CursedPharaoh extends Boss {
  constructor(x, y) {
    super('pharaoh', x, y, 2);
    this.maxHp = 800;
    this.hp = 800;
    this.speed = 70;
    this.damage = 35;
    this.attackRange = 80;
    this.alertRange = 9999;
    this.attackCooldown = 2.5;
    this.lootType = 'boss';
    this.xp = 200;
    this.knockbackForce = 250;
    this._specialCooldown = 8;

    // Phase 2: ankh charge mechanic
    this.immune = false;
    this.ankhCharges = 0;
    this.ankhChargesNeeded = 3;
    this._immuneTimer = 0;
    this._damageWindowTimer = 0;
    this._anubisChaseTarget = null;
    this._anubisChaseTimer = 0;

    // Phase 3 curse ground
    this.curseZones = []; // {x,y,r} areas of damaging ground
  }

  update(dt, players, mapSystem) {
    if (this.dead) return;
    // Phase 2 immune mechanic
    if (this.phase >= 2) {
      if (this.immune) {
        this._immuneTimer -= dt;
        if (this._immuneTimer <= 0) {
          this.immune = false;
          this._damageWindowTimer = 15; // 15 second damage window
        }
      } else if (this._damageWindowTimer > 0) {
        this._damageWindowTimer -= dt;
        if (this._damageWindowTimer <= 0 && this.phase >= 2) {
          this.immune = true;
          this._immuneTimer = 20;
          this.ankhCharges = 0;
          this.phaseEvents.push({ type: 'boss_immune', id: this.id });
        }
      }
    }

    // Phase 3 Anubis chase
    if (this._anubisChaseTimer > 0) {
      this._anubisChaseTimer -= dt;
    }

    super.update(dt, players, mapSystem);
  }

  takeDamage(amount, kbx, kby) {
    if (this.immune) {
      this.phaseEvents.push({ type: 'boss_blocked', id: this.id });
      return { damage: 0, blocked: true };
    }
    return super.takeDamage(amount, kbx, kby);
  }

  chargeAnkh() {
    if (!this.immune) return;
    this.ankhCharges++;
    this.phaseEvents.push({ type: 'ankh_charged', charges: this.ankhCharges, needed: this.ankhChargesNeeded });
    if (this.ankhCharges >= this.ankhChargesNeeded) {
      this.immune = false;
      this._damageWindowTimer = 15;
      this.phaseEvents.push({ type: 'boss_vulnerable', id: this.id });
    }
  }

  _onPhase2() {
    this.immune = true;
    this._immuneTimer = 3; // short initial immunity then wisp spawn
    this.phaseEvents.push({ type: 'boss_phase2', bossId: this.id });
  }

  _onPhase3() {
    this.speed = 55; // slower but tankier
    this.damage = Math.round(this.damage * 2);
    // Generate curse zones
    this.curseZones = [
      { x: this.x - 100, y: this.y - 80, r: 60 },
      { x: this.x + 100, y: this.y + 80, r: 60 },
      { x: this.x - 80, y: this.y + 100, r: 50 },
      { x: this.x + 80, y: this.y - 100, r: 50 },
    ];
    this.phaseEvents.push({ type: 'boss_phase3', bossId: this.id, curseZones: this.curseZones });
  }

  _doSpecial(players, mapSystem) {
    if (this.phase >= 3) {
      // Summon Anubis chase on random player
      const alivePlayers = players.filter(p => !p.dead);
      if (alivePlayers.length > 0) {
        const target = alivePlayers[Math.floor(Math.random() * alivePlayers.length)];
        this._anubisChaseTarget = target.id;
        this._anubisChaseTimer = 8;
        this.phaseEvents.push({ type: 'anubis_call', targetId: target.id });
      }
    }
  }

  serialize() {
    const s = super.serialize();
    s.immune = this.immune;
    s.ankhCharges = this.ankhCharges;
    s.ankhChargesNeeded = this.ankhChargesNeeded;
    s.curseZones = this.curseZones;
    return s;
  }
}

module.exports = CursedPharaoh;
