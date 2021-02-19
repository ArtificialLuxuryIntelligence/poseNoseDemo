import React, { useState, useEffect, useCallback } from 'react';
import Slider from 'react-input-slider';

export default function Controls({
  configure,
  speed,
  setSpeed,
  stoppingRatio,
  setStoppingRatio,
}) {
  const useHandleChange = (initial) => {
    const [value, setValue] = useState(initial);
    const setChange = useCallback((event) => {
      //   console.log(event);
      setValue(event.target.id);
    }, []);
    return [value, setChange];
  };

  const [x, setX] = useState({ min: -50, max: 50 });
  const [y, setY] = useState({ min: -50, max: 50 });
  const [responsiveness, setResponsiveness] = useState(0.1);

  useEffect(() => {
    // console.log(configure);
    // configure({render:{
    //     speed:
    // }})
    configure({
      model: {
        outer_bounding: { x: [x.min, x.max], y: [y.min, y.max] },
        // outer_bounding: { x: [-20, 20], y: [-15, 10] },
      },
      render: {
        responsiveness: responsiveness,
      },
    });
  }, [x, y, responsiveness]);

  return (
    <div
      className="control-container"
      style={{
        position: 'absolute',
        bottom: 20,
        left: 20,
      }}
    >
      <p>
        {JSON.stringify({
          model: {
            outer_bounding: { x: [x.min, x.max], y: [y.min, y.max] },
            // outer_bounding: { x: [-20, 20], y: [-15, 10] },
          },
          render: {
            responsiveness: responsiveness,
          },
        })}
      </p>

      <p>speed : {speed}</p>
      <label>x min</label>
      <Slider
        onChange={({ x }) => setX((state) => ({ ...state, min: x }))}
        axis="x"
        x={x.min}
        xstep={1}
        xmin={-100}
        xmax={0}
        id="xMin"
      />
      <label>x max</label>

      <Slider
        onChange={({ x }) => setX((state) => ({ ...state, max: x }))}
        axis="x"
        x={x.max}
        xstep={1}
        xmin={0}
        xmax={100}
        id="xMax"
      />
      <label>y min</label>

      <Slider
        onChange={({ y }) => setY((state) => ({ ...state, min: y }))}
        axis="y"
        y={y.min}
        ystep={1}
        ymin={0}
        ymax={-100}
        id="yMin"
      />

      <label>y max</label>

      <Slider
        onChange={({ y }) => setY((state) => ({ ...state, max: y }))}
        axis="y"
        y={y.max}
        ystep={1}
        ymin={100}
        ymax={0}
        id="yMax"
      />

      <label>responsiveness</label>

      <Slider
        onChange={({ x }) => setResponsiveness(parseFloat(x.toFixed(2)))}
        x={responsiveness}
        xstep={0.005}
        xmin={0}
        xmax={1}
        id="responsiveness"
      />

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
  );
}

// function clickHandlerWidth(type) {
//   let modelConfig = { ...configPresets[type] };
//   configure({ model: modelConfig });
// }

// function clickHandlerSpeed(speed) {
//   configure({ render: { speed: speed } });
// }
