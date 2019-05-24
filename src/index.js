import {global} from './global';
import {keys} from './keyboard';
import {Title} from './scene/title';

const canvasEl = document.getElementById('canvas');
const ctx = canvasEl.getContext('2d');
const width = canvasEl.clientWidth;
const height = canvasEl.clientHeight;

const entities = [];

global.ctx = ctx;
global.width = width;
global.height = height;
global.entities = entities;
global.keyboard = keys;
global.score = 0;
global.bestScore = 0;
global.scene = new Title();

setInterval(() => {
  global.scene.update();
  global.scene.draw();
}, 1000 / 60);
