import React, { useRef, useEffect, useState } from 'react';
import { drawJoystick, updatePosition } from './js/canvasDrawing';

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
    let position;
    function spaceListener(e) {
      if (e.keyCode === 32) {
        e.preventDefault();
        clickAtPosition(position, canvasRef.current);
      }
    }
    const animationLoop = () => {
      const ctx = canvasRef.current.getContext('2d');
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
      let canvasWidth = ctx.canvas.offsetWidth;
      let canvasHeight = ctx.canvas.offsetHeight;
      let canvasDimensions = [canvasWidth, canvasHeight];

      // Set initial cursor position
      position = [canvasWidth / 2, canvasHeight / 2];

      // Add click at position
      document.body.addEventListener('keyup', spaceListener);

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

          // if (position[1] < 50) {
          //   console.log('top');
          // }
          // if (position[1] > canvasRef.current.height - 50) {
          //   console.log('bottom');
          // }

          updateCanvas(position, vector, stoppingRatio, ctx);
        }

        animationFrameRef.current = requestAnimationFrame(loop);
      };
      loop();
    };

    animationLoop();

    return () => {
      // clear animation frame
      console.log('clearing cursor animation frame');
      cancelAnimationFrame(animationFrameRef.current);

      //remove listener
      document.body.removeEventListener('keyup', spaceListener);
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

const clickAtPosition = (position, canvas, mirrored = true) => {
  let [x, y] = position;
  // canvas is mirror (scale(-1,1))
  if (mirrored) {
    x = canvas.width - x;
  }
  let el = document.elementFromPoint(x, y);
  el.click();
};