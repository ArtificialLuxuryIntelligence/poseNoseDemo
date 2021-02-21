import React, { useRef, useEffect, useState } from 'react';
import {
  drawJoystick,
  updatePosition,
  clearCanvas,
} from './../js/canvasDrawing';

// const stoppingRatio = 0.2; // area within which to no movement

export default function GameCanvas({
  unitCirclePositionRef,
  unitSquarePositionRef,
  speed,
  stoppingRatio,
}) {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    const animationLoop = () => {
      let tick = 0;

      const ctx = canvasRef.current.getContext('2d');
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
      let canvasWidth = ctx.canvas.offsetWidth;
      let canvasHeight = ctx.canvas.offsetHeight;
      let canvasDimensions = [canvasWidth, canvasHeight];

      let position = [canvasWidth / 2, canvasHeight / 2];
      let shots = [];

      const loop = () => {
        tick++;
        // Set canvas width
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;

        //Render to canvas
        let vector = unitCirclePositionRef.current;
        if (vector) {
          position = updatePosition(
            vector,
            position,
            stoppingRatio,
            canvasDimensions,
            speed
          );
          let cursor = { position };

          // updateCanvas(cursor, shots, vector, tick, stoppingRatio, ctx);

          drawJoystick(vector, ctx, {
            inputRadius: 1,
            outputRadius: 50,
            center: cursor.position,
            stoppingRatio,
          });

          shots = updateShots(shots);
          drawShots(shots, ctx);

          if (tick % 10 === 0) {
            fireShot(cursor.position, vector, 18, shots, {
              inputRadius: 1,
              outputRadius: 50,
            });
          }

          // if (shots.length) {
          //   console.log(shots[0].position);
          // }
        }

        animationFrameRef.current = requestAnimationFrame(loop);
      };
      loop();
    };

    animationLoop();

    return () => {
      console.log('clearing cursor animation frame');
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [unitCirclePositionRef, unitSquarePositionRef, speed, stoppingRatio]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        width: '100vw',
        height: '100vh',

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

const updateCanvas = (cursor, shots, vector, tick, stoppingRatio, ctx) => {
  // console.log(tick);
  // tick = 0;
  clearCanvas(ctx);
};

const fireShot = (
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

  shots.push({ position: [x_j, y_j], vector, speed });
};

const drawShots = (shots, ctx) => {
  shots.forEach((shot) => {
    const [x, y] = shot.position;
    const [x_v, y_v] = shot.vector;

    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = 'purple';
    ctx.fill();
  });
};
const updateShots = (shots) => {
  let res = shots.map((shot) => {
    const [x, y] = shot.position;
    const [x_v, y_v] = shot.vector;
    const speed = shot.speed;
    let newPos = [x - x_v * speed, y - y_v * speed];

    let res = { ...shot, position: newPos };
    return res;
  });

  // console.log(res);
  return res;
};
