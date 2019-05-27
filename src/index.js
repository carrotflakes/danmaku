import {global} from './global';
import {keys} from './keyboard';
import {Title} from './scene/title';
import {VM} from './vm';

const canvasEl = document.getElementById('canvas');
const ctx = canvasEl.getContext('2d');
const width = canvasEl.clientWidth;
const height = canvasEl.clientHeight;
const spawnEntities = [];

global.ctx = ctx;
global.width = width;
global.height = height;
global.entities = [];
global.keyboard = keys;
global.score = 0;
global.bestScore = 0;
global.scene = new Title();
global.vm = new VM();
global.spawn = entity => (spawnEntities.push(entity), entity);

setInterval(() => {
  global.scene.update();
  global.vm.update();
  removeDespawnedEntities();
  global.scene.draw();
  global.entities.push(...spawnEntities);
  spawnEntities.length = 0;
}, 1000 / 60);

function removeDespawnedEntities() {
  const entities = global.entities;
  for (let i = 0; i < entities.length; ++i) {
    if (entities[i]._despawn) {
      entities.splice(i, 1);
      i--;
    }
  }
}
