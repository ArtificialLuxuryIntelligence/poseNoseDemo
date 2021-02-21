import React, { useRef, useEffect, useState } from 'react';
import { drawJoystick, updatePosition } from './../js/canvasDrawing';

// const stoppingRatio = 0.2; // area within which to no movement

export default function CursorCanvas({
  unitCirclePositionRef,
  unitSquarePositionRef,
  speed,
  stoppingRatio,
}) {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);

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
          position = updatePosition(
            vector,
            position,
            stoppingRatio,
            canvasDimensions,
            speed
          );
          updateCanvas(position, vector, stoppingRatio, ctx);
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

const updateCanvas = (position, vector, stoppingRatio, ctx) => {
  const [x, y] = position;

  // Render generic circle cursor
  // console.log(x);

  // ctx.beginPath();
  // ctx.arc(x, y, 10, 0, 2 * Math.PI);
  // ctx.fillStyle = 'purple';
  // ctx.fill();

  // Render fancy joystick 'cursor'
  drawJoystick(vector, ctx, {
    inputRadius: 1,
    outputRadius: 50,
    center: position,
    stoppingRatio,
  });
};
