import React, { useEffect, useRef, useState } from 'react';

import {
  clearCanvas,
  drawCircleControl,
  drawSquareControl,
  drawBoundingFace,
} from './../js/canvasDrawing.js';

export default function OverlayCanvas({ nosePose, displayOptions }) {
  const {
    webcamRef,
    unitCirclePositionRef,
    unitSquarePositionRef,
    currentPredictionRef,
  } = nosePose;
  const overlayCanvasRef = useRef(null);
  const overlayAnimationFrameRef = useRef(null);

  const [displayConfig, setDisplayConfig] = useState(displayOptions);
  useEffect(() => {
    const animationLoop = () => {
      // console.log('starting animation');

      const loop = () => {
        if (unitSquarePositionRef.current && currentPredictionRef.current) {
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
          let { predictions, config } = currentPredictionRef.current;
          let { central_bounding, outer_bounding } = config;

          clearCanvas(ctx);

          displayConfig.video && ctx.drawImage(video, 0, 0);
          displayConfig.video &&
            drawBoundingFace(
              central_bounding,
              outer_bounding,
              predictions,
              ctx
            );

          displayConfig.circleControl &&
            drawCircleControl(unitSquarePositionRef.current, ctx, {
              inputRadius: 1,
              outputRadius: 50,
              center: [70, 70], // note: canvas is mirrored
            });

          displayConfig.squareControl &&
            drawSquareControl(unitSquarePositionRef.current, ctx, {
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
  }, [
    displayConfig,
    currentPredictionRef,
    unitSquarePositionRef,
    unitCirclePositionRef,
  ]);

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
