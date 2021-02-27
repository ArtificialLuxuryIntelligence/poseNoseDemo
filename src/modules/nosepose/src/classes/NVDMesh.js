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
      rightEyeLower1,
      rightEyeUpper1,
      leftEyeLower1,
      leftEyeUpper1,
      eyeDist,
    } = this.__getPredictionData(predictions[0]);

    let noseVectors = this.__getNosePointVectors(nose, center);
    let mouthVector = this.__getMouthOpenVector(
      lipsLowerInner,
      lipsUpperInner,
      eyeDist
    );

    let eyeVectors = this.__getEyesClosedVectors(
      rightEyeLower1,
      rightEyeUpper1,
      leftEyeLower1,
      leftEyeUpper1,
      eyeDist
    );
    let vectors = {
      ...noseVectors,
      ...mouthVector,
      ...eyeVectors,
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
      rightEyeUpper1,
      leftEyeLower1,
      leftEyeUpper1,
    } = prediction.annotations;

    lipsLowerInner = lipsLowerInner[5];
    lipsUpperInner = lipsUpperInner[5];
    rightEyeLower1 = rightEyeLower1[4];
    rightEyeUpper1 = rightEyeUpper1[4];
    leftEyeLower1 = leftEyeLower1[4];
    leftEyeUpper1 = leftEyeUpper1[4];

    const eyeDist = distanceCoordinates(rightEyeLower1, leftEyeLower1);
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
      rightEyeLower1,
      rightEyeUpper1,
      leftEyeLower1,
      leftEyeUpper1,
      eyeDist,
    };
  }
  __getMouthOpenVector(lipUpper, lipLower, eyeDist) {
    let distance = (distanceCoordinates(lipUpper, lipLower) / eyeDist) * 100; //distance normalized for z-dist
    let mouth_bounding = this.config.mouth_bounding;
    const normalized_mouth = this.__normalizeInRange(distance, mouth_bounding);
    return { normalized_mouth };
  }
  __getEyesClosedVectors(
    rightEyeLower1,
    rightEyeUpper1,
    leftEyeLower1,
    leftEyeUpper1,
    eyeDist
  ) {
    let distance_r =
      (distanceCoordinates(rightEyeLower1, rightEyeUpper1) / eyeDist) * 100; //distance normalized for z-dist
    let eye_bounding = this.config.eye_bounding;
    const normalized_eye_r = this.__normalizeInRange(distance_r, eye_bounding);
    let distance_l =
      (distanceCoordinates(leftEyeLower1, leftEyeUpper1) / eyeDist) * 100; //distance normalized for z-dist

    const normalized_eye_l = this.__normalizeInRange(distance_l, eye_bounding);

    return { normalized_eye_r, normalized_eye_l };
  }
}
