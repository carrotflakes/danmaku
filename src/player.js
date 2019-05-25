import {global} from './global';
import {Entity} from './entity';
import {Enemy, Bullet} from './enemy';
import {PlayerBullet} from './playerBullet';
import * as se from './se';

export class Player extends Entity {
  constructor(opts) {
    super();
    this.x = opts.x;
    this.y = opts.y;
    this.bulletCoolTime = 0;
  }

  update() {
    const {entities, keyboard, width, height} = global;

    // 当たり判定
    for (const entity of entities) {
      if ((entity instanceof Enemy || entity instanceof Bullet) &&
          Math.abs(entity.x - this.x) < 5 &&
          Math.abs(entity.y - this.y) < 5) {
        this.despawn();
      }
    }

    if (keyboard.left) {
      this.x -= 3;
    }
    if (keyboard.right) {
      this.x += 3;
    }
    if (keyboard.up) {
      this.y -= 3;
    }
    if (keyboard.down) {
      this.y += 3;
    }
    this.x = clamp(this.x, 10, width - 10);
    this.y = clamp(this.y, 10, height - 10);

    if (this.bulletCoolTime === 0) {
      if (keyboard.a) {
        entities.push(new PlayerBullet({
          x: this.x, y: this.y,
          dx: Math.cos(Math.PI * 1.5) * 5,
          dy: Math.sin(Math.PI * 1.5) * 5
        }));
        entities.push(new PlayerBullet({
          x: this.x, y: this.y,
          dx: Math.cos(Math.PI * 1.45) * 5,
          dy: Math.sin(Math.PI * 1.45) * 5
        }));
        entities.push(new PlayerBullet({
          x: this.x, y: this.y,
          dx: Math.cos(Math.PI * 1.55) * 5,
          dy: Math.sin(Math.PI * 1.55) * 5
        }));
        se.playerShot();
        this.bulletCoolTime = 5;
      }
    } else {
      this.bulletCoolTime -= 1;
    }
  }

  draw() {
    const {ctx} = global;
    const size = 20;
    ctx.fillStyle = '#00F';
    ctx.fillRect(this.x - size / 2, this.y - size / 2, size, size);
  }
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}
