import React, { useRef, useState, useEffect } from 'react';
import './App.css';
// import * as tf from '@tensorflow/tfjs';
// import * as facemesh from '@tensorflow-models/facemesh';
// import * as blazeface from '@tensorflow-models/blazeface';

import FaceDetector from './js/faceDetector.js';
import Webcam from 'react-webcam';
import magicWrapper from './magicWrapper.js';
// import { drawMesh } from './meshUtilities.js';

const INTERVAL = 200;

function App({ thing }) {
  const [tfModel, setModelLoaded] = useState(null);

  const webcamReference = useRef(null);
  const canvasReference = useRef(null);
  const intervalTimerRef = useRef(null);
  const animationFrameRef = useRef(null);

  const currentPredictionRef = useRef(null);
  const unitPositionRef = useRef(null);

  const detectFace = async (model) => {
    if (!model) {
      return;
    }
    if (
      typeof webcamReference.current !== 'undefined' &&
      webcamReference.current !== null &&
      webcamReference.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamReference.current.video;
      const videoWidth = webcamReference.current.video.videoWidth;
      const videoHeight = webcamReference.current.video.videoHeight;

      // Set video width
      webcamReference.current.video.width = videoWidth;
      webcamReference.current.video.height = videoHeight;

      // Set canvas width
      canvasReference.current.width = videoWidth;
      canvasReference.current.height = videoHeight;

      // Make Detections
      const prediction = await model.detectFace(video);

      // Set prediction to Ref
      currentPredictionRef.current = prediction;
    }
  };

  // load model
  useEffect(() => {
    async function loadModel() {
      let faceDetector = new FaceDetector();
      let model = await faceDetector.load();
      console.log('model loaded');
      setModelLoaded(model);
    }
    loadModel();
  }, []);

  // start model detection loop
  useEffect(() => {
    const loopDectection = async () => {
      // console.log('detection looping');
      intervalTimerRef.current = setInterval(async () => {
        // console.log('detection looping');
        detectFace(tfModel);
      }, INTERVAL);
    };

    loopDectection();

    return () => {
      console.log('clearing interval');
      clearInterval(intervalTimerRef.current);
    };
  }, [tfModel]);

  // start animation loop
  useEffect(() => {
    console.log('rerending');
    const animationLoop = () => {
      const ctx = canvasReference.current.getContext('2d');
      let prevPos = [0, 0];
      const loop = () => {
        // console.log('animation frame looping');
        //canvas stuff

        if (currentPredictionRef.current) {
          let actualPos =
            currentPredictionRef.current.facingDirection
              .vector_normalized_circle;

          let newPos = stepToward(prevPos, actualPos, 0.05);
          prevPos = newPos;
          unitPositionRef.current = prevPos;
          drawJoystick(prevPos, ctx);
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
  }, []);

  // useEffect(() => {
  //   console.log('rerendering');
  // }, []);

  return (
    <div className="App">
      <Webcam
        ref={webcamReference}
        style={{
          visibility: 'hidden',
          // display: 'none',
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
    </div>
  );
}

export default magicWrapper(App);

const colours = ['red', 'green', 'blue', 'white', 'orange', 'magenta'];

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

// const smooth;

/// -----------------------------------------------------------------------------------
/// -----------------------------------------------------------------------------------

const drawFace = (predictions, ctx) => {
  if (predictions.length > 0) {
    predictions.forEach((prediction) => {
      const landmarks = prediction.landmarks;
      // Draw Dots
      for (let i = 0; i < landmarks.length; i++) {
        const x = landmarks[i][0];
        const y = landmarks[i][1];
        ctx.beginPath();
        if (i === 2) {
          ctx.arc(x, y, 20 /* radius */, 0, 3 * Math.PI);
        } else {
          ctx.arc(x, y, 10 /* radius */, 0, 3 * Math.PI);
        }
        // ctx.arc(x, y, 2 /* radius */, 0, 3 * Math.PI);
        ctx.fillStyle = colours[i];
        ctx.fill();
      }
      // Draw bounding box;

      const { topLeft, width, height } = getDimensions(prediction);

      ctx.strokeStyle = 'pink';
      ctx.beginPath();
      ctx.rect(topLeft[0], topLeft[1], width, height);
      ctx.stroke();
    });
  }
};

// Helper
function getDimensions(prediction) {
  const topLeft = prediction.topLeft;
  const bottomRight = prediction.bottomRight;
  const width = bottomRight[0] - topLeft[0];
  const height = bottomRight[1] - topLeft[1];
  const center = [topLeft[0] + width / 2, topLeft[1] + height / 2];

  return { topLeft, bottomRight, width, height, center };
}

// step size range [0,1] (percent of total dist)
function stepToward(prevPos, actualPos, stepSize = 0.1) {
  // console.log(prevPos, actualPos);
  let x, y;
  let [x1, y1] = [...prevPos];
  let [x2, y2] = [...actualPos];

  let d_x = x2 - x1;
  let d_y = y2 - y1;

  x = x1 + d_x * stepSize;
  y = y1 + d_y * stepSize;
  // console.log(x);
  return [x, y];
}
