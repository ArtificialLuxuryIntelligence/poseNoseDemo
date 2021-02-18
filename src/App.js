import React from 'react';
import './App.css';

import magicWrapper from './Components/magicWrapper.js';
import Canvas from './Components/Canvas.js';

import { configPresets } from './js/faceDetector';

function App({
  unitCirclePositionRef,
  unitSquarePositionRef,
  webcamReference,
  configure,
}) {
  function clickHandlerWidth(type) {
    configure({ model: configPresets[type] });
  }

  function clickHandlerSpeed(speed) {
    configure({ render: { speed: speed } });
  }

  return (
    <div className="App" style={{}}>
      {/* <Canvas
        unitPositionRef={unitPositionRef}
        webcamReference={webcamReference}
      /> */}
      <button onClick={() => clickHandlerWidth('narrow')}>narrow config</button>
      <button onClick={() => clickHandlerWidth('normal')}>normal config</button>
      <button onClick={() => clickHandlerWidth('wide')}> wide config</button>

      <button onClick={() => clickHandlerSpeed(0.01)}>slow config</button>
      <button onClick={() => clickHandlerSpeed(0.05)}>normal config</button>
      <button onClick={() => clickHandlerSpeed(0.1)}> fast config</button>
    </div>
  );
}

export default magicWrapper(App, {
  preview: { video: false, circleControl: true, squareControl: true },
});

// export default magicWrapper(App);
