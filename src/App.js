import React, { useState } from 'react';
import './App.css';

import nosePose from './modules/nosePose/Component/nosePose.js';
import Canvas from './Components/Canvas.js';
import Controls from './Components/Controls';

import { configPresets } from './modules/nosePose/js/presets';
console.log(configPresets.normal);

function App({ unitCirclePositionRef, unitSquarePositionRef, configure }) {
  const [speed, setSpeed] = useState(6);
  const [stoppingRatio, setStoppingRatio] = useState(0.2);

  return (
    <div
      className="App"
      style={{ minWidth: '100vw', minHeight: '100vh', display: 'flex' }}
    >
      <Canvas
        unitSquarePositionRef={unitSquarePositionRef}
        unitCirclePositionRef={unitCirclePositionRef}
        speed={speed}
        stoppingRatio={stoppingRatio}
      />
      <Controls
        configure={configure}
        speed={speed}
        setSpeed={setSpeed}
        stoppingRatio={stoppingRatio}
        setStoppingRatio={setStoppingRatio}
       
      />

      {/* <button onClick={() => clickHandlerWidth('narrow')}>narrow config</button>
      <button onClick={() => clickHandlerWidth('normal')}>normal config</button>
      <button onClick={() => clickHandlerWidth('wide')}> wide config</button>

      <button onClick={() => clickHandlerSpeed(0.01)}>slow config</button>
      <button onClick={() => clickHandlerSpeed(0.05)}>normal config</button>
      <button onClick={() => clickHandlerSpeed(0.1)}> fast config</button> */}
    </div>
  );
}

export default nosePose(App, {
  preview: { video: true, circleControl: true, squareControl: true },
});

// export default nosePose(App);
