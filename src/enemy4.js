import {global} from './global';
import {Enemy, Bullet} from './enemy';
import {PlayerBullet} from './playerBullet';
import {Player} from './player';
import {wait, sleep, fork} from './vm';

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
        this.despawn();
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
    const {entities, spawn} = global;
    const player = entities.find(e => e instanceof Player);
    if (player) {
      const angle = angleTo(this, player);
      const dx = Math.cos(angle) * 5;
      const dy = Math.sin(angle) * 5;
      spawn(new Bullet2(this, function*(bullet) {
        while (1) {
          bullet.x += dx;
          bullet.y += dy;
          yield wait();
        }
      }));
    }
  }

  *codeGen() {
    yield this.autoKill(this.process);
    yield this.setPos(100, 0);
    yield this.moveTo(100, 100, 0.5);
    while (1) {
      yield this.shot();
      yield sleep(0.1);
    }
  }
}

export class Bullet2 extends Bullet {
  constructor(parent, codeGen) {
    super({x: parent.x, y: parent.y});
    this.process = global.vm.put(codeGen(this));
    global.vm.put(this.autoKill(this.process));
  }

  update() {
    const {width, height} = global;

    // 画面外判定
    if (this.x < 0 || this.y < 0 || width <= this.x || height <= this.y)
      this.despawn();
  }
}

function angleTo(entity1, entity2) {
  return -Math.atan2(entity1.x - entity2.x, entity1.y - entity2.y) - Math.PI / 2;
}
