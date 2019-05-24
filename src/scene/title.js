import {Scene} from './scene';
import {global} from '../global';
import {Game} from './game';
import {BGM} from '../bgm';

export class Title extends Scene {
  constructor() {
    super();
    this.bgm = new BGM();
    //this.bgm.play();
  }

  update() {
    const {keyboard} = global;
    if (keyboard.space) {
      //this.bgm.stop();
      global.scene = new Game(() => {
        global.bestScore = Math.max(global.bestScore, global.score);
        global.scene = this;
        //this.bgm.play();
      });
    }
  }

  draw() {
    const {ctx} = global;
    // 背景をクリア
    ctx.fillStyle = '#EEE';
    ctx.fillRect(0, 0, 400, 600);

    ctx.fillStyle = '#000';
    ctx.font = '30px monospace';
    ctx.fillText('danmaku STG', 100, 100);

    ctx.fillStyle = '#000';
    ctx.font = '18px monospace';
    ctx.fillText('best socre: ' + global.bestScore, 50, 380);
    ctx.fillText('push space to start', 50, 400);
  }
}
