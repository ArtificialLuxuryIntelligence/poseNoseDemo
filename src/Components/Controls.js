import React, { useState, useEffect, useCallback } from 'react';
import Slider from 'react-input-slider';

export default function Controls({
  configure,
  configs,
  speed,
  setSpeed,
  stoppingRatio,
  setStoppingRatio,
}) {
  // console.log('configsss', configs);
  // const [configs, setConfigs] = useState(configs);

  const { responsiveness, performance } = configs.render;
  const { outer_bounding } = configs.model;

  const [x, setX] = useState(outer_bounding.x);
  const [y, setY] = useState(outer_bounding.y);
  const [responsive, setResponsive] = useState(responsiveness.value);
  const [FPS, setFPS] = useState(performance.fps);

  useEffect(() => {
    configure({
      render: {
        responsiveness: { value: responsive },
        performance: {
          fps: FPS,
        },
      },
      model: {
        outer_bounding: { x, y },
      },
    });
  }, [x, y, responsive, FPS, configure]);

  return (
    <div
      className="control-container"
      style={{
        width: '20vw',
      }}
    >
      <pre>
        {JSON.stringify(
          {
            model: {
              outer_bounding: { x, y },
            },
            render: {
              responsiveness: responsiveness,
              performance: {
                fps: FPS,
              },
            },
          },
          null,
          4
        )}
      </pre>

      <p>speed : {speed}</p>

      <div className="slider-control">
        <label>x min</label>
        <Slider
          onChange={({ x }) => setX((state) => [x, state[1]])}
          axis="x"
          x={x.min}
          xstep={1}
          xmin={-100}
          xmax={0}
          id="xMin"
        />
      </div>

      <div className="slider-control">
        <label>x max</label>

        <Slider
          onChange={({ x }) => setX((state) => [state[1], x])}
          axis="x"
          x={x.max}
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
            y={y.min}
            ystep={1}
            ymin={0}
            ymax={-100}
            id="yMin"
          />
        </div>

        <div className="slider-control">
          <label>y max</label>

          <Slider
            onChange={({ y }) => setY((state) => [state[1], x])}
            axis="y"
            y={y.max}
            ystep={1}
            ymin={100}
            ymax={0}
            id="yMax"
          />
        </div>
      </div>
      <div className="slider-control">
        <label>responsiveness</label>

        <Slider
          onChange={({ x }) => setResponsive(parseFloat(x.toFixed(2)))}
          x={responsiveness}
          xstep={0.005}
          xmin={0}
          xmax={1}
          id="responsiveness"
        />
      </div>

      <div className="slider-control">
        <label>speed</label>

        <Slider
          onChange={({ x }) => {
            console.log(x);
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
            console.log(x);
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
          onChange={({ x }) => setFPS(parseFloat(x.toFixed(2)))}
          x={FPS}
          xstep={1}
          xmin={1}
          xmax={90}
          id="fps"
        />
      </div>
    </div>
  );
}

// function clickHandlerWidth(type) {
//   let modelConfig = { ...configPresets[type] };
//   configure({ model: modelConfig });
// }

// function clickHandlerSpeed(speed) {
//   configure({ render: { speed: speed } });
// }
