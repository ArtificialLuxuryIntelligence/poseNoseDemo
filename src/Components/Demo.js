import React, { useState } from 'react';
import withNosePose from './../modules/nosePose/HOC/withNosePose.js';
import Canvas from './Canvas.js';
import Controls from './Controls';

const STOPPING_RATIO_DEFAULT = 0.5;
const SPEED_DEFAULT = 8;

function Demo({ nosePose }) {
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
      className="Demo"
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
        // general controls (from nosePose)
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
  Demo,
  { video: true, circleControl: true, squareControl: true }

);

