import {global} from './global';
import {wait, fork} from './vm';

export class Entity {
  constructor() {
    this.x = 0;
    this.y = 0;
  }

  update() {
  }

  draw() {
  }

  despawn() {
    const {entities} = global;
    // FIXME
    entities.splice(entities.indexOf(this), 1);
  }

  *setPos(x, y) {
    this.x = x;
    this.y = y;
  }

  *moveTo(x, y, sec) {
    const startX = this.x;
    const startY = this.y;
    const msec = sec * 1000 | 0;
    const startTime = Date.now();
    const endTime = startTime + msec;
    let now = Date.now();
    while (now < endTime) {
      const rate = (now - startTime) / msec;
      this.x = (x - startX) * rate + startX;
      this.y = (y - startY) * rate + startY;
      yield wait();
      now = Date.now();
    }
    this.x = x;
    this.y = y;
  }

  // Kill process when entitiy is not exist
  *autoKill(process) {
    const self = this;
    yield fork(function* () {
      const {entities} = global;
      while (~entities.indexOf(self))
        yield wait();
      process.kill();
    });
  }
}
