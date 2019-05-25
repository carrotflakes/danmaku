import {global} from './global';
import {Enemy, Bullet} from './enemy';
import {PlayerBullet} from './playerBullet';
import {Player} from './player';

export class Enemy3 extends Enemy {
  constructor(opts) {
    super(opts);
    this.x = opts.x;
    this.y = opts.y;
    this.count = 0;
  }

  update() {
    const {entities, height} = global;

    // 当たり判定
    for (const entity of entities) {
      if ((entity instanceof PlayerBullet) &&
          Math.abs(entity.x - this.x) < 5 &&
          Math.abs(entity.y - this.y) < 5) {
        this.despawn();
        global.score += 10;
      }
    }

    // 移動
    this.y += 3;
    if (height < this.y) {
      this.despawn();
    }

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
