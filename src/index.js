import {global} from './global';
import {keys} from './keyboard';
import {Title} from './scene/title';
import {VM} from './vm';

const canvasEl = document.getElementById('canvas');
const ctx = canvasEl.getContext('2d');
const width = canvasEl.clientWidth;
const height = canvasEl.clientHeight;

global.ctx = ctx;
global.width = width;
global.height = height;
global.entities = [];
global.keyboard = keys;
global.score = 0;
global.bestScore = 0;
global.scene = new Title();
global.vm = new VM();

setInterval(() => {
  global.scene.update();
  global.vm.update();
  global.scene.draw();
}, 1000 / 60);
