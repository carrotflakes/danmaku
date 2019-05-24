const bufferSize = 1;

export class BGM {
  constructor() {
    this.intervalId = null;
    this.notes = [];
  }

  play() {
    if (this.intervalId !== null) {
      return;
    }

    const ac = new AudioContext();
    const master = ac.createGain();
    master.gain.setValueAtTime(0.1, 0);
    master.connect(ac.destination);

    const self = this;
    const acStartTime = ac.currentTime;
    function playNote(event) {
      const {start, duration, notenum, waveType, velocity} = event;
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = waveType || 'triangle';
      osc.frequency.value = 440 * Math.pow(2, (notenum - 69) / 12);
      gain.gain.value = velocity || 1;
      osc.connect(gain);
      gain.connect(master);
      osc.start(acStartTime + start);
      osc.stop(acStartTime + start + duration);
      self.notes.push({
        end: acStartTime + start + duration,
        stop(time) {osc.stop(time || 0)}
      });
    }

    const eventGenerator = makeEventGenerator();
    let event = eventGenerator.next().value;

    function update() {
      const time = ac.currentTime + bufferSize;
      while(acStartTime + event.start < time) {
        playNote(event);
        event = eventGenerator.next().value;
      }
      self.notes = self.notes.filter(note => ac.currentTime < note.end);
    }
    update();
    this.intervalId = setInterval(update, 100);
  }

  stop(time) {
    clearInterval(this.intervalId);
    this.intervalId = null;
    for (const note of this.notes)
      note.stop(time || 0);
    this.notes = [];
  }
}

class Chord {
  constructor(opts) {
    this.degree = opts.degree;
    this.tentions = opts;
    this.bass = opts.bass;
  }

  copy() {
    return new Chord({...this.tentions, degree: this.degree});
  }

  notes() {
    const {degree, tentions} = this;
    const base = 60 + degree;
    const notes = [base];
    if (typeof tentions.third === 'number')
      notes.push(base + 4 + tentions.third);
    if (typeof tentions.fifth === 'number')
      notes.push(base + 7 + tentions.fifth);
    if (typeof tentions.seventh === 'number')
      notes.push(base + 10 + tentions.seventh);
    return notes;
  }
}

function makeNote(start, duration, notenum, waveType, velocity) {
  return {
    type: 'note',
    start,
    duration,
    notenum,
    waveType,
    velocity
  };
}

function* makeEventGenerator() {
  let i = 0;
  while (1) {
    for (const chord of [
      new Chord({degree: 5, third: 0, fifth: 0, seventh: 1}),
      new Chord({degree: 7, third: 0, fifth: 0, seventh: 0}),
      new Chord({degree: 9, third: -1, fifth: 0, seventh: 0}),
      new Chord({degree: 9, third: -1, fifth: 0, seventh: 0})]) {
      yield* combine(function*() {
        yield* pat(i * 2, function*(s, d) {
          yield makeNote(s, d, clip(chord.notes()[0], 48, 59));
        });
        yield* pat3(i * 2, function*(s, d) {
          for (const note of chord.notes())
            yield makeNote(s, d-0.01, clip(note, 60, 72), 'sawtooth', 0.25);
        });
        yield* pat4(i * 2, function*(s, d) {
          yield makeNote(s, d-0.02, clip(randChoice(chord.notes()), 66, 84), 'sawtooth', 0.25);
        });
      });
      i += 1;
    }
  }
}

function* pat(time, c) {
  for (let i = 0; i < 4; ++i)
    yield* c(time + i / 2, 1/4);
}

function* pat2(time, c) {
  for (let i = 0; i < 4; ++i)
    yield* c(time + i / 2 + 0.25, 1/4);
}

function* pat3(time, c) {
  yield* c(time + 2/8, 1/8);
  yield* c(time + 3/8, 2/8);
  yield* c(time + 5/8, 1/8);
  yield* c(time + 7/8, 1/8);
  yield* c(time + 9/8, 2/8);
  yield* c(time + 11/8, 1/8);
  yield* c(time + 14/8, 2/8);
}

function* pat4(time, c) {
  for (let i = 0; i < 16; ++i)
    yield* c(time + i / 8, 1/8);
}

function combine(gen) {
  return [...gen()].sort((x, y) => x.start - y.start);
}

function clip(nn, lower, upper) {
  while (nn < lower)
    nn += 12;
  while (upper < nn)
    nn -= 12;
  return nn;
}

function randChoice(arr) {
  return arr[Math.random() * arr.length | 0];
}
