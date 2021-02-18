import React, { useRef, useState, useEffect } from 'react';

import magicWrapper from './magicWrapper.js';
import Canvas from './Components/Canvas.js';

function App({ unitPositionRef, webcamReference }) {
  return (
    <div className="App">
      <Canvas
        unitPositionRef={unitPositionRef}
        webcamReference={webcamReference}
      />
    </div>
  );
}

export default magicWrapper(App);
