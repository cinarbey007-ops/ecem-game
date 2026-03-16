const Mummy = require('../entities/Mummy');
const Scarab = require('../entities/Scarab');
const AnubisGuard = require('../entities/AnubisGuard');
const Boss = require('../entities/Boss');
const CursedPharaoh = require('../entities/CursedPharaoh');
const Enemy = require('../entities/Enemy');
const Utils = require('../../shared/utils');

// Wisp enemy (simple flying, phase-through)
class Wisp extends Enemy {
  constructor(x, y, floor) {
    super('wisp', x, y, floor);
    this.maxHp = 40 + floor * 10;
    this.hp = this.maxHp;
    this.speed = 110;
    this.damage = 12 + floor * 3;
    this.attackRange = 250;
    this.alertRange = 999;
    this.attackCooldown = 2.5;
    this.lootType = 'wisp';
    this.xp = 20;
    this.knockbackForce = 0;
    this._shootTimer = 0;
    this._shootCooldown = 2.5;
  }
  // Wisps ignore walls and shoot projectiles (handled by CombatSystem via events)
  update(dt, players, mapSystem) {
    this._shootTimer -= dt;
    // Move toward nearest player ignoring walls
    if (this.state !== 'dead') {
      const nearest = players.filter(p => !p.dead).sort((a, b) =>
        Utils.distanceSq(this.x, this.y, a.x, a.y) - Utils.distanceSq(this.x, this.y, b.x, b.y))[0];
      if (nearest) {
        const dir = Utils.normalize(nearest.x - this.x, nearest.y - this.y);
        this.facing = Math.atan2(dir.y, dir.x);
        this.x += dir.x * this.speed * dt;
        this.y += dir.y * this.speed * dt;
        if (this._shootTimer <= 0 && Utils.distance(this.x, this.y, nearest.x, nearest.y) < this.attackRange) {
          this._shootTimer = this._shootCooldown;
          // Signal to emit wisp projectile via phaseEvents
          this.phaseEvents = this.phaseEvents || [];
          this.phaseEvents.push({ type: 'wisp_shoot', id: this.id, targetId: nearest.id, x: this.x, y: this.y, tx: nearest.x, ty: nearest.y });
        }
      }
    }
    // Knockback decay
    this.vx *= 0.9; this.vy *= 0.9;
    if (this._attackCooldownLeft > 0) this._attackCooldownLeft -= dt;
    if (this.invincibleTimer > 0) this.invincibleTimer -= dt;
  }
}

// Reanimated Statue enemy
class Statue extends Enemy {
  constructor(x, y, floor) {
    super('statue', x, y, floor);
    this.maxHp = 150 + floor * 30;
    this.hp = this.maxHp;
    this.speed = 50;
    this.damage = 40 + floor * 8;
    this.attackRange = 55;
    this.alertRange = 150;
    this.attackCooldown = 2.2;
    this.lootType = 'statue';
    this.xp = 35;
    this.knockbackForce = 200;
  }
  takeDamage(amount, kbx, kby) {
    // Immune from front (simplified: 80% reduction always)
    return super.takeDamage(Math.round(amount * 0.2), kbx, kby);
  }
}

// Gatekeeper boss (level 1)
class Gatekeeper extends Boss {
  constructor(x, y) {
    super('gatekeeper', x, y, 0);
    this.maxHp = 400;
    this.hp = 400;
    this.speed = 65;
    this.damage = 22;
    this.attackRange = 60;
    this.alertRange = 9999;
    this.attackCooldown = 2.0;
    this.lootType = 'boss';
    this.xp = 100;
    this.knockbackForce = 200;
    this._specialCooldown = 10;
    this._chargeTarget = null;
    this._chargeTimer = 0;
    this._chargeActive = false;
    this._chargeVx = 0;
    this._chargeVy = 0;
  }
  _onPhase2() {
    this.speed = 90;
    this.phaseEvents.push({ type: 'boss_phase2', bossId: this.id });
  }
  _onPhase3() {
    this.phaseEvents.push({ type: 'boss_phase3', bossId: this.id });
  }
  _doSpecial(players, mapSystem) {
    const alive = players.filter(p => !p.dead);
    if (alive.length === 0) return;
    if (this.phase >= 2) {
      // Charge attack
      const t = alive[Math.floor(Math.random() * alive.length)];
      const dir = Utils.normalize(t.x - this.x, t.y - this.y);
      this._chargeTarget = t.id;
      this._chargeActive = true;
      this._chargeTimer = 0.8;
      this._chargeVx = dir.x * 350;
      this._chargeVy = dir.y * 350;
      this.phaseEvents.push({ type: 'boss_charge', bossId: this.id, facing: Math.atan2(dir.y, dir.x) });
    }
    if (this.phase === 3) {
      this.phaseEvents.push({ type: 'spawn_scarabs', count: 3, x: this.x, y: this.y });
    }
  }
  update(dt, players, mapSystem) {
    if (this._chargeActive) {
      this._chargeTimer -= dt;
      const nx = this.x + this._chargeVx * dt;
      const ny = this.y + this._chargeVy * dt;
      if (mapSystem) {
        if (!mapSystem.isSolid(nx, this.y)) this.x = nx; else this._chargeActive = false;
        if (!mapSystem.isSolid(this.x, ny)) this.y = ny; else this._chargeActive = false;
      } else { this.x = nx; this.y = ny; }
      if (this._chargeTimer <= 0) this._chargeActive = false;
    }
    super.update(dt, players, mapSystem);
  }
}

// Nephthys Shade boss (level 2)
class NephthysShade extends Boss {
  constructor(x, y) {
    super('shade', x, y, 1);
    this.maxHp = 550;
    this.hp = 550;
    this.speed = 110;
    this.damage = 28;
    this.attackRange = 70;
    this.alertRange = 9999;
    this.attackCooldown = 2.2;
    this.lootType = 'boss';
    this.xp = 150;
    this.knockbackForce = 220;
    this._specialCooldown = 8;
    this._teleportTimer = 8;
    this._isClone = false;
    this._realShadeId = null;
    this.cloneId = null;
  }
  _onPhase2() {
    this.phaseEvents.push({ type: 'shade_clone', bossId: this.id });
  }
  _onPhase3() {
    this.phaseEvents.push({ type: 'shade_storm', bossId: this.id });
  }
  _doSpecial(players, mapSystem) {
    this._teleportTimer = 8;
    if (mapSystem && players.length > 0) {
      // Teleport to random open spot near room center
      this.phaseEvents.push({ type: 'shade_teleport', bossId: this.id, x: this.x, y: this.y });
    }
  }
  update(dt, players, mapSystem) {
    this._teleportTimer -= dt;
    if (this._teleportTimer <= 0) {
      this._doSpecial(players, mapSystem);
      // Move to random location
      this.x += Utils.randFloat(-100, 100);
      this.y += Utils.randFloat(-50, 50);
    }
    super.update(dt, players, mapSystem);
  }
}

class WaveSystem {
  constructor(levelIndex, mapSystem) {
    this.levelIndex = levelIndex;
    this.mapSystem = mapSystem;
    this.enemies = [];
    this.currentRoomIndex = 0;
    this.waveComplete = false;
    this.levelComplete = false;
    this.bossSpawned = false;
    this._roomEnemyCounts = {};
    this.events = [];

    // Wisp projectiles for level 3
    this.wispProjectiles = [];
  }

  spawnRoom(roomIndex) {
    if (this._roomEnemyCounts[roomIndex] !== undefined) return;
    this._roomEnemyCounts[roomIndex] = 0;
    const room = this.mapSystem.rooms[roomIndex];
    if (!room) return;
    const isBossRoom = room.key === 'boss_room';
    if (isBossRoom && !this.bossSpawned) {
      this._spawnBoss(roomIndex);
      return;
    }
    if (isBossRoom) return;
    if (room.key === 'spawn') return;

    const spawns = this._getEnemyList(roomIndex, room.key);
    const positions = this.mapSystem.getEnemySpawnPositionsForRoom(roomIndex, spawns.length);
    for (let i = 0; i < Math.min(spawns.length, positions.length); i++) {
      const enemy = this._createEnemy(spawns[i], positions[i].x, positions[i].y);
      this.enemies.push(enemy);
      this._roomEnemyCounts[roomIndex]++;
    }
  }

  _getEnemyList(roomIndex, roomKey) {
    const floor = this.levelIndex;
    const difficulty = roomIndex; // increases with depth
    if (floor === 0) {
      if (difficulty <= 1) return ['scarab','scarab','scarab','mummy'];
      if (difficulty <= 3) return ['mummy','mummy','scarab','scarab','mummy'];
      return ['mummy','mummy','mummy','anubis','scarab','scarab'];
    } else if (floor === 1) {
      if (roomKey === 'water_room') return ['mummy','mummy','scarab','scarab','anubis'];
      if (difficulty <= 2) return ['mummy','anubis','scarab','scarab'];
      return ['anubis','anubis','mummy','mummy','scarab','scarab','mummy'];
    } else {
      if (roomKey === 'elite_room') return ['anubis','anubis','wisp','wisp','statue'];
      return ['anubis','anubis','mummy','wisp','wisp','statue','scarab','scarab'];
    }
  }

  _createEnemy(type, x, y) {
    const floor = this.levelIndex;
    switch (type) {
      case 'mummy':  return new Mummy(x, y, floor);
      case 'scarab': return new Scarab(x, y, floor);
      case 'anubis': return new AnubisGuard(x, y, floor);
      case 'wisp':   return new Wisp(x, y, floor);
      case 'statue': return new Statue(x, y, floor);
      default:       return new Mummy(x, y, floor);
    }
  }

  _spawnBoss(roomIndex) {
    this.bossSpawned = true;
    const pos = this.mapSystem.getBossSpawnPosition(roomIndex);
    let boss;
    if (this.levelIndex === 0) boss = new Gatekeeper(pos.x, pos.y);
    else if (this.levelIndex === 1) boss = new NephthysShade(pos.x, pos.y);
    else boss = new CursedPharaoh(pos.x, pos.y);
    this.enemies.push(boss);
    this._roomEnemyCounts[roomIndex] = 1;
    this.events.push({ type: 'boss_spawn', bossType: boss.type, x: pos.x, y: pos.y });
  }

  update(dt, players) {
    const mapSystem = this.mapSystem;
    for (const enemy of this.enemies) {
      if (enemy.dead) continue;
      enemy.update(dt, players, mapSystem);

      // Collect boss/wisp events
      if (enemy.phaseEvents && enemy.phaseEvents.length > 0) {
        for (const evt of enemy.phaseEvents) {
          this.events.push(evt);
          // Handle spawn_scarabs
          if (evt.type === 'spawn_scarabs') {
            for (let i = 0; i < evt.count; i++) {
              const angle = (i / evt.count) * Math.PI * 2;
              const s = new Scarab(evt.x + Math.cos(angle) * 60, evt.y + Math.sin(angle) * 60, this.levelIndex);
              this.enemies.push(s);
            }
          }
          // Wisp projectile
          if (evt.type === 'wisp_shoot') {
            const dir = Utils.normalize(evt.tx - evt.x, evt.ty - evt.y);
            this.wispProjectiles.push({
              id: Utils.generateId(),
              x: evt.x, y: evt.y,
              vx: dir.x * 150, vy: dir.y * 150,
              damage: 15, lifetime: 3,
              ownerId: evt.id
            });
          }
          // Phase 2 boss (shade clone)
          if (evt.type === 'shade_clone') {
            // Spawn a fake clone (low hp, visual only on client)
            this.events.push({ type: 'shade_has_clone', realId: evt.bossId });
          }
          // Phase 2 pharaoh: spawn wisps
          if (evt.type === 'boss_phase2' && this.levelIndex === 2) {
            const boss = this.enemies.find(e => e.id === evt.bossId);
            if (boss) {
              for (let i = 0; i < 3; i++) {
                const a = (i / 3) * Math.PI * 2;
                const w = new Wisp(boss.x + Math.cos(a) * 80, boss.y + Math.sin(a) * 80, 2);
                w.isAnkhWisp = true;
                this.enemies.push(w);
              }
            }
          }
        }
        enemy.phaseEvents = [];
      }
    }

    // Update wisp projectiles
    this._updateWispProjectiles(dt, players, mapSystem);

    // Check room cleared
    this._checkRoomCleared(players);
  }

  _updateWispProjectiles(dt, players, mapSystem) {
    const toRemove = [];
    for (const proj of this.wispProjectiles) {
      proj.lifetime -= dt;
      if (proj.lifetime <= 0) { toRemove.push(proj.id); continue; }
      proj.x += proj.vx * dt;
      proj.y += proj.vy * dt;
      if (mapSystem && mapSystem.isSolid(proj.x, proj.y)) { toRemove.push(proj.id); continue; }
      for (const player of players) {
        if (player.dead) continue;
        if (Utils.distance(proj.x, proj.y, player.x, player.y) < 14) {
          const result = player.takeDamage(proj.damage);
          if (result) {
            this.events.push({ type: 'playerHit', playerId: player.id, damage: proj.damage, x: player.x, y: player.y });
            if (result.died) this.events.push({ type: 'playerDied', playerId: player.id });
          }
          toRemove.push(proj.id);
          break;
        }
      }
    }
    this.wispProjectiles = this.wispProjectiles.filter(p => !toRemove.includes(p.id));
  }

  _checkRoomCleared(players) {
    // Determine which room players are in
    const playerRooms = new Set();
    for (const player of players) {
      if (player.dead) continue;
      const room = this.mapSystem.getRoomAtWorld(player.x, player.y);
      if (room) playerRooms.add(room.index);
    }

    for (const roomIdx of playerRooms) {
      const room = this.mapSystem.rooms[roomIdx];
      if (!room || room.cleared) continue;
      const roomEnemies = this.enemies.filter(e => {
        const r = this.mapSystem.getRoomAtWorld(e.x, e.y);
        return r && r.index === roomIdx && !e.dead;
      });
      if (roomEnemies.length === 0) {
        room.cleared = true;
        this.mapSystem.openRoomDoors(roomIdx);
        this.events.push({ type: 'room_cleared', roomIndex: roomIdx });
        // Check if boss room cleared
        if (room.key === 'boss_room') {
          this.levelComplete = true;
          this.events.push({ type: 'level_complete', level: this.levelIndex });
        }
      }
    }
  }

  // Called when ankh wisp is killed
  onWispKilled(wispId, boss) {
    const wisp = this.enemies.find(e => e.id === wispId && e.isAnkhWisp);
    if (wisp && boss && boss.chargeAnkh) {
      boss.chargeAnkh();
    }
  }

  getAndClearEvents() {
    const evts = this.events;
    this.events = [];
    return evts;
  }

  serializeEnemies() {
    return this.enemies.filter(e => !e.dead).map(e => e.serialize());
  }

  serializeWispProjectiles() {
    return this.wispProjectiles.map(p => ({ id: p.id, x: Math.round(p.x), y: Math.round(p.y), type: 'wisp' }));
  }
}

module.exports = WaveSystem;
