import {global} from './global';
import {Entity} from './entity';

export class StageLogo extends Entity {
  constructor(opts) {
    super();
    this.level = opts.level || 0;
    this.sec = 0;
  }

  update() {
    this.sec += 1 / 60;
    if (4 <= this.sec)
      this.despawn();
  }

  draw() {
    const {ctx} = global;
    const size = 20;

    if (this.sec < 1)
      ctx.globalAlpha = this.sec / 1;
    else if (this.sec < 3)
      ctx.globalAlpha = 1;
    else if (this.sec < 4)
      ctx.globalAlpha = (4 - this.sec) / 1;
    else
      ctx.globalAlpha = 0;
    ctx.fillStyle = '#000';
    ctx.font = '30px monospace';
    ctx.fillText('stage ' + this.level, 100, 100);
    ctx.globalAlpha = 1;
  }
}
