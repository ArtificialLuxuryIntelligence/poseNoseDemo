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

const INTERVAL = 1000 / 40; // 40fps
// const INTERVAL = 80;
const DEFAULT_SPEED = 0.1; // should be related to frame rate

export default function nosePose(WrappedComponent, options) {
  // render configuration:
  options = Object.assign(
    {
      preview: {
        video: false,
        circleControl: false,
        squareControl: false,
      },
      speed: {
        value: DEFAULT_SPEED,
      },
    },
    options
  );

  function AddDetection() {
    const [tfModel, setModelLoaded] = useState(null);
    const [nosePoseConfig, setNosePoseConfig] = useState(null);
    const [renderConfig, setRenderConfig] = useState(null);
    const [preview, setPreview] = useState(true);
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
    // configuration options
    // e.g. {
    //   model:{
    //     central_bounding: { x: [-20, 20], y: [-30, 30] },
    //     outer_bounding: { x: [-20, 20], y: [-15, 10] },
    //   },
    //   render{
    //     speed: 0.1
    //   }
    // }
    const configure = (config) => {
      // set central_bounding and outer_bounding
      setNosePoseConfig((prev) => ({ ...prev, ...config.model }));
      // set cursor speed
      setRenderConfig((prev) => ({ ...prev, ...config.render }));
    };

    // update nosePoseConfig
    useEffect(() => {
      tfModel && tfModel.nosePose.configure(nosePoseConfig);
    }, [tfModel, nosePoseConfig]);

    // toggle preview on load
    useEffect(() => {
      let preview = Object.values(options.preview).some((v) => v === true);
      setPreview(preview);
    }, []);

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
        }, INTERVAL);
      };
      console.log('starting model detection loop');
      loopDectection();

      return () => {
        console.log('stopping model detection loop');
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

              let { predictions, config } = currentPredictionRef.current;

              let { central_bounding, outer_bounding } = config;

              // let faceBounding = currentPrectionRef.current;
              options.preview.video &&
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
    }, [renderConfig]);

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
            audio={false}
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
