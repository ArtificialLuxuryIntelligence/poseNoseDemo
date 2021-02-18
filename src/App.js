import React from 'react';
import './App.css';

import nosePose from './modules/nosePose/Component/nosePose.js';
import Canvas from './Components/Canvas.js';

import { configPresets } from './modules/nosePose/js/faceDetector';
console.log(configPresets.normal);

function App({
  unitCirclePositionRef,
  unitSquarePositionRef,
  webcamReference,
  configure,
}) {
  function clickHandlerWidth(type) {
    let modelConfig = { ...configPresets[type] };

    configure({ model: modelConfig });
  }

  function clickHandlerSpeed(speed) {
    configure({ render: { speed: speed } });
  }

  return (
    <div className="App" style={{}}>
      <Canvas
        unitSquarePositionRef={unitSquarePositionRef}
        unitCirclePositionRef={unitCirclePositionRef}
        webcamReference={webcamReference}
      />
      <button onClick={() => clickHandlerWidth('narrow')}>narrow config</button>
      <button onClick={() => clickHandlerWidth('normal')}>normal config</button>
      <button onClick={() => clickHandlerWidth('wide')}> wide config</button>

      <button onClick={() => clickHandlerSpeed(0.01)}>slow config</button>
      <button onClick={() => clickHandlerSpeed(0.05)}>normal config</button>
      <button onClick={() => clickHandlerSpeed(0.1)}> fast config</button>
    </div>
  );
}

// export default nosePose(App, {
//   preview: { video: true, circleControl: true, squareControl: true },
// });

export default nosePose(App);
