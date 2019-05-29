import {Scene} from './scene';
import {global} from '../global';
import {Player} from '../player';
import {Game} from './game';
import {BGM} from '../bgm';

export class Title extends Scene {
  constructor() {
    super();
    this.bgm = new BGM();
    //this.bgm.play();

    const {entities, width, height, vm} = global;
    entities.forEach(e => e.despawn());
    entities.push(new Player({x: width / 2, y: height - 100}));
  }

  update() {
    const {entities} = global;
    for (const entity of entities) {
      entity.update();
    }

    const {keyboard, width, height} = global;
    if (keyboard.space) {
      //this.bgm.stop();
      global.scene = new Game(() => {
        global.scene = this;
        entities.forEach(e => e.despawn());
        entities.push(new Player({x: width / 2, y: height - 100}));
        //this.bgm.play();
      });
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
    ctx.font = '30px monospace';
    ctx.fillText('danmaku STG', 100, 100);

    ctx.fillStyle = '#000';
    ctx.font = '18px monospace';
    ctx.fillText('arrow keys ... move', 100, 300);
    ctx.fillText('z          ... shot', 100, 320);
    ctx.fillText('shift      ... slow', 100, 340);
    ctx.fillText('space      ... game start', 100, 360);
    ctx.fillText('best score : ' + global.bestScore, 100, 400);
  }
}
