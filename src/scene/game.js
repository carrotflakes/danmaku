import {Scene} from './scene';
import {global} from '../global';
import {Player} from '../player';
import {BGM} from '../bgm';
import {Enemy} from '../enemy';
import {Enemy2} from '../enemy2';
import {Enemy3} from '../enemy3';
import {Enemy4} from '../enemy4';
import {Enemy5} from '../enemy5';
import {StageLogo} from '../stageLogo';
import {wait, sleep, fork, join} from '../vm';

export class Game extends Scene {
  constructor(exit) {
    super();
    this.exit = exit;
    this.bgm = new BGM();
    this.bgm.play();

    const {entities, width, height, vm} = global;
    entities.forEach(e => e.despawn());
    entities.push(new Player({x: width / 2, y: height - 100}));
    this.process = vm.put(codeGen());

    global.score = 0;
  }

  update() {
    const {entities} = global;
    for (const entity of entities) {
      entity.update();
    }

    // 終了判定
    if (!entities.find(e => e instanceof Player)) {
      this.bgm.stop();
      this.process.kill();
      this.exit();
    }
  }

  draw() {
    const {ctx, entities} = global;
    // 背景をクリア
    ctx.fillStyle = '#EEE';
    ctx.fillRect(0, 0, 400, 600);

    for (const entity of entities) {
      entity.draw();
    }

    ctx.fillStyle = '#000';
    ctx.font = '18px monospace';
    ctx.fillText('score: ' + global.score, 20, 20);
  }
}

export function* codeGen() {
  const {spawn, width, height} = global;
  yield waitToDespawn(spawn(new StageLogo({level: 1})));
  while (true) {
    yield waitForNoEnemy();
    yield sleep(0.1);
    spawn(new Enemy4({
      x: Math.random() * width, y: -10,
    }));
    yield waitForNoEnemy();
    yield sleep(0.1);
    spawn(new Enemy({
      x: width / 2, y: -10,
      targetX: width / 3, targetY: height / 3
    }));
    yield waitForNoEnemy();
    yield sleep(0.1);
    spawn(new Enemy2({
      x: width / 2, y: -10,
      targetX: width * 2 / 3, targetY: height / 3
    }));
    yield waitForNoEnemy();
    yield sleep(0.1);
    const x = Math.random() * width;
    for (let i = 0; i < 5; i++) {
      spawn(new Enemy3({
        x: x, y: -10,
      }));
      yield sleep(0.1);
    }
    yield waitForNoEnemy();
    yield sleep(0.1);
    spawn(new Enemy5(function*(enemy) {
      yield enemy.autoKill(enemy.process);
      yield enemy.setPos(100, 0);
      yield enemy.moveTo(100, 100, 0.5);
      const shot = yield fork(function*() {
        while (enemy.exists) {
          yield enemy.shot(function*(bullet) {
            yield bullet.setPos(enemy.x, enemy.y);
            while (1) {
              bullet.y += 3;
              yield wait();
            }
          });
          yield sleep(0.1);
        }
      });
      yield enemy.moveTo(300, 100, 2);
      shot.kill();
      yield enemy.moveTo(300, height, 1);
      enemy.despawn();
    }));
  }
}

export function* waitForNoEnemy() {
  const {entities} = global;
  yield wait();
  while (entities.find(e => e instanceof Enemy))
    yield wait();
}

export function* waitToDespawn(entity) {
  while (!entity._despawn)
    yield wait();
}
