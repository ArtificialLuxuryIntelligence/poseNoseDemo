import React, { useRef, useEffect, useState } from 'react';
import ShipGame from './../js/ShipGame';
import { updatePosition } from './../js/canvasDrawing';
import BlasterGame from '../js/BlasterGame';

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
      const ctx = canvasRef.current.getContext('2d');

      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
      let canvasWidth = ctx.canvas.offsetWidth;
      let canvasHeight = ctx.canvas.offsetHeight;
      let canvasDimensions = [canvasWidth, canvasHeight];

      let tick = 0;
      let shipGame = new ShipGame(ctx);
      // let blasterGame = new BlasterGame(ctx);
      let position = [canvasWidth / 2, canvasHeight / 2];

      const loop = () => {
        tick++;
        // Set canvas width
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;

        //Render to canvas
        let circleVector = unitCirclePositionRef.current;
        let squareVector = unitSquarePositionRef.current;

        if (circleVector) {
          position = updatePosition(
            circleVector,
            position,
            stoppingRatio,
            canvasDimensions,
            speed
          );
          let cursor = { position };

          shipGame.updateCanvas(cursor, circleVector, stoppingRatio, tick);
          // blasterGame.updateCanvas(squareVector, tick);
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
