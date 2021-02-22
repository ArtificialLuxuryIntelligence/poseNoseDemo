let SHIFT = 150;

export default class BlasterGame {
  constructor(ctx) {
    this.ctx = ctx;
    this.canvasDims = { w: ctx.canvas.width, h: ctx.canvas.height };
    this.shots = [];
  }

  updateCanvas = (vector, tick) => {
    this.__drawSquares(vector);
    // this.__handleShots();
    // if (tick % 20 === 0) {
    //   this.__fireShot(vector, 0.1);
    // }
  };

  __drawSquares = (vector) => {
    this.ctx.strokeStyle = 'white';
    this.ctx.fillStyle = 'black';

    let [x, y] = vector;
    let { h, w } = this.canvasDims;
    let b1 = { width: 1200, height: 900 };
    let b2 = { width: 400, height: 300 };

    let c = [w / 2, h / 2];
    //static window
    let b1_corners = [
      [c[0] - b1.width / 2, c[1] - b1.height / 2],
      [c[0] - b1.width / 2, c[1] + b1.height / 2],
      [c[0] + b1.width / 2, c[1] + b1.height / 2],
      [c[0] + b1.width / 2, c[1] - b1.height / 2],
    ];
    b1.corners = b1_corners;
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(b1.corners[0][0], b1.corners[0][1], b1.width, b1.height);

    // moving parallax window
    //shift center
    let c2 = c.map((val, i) => {
      return val - vector[i] * SHIFT;
    });

    let b2_corners = [
      [c2[0] - b2.width / 2, c2[1] - b2.height / 2],
      [c2[0] - b2.width / 2, c2[1] + b2.height / 2],
      [c2[0] + b2.width / 2, c2[1] + b2.height / 2],
      [c2[0] + b2.width / 2, c2[1] - b2.height / 2],
    ];

    // let b2_corners_shift = perspectiveWarp(b2_corners, vector, shift); //TODO?
    // b2.corners = b2_corners_shift;
    b2.corners = b2_corners;
    this.ctx.beginPath();
    this.ctx.lineTo(b2.corners[0][0], b2.corners[0][1]);
    this.ctx.lineTo(b2.corners[1][0], b2.corners[1][1]);
    this.ctx.lineTo(b2.corners[2][0], b2.corners[2][1]);
    this.ctx.lineTo(b2.corners[3][0], b2.corners[3][1]);
    this.ctx.closePath();
    // this.ctx.fill();
    this.ctx.stroke();
    // this.ctx.fillRect(b2.corners[0][0], b2.corners[0][1], b2.width, b2.height);

    // connect corners with lines
    this.ctx.beginPath();
    this.ctx.moveTo(b1.corners[0][0], b1.corners[0][1]);
    this.ctx.lineTo(b2.corners[0][0], b2.corners[0][1]);

    this.ctx.moveTo(b1.corners[1][0], b1.corners[1][1]);
    this.ctx.lineTo(b2.corners[1][0], b2.corners[1][1]);

    this.ctx.moveTo(b1.corners[2][0], b1.corners[2][1]);
    this.ctx.lineTo(b2.corners[2][0], b2.corners[2][1]);

    this.ctx.moveTo(b1.corners[3][0], b1.corners[3][1]);
    this.ctx.lineTo(b2.corners[3][0], b2.corners[3][1]);

    this.ctx.closePath();
    this.ctx.stroke();
  };

  __fireShot = (vector, speed) => {
    let { h, w } = this.canvasDims;

    let c = [w / 2, h / 2];
    let c2 = c.map((val, i) => {
      return val - vector[i] * SHIFT;
    });
    let start = [0, 0];
    let v = [start[0] - c2[0], start[1] - c2[1]]; //high number
    // get position of end of vector turret thing

    this.shots.push({
      position: start,
      vector: v,
      radius: 50,
      speed,
      hit: false,
      end: c2,
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
    const [x_e, y_e] = shot.end;

    // let { w, h } = this.canvasDims;

    let d = Math.sqrt((x_e - x) ** 2 + (y_e - y) ** 2);
    if (d <= 10) {
      return null;
    }

    // update position
    let newPos = [x - x_v * speed, y - y_v * speed];
    // update radius
    let newRadius = shot.radius - 2;
    let res = { ...shot, radius: newRadius, position: newPos };
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
}

function perspectiveWarp(corners, vector, shift) {
  let cornerShift = [...corners];

  cornerShift[0] = [
    corners[0][0] + (vector[0] * shift) / 3,
    corners[0][1] + (vector[1] * shift) / 3,
  ];
  cornerShift[1] = [
    corners[1][0] + (vector[0] * shift) / 3,
    corners[1][1] + (vector[1] * shift) / 3,
  ];
  // cornerShift[2] = [
  //   corners[2][0] + (vector[0] * shift) / 3,
  //   corners[2][1] + (vector[1] * shift) / 3,
  // ];
  // cornerShift[3] = [
  //   corners[3][0] + (vector[0] * shift) / 3,
  //   corners[3][1] - (vector[1] * shift) / 3,
  // ];

  return cornerShift;
}
