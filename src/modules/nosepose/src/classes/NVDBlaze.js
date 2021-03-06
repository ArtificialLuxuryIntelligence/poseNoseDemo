import * as blazeface from '@tensorflow-models/blazeface';
import * as tf from '@tensorflow/tfjs';

import './VectorDetector';
import VectorDetector from './VectorDetector';

export default class NVDBlaze extends VectorDetector {
  constructor(config, model) {
    super(model, config);
    // super(config);
    // this.model = model;
  }

  async load() {
    this.model = await blazeface.load({ maxFaces: 1 });
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

  __getPredictionData(prediction) {
    const topLeft = prediction.topLeft;
    const bottomRight = prediction.bottomRight;
    const width = bottomRight[0] - topLeft[0];
    const height = bottomRight[1] - topLeft[1];
    const center = [topLeft[0] + width / 2, topLeft[1] + height / 2];

    const nose = prediction.landmarks[2];

    return { topLeft, bottomRight, width, height, center, nose };
  }
}
