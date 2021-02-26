// Presets for FaceDetector class

import { stepToward } from './helpers/geometry';

const defaults = {
  detector: {
    central_bounding: { x: [-20, 20], y: [-30, 15] },
    outer_bounding: { x: [-50, 50], y: [-35, 15] },
  },
  interpolater: {
    fps: 15,
    sensitivity: 0.1,
    stepToward: stepTowardDetector,
  },
};

// only change circle/square vectors
function stepTowardDetector(prevPredictions, currentPredictions, sensitivity) {
  const { vectors } = currentPredictions;
  const { vector_normalized_circle, vector_normalized_square } = vectors;

  return {
    ...currentPredictions,
    vectors: {
      ...currentPredictions.vectors,
      vector_normalized_circle: stepToward(
        prevPredictions.vectors.vector_normalized_circle,
        vector_normalized_circle,
        sensitivity
      ),
      vector_normalized_square: stepToward(
        prevPredictions.vectors.vector_normalized_square,
        vector_normalized_square,
        sensitivity
      ),
    },
  };
}

export { defaults };
