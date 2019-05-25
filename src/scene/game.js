import {Scene} from './scene';
import {global} from '../global';
import {Player} from '../player';
import {Enemy} from '../enemy';
import {codeGen} from '../sequence';
import {BGM} from '../bgm';

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
