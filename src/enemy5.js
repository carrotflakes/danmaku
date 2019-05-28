import {global} from './global';
import {Enemy, Bullet} from './enemy';
import {PlayerBullet} from './playerBullet';
import {Player} from './player';
import {wait, sleep, fork} from './vm';
import {enemyDefeated} from './se';

export class Enemy5 extends Enemy {
  constructor(codeGen) {
    super({});
    this.process = global.vm.put(codeGen(this));
    this.hp = 5;
  }

  update() {
    const {entities, height} = global;

    // 当たり判定
    for (const entity of entities) {
      if ((entity instanceof PlayerBullet) &&
          Math.abs(entity.x - this.x) < 8 &&
          Math.abs(entity.y - this.y) < 8) {
        entity.despawn();
        this.hp -= 1;
        if (this.exists && this.hp <= 0) {
          enemyDefeated();
          this.despawn();
          global.score += 10;
        }
      }
    }
  }

  draw() {
    const {ctx} = global;
    const size = 16;
    ctx.fillStyle = '#F00';
    ctx.fillRect(this.x - size / 2, this.y - size / 2, size, size);
  }

  *shot(codeGen) {
    global.spawn(new Bullet2(this, codeGen));
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

export function angleTo(entity1, entity2) {
  return Math.atan2(entity1.x - entity2.x, entity1.y - entity2.y) + Math.PI / 2;
}
