// takes a slow promise and allows it to be run quickly with values interpolated (using any function) when slow promise  has yet to return

// slowPromise :FUNCTION returns a promise that takes some time to resolve
// stepToward : FUNCTION called on previous calculated value and resolved value of promise
// fps : frames per second for slowPromise to be called (leave as false if max fps for promise is desired)

export default class Interpolater {
  constructor(slowPromise, stepToward, stepArg, fps = false) {
    this.slowPromise = slowPromise;
    this.stepToward = stepToward;
    this.fast = null; //updated every iteration call
    this.slow = null; //updated only when promise resolves
    this.resolved = true;
    this.fps = fps;
    this.stepArg = stepArg; // 3rd argument supplied to stepToward (after prev value and target value (aka this.fast & this.slow)
  }

  interpolate(val) {
    this.__updateFast();
    this.__updateSlow(val);
    return this.fast;
  }
  __updateFast() {
    if (!this.fast) {
      this.fast = this.slow;
    } else {
      this.fast = this.stepToward(this.fast, this.slow, this.stepArg);
    }
  }
  async __updateSlow(val) {
    if (!this.resolved) {
      return;
    }
    if (this.resolved) {
      this.resolved = false;
      let v;

      if (this.fps) {
        const [p1, p2] = [this.slowPromise(val), this.__timeoutPromise()];
        let p = await Promise.all([p1, p2]);
        v = p[0];
        this.resolved = true;
        v && (this.slow = v);
      } else {
        v = await this.slowPromise(val);
        this.resolved = true;
        v && (this.slow = v);
      }
    }
  }
  async __timeoutPromise() {
    // console.log('calling TO');
    return new Promise((resolve, reject) => {
      setTimeout(resolve, 1000 / this.fps);
    }).then(() => {
      // console.log('resolved TO');
      return null;
    });
  }
}
