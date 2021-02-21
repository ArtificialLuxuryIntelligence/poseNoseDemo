import React, { useState } from 'react';
import './App.css';
import withNosePose from './modules/nosePose/HOC/withNosePose.js';
import Canvas from './Components/Canvas.js';
import Controls from './Components/Controls';

const STOPPING_RATIO_DEFAULT = 0.5;
const SPEED_DEFAULT = 12;

function App({ nosePose }) {
  const {
    unitCirclePositionRef,
    unitSquarePositionRef,
    configure,
    configs,
  } = nosePose;

  // state for moving cursor
  const [speed, setSpeed] = useState(SPEED_DEFAULT);
  const [stoppingRatio, setStoppingRatio] = useState(STOPPING_RATIO_DEFAULT);

  return (
    <div
      className="App"
      style={{
        minHeight: '100vh',
        display: 'flex',
      }}
    >
      <Canvas
        unitSquarePositionRef={unitSquarePositionRef}
        unitCirclePositionRef={unitCirclePositionRef}
        speed={speed}
        stoppingRatio={stoppingRatio}
      />
      <Controls
        // general controls
        configure={configure}
        configs={configs}
        // moving cursor controls
        speed={speed}
        setSpeed={setSpeed}
        stoppingRatio={stoppingRatio}
        setStoppingRatio={setStoppingRatio}
      />
    </div>
  );
}

export default withNosePose(
  App,
  { video: true, circleControl: true, squareControl: true }
  // {
  //   responsiveness: {
  //     value: 0.1,
  //   },
  //   performance: {
  //     fps: 10,
  //   },
  // }
  // {
  //   outer_bounding: {
  //     x: [-50, 50],
  //     y: [-35, 35],
  //   },
  // }
);

// export default withNosePose(App);
