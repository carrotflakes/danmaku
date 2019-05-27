import {Scene} from './scene';
import {global} from '../global';
import {Player} from '../player';
import {BGM} from '../bgm';
import {Enemy} from '../enemy';
import {Enemy2} from '../enemy2';
import {Enemy3} from '../enemy3';
import {Enemy4} from '../enemy4';
import {wait, sleep, fork, join} from '../vm';

export class Game extends Scene {
  constructor(exit) {
    super();
    this.exit = exit;
    this.bgm = new BGM();
    this.bgm.play();

    const {entities, width, height, vm} = global;
    entities.length = 0;
    entities.push(new Player({x: width / 2, y: height - 100}));
    this.process = vm.put(codeGen());

    global.score = 0;
  }

  update() {
    const {entities} = global;
    for (const entity of entities) {
      entity.update();
    }
    for (let i = 0; i < entities.length; ++i) {
      if (entities[i]._despawn) {
        entities.splice(i, 1);
        i--;
      }
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
  }
}

export function* waitForNoEnemy() {
  const {entities} = global;
  yield wait();
  while (entities.find(e => e instanceof Enemy))
    yield wait();
}
