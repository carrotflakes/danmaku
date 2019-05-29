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
    this.invincible = global.keyboard.dev;
  }

  update() {
    const {entities, keyboard, width, height, spawn} = global;

    // 当たり判定
    for (const entity of entities) {
      if ((entity instanceof Enemy || entity instanceof Bullet) &&
          Math.abs(entity.x - this.x) < 5 &&
          Math.abs(entity.y - this.y) < 5) {
        if (!this.invincible)
          this.despawn();
        else
          console.log('hit');
      }
    }

    let velocity = keyboard.shift ? 2 : 6;
    if (keyboard.left) {
      this.x -= velocity;
    }
    if (keyboard.right) {
      this.x += velocity;
    }
    if (keyboard.up) {
      this.y -= velocity;
    }
    if (keyboard.down) {
      this.y += velocity;
    }
    this.x = clamp(this.x, 10, width - 10);
    this.y = clamp(this.y, 10, height - 10);

    if (this.bulletCoolTime === 0) {
      if (keyboard.a) {
        spawn(new PlayerBullet({
          x: this.x, y: this.y,
          dx: Math.cos(Math.PI * 1.5) * 10,
          dy: Math.sin(Math.PI * 1.5) * 10
        }));
        spawn(new PlayerBullet({
          x: this.x, y: this.y,
          dx: Math.cos(Math.PI * 1.51) * 10,
          dy: Math.sin(Math.PI * 1.51) * 10
        }));
        spawn(new PlayerBullet({
          x: this.x, y: this.y,
          dx: Math.cos(Math.PI * 1.49) * 10,
          dy: Math.sin(Math.PI * 1.49) * 10
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
    const size = 10;
    ctx.fillStyle = '#00F';
    ctx.fillRect(this.x - size / 2, this.y - size / 2, size, size);
  }
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}
