import {global} from './global';
import {Enemy, Bullet} from './enemy';
import {PlayerBullet} from './playerBullet';
import {Player} from './player';

export class Enemy2 extends Enemy {
  constructor(opts) {
    super(opts);
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
      const player = entities.find(e => e instanceof Player);
      if (player) {
        const p = -Math.atan2(this.x - player.x, this.y - player.y) - Math.PI / 2;
        entities.push(new Bullet({
          x: this.x, y: this.y,
          dx: Math.cos(p) * 5,
          dy: Math.sin(p) * 5
        }));
        this.count = 0;
      }
    }
  }

  draw() {
    const {ctx} = global;
    const size = 20;
    ctx.fillStyle = '#F00';
    ctx.fillRect(this.x - size / 2, this.y - size / 2, size, size);
  }
}
