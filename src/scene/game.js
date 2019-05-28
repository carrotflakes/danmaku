import {Scene} from './scene';
import {global} from '../global';
import {Player} from '../player';
import {BGM} from '../bgm';
import {level1} from  '../levels';

export class Game extends Scene {
  constructor(exit) {
    super();
    this.exit = exit;
    this.bgm = new BGM();
    //this.bgm.play();

    const {entities, width, height, vm} = global;
    entities.forEach(e => e.despawn());
    entities.push(new Player({x: width / 2, y: height - 100}));
    this.process = vm.put(level1());

    global.score = 0;
  }

  update() {
    const {entities} = global;
    for (const entity of entities) {
      entity.update();
    }

    // 終了判定
    if (!entities.find(e => e instanceof Player)) {
      //this.bgm.stop();
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
