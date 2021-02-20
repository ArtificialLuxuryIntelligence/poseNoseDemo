import React, { useState } from 'react';
import './App.css';
import nosePose from './modules/nosePose/Component/nosePose.js';
import Canvas from './Components/Canvas.js';
import Controls from './Components/Controls';

function App({
  unitCirclePositionRef,
  unitSquarePositionRef,
  configure,
  configs,
}) {
  const [speed, setSpeed] = useState(12);
  const [stoppingRatio, setStoppingRatio] = useState(0.2);

  return (
    <div
      className="App"
      style={{ width: '100vw', minHeight: '100vh', display: 'flex' }}
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

export default nosePose(
  App
  // { video: true, circleControl: true, squareControl: true }
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

// export default nosePose(App);
