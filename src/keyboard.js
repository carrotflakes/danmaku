export const keys = {
  left: 0,
  right: 0,
  up: 0,
  down: 0,
  a: 0,
  space: 0,
};
const code2key = {
  ArrowLeft: 'left',
  ArrowRight: 'right',
  ArrowUp: 'up',
  ArrowDown: 'down',
  KeyZ: 'a',
  Space: 'space'
};

window.addEventListener('keydown', e => {
  const key = code2key[e.code];
  if (key)
    keys[key] = true;
});

window.addEventListener('keyup', e => {
  const key = code2key[e.code];
  if (key)
    keys[key] = false;
});
