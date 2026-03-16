// Shared utility functions
const Utils = {
  distance(ax, ay, bx, by) {
    const dx = bx - ax;
    const dy = by - ay;
    return Math.sqrt(dx * dx + dy * dy);
  },

  distanceSq(ax, ay, bx, by) {
    const dx = bx - ax;
    const dy = by - ay;
    return dx * dx + dy * dy;
  },

  angle(ax, ay, bx, by) {
    return Math.atan2(by - ay, bx - ax);
  },

  normalize(dx, dy) {
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len === 0) return { x: 0, y: 0 };
    return { x: dx / len, y: dy / len };
  },

  lerp(a, b, t) {
    return a + (b - a) * t;
  },

  lerpAngle(a, b, t) {
    let diff = b - a;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    return a + diff * t;
  },

  clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  },

  // Check if point is in arc (for melee hitbox)
  pointInArc(px, py, cx, cy, radius, angle, arcWidth) {
    const dist = Utils.distance(px, py, cx, cy);
    if (dist > radius) return false;
    const pointAngle = Math.atan2(py - cy, px - cx);
    let diff = pointAngle - angle;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    return Math.abs(diff) <= arcWidth / 2;
  },

  // Check if point is in circle
  pointInCircle(px, py, cx, cy, radius) {
    return Utils.distanceSq(px, py, cx, cy) <= radius * radius;
  },

  // AABB overlap check
  rectsOverlap(ax, ay, aw, ah, bx, by, bw, bh) {
    return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
  },

  // Random integer in range [min, max)
  randInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  },

  // Random float in range
  randFloat(min, max) {
    return Math.random() * (max - min) + min;
  },

  // Weighted random selection
  weightedRandom(items) {
    // items: [{value, weight}, ...]
    const total = items.reduce((s, i) => s + i.weight, 0);
    let roll = Math.random() * total;
    for (const item of items) {
      roll -= item.weight;
      if (roll <= 0) return item.value;
    }
    return items[items.length - 1].value;
  },

  // Bresenham line of sight check on solid grid
  hasLineOfSight(x1, y1, x2, y2, solidGrid, tileSize) {
    const tx1 = Math.floor(x1 / tileSize);
    const ty1 = Math.floor(y1 / tileSize);
    const tx2 = Math.floor(x2 / tileSize);
    const ty2 = Math.floor(y2 / tileSize);
    let x = tx1, y = ty1;
    const dx = Math.abs(tx2 - tx1);
    const dy = Math.abs(ty2 - ty1);
    const sx = tx1 < tx2 ? 1 : -1;
    const sy = ty1 < ty2 ? 1 : -1;
    let err = dx - dy;
    while (true) {
      if (x === tx2 && y === ty2) return true;
      if (solidGrid[y] && solidGrid[y][x]) return false;
      const e2 = err * 2;
      if (e2 > -dy) { err -= dy; x += sx; }
      if (e2 < dx) { err += dx; y += sy; }
    }
  },

  // Simple A* pathfinding step (next direction toward target avoiding walls)
  getPathStep(fromX, fromY, toX, toY, solidGrid, tileSize) {
    const fx = Math.floor(fromX / tileSize);
    const fy = Math.floor(fromY / tileSize);
    const tx = Math.floor(toX / tileSize);
    const ty = Math.floor(toY / tileSize);
    if (fx === tx && fy === ty) return { dx: 0, dy: 0 };

    // Simple: try direct, then try slide
    const dx = tx - fx;
    const dy = ty - fy;
    const nx = dx !== 0 ? Math.sign(dx) : 0;
    const ny = dy !== 0 ? Math.sign(dy) : 0;

    const tryTile = (cx, cy) => {
      const row = solidGrid[cy];
      if (!row) return false;
      return !row[cx];
    };

    if (nx !== 0 && ny !== 0) {
      if (tryTile(fx + nx, fy + ny)) return { dx: nx, dy: ny };
      if (tryTile(fx + nx, fy)) return { dx: nx, dy: 0 };
      if (tryTile(fx, fy + ny)) return { dx: 0, dy: ny };
      return { dx: 0, dy: 0 };
    }
    if (nx !== 0) {
      if (tryTile(fx + nx, fy)) return { dx: nx, dy: 0 };
      if (tryTile(fx, fy - 1)) return { dx: 0, dy: -1 };
      if (tryTile(fx, fy + 1)) return { dx: 0, dy: 1 };
      return { dx: 0, dy: 0 };
    }
    if (ny !== 0) {
      if (tryTile(fx, fy + ny)) return { dx: 0, dy: ny };
      if (tryTile(fx - 1, fy)) return { dx: -1, dy: 0 };
      if (tryTile(fx + 1, fy)) return { dx: 1, dy: 0 };
      return { dx: 0, dy: 0 };
    }
    return { dx: 0, dy: 0 };
  },

  generateId() {
    return Math.random().toString(36).substr(2, 9);
  }
};

if (typeof module !== 'undefined') module.exports = Utils;
