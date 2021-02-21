const DISPLAY_OPTIONS_DEFAULT = {
  video: false,
  circleControl: false,
  squareControl: false,
};

const RENDER_OPTIONS_DEFAULT = {
  responsiveness: {
    value: 0.08,
  },
  performance: {
    fps: 20,
  },
};
const MODEL_OPTIONS_DEFAULT = {
  central_bounding: { x: [-20, 20], y: [-30, 15] },
  outer_bounding: { x: [-50, 50], y: [-35, 35] },
};

export {
  RENDER_OPTIONS_DEFAULT,
  DISPLAY_OPTIONS_DEFAULT,
  MODEL_OPTIONS_DEFAULT,
};
