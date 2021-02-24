import React, { useEffect, useRef, useState } from 'react';

import {
  clearCanvas,
  drawCircleControl,
  drawSquareControl,
  drawBoundingFace,
} from '../js/canvasDrawing.js';

export default function OverlayCanvas({ nosePose }) {
  const { webcamRef, outputRef } = nosePose;
  const overlayCanvasRef = useRef(null);
  const overlayAnimationFrameRef = useRef(null);

  useEffect(() => {
    const animationLoop = () => {
      // console.log('starting animation');

      const loop = () => {
        if (outputRef.current) {
          // Get Video Properties
          const video = webcamRef.current.video;
          const videoWidth = webcamRef.current.video.videoWidth;
          const videoHeight = webcamRef.current.video.videoHeight;

          // Set video width
          webcamRef.current.video.width = videoWidth;
          webcamRef.current.video.height = videoHeight;

          // Set canvas width
          overlayCanvasRef.current.width = videoWidth;
          overlayCanvasRef.current.height = videoHeight;

          // -------------------render display
          const ctx = overlayCanvasRef.current.getContext('2d');
          let { predictions, config, vectors } = outputRef.current;
          let { vector_normalized_square, vector_normalized_circle } = vectors;
          let { central_bounding, outer_bounding } = config;

          clearCanvas(ctx);

          ctx.drawImage(video, 0, 0);

          drawBoundingFace(central_bounding, outer_bounding, predictions, ctx);

          drawCircleControl(vector_normalized_circle, ctx, {
            inputRadius: 1,
            outputRadius: 50,
            center: [70, 70], // note: canvas is mirrored
          });

          drawSquareControl(vector_normalized_square, ctx, {
            inputDimensions: [1, 1],
            outputDimensions: [100, 100],
            topLeft: [20, 140], // note: canvas is mirrored
          });
        }

        overlayAnimationFrameRef.current = requestAnimationFrame(loop);
      };
      loop();
    };
    animationLoop();

    return () => {
      // console.log('stopping animation');
      cancelAnimationFrame(overlayAnimationFrameRef.current);
    };
  }, [outputRef, webcamRef]);

  return (
    <div className={'overlay-canvas'}>
      <canvas
        ref={overlayCanvasRef}
        style={{
          position: 'absolute',
          marginLeft: 'auto',
          top: 0,
          left: 0,
          right: 0,
          textAlign: 'center',
          zindex: 999,
          width: '40vw',
          transform: 'scale(-1, 1)',
        }}
      />
    </div>
  );
}
