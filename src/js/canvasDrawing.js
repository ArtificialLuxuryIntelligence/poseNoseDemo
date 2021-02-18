const drawCircleControl = function (
  coords,
  ctx,
  options = { inputRadius: 1, outputRadius: 50, center: [50, 100] }
) {
  const [x, y] = coords;
  const scaleFactor = options.outputRadius / options.inputRadius;
  const [c_x, c_y] = options.center;
  const { outputRadius: r } = options;
  let x_j = c_x - x * scaleFactor;
  let y_j = c_y - y * scaleFactor;

  ctx.beginPath();
  ctx.arc(c_x, c_y, r, 0, 2 * Math.PI);
  ctx.fillStyle = 'red';
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
    topLeft: [0, 200],
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
  ctx.fillStyle = 'red';
  ctx.fill();
  //   ctx.stroke();

  ctx.beginPath();

  ctx.arc(x_j, y_j, 10, 0, 2 * Math.PI);
  ctx.fillStyle = 'blue';
  ctx.fill();
};

const drawFace = (prediction, ctx) => {
  const landmarks = prediction.landmarks;
  // Draw Dots
  for (let i = 0; i < landmarks.length; i++) {
    const x = landmarks[i][0];
    const y = landmarks[i][1];
    ctx.beginPath();
    if (i === 2) {
      ctx.arc(x, y, 15 /* radius */, 0, 3 * Math.PI);
      ctx.fillStyle = 'black';
    } else {
      //   ctx.arc(x, y, 10 /* radius */, 0, 3 * Math.PI);
      //   ctx.fillStyle = 'orangered';
    }
    // ctx.arc(x, y, 2 /* radius */, 0, 3 * Math.PI);
    ctx.fill();
  }
  // Draw bounding box;

  const { topLeft, width, height } = getDimensions(prediction);

  ctx.strokeStyle = 'pink';
  ctx.beginPath();
  ctx.rect(topLeft[0], topLeft[1], width, height);
  ctx.stroke();
};

function clearCanvas(ctx) {
  let w = ctx.canvas.width;
  let h = ctx.canvas.height;
  ctx.clearRect(0, 0, w, h);
}

//   // Helper
function getDimensions(prediction) {
  const topLeft = prediction.topLeft;
  const bottomRight = prediction.bottomRight;
  const width = bottomRight[0] - topLeft[0];
  const height = bottomRight[1] - topLeft[1];
  const center = [topLeft[0] + width / 2, topLeft[1] + height / 2];

  return { topLeft, bottomRight, width, height, center };
}

export { clearCanvas, drawCircleControl, drawSquareControl, drawFace };
