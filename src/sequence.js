import {global} from './global';
import {Enemy} from './enemy';
import {Enemy2} from './enemy2';
import {Enemy3} from './enemy3';
import {Enemy4} from './enemy4';
import {wait, sleep, fork, join} from './vm';

export function* codeGen() {
  const {entities, width, height} = global;
  while (true) {
    yield waitForNoEnemy();
    yield sleep(0.1);
    entities.push(new Enemy4({
      x: Math.random() * width, y: -10,
    }));
    yield waitForNoEnemy();
    yield sleep(0.1);
    entities.push(new Enemy({
      x: width / 2, y: -10,
      targetX: width / 3, targetY: height / 3
    }));
    yield waitForNoEnemy();
    yield sleep(0.1);
    entities.push(new Enemy2({
      x: width / 2, y: -10,
      targetX: width * 2 / 3, targetY: height / 3
    }));
    yield waitForNoEnemy();
    yield sleep(0.1);
    const x = Math.random() * width;
    for (let i = 0; i < 5; i++) {
      entities.push(new Enemy3({
        x: x, y: -10,
      }));
      yield sleep(0.1);
    }
  }
}

function* waitForNoEnemy() {
  const {entities} = global;
  while (entities.find(e => e instanceof Enemy))
    yield wait();
}
