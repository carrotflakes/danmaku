import {global} from './global';
import {Player} from './player';
import {Enemy5 as Enemy, angleTo} from './enemy5';
import {StageLogo} from './stageLogo';
import {wait, sleep, fork, join} from './vm';

export function* level1() {
  const {entities, spawn, width, height} = global;
  yield waitToDespawn(spawn(new StageLogo({level: 1})));
  for (let phase = 0; phase < 10; ++phase) {
    yield waitForNoEnemy();
    yield sleep(0.1);
    function* enemy1(enemy, x) {
      yield enemy.autoKill(enemy.process);
      yield enemy.setPos(x, 0);
      yield enemy.moveTo(x, 100, 0.5);
      const shooting = yield fork(function*() {
        while (enemy.exists) {
          const player = entities.find(e => e instanceof Player);
          const angle = angleTo(enemy, player);
          yield enemy.shot(straight({parent: enemy, angle, velocity: 3}));
          yield sleep(0.2);
        }
      });
      yield sleep(2);
      shooting.kill();
      yield enemy.moveTo(x, height, 1);
      enemy.despawn();
    }
    for (let i = 0; i < phase + 2; ++i) {
      spawnEnemy(enemy1, 100 + 200 * i / (phase + 1));
    }

    yield waitForNoEnemy();
    yield sleep(0.1);
    function* enemy2(enemy, x) {
      yield enemy.autoKill(enemy.process);
      yield enemy.setPos(x, 0);
      yield enemy.moveTo(x, 100, 0.5);
      const player = entities.find(e => e instanceof Player);
      for (let i = 0; i < 3 + phase; i++) {
        yield shotNway({
          build: straight,
          parent: enemy,
          nway: 5,
          angle: angleTo(enemy, player),
          dAngle: 0.03,
          velocity: 4
        });
        yield sleep(0.4);
      }
      yield sleep(1);
      yield enemy.moveTo(x, height, 1);
      enemy.despawn();
    }
    for (let i = 0; i < phase + 2; ++i) {
      spawnEnemy(enemy2, 50 + 300 * Math.random());
      yield sleep(0.5);
    }

    yield waitForNoEnemy();
    yield sleep(0.1);
    function* enemy3(enemy) {
      yield enemy.autoKill(enemy.process);
      yield enemy.setPos(0, 100);
      yield enemy.moveTo(10, 100, 0.1);
      const shooting = yield fork(function*() {
        while (enemy.exists) {
          yield enemy.shot(straight({parent: enemy, angle: down, velocity: 6}));
          yield sleep(0.3);
        }
      });
      yield enemy.moveTo(width - 10, 100, 0.4);
      yield enemy.moveTo(width - 10, 150, 0.2);
      yield enemy.moveTo(10, 150, 0.4);
      yield enemy.moveTo(10, 200, 0.2);
      yield enemy.moveTo(width - 10, 200, 0.4);
      yield enemy.moveTo(width - 10, 250, 0.2);
      yield enemy.moveTo(10, 250, 0.4);
      yield enemy.moveTo(10, 300, 0.2);
      yield enemy.moveTo(width - 10, 300, 2);
      shooting.kill();
      yield enemy.moveTo(width, 300, 0.1);
      enemy.despawn();
    }
    for (let i = 0; i < 5 + phase; i++) {
      spawnEnemy(enemy3);
      yield sleep(0.1);
    }

    yield waitForNoEnemy();
    yield sleep(0.1);
    function* enemy4(enemy, x) {
      yield enemy.autoKill(enemy.process);
      yield enemy.setPos(x, 0);
      yield enemy.moveTo(x, 100, 0.5);
      const shooting = yield fork(function*() {
        let angle = 0;
        let dAngle = 0.01;
        while (enemy.exists) {
          yield enemy.shot(straight({
            parent: enemy,
            angle: angle += (dAngle += 0.004),
            velocity: 1.5
          }));
          yield sleep(0.01);
        }
      });
      yield sleep(8);
      shooting.kill();
      yield sleep(1);
      yield enemy.moveTo(x, height, 1);
      enemy.despawn();
    }
    if (phase < 5)
      spawnEnemy(enemy4, 200);
    else if (phase < 7) {
      spawnEnemy(enemy4, 100);
      spawnEnemy(enemy4, 300);
    } else {
      spawnEnemy(enemy4, 100);
      spawnEnemy(enemy4, 300);
      yield sleep(3);
      spawnEnemy(enemy4, 200);
    }
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

export function spawnEnemy(codeGen, ...args) {
  return global.spawn(new Enemy(entity => codeGen(entity, ...args)));
}

export function moveTo(entity, angle, velocity) {
  entity.x += Math.cos(angle) * velocity;
  entity.y -= Math.sin(angle) * velocity;
}

export function straight(opts) {
  let {
    parent,
    angle,
    velocity,
  } = opts;
  return function*(bullet) {
    yield bullet.setPos(parent.x, parent.y);
    while (1) {
      moveTo(bullet, angle, velocity);
      yield wait();
    }
  }
}

export function* shotNway(opts) {
  let {
    build,
    parent,
    nway,
    angle,
    dAngle,
    velocity,
    velocityError,
  } = opts;
  for (let i = 0; i < nway; ++i) {
    yield parent.shot(build({
      ...opts,
      angle: angle + dAngle * (i - nway / 2),
      velocity: velocity + (Math.random() * 2 - 1) * (velocityError | 0)
    }));
  }
}

const {up, left, right, down} = {
  up: Math.PI * 0.5, left: Math.PI * 0, right: Math.PI * 1.0, down: Math.PI * 1.5
};
