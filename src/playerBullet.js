import {global} from './global';
import {Entity} from './entity';

export class PlayerBullet extends Entity {
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
      this.despawn();
    }
  }

  draw() {
    const {ctx} = global;
    const size = 5;
    ctx.fillStyle = '#333';
    ctx.fillRect(this.x - size / 2, this.y - size / 2, size, size);
  }
}
