import { clearCanvas, drawJoystick } from './canvasDrawing';

export default class ShipGame {
  constructor(ctx) {
    this.ctx = ctx;
    this.canvasDims = { w: ctx.canvas.width, h: ctx.canvas.height };
    this.shots = [];
    this.targets = [];
  }

  updateCanvas = (cursor, vector, stoppingRatio, tick) => {
    clearCanvas(this.ctx);

    // Player
    this.__drawJoystick(vector, this.ctx, {
      inputRadius: 1,
      outputRadius: 50,
      center: cursor.position,
      stoppingRatio,
    });

    // Shots

    this.__handleShots();
    if (tick % 12 === 0) {
      this.__fireShot(cursor.position, vector, 18, this.shots, {
        inputRadius: 1,
        outputRadius: 50,
      });
    }

    // Targets

    this.__handleTargets();
    if (tick % 100 === 0) {
      this.__createTarget(5);
    }

    // this.__checkCollisions();
  };

  __drawJoystick = drawJoystick;

  // Shots
  __fireShot = (
    position,
    vector,
    speed,
    shots,
    options = {
      inputRadius: 1,
      outputRadius: 100,
    }
  ) => {
    const [x, y] = vector;
    const scaleFactor = options.outputRadius / options.inputRadius;
    const [c_x, c_y] = position;
    // get position of end of vector turret thing
    let x_j = c_x - x * scaleFactor;
    let y_j = c_y - y * scaleFactor;

    this.shots.push({
      position: [x_j, y_j],
      vector,
      radius: 5,
      speed,
      hit: false,
    });
  };
  __drawShot = (shot) => {
    const [x, y] = shot.position;
    this.ctx.beginPath();
    this.ctx.arc(x, y, shot.radius, 0, 2 * Math.PI);
    this.ctx.fillStyle = 'purple';
    this.ctx.fill();
  };
  __updateShot = (shot) => {
    const [x, y] = shot.position;
    const [x_v, y_v] = shot.vector;
    const speed = shot.speed;

    //set to null if out of bounds
    let { w, h } = this.canvasDims;
    if (x > w || x < 0 || y < 0 || y > h) {
      return null;
    }

    // update position
    let newPos = [x - x_v * speed, y - y_v * speed];
    let res = { ...shot, position: newPos };
    return res;
  };
  __handleShots = () => {
    this.shots.forEach((shot, i, a) => {
      this.__drawShot(shot);
      a[i] = this.__updateShot(shot);
    });
    this.shots = this.shots.filter((shot) => {
      if (!shot) {
        return false;
      }
      if (shot.hit) {
        return false;
      }
      return true;
    });
  };

  // Targets
  __createTarget = (speed) => {
    // let c = this.ctx.canvas;
    const { w, h } = this.canvasDims; // console.log(this.ctx.canvas.width);
    // Create new target outside bounds;

    let x, y;
    let top = Math.random() > 0.5;
    let left = Math.random() > 0.5;
    // let x = left ? -10 : w + 10;
    // let y = top ? -10 : h + 10;
    if (top) {
      y = -10;
      x = Math.random() * (w + 20);
    } else {
      y = h + 10;
      x = Math.random() * (w + 20);
    }

    // vector
    let r = Math.random();
    let r2 = Math.random();
    let x_v = left ? -1 * r : 1 * r;
    let y_v = top ? -1 * r2 : 1 * r2;

    this.targets.push({
      position: [x, y],
      vector: [x_v, y_v],
      speed,
      radius: 20,
      hit: false,
    });
  };
  __drawTarget = (target) => {
    const [x, y] = target.position;
    this.ctx.beginPath();
    this.ctx.arc(x, y, target.radius, 0, 2 * Math.PI);
    this.ctx.fillStyle = 'purple';
    this.ctx.fill();
  };
  __updateTarget = (target) => {
    const [x, y] = target.position;
    const [x_v, y_v] = target.vector;
    const speed = target.speed;

    //set to null if out of bounds
    let { w, h } = this.canvasDims;
    if (x > w + 10 || x < -10 || y < -10 || y > h + 10) {
      return null;
    }

    // update position
    let newPos = [x - x_v * speed, y - y_v * speed];
    let res = { ...target, position: newPos };
    return res;
  };
  __handleTargets = () => {
    this.targets.forEach((target, i, a) => {
      a[i] = this.__checkTargetCollision(target);
      this.__drawTarget(target);
      a[i] = this.__updateTarget(target);
    });
    this.targets = this.targets.filter((target) => {
      //out of bounds
      if (!target) {
        return false;
      }
      if (target.hit) {
        return false;
      }
      return true;
    });
  };

  __checkTargetCollision = (target) => {
    let [x, y] = target.position;
    let r = target.radius;

    this.shots.forEach((shot, i, a) => {
      let [x_t, y_t] = shot.position;
      let r_t = shot.radius;

      //check if collision
      let d = Math.sqrt((x - x_t) ** 2 + (y - y_t) ** 2);
      if (d < r_t + r) {
        a[i].hit = true;
        target.hit = true;
        console.log('hit');
      }
    });
    return target;
  };
}
