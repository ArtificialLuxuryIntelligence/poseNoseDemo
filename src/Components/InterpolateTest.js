import React, { useRef, useEffect, useState, useCallback } from 'react';
import Webcam from 'react-webcam';

import { stepToward } from './../modules/react-with-nosepose/js/geometry.js';

import InterpolatedDetector from './../modules/nosepose/InterpolatedDetector';
import NoseVectorDetector from './../modules/nosepose/NoseVectorDetector';

export default function InterpolateTest() {
  let webcamRef = useRef();
  let predictionsRef = useRef();
  let animationFrameRef = useRef();
  let [detector, setDetector] = useState(null);

  function stepTowardDetector(prevPredictions, currentPredictions) {
    const { vectors } = currentPredictions;
    const { vector_normalized_circle, vector_normalized_square } = vectors;

    return {
      ...currentPredictions,
      vectors: {
        ...currentPredictions.vectors,
        vector_normalized_circle: stepToward(
          prevPredictions.vectors.vector_normalized_square,
          vector_normalized_circle
        ),
        vector_normalized_square: stepToward(
          prevPredictions.vectors.vector_normalized_square,
          vector_normalized_square
        ),
      },
    };
  }

  const loadDetector = useCallback(async () => {
    // load vector detector
    let detector = new NoseVectorDetector();

    // setup interpolation
    const configs = {
      detector: {
        central_bounding: { x: [-20, 20], y: [-30, 15] },
        outer_bounding: { x: [-50, 50], y: [-35, 35] },
      },
      interpolater: {
        fps: 1,
        initialVal: {
          vectors: {
            direction_word: '',
            vector: [], //absolute value in face bounding rect
            vector_normalized_square: [0, 0], //normalized square [0,1]x [0,1]y
            vector_normalized_circle: [0, 0], //normalized circle [0,1]r
          },
          predictions: {},
          config: {},
        },
        stepToward: stepTowardDetector,
      },
    };
    let smoothDetector = new InterpolatedDetector({
      detector,
      configs,
    });
    await smoothDetector.load();
    setDetector(smoothDetector);
    console.log('loaded!', smoothDetector);
  }, []);

  const detect = () => {
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
      const prediction = detector.detect(video);
      console.log(prediction);

      // Set prediction to Ref
      predictionsRef.current = prediction;
    }
  };

  // Load Detector
  useEffect(() => {
    loadDetector();
  }, []);

  // Detection animation loop
  useEffect(() => {
    console.log('rerendering animation');

    const animationLoop = () => {
      // console.log('starting animation');

      const loop = () => {
        detect();
        animationFrameRef.current = requestAnimationFrame(loop);
      };

      loop();
    };
    animationLoop();

    return () => {
      console.log('stopping animation');
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [detector]);

  return (
    <div>
      {' '}
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
  );
}
