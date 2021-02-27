import React, { useRef, useEffect, useState } from 'react';
import {
  drawJoystick,
  drawPrecisionCursor,
  updatePosition,
  drawSquareControl,
} from './js/canvasDrawing';

// const stoppingRatio = 0.2; // area within which to no movement

export default function PrecisionCursor({ outputRef, speed, stoppingRatio }) {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    let position = [0, 0];
    function spaceListener(e) {
      if (e.keyCode === 32) {
        e.preventDefault();
        // clickAtPosition(position, clicked, canvasRef.current);
      }
    }
    const animationLoop = () => {
      const ctx = canvasRef.current.getContext('2d');
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
      let canvasWidth = ctx.canvas.offsetWidth;
      let canvasHeight = ctx.canvas.offsetHeight;
      let canvasDimensions = [canvasWidth, canvasHeight];

      // track clicks to prevent multiple clicks
      let clicked = false;

      // Set initial cursor position
      let mouthWasOpen = false;
      let fixed_pos = [canvasWidth / 2, canvasHeight / 2];
      // set initial pointer radius
      let pointer_radius = 5;

      // Add click at position
      document.body.addEventListener('keyup', spaceListener);

      const loop = () => {
        // Set canvas width
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        //Render to canvas

        let vectors = outputRef.current?.vectors;

        if (vectors) {
          const {
            vector_normalized_circle,
            vector_normalized_square,
            normalized_eye_l,
            normalized_eye_r,
            normalized_mouth,
          } = vectors;

          // Mouth open
          let mouth = normalized_mouth === 1;
          // Eyes closed
          let wink = normalized_eye_l < 0.3 || normalized_eye_r < 0.3;

          if (wink) {
            console.log('winky');
            if (!clicked) {
              clickAtPosition(position, canvasRef.current);
              clicked = true;
              setTimeout(() => {
                clicked = false;
              }, 200);
            }
          }

          const [x, y] = vector_normalized_square;
          let w = canvasRef.current.width;
          let h = canvasRef.current.height;
          const [c_x, c_y] = [w / 2, h / 2];
          let x_j = c_x - (x * w) / 2;
          let y_j = c_y - (y * h) / 2;

          position = [x_j, y_j];

          // fix the position of cursor
          if (mouth && !mouthWasOpen) {
            mouthWasOpen = true;
            fixed_pos = [x_j, y_j];
          } else if (!mouth) {
            mouthWasOpen = false;
            fixed_pos = [x_j, y_j];
          }
          //pointer radius
          if (mouth && pointer_radius <= 50) {
            pointer_radius += 3;
          } else if (!mouth && pointer_radius > 5) {
            pointer_radius -= 3;
          }

          if (mouth) {
            //add extra vector for precision pointer
            let [x_f, y_f] = fixed_pos;
            let [v_x, v_y] = vector_normalized_circle;
            let x_p = x_f - v_x * pointer_radius;
            let y_p = y_f - v_y * pointer_radius;

            position = [x_p, y_p];

            drawPrecisionCursor(
              fixed_pos,
              vector_normalized_circle,
              true,
              { outputRadius: pointer_radius },
              ctx
            );
          } else {
            drawPrecisionCursor(
              [x_j, y_j],
              vector_normalized_circle,
              false,
              { outputRadius: pointer_radius },
              ctx
            );
          }
        }

        animationFrameRef.current = requestAnimationFrame(loop);
      };
      loop();
    };

    animationLoop();

    return () => {
      // clear animation frame
      cancelAnimationFrame(animationFrameRef.current);

      //remove listener
      document.body.removeEventListener('keyup', spaceListener);
    };
  }, [outputRef, speed, stoppingRatio]);

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

const updateCanvas = (
  position,
  vectors,
  stoppingRatio,
  pointer_radius,
  ctx
) => {
  const {
    vector_normalized_circle,
    vector_normalized_square,
    normalized_mouth,
  } = vectors;
  const [x, y] = position;

  drawSquareControl(vector_normalized_square, ctx, {
    inputDimensions: [1, 1],
    outputDimensions: [ctx.canvas.width, ctx.canvas.height],
    topLeft: [0, 0], // note: canvas is mirrored
    pointer_radius: pointer_radius,
  });
};

const clickAtPosition = (position, canvas, mirrored = true) => {
  let [x, y] = position;
  // canvas is mirror (scale(-1,1))
  if (mirrored) {
    x = canvas.width - x;
  }
  let el = document.elementFromPoint(x, y);
  if (el) {
    el.click();
  }
};
