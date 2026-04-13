class DeferCounter {
  constructor() {
    this.resetCount();
  }

  resetCount() {
    this.deferCount = 0;
    this.inputs = new Map();
  }

  getCount() {
    return this.deferCount;
  }

  increment(input) {
    if(input) {
      if(this.inputs.has(input)) {
        return;
      }
      this.inputs.set(input, true);
    }

    this.deferCount++;
  }
}

module.exports = DeferCounter;
