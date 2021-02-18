import React, { useRef, useEffect, useState } from 'react';

export default function Canvas({
  unitCirclePositionRef,
  unitSquarePositionRef,
  webcamReference,
}) {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const [speed, setSpeed] = useState(6);

  useEffect(() => {
    const animationLoop = () => {
      const ctx = canvasRef.current.getContext('2d');
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;

      let canvasWidth = ctx.canvas.offsetWidth;
      let canvasHeight = ctx.canvas.offsetHeight;

      let position = [canvasWidth / 2, canvasHeight / 2];
      let canvasDimensions = [canvasWidth, canvasHeight];

      const loop = () => {
        // Set canvas width
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;

        //Render to canvas

        let vector = unitCirclePositionRef.current;
        if (vector) {
          position = updatePosition(vector, position, canvasDimensions, speed);
          updateCanvas(position, ctx);
        }

        animationFrameRef.current = requestAnimationFrame(loop);
      };
      loop();
    };

    animationLoop();

    return () => {
      console.log('clearing animation frame');
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [unitCirclePositionRef, unitSquarePositionRef]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',

        top: 0,
        left: 0,
        right: 0,
        zindex: 9,
        // width: 720,
        // height: 500,
        transform: 'scale(-1, 1)',
        pointerEvents: 'none',
      }}
    />
  );
}

const updatePosition = (vector, prevPos, canvasDimensions, speed) => {
  const [width, height] = canvasDimensions;
  const [x, y] = vector;
  const [x_p, y_p] = prevPos;
  let x_new = -x * speed + x_p;
  let y_new = -y * speed + y_p;

  //boundary conditions
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

const updateCanvas = (position, ctx) => {
  const [x, y] = position;
  // console.log(x);

  ctx.beginPath();
  ctx.arc(x, y, 10, 0, 2 * Math.PI);
  ctx.fillStyle = 'purple';
  ctx.fill();
};

const drawJoystick = (
  vector,
  ctx,
  options = { inputRadius: 1, outputRadius: 100, center: [300, 300] }
) => {
  const [x, y] = vector;
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
  ctx.fillStyle = 'white';
  ctx.fill();
};
