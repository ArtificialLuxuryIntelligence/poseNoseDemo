import * as tf from '@tensorflow/tfjs';
import * as blazeface from '@tensorflow-models/blazeface';

export default class FaceDetector {
  constructor(
    options = {
      // TO DO make this as a percentage of something (bounding box?)
      // number with respect to central point of facebounding
      //nose position
      central_bounding: { x: [-20, 20], y: [-30, 30] }, // within which no direction is registered
      normalizing_range: { x: [-100, 100], y: [-100, 100] }, // point at which normalized direction is 1. (range: [0,1])
    }
  ) {
    this.model = null;
    this.options = options;
  }

  async load() {
    this.model = await blazeface.load();

    return Object.assign(this.model, {
      detectFace: this.detectFace.bind(this),
    });
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
    const { center } = this.__getDimensions(predictions[0]);
    const nose = predictions[0].landmarks[2];
    const x = center[0] - nose[0];
    const y = center[1] - nose[1];

    let direction;

    if (x <= 20 && x >= -20 && y <= 30 && y >= -30) {
      direction = 'center';
    } else if (x < 20 && x > -20) {
      if (y > 30) {
        direction = 'up';
      } else if (y < -30) {
        direction = 'down';
      }
    } else if (y < 30 && y > -30) {
      if (x > 30) {
        direction = 'right';
      } else if (x < -30) {
        direction = 'left';
      }
    }
    let x_normalized = this.__normalizeInRange(x, [-50, 50], [-1, 1]);
    let y_normalized = this.__normalizeInRange(y, [-35, 20], [-1, 1]);

    // NOTE : vector is comp heavy? so make it a function...?
    return {
      direction,
      vector: [x, y],
      vector_normalized: [x_normalized, y_normalized], //square
      vector_normalized_circle: this.__confineToCircle([
        x_normalized,
        y_normalized,
      ]), //circle
    };
  }

  // Helper
  __getDimensions(prediction) {
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
  __confineToCircle(coords, radius = 1) {
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
}
