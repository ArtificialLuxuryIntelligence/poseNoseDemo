// takes a slow promise and allows it to be run quickly with values interpolated (using any function) when slow promise  has yet to return

// slowPromise :FUNCTION returns a promise that takes some time to resolve
// stepToward : FUNCTION called on previous calculated value and resolved value of promise
// fps : frames per second for slowPromise to be called (leave as false if max fps for promise is desired)

export default class Interpolater {
  constructor(slowPromise, initialVal, stepToward, fps = false) {
    this.slowPromise = slowPromise;
    this.stepToward = stepToward;
    this.fast = initialVal; //updated every iteration call
    this.slow = initialVal; //updated only when promise resolves
    this.resolved = true;
    this.fps = fps;
  }

  interpolate(val) {
    this.__updateFast();
    this.__updateSlow(val);
    return this.fast;
  }
  __updateFast() {
    this.fast = this.stepToward(this.fast, this.slow);
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
        this.slow = v;
      } else {
        v = await this.slowPromise();
        this.resolved = true;
        this.slow = v;
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
