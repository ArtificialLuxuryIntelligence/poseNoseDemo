import React, { useState } from 'react';
import CursorCanvas from '../CursorCanvas';
import './WelcomeDemo.css';

const SPEED = 6;
const STOPPINGR = 0.3;

export default function WelcomeDemo({ nosePose }) {
  const {
    unitCirclePositionRef,
    unitSquarePositionRef,
    configure,
    configs,
    webcamRef,
    currentPredictionRef,
  } = nosePose;

  const [shift, setShift] = useState(true);
  return (
    <div>
      <CursorCanvas
        unitSquarePositionRef={unitSquarePositionRef}
        unitCirclePositionRef={unitCirclePositionRef}
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
