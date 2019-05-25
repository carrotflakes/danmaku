export class VM {
  constructor() {
    this._processes = [];
  }

  put(codeIt) {
    const process = new Process(codeIt);
    this._processes.push(process);
    return process;
  }

  update() {
    const codeIts = [];
    const spawn = codeIts.push.bind(codeIts);
    for (const process of this._processes) {
      process._update(spawn);
    }
    codeIts.forEach(this.put.bind(this));
  }
}

export class Process {
  constructor(codeIt) {
    this._callStack = [codeIt];
    this._frozen = false;
  }

  get done() {
    return !this._callStack[0];
  }

  kill() {
    this._callStack = [];
  }

  _update(spawn) {
    if (this._frozen)
      return;

    let signal = null;
    while (!this.done) {
      const it = this._callStack[this._callStack.length - 1];
      const {value, done} = it.next();
      if (done) {
        this._callStack.pop();
        continue;
      }
      if (value.next) {
        this._callStack.push(value);
        continue;
      }
      switch (value.type) {
        case 'WAIT':
          return;
        case 'FORK':
          spawn(value.codeIt);
          break;
        default:
          if (signal === value) {
            this._frozen = true;
            throw new Error('Unknown signal repeated', value);
          }
          console.warn('Unknown signal: ', value);
          signal = value;
          break;
      }
    }
  }
}

// 制御を戻す
export function wait() {
  return {
    type: 'WAIT'
  };
}

// プロセスをフォーク
export function fork(codeGenOrIt) {
  let codeIt = codeGenOrIt;

  // Call if it is a generator
  if (codeIt instanceof Function)
    codeIt = codeIt();

  return {
    type: 'FORK',
    codeIt
  };
}

// プロセスの終了を待つ
export function* join(process) {
  while (!process.done)
    yield wait();
}

// sec 秒待つ
export function* sleep(sec) {
  const end = Date.now() + (sec * 1000 | 0);
  while (Date.now() < end)
    yield wait();
}
