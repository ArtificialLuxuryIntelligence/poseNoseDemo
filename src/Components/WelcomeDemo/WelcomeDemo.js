import React, { useState } from 'react';
import CursorCanvas from '../CursorCanvas';
import PrecisionCursor from '../PrecisionCursor';
import './WelcomeDemo.css';

const SPEED = 6;
const STOPPINGR = 0.3;

export default function WelcomeDemo({ nosePose }) {
  const { outputRef, configure, configs, webcamRef } = nosePose;

  const [shift, setShift] = useState(true);
  return (
    <div>
      {/* <CursorCanvas
        webcamRef={webcamRef}
        outputRef={outputRef}
        speed={SPEED}
        stoppingRatio={STOPPINGR}
      /> */}

      <PrecisionCursor
        webcamRef={webcamRef}
        outputRef={outputRef}
        speed={SPEED}
        stoppingRatio={STOPPINGR}
      />

      <h1>Welcome</h1>
      <p>lorem </p>
      <button onClick={() => alert('oh')}>ohhhhhhhh</button>
      <button onClick={() => alert('oh')}>ohhhhhhhh</button>
      <button onClick={() => alert('oh')}>ohhhhhhhh</button>
      <button onClick={() => alert('oh')}>ohhhhhhhh</button>
      <button onClick={() => alert('oh')}>ohhhhhhhh</button>
      <button onClick={() => alert('oh')}>ohhhhhhhh</button>
      <button onClick={() => alert('oh')}>ohhhhhhhh</button>
      <button onClick={() => alert('oh')}>ohhhhhhhh</button>
      <button onClick={() => alert('oh')}>ohhhhhhhh</button>
      <button onClick={() => alert('oh')}>ohhhhhhhh</button>
      <button onClick={() => alert('oh')}>ohhhhhhhh</button>
      <button onClick={() => alert('oh')}>ohhhhhhhh</button>
      <button onClick={() => alert('oh')}>ohhhhhhhh</button>
      <button onClick={() => alert('oh')}>ohhhhhhhh</button>
      <button onClick={() => alert('oh')}>ohhhhhhhh</button>
      <button onClick={() => alert('oh')}>ohhhhhhhh</button>
      <button onClick={() => alert('oh')}>ohhhhhhhh</button>
      <button onClick={() => alert('oh')}>ohhhhhhhh</button>
      <button onClick={() => alert('oh')}>ohhhhhhhh</button>
      <button onClick={() => alert('oh')}>ohhhhhhhh</button>
      <button onClick={() => alert('oh')}>ohhhhhhhh</button>
      <button onClick={() => alert('oh')}>ohhhhhhhh</button>
      <button onClick={() => alert('oh')}>ohhhhhhhh</button>
      <button onClick={() => alert('oh')}>ohhhhhhhh</button>
      <button onClick={() => alert('oh')}>ohhhhhhhh</button>
      <button onClick={() => alert('oh')}>ohhhhhhhh</button>
      <button onClick={() => alert('oh')}>ohhhhhhhh</button>
      <button onClick={() => alert('oh')}>ohhhhhhhh</button>
      <button onClick={() => alert('oh')}>ohhhhhhhh</button>
      <button onClick={() => alert('oh')}>ohhhhhhhh</button>
      <button onClick={() => alert('oh')}>ohhhhhhhh</button>
      <button onClick={() => alert('oh')}>ohhhhhhhh</button>
      <button onClick={() => alert('oh')}>ohhhhhhhh</button>
      <button onClick={() => alert('oh')}>ohhhhhhhh</button>
      <button onClick={() => alert('oh')}>ohhhhhhhh</button>
      <button onClick={() => alert('oh')}>ohhhhhhhh</button>
      <button onClick={() => alert('oh')}>ohhhhhhhh</button>
      <button onClick={() => alert('oh')}>ohhhhhhhh</button>
      <button onClick={() => alert('oh')}>ohhhhhhhh</button>
      <button onClick={() => alert('oh')}>ohhhhhhhh</button>
      <button onClick={() => alert('oh')}>ohhhhhhhh</button>
      <button onClick={() => alert('oh')}>ohhhhhhhh</button>
      <button onClick={() => alert('oh')}>ohhhhhhhh</button>
      <button onClick={() => alert('oh')}>ohhhhhhhh</button>
      <button onClick={() => alert('oh')}>ohhhhhhhh</button>
      <button onClick={() => alert('oh')}>ohhhhhhhh</button>
      <button onClick={() => alert('oh')}>ohhhhhhhh</button>
      <button onClick={() => alert('oh')}>ohhhhhhhh</button>
      <button onClick={() => alert('oh')}>ohhhhhhhh</button>
      <button onClick={() => alert('oh')}>ohhhhhhhh</button>
      <button onClick={() => alert('oh')}>ohhhhhhhh</button>
      <button onClick={() => alert('oh')}>ohhhhhhhh</button>
      <button onClick={() => alert('oh')}>ohhhhhhhh</button>
      <button onClick={() => alert('oh')}>ohhhhhhhh</button>
      <button onClick={() => alert('oh')}>ohhhhhhhh</button>
      <button onClick={() => alert('oh')}>ohhhhhhhh</button>
      <button onClick={() => alert('oh')}>ohhhhhhhh</button>
      <button onClick={() => alert('oh')}>ohhhhhhhh</button>
      <button onClick={() => alert('oh')}>ohhhhhhhh</button>
    </div>
  );
}
