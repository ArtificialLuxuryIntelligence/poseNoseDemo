import React, { useRef, useState, useEffect, useCallback } from 'react';
import NosePose from '../nosepose/nosePose.js';
import Webcam from 'react-webcam';

import { stepToward } from './js/geometry.js';

import { RENDER_OPTIONS_DEFAULT, MODEL_OPTIONS_DEFAULT } from './js/defaults';

export default function nosePose(WrappedComponent, options) {
  let renderOptions = Object.assign(RENDER_OPTIONS_DEFAULT, options.render);
  let modelOptions = Object.assign(MODEL_OPTIONS_DEFAULT, options.model);

  function AddDetection() {
    const [tfModel, setModelLoaded] = useState(null);

    const [modelConfig, setModelConfig] = useState(modelOptions);
    const [renderConfig, setRenderConfig] = useState(renderOptions);

    const webcamRef = useRef(null);
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
        typeof webcamRef.current !== 'undefined' &&
        webcamRef.current !== null &&
        webcamRef.current.video.readyState === 4
      ) {
        // Get Video Properties
        const video = webcamRef.current.video;
        const videoWidth = webcamRef.current.video.videoWidth;
        const videoHeight = webcamRef.current.video.videoHeight;

        // Set video width
        webcamRef.current.video.width = videoWidth;
        webcamRef.current.video.height = videoHeight;

        // Make Detections
        const prediction = await model.detect(video);
        // console.log(prediction);

        // Set prediction to Ref
        currentPredictionRef.current = prediction;
      }
    };

    // configures both the model options and the render options (triggers useEffect to actually update)
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
        await nosepose.load();
        setModelLoaded(nosepose);
        // console.log('model loaded');
        // setModelLoaded(model);
      }
      loadModel();
    }, []);

    // update modelConfig
    useEffect(() => {
      tfModel && tfModel.configure(modelConfig);
    }, [tfModel, modelConfig]);

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
    }, [renderConfig]);

    //props  accessible to wrapped component in nosePose prop
    const props = {
      unitCirclePositionRef,
      unitSquarePositionRef,
      configure,
      configs: { render: renderConfig, model: modelConfig },
      webcamRef,
      currentPredictionRef,
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
            ref={webcamRef}
            audio={false}
            style={{
              visibility: 'hidden',
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
        </div>

        <WrappedComponent nosePose={props} />
      </>
    );
  }

  return AddDetection;
}
