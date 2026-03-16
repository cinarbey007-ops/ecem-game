const C = require('../../shared/constants');
const Utils = require('../../shared/utils');

class CombatSystem {
  constructor(gameRoom) {
    this.room = gameRoom;
    this.projectiles = []; // arrows, boss projectiles
    this.events = []; // combat events to emit this tick
  }

  processPlayerAttack(player, enemies) {
    if (player.dead) return;
    const { attacking, abilityKey, mouseAngle, shift } = player.input;

    // Primary attack
    if (attacking && player.attackCooldown <= 0) {
      if (player.class === 'warrior') {
        this._warriorMelee(player, enemies);
      } else {
        this._archerShoot(player, mouseAngle);
      }
    }

    // Heavy ability
    if (abilityKey && player.class === 'warrior' && player.heavyCooldown <= 0) {
      if (!player.isCharging) {
        player.isCharging = true;
        player.chargeTimer = C.HEAVY_CHARGE_MS / 1000;
      }
    } else if (!abilityKey && player.isCharging) {
      if (player.chargeTimer <= 0) {
        this._warriorHeavy(player, enemies);
      }
      player.isCharging = false;
      player.chargeTimer = 0;
    }
    if (player.isCharging && player.chargeTimer > 0) {
      player.chargeTimer -= 1 / C.SERVER_TICK_HZ;
    }

    // Spread shot (archer)
    if (abilityKey && player.class === 'archer' && player.spreadCooldown <= 0) {
      this._archerSpread(player, mouseAngle);
    }

    // Ultimate
    if (player.input.ultimate && player.ultimateCooldown <= 0) {
      if (player.class === 'warrior') {
        player.rageActive = true;
        player.rageTimer = 5;
        player.ultimateCooldown = 40;
        this.events.push({ type: 'ultimate', playerId: player.id, skill: 'rage' });
      } else {
        player.rageActive = true; // reuse flag for eye of Ra
        player.rageTimer = 8;
        player.ultimateCooldown = 45;
        this.events.push({ type: 'ultimate', playerId: player.id, skill: 'eyeOfRa' });
      }
    }
  }

  _warriorMelee(player, enemies) {
    const { damage, crit } = player.getDamage();
    player.attackCooldown = C.MELEE_COOLDOWN_MS / 1000;

    // Combo tracking
    player.comboCount++;
    player.comboTimer = 1.2;
    const isComboFinisher = player.comboCount >= 3;
    if (isComboFinisher) {
      player.comboCount = 0;
    }

    const arcRadius = isComboFinisher ? C.MELEE_RANGE * 1.3 : C.MELEE_RANGE;
    const arcAngle = isComboFinisher ? Math.PI * 0.8 : C.MELEE_ANGLE;
    const finalDamage = isComboFinisher ? Math.round(damage * 1.5) : damage;

    let hitCount = 0;
    for (const enemy of enemies) {
      if (enemy.dead) continue;
      if (Utils.pointInArc(enemy.x, enemy.y, player.x, player.y, arcRadius, player.facing, arcAngle)) {
        const kbAngle = Utils.angle(player.x, player.y, enemy.x, enemy.y);
        const kb = player.knockbackForce || 150;
        const result = enemy.takeDamage(finalDamage, Math.cos(kbAngle) * kb, Math.sin(kbAngle) * kb);
        if (result) {
          hitCount++;
          this.events.push({ type: 'hit', enemyId: enemy.id, damage: finalDamage, crit, x: enemy.x, y: enemy.y });
          if (result.died) {
            player.kills++;
            this.events.push({ type: 'kill', enemyId: enemy.id, playerId: player.id, loot: this._rollEnemyLoot(enemy) });
          }
          // Lifesteal
          if (player.stats.lifesteal > 0) {
            player.hp = Math.min(player.maxHp + player.stats.hpBonus, player.hp + finalDamage * player.stats.lifesteal);
          }
        }
      }
    }

    player.state = 'attacking';
    this.events.push({ type: 'attack', playerId: player.id, class: 'warrior', facing: player.facing, combo: player.comboCount, finisher: isComboFinisher });
  }

  _warriorHeavy(player, enemies) {
    player.heavyCooldown = C.HEAVY_COOLDOWN_MS / 1000;
    const { damage } = player.getDamage();
    const aoeRange = C.HEAVY_RANGE;
    const finalDamage = Math.round(damage * 1.8);

    for (const enemy of enemies) {
      if (enemy.dead) continue;
      if (Utils.pointInCircle(enemy.x, enemy.y, player.x, player.y, aoeRange)) {
        const kbAngle = Utils.angle(player.x, player.y, enemy.x, enemy.y);
        const result = enemy.takeDamage(finalDamage, Math.cos(kbAngle) * 220, Math.sin(kbAngle) * 220);
        if (result) {
          this.events.push({ type: 'hit', enemyId: enemy.id, damage: finalDamage, x: enemy.x, y: enemy.y });
          if (result.died) {
            player.kills++;
            this.events.push({ type: 'kill', enemyId: enemy.id, playerId: player.id, loot: this._rollEnemyLoot(enemy) });
          }
        }
      }
    }
    this.events.push({ type: 'heavy', playerId: player.id, x: player.x, y: player.y, radius: aoeRange });
  }

  _archerShoot(player, mouseAngle) {
    if (player.arrowCount >= C.ARROW_MAX_FLIGHT) return;
    player.attackCooldown = C.ARROW_COOLDOWN_MS / 1000;
    const { damage } = player.getDamage();
    const arrow = {
      id: Utils.generateId(),
      ownerId: player.id,
      x: player.x,
      y: player.y,
      angle: mouseAngle,
      speed: C.ARROW_SPEED,
      damage,
      pierce: player.rageActive,
      lifetime: 1.5
    };
    this.projectiles.push(arrow);
    player.arrowCount++;
    this.events.push({ type: 'shoot', playerId: player.id, arrowId: arrow.id, angle: mouseAngle });
  }

  _archerSpread(player, mouseAngle) {
    player.spreadCooldown = C.SPREAD_COOLDOWN_MS / 1000;
    const { damage } = player.getDamage();
    const angles = [-0.3, -0.15, 0, 0.15, 0.3];
    for (const offset of angles) {
      const arrow = {
        id: Utils.generateId(),
        ownerId: player.id,
        x: player.x,
        y: player.y,
        angle: mouseAngle + offset,
        speed: C.ARROW_SPEED,
        damage: Math.round(damage * 0.7),
        pierce: false,
        lifetime: 1.5
      };
      this.projectiles.push(arrow);
    }
    this.events.push({ type: 'spread', playerId: player.id, angle: mouseAngle });
  }

  updateProjectiles(dt, enemies, players, mapSystem) {
    const toRemove = [];
    for (const proj of this.projectiles) {
      proj.lifetime -= dt;
      if (proj.lifetime <= 0) { toRemove.push(proj.id); continue; }
      proj.x += Math.cos(proj.angle) * proj.speed * dt;
      proj.y += Math.sin(proj.angle) * proj.speed * dt;

      // Wall collision
      if (mapSystem && mapSystem.isSolid(proj.x, proj.y)) {
        this.events.push({ type: 'arrowHitWall', x: proj.x, y: proj.y });
        toRemove.push(proj.id);
        // Decrement owner arrow count
        const owner = players.find(p => p.id === proj.ownerId);
        if (owner) owner.arrowCount = Math.max(0, owner.arrowCount - 1);
        continue;
      }

      // Enemy collision
      let hit = false;
      for (const enemy of enemies) {
        if (enemy.dead) continue;
        if (Utils.pointInCircle(proj.x, proj.y, enemy.x, enemy.y, 16)) {
          const kbAngle = proj.angle;
          const result = enemy.takeDamage(proj.damage, Math.cos(kbAngle) * 100, Math.sin(kbAngle) * 100);
          if (result) {
            this.events.push({ type: 'hit', enemyId: enemy.id, damage: proj.damage, x: enemy.x, y: enemy.y });
            const owner = players.find(p => p.id === proj.ownerId);
            if (owner) {
              if (result.died) {
                owner.kills++;
                this.events.push({ type: 'kill', enemyId: enemy.id, playerId: proj.ownerId, loot: this._rollEnemyLoot(enemy) });
              }
              // Lifesteal
              if (owner.stats.lifesteal > 0) {
                owner.hp = Math.min(owner.maxHp + owner.stats.hpBonus, owner.hp + proj.damage * owner.stats.lifesteal);
              }
              // Sand step passive (every 5th dodge arrow leaves slow zone - simplified: on spread shot hits)
            }
          }
          if (!proj.pierce) {
            hit = true;
            break;
          }
        }
      }
      if (hit) {
        toRemove.push(proj.id);
        const owner = players.find(p => p.id === proj.ownerId);
        if (owner) owner.arrowCount = Math.max(0, owner.arrowCount - 1);
      }
    }
    this.projectiles = this.projectiles.filter(p => !toRemove.includes(p.id));
  }

  processEnemyAttacks(enemies, players) {
    for (const enemy of enemies) {
      if (enemy.dead || enemy.state !== 'attacking') continue;
      // Only deal damage once per attack (use a flag)
      if (enemy._damageDealtThisAttack) continue;
      enemy._damageDealtThisAttack = true;

      for (const player of players) {
        if (player.dead) continue;
        const dist = Utils.distance(enemy.x, enemy.y, player.x, player.y);
        if (dist <= enemy.attackRange + 10) {
          const kbAngle = Utils.angle(enemy.x, enemy.y, player.x, player.y);
          const result = player.takeDamage(enemy.damage, Math.cos(kbAngle) * enemy.knockbackForce, Math.sin(kbAngle) * enemy.knockbackForce);
          if (result && result.damage > 0) {
            this.events.push({ type: 'playerHit', playerId: player.id, damage: result.damage, x: player.x, y: player.y });
            if (result.died) {
              this.events.push({ type: 'playerDied', playerId: player.id });
            }
            // Scarab curse: slow attacker
            if (enemy.type === 'mummy' || enemy.type === 'scarab') {
              const curseProp = player.equipped.chest?.specials?.find(s => s.effect === 'curseSlow');
              if (curseProp) {
                enemy.speed = Math.round(enemy.speed * (1 - curseProp.value));
                setTimeout(() => { enemy.speed = enemy.maxSpeed || enemy.speed; }, 2000);
              }
            }
          }
        }
      }
    }
    // Reset damage flag when enemy leaves attacking state
    for (const enemy of enemies) {
      if (enemy.state !== 'attacking') enemy._damageDealtThisAttack = false;
    }
  }

  processTrapDamage(players, mapSystem) {
    if (!mapSystem) return;
    for (const player of players) {
      if (player.dead) continue;
      const trap = mapSystem.isTrap(player.x, player.y);
      if (trap) {
        player.takeDamage(5);
        this.events.push({ type: 'trapHit', playerId: player.id, x: player.x, y: player.y });
      }
      if (mapSystem.isWater(player.x, player.y)) {
        player.takeDamage(3 / C.SERVER_TICK_HZ); // continuous damage
      }
    }
  }

  processCurseZones(players, boss) {
    if (!boss || !boss.curseZones) return;
    for (const player of players) {
      if (player.dead) continue;
      for (const zone of boss.curseZones) {
        if (Utils.pointInCircle(player.x, player.y, zone.x, zone.y, zone.r)) {
          player.takeDamage(15 / C.SERVER_TICK_HZ);
        }
      }
    }
  }

  processAnubisChase(players, boss) {
    if (!boss || !boss._anubisChaseTarget || boss._anubisChaseTimer <= 0) return;
    const chased = players.find(p => p.id === boss._anubisChaseTarget);
    if (!chased) return;
    // Check if both players are close (dispel condition)
    if (players.length >= 2) {
      const other = players.find(p => p.id !== boss._anubisChaseTarget && !p.dead);
      if (other && Utils.distance(chased.x, chased.y, other.x, other.y) < 30) {
        boss._anubisChaseTimer = 0;
        this.events.push({ type: 'anubis_dispelled' });
      }
    }
  }

  _rollEnemyLoot(enemy) {
    const { rollLoot } = require('../data/lootTables');
    return rollLoot(enemy.lootType, enemy.floor || 0);
  }

  getAndClearEvents() {
    const evts = this.events;
    this.events = [];
    return evts;
  }

  serializeProjectiles() {
    return this.projectiles.map(p => ({
      id: p.id,
      x: Math.round(p.x),
      y: Math.round(p.y),
      angle: p.angle,
      type: 'arrow'
    }));
  }
}

module.exports = CombatSystem;
