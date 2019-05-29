import {Scene} from './scene';
import {global} from '../global';
import {BGM} from '../bgm';

export class GameOver extends Scene {
  constructor(game, exit) {
    super();
    this.game = game;
    this.exit = exit;
  }

  update() {
    const {keyboard} = global;
    if (keyboard.space) {console.log(1)
      keyboard.space = false;
      this.exit();
      return;
    }

    this.game.update();
  }

  draw() {
    const {ctx, width, height} = global;

    this.game.draw();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#000';
    ctx.font = '30px monospace';
    ctx.fillText('Game over...', 100, height * 1/2);

    ctx.fillStyle = '#000';
    ctx.font = '18px monospace';
    ctx.fillText('score: ' + global.score, 120, height * 1/2 + 40);
  }
}
