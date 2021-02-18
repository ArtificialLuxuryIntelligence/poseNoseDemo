import * as tf from '@tensorflow/tfjs';
import * as blazeface from '@tensorflow-models/blazeface';

export default class FaceDetector {
  constructor() {
    this.model = null;
    this.config = configPresets.normal;
  }

  // configure

  async load() {
    this.model = await blazeface.load({ maxFaces: 1 });

    return Object.assign(this.model, {
      detectFace: this.detectFace.bind(this),
    });
  }

  configure(config) {
    this.config = Object.assign(this.config, config);
    console.log('model', this.model);
  }

  async detectFace(video) {
    let predictions = await this.model.estimateFaces(video);
    if (!predictions.length) {
      return false;
    }
    return {
      ...predictions[0],
      facingDirection: this.facingDirection(predictions),
    };
  }

  facingDirection(predictions) {
    if (!predictions[0]) {
      return false;
    }

    let central_bounding = this.config.central_bounding;
    let outer_bounding = this.config.outer_bounding;

    // get predictions data
    const { center } = this.__getPredictionBoundingDimensions(predictions[0]);
    const nose = predictions[0].landmarks[2];
    const x = center[0] - nose[0];
    const y = center[1] - nose[1];
    const coords = [x, y];

    const vector_normalized = this.__getVectorNormalized(
      coords,
      outer_bounding
    );
    return {
      direction: this.__getDirection(coords, central_bounding),
      vector: [x, y],
      vector_normalized_square: vector_normalized, //square
      vector_normalized_circle: this.__normalizeRect2Circ(vector_normalized), //circle
    };
  }

  // Helpers
  __getPredictionBoundingDimensions(prediction) {
    const topLeft = prediction.topLeft;
    const bottomRight = prediction.bottomRight;
    const width = bottomRight[0] - topLeft[0];
    const height = bottomRight[1] - topLeft[1];
    const center = [topLeft[0] + width / 2, topLeft[1] + height / 2];

    return { topLeft, bottomRight, width, height, center };
  }

  // Where a value lies in a given range. Normalized to a range(range2).
  // note: careful with negative ranges
  __normalizeInRange(value, range1, range2 = [0, 1]) {
    if (value > range1[1]) {
      return range2[1];
    }
    if (value < range1[0]) {
      return range2[0];
    }
    let dist1 = range1[1] - range1[0];
    let dist2 = range2[1] - range2[0];

    const ratio = (value - range1[0]) / dist1; //range [0,1]
    let norm = range2[0] + ratio * dist2;
    return norm;
  }

  //2d plane [-1,1] coordinates => unit circle r=1.
  // note: not a map but simply limits coordinates outside of radius to on circle.
  __normalizeRect2Circ(coords, radius = 1) {
    let [x, y] = coords;
    let x_sign = x > 0 ? 1 : -1;
    let y_sign = y > 0 ? 1 : -1;

    if (Math.sqrt(x ** 2 + y ** 2) <= radius) {
      return [x, y];
    }
    const theta = Math.atan(y / x);
    const y_b = y_sign * Math.abs(radius * Math.sin(theta));
    const x_b = x_sign * Math.abs(radius * Math.cos(theta));
    return [x_b, y_b];
  }

  __getDirection(coords, central_bounding) {
    const [x, y] = coords;

    let direction;
    // get bounding config
    let bounding_x = central_bounding.x;
    let bounding_y = central_bounding.y;
    let [x_min, x_max] = bounding_x;
    let [y_min, y_max] = bounding_y;

    // estimate direction
    if (x <= x_max && x >= x_min && y <= y_max && y >= y_min) {
      direction = 'center';
    } else if (x < x_max && x > x_min) {
      if (y > y_max) {
        direction = 'up';
      } else if (y < y_min) {
        direction = 'down';
      }
    } else if (y < y_max && y > y_min) {
      if (x > x_max) {
        direction = 'right';
      } else if (x < x_min) {
        direction = 'left';
      }
    }
    return direction;
  }
  __getVectorNormalized(coords, outer_bounding) {
    const [x, y] = coords;
    // get bounding config
    let bounding_x = outer_bounding.x;
    let bounding_y = outer_bounding.y;
    let [x_min, x_max] = bounding_x;
    let [y_min, y_max] = bounding_y;

    let x_normalized = this.__normalizeInRange(x, [x_min, x_max], [-1, 1]);
    let y_normalized = this.__normalizeInRange(y, [y_min, y_max], [-1, 1]);

    return [x_normalized, y_normalized];
  }
}

const configPresets = {
  narrow: {
    central_bounding: { x: [-20, 20], y: [-30, 30] },
    outer_bounding: { x: [-20, 20], y: [-15, 10] },
  },
  normal: {
    central_bounding: { x: [-20, 20], y: [-30, 30] },
    outer_bounding: { x: [-50, 50], y: [-35, 20] },
  },
  wide: {
    central_bounding: { x: [-20, 20], y: [-30, 30] },
    outer_bounding: { x: [-100, 100], y: [-65, 50] },
  },
};

export { configPresets };
