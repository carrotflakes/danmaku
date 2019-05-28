import {ac, master} from './audio';

export function playerShot() {
  const notenum = 79;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  const time = ac.currentTime;
  osc.type = 'square';
  osc.frequency.value = 440 * Math.pow(2, (notenum - 69) / 12);
  osc.frequency.exponentialRampToValueAtTime(osc.frequency.value / 2, time + 0.1);
  gain.gain.value = 0.2;
  osc.connect(gain);
  gain.connect(master);
  osc.start(time);
  osc.stop(time + 0.1);
}

export function enemyDefeated() {
  const notenum = 60;
  const mod = ac.createOscillator();
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  const modGain = ac.createGain();
  const time = ac.currentTime;
  osc.type = 'sine';
  osc.frequency.value = 440 * Math.pow(2, (notenum - 69) / 12) * (0.98 + Math.random() * 0.04);
  mod.frequency.value = osc.frequency.value * 2.01;
  gain.gain.value = 0.2;
  modGain.gain.value = 5000;
  modGain.gain.linearRampToValueAtTime(200, time + 0.2);
  mod.connect(modGain);
  modGain.connect(osc.frequency);
  osc.connect(gain);
  gain.connect(master);
  mod.start(time);
  mod.stop(time + 0.2);
  osc.start(time);
  osc.stop(time + 0.2);
}
