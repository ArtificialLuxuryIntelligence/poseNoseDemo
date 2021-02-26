import React, { useState } from 'react';
import Controls from './Controls';
import OverlayCanvas from './OverlayCanvas';
import CursorCanvas from './../CursorCanvas';

export default function ConfigPage({ nosePose }) {
  const [speed, setSpeed] = useState(10);
  const [stoppingRatio, setStoppingRatio] = useState(0.3);

  const { outputRef, webcamRef, configs, configure } = nosePose;

  //   console.log(configs);

  const props = {
    configs,
    configure,
    speed,
    setSpeed,
    stoppingRatio,
    setStoppingRatio,
  };

  return (
    <div>
      <Controls props={props} />
      <OverlayCanvas nosePose={nosePose} />
      <CursorCanvas
        outputRef={outputRef}
        speed={speed}
        stoppingRatio={stoppingRatio}
      />
    </div>
  );
}
