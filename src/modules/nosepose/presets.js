// Presets for FaceDetector class

import { stepToward } from './../react-with-nosepose/js/geometry';

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

function stepTowardDetector(prevPredictions, currentPredictions) {
  const { vectors } = currentPredictions;
  const { vector_normalized_circle, vector_normalized_square } = vectors;

  return {
    ...currentPredictions,
    vectors: {
      ...currentPredictions.vectors,
      vector_normalized_circle: stepToward(
        prevPredictions.vectors.vector_normalized_square,
        vector_normalized_circle
      ),
      vector_normalized_square: stepToward(
        prevPredictions.vectors.vector_normalized_square,
        vector_normalized_square
      ),
    },
  };
}

const configs = {
  detector: {
    central_bounding: { x: [-20, 20], y: [-30, 15] },
    outer_bounding: { x: [-50, 50], y: [-35, 35] },
  },
  interpolater: {
    fps: 1,
    initialVal: {
      vectors: {
        direction_word: '',
        vector: [], //absolute value in face bounding rect
        vector_normalized_square: [0, 0], //normalized square [0,1]x [0,1]y
        vector_normalized_circle: [0, 0], //normalized circle [0,1]r
      },
      predictions: {},
      config: {},
    },
    stepToward: stepTowardDetector,
  },
};

export { configPresets, configs };
