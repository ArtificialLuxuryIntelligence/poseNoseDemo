import React, { useState, useEffect, useCallback } from 'react';
import Slider from 'react-input-slider';

export default function Controls({ props }) {
  const {
    configs,
    configure,
    speed,
    setSpeed,
    stoppingRatio,
    setStoppingRatio,
  } = props;

  const { outer_bounding } = configs.detector;
  const { fps, sensitivity } = configs.interpolater;

  // Local state needed for sliders

  // detector settings
  const [x, setX] = useState(outer_bounding.x);
  const [y, setY] = useState(outer_bounding.y);

  // interpolator settings
  const [_sensitivity, setSensitivity] = useState(sensitivity);
  const [_fps, setfps] = useState(fps);

  useEffect(() => {
    configure({
      interpolater: {
        sensitivity: _sensitivity,
        fps: _fps,
      },
      detector: {
        outer_bounding: { x, y },
      },
    });
  }, [x, y, _sensitivity, _fps]);

  return (
    <div
      className="control-container"
      style={{
        width: '40vw',
      }}
    >
      <p>speed : {speed}</p>
      <p>stoppingRatio: {stoppingRatio}</p>

      <div className="slider-control">
        <label>x min</label>
        <Slider
          onChange={({ x }) => setX((state) => [x, state[1]])}
          axis="x"
          x={x[0]}
          xstep={1}
          xmin={-100}
          xmax={0}
          id="xMin"
        />
      </div>

      <div className="slider-control">
        <label>x max</label>

        <Slider
          onChange={({ x }) => setX((state) => [state[0], x])}
          axis="x"
          x={x[1]}
          xstep={1}
          xmin={0}
          xmax={100}
          id="xMax"
        />
      </div>
      <div
        className="control-group"
        style={{ display: 'flex', justifyContent: 'space-around' }}
      >
        <div className="slider-control">
          <label>y min</label>

          <Slider
            onChange={({ y }) => setY((state) => [y, state[1]])}
            axis="y"
            y={y[0]}
            ystep={1}
            ymin={0}
            ymax={-100}
            id="yMin"
          />
        </div>

        <div className="slider-control">
          <label>y max</label>

          <Slider
            onChange={({ y }) => setY((state) => [state[0], y])}
            axis="y"
            y={y[1]}
            ystep={1}
            ymin={100}
            ymax={0}
            id="yMax"
          />
        </div>
      </div>
      <div className="slider-control">
        <label>sensitivity </label>

        <Slider
          onChange={({ x }) => setSensitivity(parseFloat(x.toFixed(2)))}
          x={_sensitivity}
          xstep={0.005}
          xmin={0}
          xmax={1}
          id="sensitivity"
        />
      </div>

      <div className="slider-control">
        <label>speed</label>

        <Slider
          onChange={({ x }) => {
            setSpeed(parseFloat(parseFloat(x.toFixed(2))));
          }}
          x={speed}
          xstep={0.1}
          xmin={1}
          xmax={30}
          id="speed"
        />
      </div>

      <div className="slider-control">
        <label>stopping ratio</label>

        <Slider
          onChange={({ x }) => {
            setStoppingRatio(parseFloat(x.toFixed(2)));
          }}
          x={stoppingRatio}
          xstep={0.05}
          xmin={0}
          xmax={1}
          id="stopping-ratiox"
        />
      </div>

      <div className="slider-control">
        <label>FPS</label>

        <Slider
          onChange={({ x }) => setfps(parseFloat(x.toFixed(2)))}
          x={_fps}
          xstep={1}
          xmin={0}
          xmax={60}
          id="fps"
        />
      </div>
      <pre>{JSON.stringify(configs, null, 4)}</pre>
    </div>
  );
}
