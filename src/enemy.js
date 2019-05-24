import {global} from './global';
import {Entity} from './entity';
import {PlayerBullet} from './playerBullet';

export class Enemy extends Entity {
  constructor(opts) {
    super();
    this.x = opts.x;
    this.y = opts.y;
    this.targetX = opts.targetX;
    this.targetY = opts.targetY;
    this.count = 0;
  }

  update() {
    const {entities} = global;

    // 当たり判定
    for (const entity of entities) {
      if ((entity instanceof PlayerBullet) &&
          Math.abs(entity.x - this.x) < 5 &&
          Math.abs(entity.y - this.y) < 5) {
        entities.splice(entities.indexOf(this), 1);
        global.score += 10;
      }
    }

    // 移動
    this.x = (this.x * 9 + this.targetX) / 10;
    this.y = (this.y * 9 + this.targetY) / 10;

    // 弾を打つ
    this.count += 1;
    if (10 < this.count) {
      for (let i = 0; i < 16; ++i) {
        const p = i * 2 * Math.PI / 16;
        entities.push(new Bullet({
          x: this.x, y: this.y,
          dx: Math.sin(p) * 5,
          dy: Math.cos(p) * 5
        }));
      }
      this.count = 0;
    }
  }

  draw() {
    const {ctx} = global;
    const size = 20;
    ctx.fillStyle = '#F00';
    ctx.fillRect(this.x - size / 2, this.y - size / 2, size, size);
  }
}

export class Bullet extends Entity {
  constructor(opts) {
    super();
    this.x = opts.x;
    this.y = opts.y;
    this.dx = opts.dx;
    this.dy = opts.dy;
  }

  update() {
    const {entities, width, height} = global;
    this.x += this.dx;
    this.y += this.dy;

    // 画面外判定
    if (this.x < 0 || this.y < 0 || width <= this.x || height <= this.y) {
      entities.splice(entities.indexOf(this), 1);
    }
  }

  draw() {
    const {ctx} = global;
    const size = 5;
    ctx.fillStyle = '#333';
    ctx.fillRect(this.x - size / 2, this.y - size / 2, size, size);
  }
}
