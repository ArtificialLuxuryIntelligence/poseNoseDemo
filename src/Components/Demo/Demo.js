import React, { useState } from 'react';
import CursorCanvas from './CursorCanvas.js';
import Controls from './Controls';
import OverlayCanvas from './OverlayCanvas.js';

const STOPPING_RATIO_DEFAULT = 0.35;
const SPEED_DEFAULT = 8;

export default function Demo({ nosePose }) {
  const {
    unitCirclePositionRef,
    unitSquarePositionRef,
    configure,
    configs,
    webcamRef,
    currentPredictionRef,
  } = nosePose;

  // state for moving cursor
  const [speed, setSpeed] = useState(SPEED_DEFAULT);
  const [stoppingRatio, setStoppingRatio] = useState(STOPPING_RATIO_DEFAULT);
  const [displayOptions, setDisplayOptions] = useState({
    video: true,
    circleControl: true,
    squareControl: true,
  });

  return (
    <div
      className="Demo"
      style={{
        minHeight: '100vh',
        // display: 'flex',
      }}
    >
      <OverlayCanvas nosePose={nosePose} displayOptions={displayOptions} />
      <h1>Configuration Dashboard</h1>

      <Controls
        // general controls (from nosePose)
        configure={configure}
        configs={configs}
        // cursor controls
        speed={speed}
        setSpeed={setSpeed}
        stoppingRatio={stoppingRatio}
        setStoppingRatio={setStoppingRatio}
        //display options
        displayOptions={displayOptions}
        setDisplayOptions={setDisplayOptions}
      />
      <CursorCanvas
        unitSquarePositionRef={unitSquarePositionRef}
        unitCirclePositionRef={unitCirclePositionRef}
        speed={speed}
        stoppingRatio={stoppingRatio}
      />
    </div>
  );
}



// export default withNosePoseAndDisplay(Demo, {
//   display: { video: true, circleControl: true, squareControl: true },
// });
