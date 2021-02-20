import React, { useRef, useState, useEffect, useCallback } from 'react';

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

const DISPLAY_OPTIONS_DEFAULT = {
  video: false,
  circleControl: false,
  squareControl: false,
};

const RENDER_OPTIONS_DEFAULT = {
  responsiveness: {
    value: 0.2,
  },
  performance: {
    fps: 30,
  },
};
const MODEL_OPTIONS_DEFAULT = {
  central_bounding: { x: [-20, 20], y: [-30, 15] },
  outer_bounding: { x: [-50, 50], y: [-35, 35] },
};

export default function nosePose(
  WrappedComponent,
  displayOptions,
  renderOptions,
  modelOptions
) {
  displayOptions = Object.assign(DISPLAY_OPTIONS_DEFAULT, displayOptions);
  renderOptions = Object.assign(RENDER_OPTIONS_DEFAULT, renderOptions);
  modelOptions = Object.assign(MODEL_OPTIONS_DEFAULT, modelOptions); // default empty - the loaded model handles no input

  function AddDetection() {
    const [tfModel, setModelLoaded] = useState(null);
    const [modelConfig, setModelConfig] = useState(modelOptions);
    const [renderConfig, setRenderConfig] = useState(renderOptions);
    const [displayConfig, setDisplayConfig] = useState(displayOptions);

    const [display, setDisplay] = useState(true);
    const webcamReference = useRef(null);
    const canvasReference = useRef(null);
    const intervalTimerRef = useRef(null);
    const animationFrameRef = useRef(null);
    const currentPredictionRef = useRef(null);
    const unitCirclePositionRef = useRef(null);
    const unitSquarePositionRef = useRef(null);

    // Sets currentPredictionRef to nosePose predictions
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
        const prediction = await model.nosePose.detect(video);
        // console.log(prediction);

        // Set prediction to Ref
        currentPredictionRef.current = prediction;
      }
    };

    // configures both the model options and the render options

    const configure = useCallback((config) => {
      // set cursor responsiveness, performance
      setRenderConfig((prev) => ({ ...prev, ...config.render }));

      // set central_bounding and outer_bounding
      setModelConfig((prev) => ({ ...prev, ...config.model }));
    }, []);

    // update modelConfig
    useEffect(() => {
      tfModel && tfModel.nosePose.configure(modelConfig);
    }, [tfModel, modelConfig]);

    // toggle display on load
    useEffect(() => {
      let display = Object.values(displayConfig).some((v) => v === true);
      setDisplay(display);
    }, [displayConfig]);

    // load  model
    useEffect(() => {
      async function loadModel() {
        console.log('loading model');
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
          //   console.log('detection looping');
          detectFace(tfModel);
        }, 1000 / renderConfig.performance.fps);
      };
      console.log('starting model detection loop');
      loopDectection();

      return () => {
        console.log('stopping model detection loop');
        clearInterval(intervalTimerRef.current);
      };
    }, [tfModel, renderConfig.performance.fps]);

    // start animation frame loop
    // used for interpolating model predictions and rendering display
    useEffect(() => {
      let display = Object.values(displayConfig).some((v) => v === true);
      setDisplay(display);
      // console.log('rerending animation');

      const animationLoop = () => {
        console.log('starting animation');

        let prevCirclePos = [0, 0];
        let prevSquarePos = [0, 0];

        const loop = () => {
          if (currentPredictionRef.current) {
            // console.log(currentPredictionRef.current);
            // -------------------interpolate
            let actualCirclePos =
              currentPredictionRef.current.vectors.vector_normalized_circle;
            let actualSquarePos =
              currentPredictionRef.current.vectors.vector_normalized_square;

            //circle position
            let newCirclePos = stepToward(
              prevCirclePos,
              actualCirclePos,
              renderConfig.responsiveness.value
            );
            prevCirclePos = newCirclePos;
            unitCirclePositionRef.current = prevCirclePos;

            // square position
            let newSquarePos = stepToward(
              prevSquarePos,
              actualSquarePos,
              renderConfig.responsiveness.value
            );
            prevSquarePos = newSquarePos;
            unitSquarePositionRef.current = prevSquarePos;

            // -------------------render display
            if (display) {
              const ctx = canvasReference.current.getContext('2d');
              clearCanvas(ctx);

              displayConfig.circleControl &&
                drawCircleControl(prevCirclePos, ctx);

              displayConfig.squareControl &&
                drawSquareControl(prevSquarePos, ctx);

              let { predictions, config } = currentPredictionRef.current;

              let { central_bounding, outer_bounding } = config;

              displayConfig.video &&
                drawBoundingFace(
                  central_bounding,
                  outer_bounding,
                  predictions,
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
        console.log('stopping animation');
        cancelAnimationFrame(animationFrameRef.current);
      };
    }, [renderConfig, displayConfig]);

    return (
      <>
        <div
          className="nose-pose"
          style={{
            pointerEvents: 'none',
            position: 'fixed',
            display: 'flex',
            top: 0,
            width: '100vw',
            height: '100vh',
          }}
        >
          <Webcam
            ref={webcamReference}
            audio={false}
            style={{
              visibility: displayConfig.video ? 'auto' : 'hidden',
              position: 'absolute',
              marginLeft: 'auto',
              // marginRight: 'auto',
              left: 0,
              right: 0,
              // textAlign: 'center',
              zindex: 9,
              width: '40vw',
              height: 'auto',
              transform: 'scale(-1, 1)',
            }}
          />

          <canvas
            ref={canvasReference}
            style={{
              // visibility: display ? 'auto' : 'hidden',
              display: display ? 'auto' : 'none',
              position: 'absolute',
              marginLeft: 'auto',
              // marginRight: 'auto',
              left: 0,
              right: 0,
              textAlign: 'center',
              zindex: 999,
              width: '40vw',
              // height: 500,
              transform: 'scale(-1, 1)',
            }}
          />
        </div>
        <WrappedComponent
          unitCirclePositionRef={unitCirclePositionRef}
          unitSquarePositionRef={unitSquarePositionRef}
          configure={configure}
          configs={{ render: renderConfig, model: modelConfig }}
          // style={{
          //   position: 'absolute',
          //   top: 0,
          //   left: 0,
          //   visibility: 'hidden',
          // }}
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
