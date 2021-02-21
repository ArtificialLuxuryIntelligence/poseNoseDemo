const drawCircleControl = function (
  coords,
  ctx,
  options = { inputRadius: 1, outputRadius: 50, center: [70, 100] }
) {
  const [x, y] = coords;
  const scaleFactor = options.outputRadius / options.inputRadius;
  const [c_x, c_y] = options.center;
  const { outputRadius: r } = options;
  let x_j = c_x - x * scaleFactor;
  let y_j = c_y - y * scaleFactor;

  ctx.beginPath();
  ctx.arc(c_x, c_y, r, 0, 2 * Math.PI);
  ctx.fillStyle = 'rgba(200,0,0,0.8)';

  ctx.fill();

  ctx.beginPath();
  ctx.arc(x_j, y_j, 10, 0, 2 * Math.PI);
  ctx.fillStyle = 'black';
  ctx.fill();
};

const drawSquareControl = function (
  coords,
  ctx,
  options = {
    inputDimensions: [1, 1],
    outputDimensions: [100, 100],
    topLeft: [20, 200],
  }
) {
  const { inputDimensions, outputDimensions, topLeft } = options;
  const [x, y] = coords;
  const [c_x, c_y] = [
    topLeft[0] + outputDimensions[0] / 2,
    topLeft[1] + outputDimensions[1] / 2,
  ];
  const scaleFactorX = outputDimensions[0] / 2 / inputDimensions[0];
  const scaleFactorY = outputDimensions[1] / 2 / inputDimensions[1];

  //   const [c_x, c_y] = options.topLeft;
  //   const { outputRadius: r } = options;
  let x_j = c_x - x * scaleFactorX;
  let y_j = c_y - y * scaleFactorY;

  //   ctx.strokeStyle = 'pink';
  ctx.beginPath();
  ctx.rect(topLeft[0], topLeft[1], outputDimensions[0], outputDimensions[1]);
  ctx.fillStyle = 'rgba(200,0,0,0.8)';
  ctx.fill();
  //   ctx.stroke();

  ctx.beginPath();

  ctx.arc(x_j, y_j, 10, 0, 2 * Math.PI);
  ctx.fillStyle = 'blue';
  ctx.fill();
};

const drawBoundingFace = (
  central_bounding,
  outer_bounding,
  prediction,
  ctx
) => {
  const landmarks = prediction.landmarks;
  // Draw Dots
  for (let i = 0; i < landmarks.length; i++) {
    const x = landmarks[i][0];
    const y = landmarks[i][1];
    ctx.beginPath();
    if (i === 2) {
      // draw nose
      ctx.arc(x, y, 15 /* radius */, 0, 3 * Math.PI);
      ctx.fillStyle = 'black';
    } else {
      // ctx.arc(x, y, 10 /* radius */, 0, 3 * Math.PI);
      // ctx.fillStyle = 'orangered';
    }
    // ctx.arc(x, y, 2 /* radius */, 0, 3 * Math.PI);
    ctx.fill();
  }

  const { topLeft, width, height, center } = getDimensions(prediction);
  // -------------------- Draw face bounding box;
  // ctx.strokeStyle = 'pink';
  // ctx.beginPath();
  // ctx.rect(topLeft[0], topLeft[1], width, height);
  // ctx.stroke();

  // --------------------------------------------Draw  configuration bounding boxes

  //  --------------- Draw central bounding box; // only used for named directions "up" "down" etc -- going to be removed
  // const {
  //   topLeft: topLeft_c,
  //   width: width_c,
  //   height: height_c,
  // } = getBoundingDimensions(central_bounding);

  // ctx.strokeStyle = 'green';
  // ctx.beginPath();
  // ctx.rect(
  //   center[0] + topLeft_c[0],
  //   center[1] + topLeft_c[1],
  //   width_c,
  //   height_c
  // );
  // ctx.stroke();

  // --------------- Draw outer bounding box
  const {
    topLeft: topLeft_o,
    width: width_o,
    height: height_o,
  } = getBoundingDimensions(outer_bounding);

  ctx.strokeStyle = 'purple';
  ctx.beginPath();
  ctx.rect(
    center[0] + topLeft_o[0],
    center[1] + topLeft_o[1],
    width_o,
    height_o
  );
  ctx.stroke();

  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  // ctx.fillStyle = 'pink';
  ctx.fillRect(
    center[0] + topLeft_o[0],
    center[1] + topLeft_o[1],
    width_o,
    height_o
  );
};

function clearCanvas(ctx) {
  let w = ctx.canvas.width;
  let h = ctx.canvas.height;
  ctx.clearRect(0, 0, w, h);
}

// cursor contrlol
const drawJoystick = (
  vector,
  ctx,
  options = {
    inputRadius: 1,
    outputRadius: 100,
    center: [300, 300],
    stoppingRatio: 0,
  }
) => {
  const [x, y] = vector;
  const scaleFactor = options.outputRadius / options.inputRadius;
  const [c_x, c_y] = options.center;
  const { outputRadius: r, stoppingRatio } = options;
  let x_j = c_x - x * scaleFactor;
  let y_j = c_y - y * scaleFactor;

  //outer limit
  ctx.beginPath();
  ctx.arc(c_x, c_y, r, 0, 2 * Math.PI);
  ctx.fillStyle = 'blue';
  ctx.fill();

  // stopping ratio
  ctx.beginPath();
  ctx.arc(c_x, c_y, stoppingRatio * r, 0, 2 * Math.PI);
  ctx.fillStyle = 'red';
  ctx.fill();

  //vector tip
  ctx.beginPath();
  ctx.arc(x_j, y_j, 8, 0, 2 * Math.PI);
  ctx.fillStyle = 'white';
  ctx.fill();

  // line to vector
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(c_x, c_y);
  ctx.lineTo(x_j, y_j);
  ctx.stroke();
};

const updatePosition = (
  vector,
  prevPos,
  stoppingRatio,
  canvasDimensions,
  speed
) => {
  const [width, height] = canvasDimensions;
  const [x, y] = vector;
  const [x_p, y_p] = prevPos;
  let x_new = -x * speed + x_p;
  let y_new = -y * speed + y_p;

  // Stop if within 'stopping ratio' *r
  let r = Math.sqrt(vector[0] ** 2 + vector[1] ** 2);
  if (r < stoppingRatio) {
    return prevPos;
  }
  // Canvas edge conditions
  if (x_new >= width) {
    x_new = 0;
  } else if (x_new <= 0) {
    x_new = width;
  }
  if (y_new >= height) {
    y_new = 0;
  } else if (y_new <= 0) {
    y_new = height;
  }
  return [x_new, y_new];
};

//helpers
function getDimensions(prediction) {
  const topLeft = prediction.topLeft;
  const bottomRight = prediction.bottomRight;
  const width = bottomRight[0] - topLeft[0];
  const height = bottomRight[1] - topLeft[1];
  const center = [topLeft[0] + width / 2, topLeft[1] + height / 2];

  return { topLeft, bottomRight, width, height, center };
}

function getBoundingDimensions(bounding) {
  let { x: bounding_x, y: bounding_y } = bounding;
  let topLeft = [-bounding_x[1], -bounding_y[1]]; // weirdness to correct for mirror
  let height = Math.abs(bounding_y[0]) + Math.abs(bounding_y[1]);
  let width = Math.abs(bounding_x[0]) + Math.abs(bounding_x[1]);

  return { topLeft, width, height };
}

export {
  clearCanvas,
  drawCircleControl,
  drawSquareControl,
  drawBoundingFace,
  drawJoystick,
  updatePosition,
};
