// Presets for FaceDetector class

const configPresets = {
  narrow: {
    central_bounding: { x: [-20, 20], y: [-30, 30] },
    outer_bounding: { x: [-20, 20], y: [-15, 10] },
  },
  normal: {
    central_bounding: { x: [-20, 20], y: [-30, 15] },
    outer_bounding: { x: [-50, 50], y: [-35, 35] },
  },
  wide: {
    central_bounding: { x: [-20, 20], y: [-30, 30] },
    outer_bounding: { x: [-100, 100], y: [-65, 50] },
  },
};

export { configPresets };
