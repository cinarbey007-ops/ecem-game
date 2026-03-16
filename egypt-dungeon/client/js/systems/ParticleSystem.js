// Client-side visual effects (no server involvement)
class ParticleSystem {
  constructor(scene) {
    this.scene = scene;
    this.particles = [];
    this.texts = [];
  }

  hitSparks(x, y, color = 0xFF4444, count = 6) {
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
      const speed = 60 + Math.random() * 80;
      const g = this.scene.add.graphics();
      g.fillStyle(color);
      g.fillRect(0, 0, 3, 3);
      g.x = x;
      g.y = y;
      this.particles.push({
        obj: g,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 40,
        life: 0.4 + Math.random() * 0.2,
        maxLife: 0.4,
        gravity: 120
      });
    }
  }

  sandPuff(x, y) {
    for (let i = 0; i < 5; i++) {
      const g = this.scene.add.graphics();
      const size = 4 + Math.random() * 6;
      g.fillStyle(PALETTE.SAND_MID, 0.7);
      g.fillCircle(size / 2, size / 2, size / 2);
      g.x = x + (Math.random() - 0.5) * 20;
      g.y = y + (Math.random() - 0.5) * 10;
      this.particles.push({
        obj: g,
        vx: (Math.random() - 0.5) * 40,
        vy: -30 - Math.random() * 30,
        life: 0.5,
        maxLife: 0.5,
        gravity: 0,
        fade: true
      });
    }
  }

  cursePuff(x, y) {
    for (let i = 0; i < 4; i++) {
      const g = this.scene.add.graphics();
      g.fillStyle(PALETTE.CURSE_PURPLE, 0.8);
      g.fillCircle(5, 5, 5);
      g.x = x + (Math.random() - 0.5) * 16;
      g.y = y + (Math.random() - 0.5) * 16;
      this.particles.push({
        obj: g,
        vx: (Math.random() - 0.5) * 50,
        vy: -60 - Math.random() * 40,
        life: 0.6,
        maxLife: 0.6,
        gravity: -30,
        fade: true
      });
    }
  }

  aoeRing(x, y, radius, color = 0xFFAA00) {
    const g = this.scene.add.graphics();
    g.lineStyle(3, color, 0.8);
    g.strokeCircle(0, 0, 1);
    g.x = x;
    g.y = y;
    this.particles.push({
      obj: g,
      scale: 0,
      targetScale: radius,
      life: 0.4,
      maxLife: 0.4,
      type: 'ring',
      color,
      radius
    });
  }

  floatingText(x, y, text, color = '#FFFFFF', size = 16) {
    const t = this.scene.add.text(x, y, text, {
      fontSize: `${size}px`,
      fontFamily: 'monospace',
      color,
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5);
    this.texts.push({ obj: t, vy: -60, life: 0.8, maxLife: 0.8 });
  }

  damageNumber(x, y, damage, isCrit = false) {
    const color = isCrit ? PALETTE.CRIT_ORANGE : '#FFFFFF';
    const size = isCrit ? 20 : 14;
    const text = isCrit ? `${damage}!` : `${damage}`;
    this.floatingText(x, y - 10, text, `#${color.toString(16).padStart(6, '0').slice(-6)}`, size);
  }

  healNumber(x, y, amount) {
    this.floatingText(x, y - 10, `+${amount}`, PALETTE.TEXT_GREEN, 14);
  }

  update(dt) {
    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;
      if (p.life <= 0) {
        p.obj.destroy();
        this.particles.splice(i, 1);
        continue;
      }

      if (p.type === 'ring') {
        const progress = 1 - p.life / p.maxLife;
        p.obj.clear();
        p.obj.lineStyle(3, p.color, p.life / p.maxLife);
        p.obj.strokeCircle(0, 0, p.radius * progress);
        continue;
      }

      p.obj.x += p.vx * dt;
      p.obj.y += p.vy * dt;
      if (p.gravity) p.vy += p.gravity * dt;

      if (p.fade) {
        p.obj.alpha = p.life / p.maxLife;
      }
    }

    // Update floating texts
    for (let i = this.texts.length - 1; i >= 0; i--) {
      const t = this.texts[i];
      t.life -= dt;
      if (t.life <= 0) {
        t.obj.destroy();
        this.texts.splice(i, 1);
        continue;
      }
      t.obj.y += t.vy * dt;
      t.obj.alpha = t.life / t.maxLife;
    }
  }

  destroy() {
    for (const p of this.particles) p.obj.destroy();
    for (const t of this.texts) t.obj.destroy();
    this.particles = [];
    this.texts = [];
  }
}
