import React, { useState } from 'react';
import GameCanvas from './GameCanvas.js';

const STOPPING_RATIO_DEFAULT = 0.55;
const SPEED_DEFAULT = 6;

export default function Game({ nosePose }) {
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
      <h1>Game</h1>

      <GameCanvas
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
