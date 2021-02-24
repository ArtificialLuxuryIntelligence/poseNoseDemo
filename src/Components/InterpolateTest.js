import React from 'react';

export default function InterpolateTest({ nosePose }) {
  function changeFPS() {
    nosePose.configure({ interpolater: { fps: 10 } });
  }
  function changeBounding() {
    nosePose.configure({
      detector: {
        outer_bounding: { x: [0, 10] },
      },
    });
  }
  return (
    <div>
      <button onClick={changeFPS}>FPS</button>
      <button onClick={changeBounding}>boundig</button>
    </div>
  );
}
