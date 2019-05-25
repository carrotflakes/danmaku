export const ac = new AudioContext();
export const master = ac.createGain();
master.gain.value = 0.1;

master.connect(ac.destination);
