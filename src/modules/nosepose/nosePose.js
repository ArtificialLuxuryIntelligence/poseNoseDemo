import * as blazeface from '@tensorflow-models/blazeface';
import * as tf from '@tensorflow/tfjs';
import { configPresets } from './defaults';

export default class NosePose {
  constructor(model) {
    this.model = model; // Note: original model still accessible in instance
    this.config = configPresets.normal;
  }

  async load() {
    this.model = await blazeface.load({ maxFaces: 1 });
    return new NosePose(this.model);
  }

  configure(config) {
    this.config = Object.assign({ ...configPresets.normal }, config);
  }
  async detect(video) {
    // Get predictions from model
    let predictions = await this.model.estimateFaces(video);
    if (!predictions.length) {
      return false;
    }

    // Extract relevant data
    const { nose, center } = this.__getPredictionData(predictions[0]);

    let vectors = this.__getNosePointVectors(nose, center);
    let config = this.config;

    // note estimateFaces complete *predictions* are also included here (DO NOT call it again!)
    return { vectors, predictions: predictions[0], config };
  }

  __getNosePointVectors(nose, center) {
    let central_bounding = this.config.central_bounding;
    let outer_bounding = this.config.outer_bounding;

    const x = center[0] - nose[0];
    const y = center[1] - nose[1];
    const coords = [x, y];

    // -----------------------------------------------------------

    const direction_word = this.__getDirection(coords, central_bounding);
    const vector = [x, y];
    const vector_normalized_square = this.__getVectorNormalized(
      coords,
      outer_bounding
    );
    const vector_normalized_circle = this.__normalizeRect2Circ(
      vector_normalized_square
    );

    return {
      direction_word,
      vector, //absolute value in face bounding rect
      vector_normalized_square, //normalized square [0,1]x [0,1]y
      vector_normalized_circle, //normalized circle [0,1]r
    };
  }

  // note: current only nose and center are used from this function
  __getPredictionData(prediction) {
    const topLeft = prediction.topLeft;
    const bottomRight = prediction.bottomRight;
    const width = bottomRight[0] - topLeft[0];
    const height = bottomRight[1] - topLeft[1];
    const center = [topLeft[0] + width / 2, topLeft[1] + height / 2];

    const nose = prediction.landmarks[2];

    return { topLeft, bottomRight, width, height, center, nose };
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

  //2d plane coordinates => unit circle r=1.
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

  // returns "up", "down","left","right"
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
