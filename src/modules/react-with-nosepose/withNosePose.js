import React, { useRef, useEffect, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { defaults } from '../nosepose/defaults';
import { mergeDeep } from '../nosepose/helpers/helpers';

import nosePose from '../nosepose/index';

export default function withNosePose(WrappedComponent) {
  function AddDetection() {
    let webcamRef = useRef();
    let animationFrameRef = useRef();
    let [detector, setDetector] = useState(null);
    let [configs, setConfigs] = useState(defaults);
    let outputRef = useRef(null);

    const loadDetector = useCallback(async () => {
      // setup interpolation

      // load vector detector
      let detector = nosePose(configs);
      await detector.load();

      setDetector(detector);
      console.log('Detector loaded!', detector);
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
        // console.log(prediction);

        // Set prediction to Ref
        outputRef.current = prediction;
      }
    };

    // keep configs state in sync with detector.
    // incomplete (nested) configuration is possible here thanks to deep merge.
    // e.g.
    // configure({ interpolater: { fps: 10 } });

    const configure = (configurations) => {
      let newConfigs = mergeDeep({}, configs, configurations);
      setConfigs(newConfigs);
      if (detector) {
        detector.configure(newConfigs);
      }
    };

    useEffect(() => {
      if (detector) {
        detector.configure(configs);
      }
    }, [configs, detector]);

    // Load Detector
    useEffect(() => {
      loadDetector();
    }, [loadDetector]);

    // Detection animation loop
    useEffect(() => {
      // console.log('rerendering animation');
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
        // console.log('stopping animation');
        cancelAnimationFrame(animationFrameRef.current);
      };
    }, [detector]);

    const props = {
      outputRef,
      webcamRef,
      configs,
      configure,
    };

    return (
      <div>
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
        <WrappedComponent nosePose={props} />
      </div>
    );
  }
  return AddDetection;
}
