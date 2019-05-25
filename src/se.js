import {ac, master} from './audio';

export function playerShot() {
  const notenum = 72;
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
