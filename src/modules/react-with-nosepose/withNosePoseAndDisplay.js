import React, { useRef, useState, useEffect, useCallback } from 'react';
import NosePose from '../nosepose/index.js';
import Webcam from 'react-webcam';

import {
  clearCanvas,
  drawCircleControl,
  drawSquareControl,
  drawBoundingFace,
} from './js/canvasDrawing';

import { stepToward } from './js/geometry.js';

import {
  RENDER_OPTIONS_DEFAULT,
  DISPLAY_OPTIONS_DEFAULT,
  MODEL_OPTIONS_DEFAULT,
} from './js/defaults';

export default function nosePose(WrappedComponent, options) {
  let displayOptions = Object.assign(DISPLAY_OPTIONS_DEFAULT, options.display);
  let renderOptions = Object.assign(RENDER_OPTIONS_DEFAULT, options.render);
  let modelOptions = Object.assign(MODEL_OPTIONS_DEFAULT, options.model);

  function AddDetection() {
    const [tfModel, setModelLoaded] = useState(null);

    const [displayConfig, setDisplayConfig] = useState(displayOptions); // cannot be changed other than when wrapping component
    const [modelConfig, setModelConfig] = useState(modelOptions);
    const [renderConfig, setRenderConfig] = useState(renderOptions);

    const [display, setDisplay] = useState(true);
    const webcamReference = useRef(null);
    const canvasReference = useRef(null);
    const intervalTimerRef = useRef(null);
    const animationFrameRef = useRef(null);
    const currentPredictionRef = useRef(null);
    const unitCirclePositionRef = useRef(null);
    const unitSquarePositionRef = useRef(null);

    // Sets currentPredictionRef to nosePose predictions
    const detect = async (model) => {
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
        const prediction = await model.detect(video);
        // console.log(prediction);

        // Set prediction to Ref
        currentPredictionRef.current = prediction;
      }
    };

    // configures both the model options and the render options (triggers useEffect to actually update) [not display config]
    const configure = useCallback((config) => {
      // set cursor responsiveness, performance
      setRenderConfig((prev) => ({ ...prev, ...config.render }));
      // set central_bounding and outer_bounding
      setModelConfig((prev) => ({ ...prev, ...config.model }));
    }, []);

    // load  model
    useEffect(() => {
      async function loadModel() {
        // console.log('loading model');
        let nosepose = new NosePose();
        let model = await nosepose.load();

        // console.log('model loaded');
        setModelLoaded(model);
      }
      loadModel();
    }, []);

    // update modelConfig
    useEffect(() => {
      tfModel && tfModel.configure(modelConfig);
    }, [tfModel, modelConfig]);

    // toggle display on load
    useEffect(() => {
      let display = Object.values(displayConfig).some((v) => v === true);
      setDisplay(display);
    }, [displayConfig]);

    // start model detection loop
    useEffect(() => {
      const loopDectection = async () => {
        // console.log('detection looping');
        intervalTimerRef.current = setInterval(async () => {
          //   console.log('detection looping');
          detect(tfModel);
        }, 1000 / renderConfig.performance.fps);
      };
      // console.log('starting model detection loop');
      loopDectection();

      return () => {
        // console.log('stopping model detection loop');
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
        // console.log('starting animation');

        let prevCirclePos = [0, 0];
        let prevSquarePos = [0, 0];

        const loop = () => {
          if (currentPredictionRef.current) {
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
                drawCircleControl(prevCirclePos, ctx, {
                  inputRadius: 1,
                  outputRadius: 50,
                  center: [70, 70], // note: canvas is mirrored
                });

              displayConfig.squareControl &&
                drawSquareControl(prevSquarePos, ctx, {
                  inputDimensions: [1, 1],
                  outputDimensions: [100, 100],
                  topLeft: [20, 140], // note: canvas is mirrored
                });

              // note: currentPredictionRef is not
              console.log(currentPredictionRef.current);
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
        // console.log('stopping animation');
        cancelAnimationFrame(animationFrameRef.current);
      };
    }, [renderConfig, displayConfig]);

    // accessible to wrapped component in nosePose prop
    const props = {
      unitCirclePositionRef,
      unitSquarePositionRef,
      configure,
      configs: { render: renderConfig, model: modelConfig },
    };

    return (
      <>
        <div
          className="nose-pose"
          style={{
            pointerEvents: 'none',
            position: 'fixed',
            display: 'flex',
            top: 0,
            left: 0,
            right: 0,
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
              left: 0,
              right: 0,
              zindex: 2,
              width: '40vw',
              height: 'auto',
              transform: 'scale(-1, 1)',
            }}
          />

          {/* This canvas/all display options will be removed in a later version */}
          <canvas
            ref={canvasReference}
            style={{
              display: display ? 'auto' : 'none',
              position: 'absolute',
              marginLeft: 'auto',
              left: 0,
              right: 0,
              textAlign: 'center',
              zindex: 999,
              width: '40vw',
              transform: 'scale(-1, 1)',
            }}
          />
        </div>

        <WrappedComponent nosePose={props} />
      </>
    );
  }

  return AddDetection;
}
