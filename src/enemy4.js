import {global} from './global';
import {Enemy, Bullet} from './enemy';
import {PlayerBullet} from './playerBullet';
import {Player} from './player';
import {sleep, fork} from './vm';

export class Enemy4 extends Enemy {
  constructor(opts) {
    super(opts);
    this.x = opts.x;
    this.y = opts.y;
    this.count = 0;
    this.process = global.vm.put(this.codeGen());
  }

  update() {
    const {entities, height} = global;

    // 当たり判定
    for (const entity of entities) {
      if ((entity instanceof PlayerBullet) &&
          Math.abs(entity.x - this.x) < 5 &&
          Math.abs(entity.y - this.y) < 5) {
        this.process.kill();
        entities.splice(entities.indexOf(this), 1);
        global.score += 10;
      }
    }
  }

  draw() {
    const {ctx} = global;
    const size = 10;
    ctx.fillStyle = '#F00';
    ctx.fillRect(this.x - size / 2, this.y - size / 2, size, size);
  }

  *shot() {
    const {entities} = global;
    const player = entities.find(e => e instanceof Player);
    if (player) {
      const p = -Math.atan2(this.x - player.x, this.y - player.y) - Math.PI / 2;
      entities.push(new Bullet({
        x: this.x, y: this.y,
        dx: Math.cos(p) * 5,
        dy: Math.sin(p) * 5
      }));
    }
  }

  *codeGen() {
    yield this.setPos(100, 0);
    yield this.moveTo(100, 100, 0.5);
    while (1) {
      yield this.shot();
      yield sleep(0.1);
    }
  }
}
