import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import * as tf from '@tensorflow/tfjs';
import { distanceCoordinates } from '../helpers/geometry';

import './VectorDetector';
import VectorDetector from './VectorDetector';

export default class NVDMesh extends VectorDetector {
  constructor(config, model) {
    super(model, config);
    // super(config);
    // this.model = model;
  }

  async load() {
    this.model = await faceLandmarksDetection.load(
      faceLandmarksDetection.SupportedPackages.mediapipeFacemesh,
      { maxFaces: 1, shouldLoadIrisModel: false }
    );
  }

  async detect(video) {
    // Get predictions from model
    let predictions = await this.model.estimateFaces({
      input: video,
      predictIrises: false,
    });
    if (!predictions.length) {
      return false;
    }

    // Extract relevant data
    const {
      nose,
      center,
      lipsLowerInner,
      lipsUpperInner,
      eyeDist,
    } = this.__getPredictionData(predictions[0]);

    let noseVectors = this.__getNosePointVectors(nose, center);
    let mouthVector = this.__getMouthOpenVector(
      lipsLowerInner,
      lipsUpperInner,
      eyeDist
    );
    let vectors = {
      ...noseVectors,
      ...mouthVector,
    };
    let config = this.config;

    // note estimateFaces complete *predictions* are also included here (DO NOT call it again!)
    return { vectors, predictions: predictions[0], config };
  }

  __getPredictionData(prediction) {
    const { topLeft, bottomRight } = prediction.boundingBox;
    const width = bottomRight[0] - topLeft[0];
    const height = bottomRight[1] - topLeft[1];
    const center = [topLeft[0] + width / 2, topLeft[1] + height / 2];

    let {
      lipsLowerInner,
      lipsUpperInner,
      rightEyeLower1,
      leftEyeLower1,
    } = prediction.annotations;

    lipsLowerInner = lipsLowerInner[5];
    lipsUpperInner = lipsUpperInner[5];

    const eyeDist = distanceCoordinates(rightEyeLower1[4], leftEyeLower1[4]);
    const nose = prediction.scaledMesh[4];
    return {
      topLeft,
      bottomRight,
      width,
      height,
      center,
      nose,
      lipsLowerInner,
      lipsUpperInner,
      eyeDist,
    };
  }
  __getMouthOpenVector(lipUpper, lipLower, eyeDist) {
    let distance = (distanceCoordinates(lipUpper, lipLower) / eyeDist) * 100; //distance normalized for z-dist
    let mouth_bounding = this.config.mouth_bounding;
    const normalized_mouth = this.__normalizeInRange(distance, mouth_bounding);
    return { normalized_mouth };
  }
}
