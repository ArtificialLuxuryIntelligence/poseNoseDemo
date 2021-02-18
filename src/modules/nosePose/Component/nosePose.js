import React, { useRef, useState, useEffect } from 'react';

import {
  clearCanvas,
  drawCircleControl,
  drawSquareControl,
  drawBoundingFace,
} from '../js/canvasDrawing';
import FaceDetector from '../js/faceDetector.js';
import Webcam from 'react-webcam';

//
// note: wrapper includes hidden video element which needs to be in current view area (even if hidden)
//

const INTERVAL = 100;
const DEFAULT_SPEED = 0.05;

export default function nosePose(WrappedComponent, options) {
  options = Object.assign(
    {
      preview: {
        video: false,
        circleControl: false,
        squareControl: false,
      },
      speed: {
        value: 0.02,
      },
    },
    options
  );

  function AddDetection() {
    const [tfModel, setModelLoaded] = useState(null);
    const [modelConfig, setModelConfig] = useState(null);
    const [renderConfig, setRenderConfig] = useState(null);

    const [preview, setPreview] = useState(true);

    const webcamReference = useRef(null);
    const canvasReference = useRef(null);
    const intervalTimerRef = useRef(null);
    const animationFrameRef = useRef(null);
    const currentPredictionRef = useRef(null);
    const unitCirclePositionRef = useRef(null);
    const unitSquarePositionRef = useRef(null);

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
        // console.log(prediction);

        // Set prediction to Ref
        currentPredictionRef.current = prediction;
      }
    };
    // configure model options
    const configure = (config) => {
      setModelConfig((prev) => ({ ...prev, ...config.model }));
      setRenderConfig((prev) => ({ ...prev, ...config.render }));
    };

    // toggle preview on load
    useEffect(() => {
      let preview = Object.values(options.preview).some((v) => v === true);
      setPreview(preview);
    }, []);

    // load and configure model
    useEffect(() => {
      async function loadModel() {
        let faceDetector = new FaceDetector();
        faceDetector.configure(modelConfig); //configure bounding options
        let model = await faceDetector.load();
        console.log('model loaded');
        setModelLoaded(model);
      }
      loadModel();
    }, [modelConfig]);

    // start model detection loop
    useEffect(() => {
      const loopDectection = async () => {
        // console.log('detection looping');
        intervalTimerRef.current = setInterval(async () => {
          //   console.log('detection looping');
          detectFace(tfModel);
        }, INTERVAL);
      };

      loopDectection();

      return () => {
        // console.log('clearing interval');
        clearInterval(intervalTimerRef.current);
      };
    }, [tfModel]);

    // start animation frame loop
    // used for interpolating model predictions and rendering preview
    useEffect(() => {
      let preview = Object.values(options.preview).some((v) => v === true);
      setPreview(preview);
      // console.log('rerending animation');

      const animationLoop = () => {
        let prevCirclePos = [0, 0];
        let prevSquarePos = [0, 0];

        const loop = () => {
          if (currentPredictionRef.current) {
            // console.log(currentPredictionRef.current);
            // -------------------interpolate
            let actualCirclePos =
              currentPredictionRef.current.facingDirection
                .vector_normalized_circle;
            let actualSquarePos =
              currentPredictionRef.current.facingDirection
                .vector_normalized_square;

            //circle position
            let newCirclePos = stepToward(
              prevCirclePos,
              actualCirclePos,
              renderConfig?.speed || DEFAULT_SPEED
            );
            prevCirclePos = newCirclePos;
            unitCirclePositionRef.current = prevCirclePos;
            // square position
            let newSquarePos = stepToward(
              prevSquarePos,
              actualSquarePos,
              renderConfig?.speed || DEFAULT_SPEED
            );
            prevSquarePos = newSquarePos;
            unitSquarePositionRef.current = prevSquarePos;

            // -------------------render preview
            if (preview) {
              const ctx = canvasReference.current.getContext('2d');
              clearCanvas(ctx);

              options.preview.circleControl &&
                drawCircleControl(prevCirclePos, ctx);

              options.preview.squareControl &&
                drawSquareControl(prevSquarePos, ctx);

              options.preview.video &&
                drawBoundingFace(currentPredictionRef.current, ctx);
            }
          }

          animationFrameRef.current = requestAnimationFrame(loop);
        };
        loop();
      };
      animationLoop();

      return () => {
        // console.log('clearing animation frame');
        cancelAnimationFrame(animationFrameRef.current);
      };
    }, [renderConfig]);

    // useEffect(() => {
    // console.log('mounting');
    // return console.log('unmounting');
    // }, []);

    return (
      <>
        <div
          className="magic-wrapper"
          style={{
            pointerEvents: 'none',
            position: 'absolute',
            top: 0,
            width: '100vw',
            height: '100vh',
          }}
        >
          <Webcam
            ref={webcamReference}
            style={{
              visibility: options.preview.video ? 'auto' : 'hidden',
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
              visibility: preview ? 'auto' : 'hidden',
              position: 'absolute',
              marginLeft: 'auto',
              marginRight: 'auto',
              left: 0,
              right: 0,
              textAlign: 'center',
              zindex: 999,
              width: 720,
              height: 500,
              transform: 'scale(-1, 1)',
            }}
          />
        </div>
        <WrappedComponent
          unitCirclePositionRef={unitCirclePositionRef}
          unitSquarePositionRef={unitSquarePositionRef}
          configure={configure}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            visibility: 'hidden',
          }}
        />
      </>
    );
  }

  return AddDetection;
}

//   /// -----------------------------------------------------------------------------------
//   /// -----------------------------------------------------------------------------------

//   // step size range [0,1] (percent of total dist)
function stepToward(prevPos, actualPos, stepSize = 0.1) {
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

/////////////
