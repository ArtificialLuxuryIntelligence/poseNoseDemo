import React, { useRef, useEffect } from 'react';

export default function Canvas({ unitPositionRef, webcamReference }) {
  const canvasReference = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    console.log('rerending');
    const animationLoop = () => {
      const ctx = canvasReference.current.getContext('2d');
      const loop = () => {
        // console.log('animation frame looping canvas');

        // Get Video Properties
        const video = webcamReference.current.video;
        const videoWidth = webcamReference.current.video.videoWidth;
        const videoHeight = webcamReference.current.video.videoHeight;
        // Set canvas width
        canvasReference.current.width = videoWidth;
        canvasReference.current.height = videoHeight;
        //canvas stuff

        if (unitPositionRef.current) {
          drawJoystick(unitPositionRef.current, ctx);
        } else {
          //   console.log('nope');
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
  }, [unitPositionRef]);

  return (
    <canvas
      ref={canvasReference}
      style={{
        position: 'absolute',
        marginLeft: 'auto',
        marginRight: 'auto',
        left: 0,
        right: 0,
        textAlign: 'center',
        zindex: 9,
        width: 720,
        height: 500,
        transform: 'scale(-1, 1)',
      }}
    />
  );
}

const drawJoystick = (
  coords,
  ctx,
  options = { inputRadius: 1, outputRadius: 100, center: [300, 300] }
) => {
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
  ctx.fillStyle = 'white';
  ctx.fill();
};
