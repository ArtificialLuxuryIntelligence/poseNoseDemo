import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import * as tf from '@tensorflow/tfjs';

import './VectorDetector';
import VectorDetector from './VectorDetector';

export default class IVDMesh extends VectorDetector {
  constructor(config, model) {
    super(model, config);
  }

  async load() {
    this.model = await faceLandmarksDetection.load(
      faceLandmarksDetection.SupportedPackages.mediapipeFacemesh,
      { maxFaces: 1, shouldLoadIrisModel: true }
    );
  }

  async detect(video) {
    // Get predictions from model
    let predictions = await this.model.estimateFaces({
      input: video,
      predictIrises: true,
    });
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
    let annots = prediction.annotations;

    let {
      leftEyeIris,
      leftEyeLower0,
      leftEyeLower1,
      leftEyeLower2,
      leftEyeLower3,
      leftEyeUpper0,
      leftEyeUpper1,
      leftEyeUpper2,
    } = annots;

    let pts = [
      ...leftEyeLower0,
      // ...leftEyeLower1,
      // ...leftEyeLower2,
      // ...leftEyeLower3,
      ...leftEyeUpper0,
      // ...leftEyeUpper1,
      // ...leftEyeUpper2,
    ];
    //find average (central point)
    let l = pts.length;
    let c = pts
      .reduce(
        (acc, curr, i, a) => {
          let [x, y] = acc;
          let [xc, yc] = curr;
          return [x + xc, y + yc];
        },
        [0, 0]
      )
      .map((v) => v / l);

    // const topLeft = prediction.topLeft;
    // const bottomRight = prediction.bottomRight;
    // const width = bottomRight[0] - topLeft[0];
    // const height = bottomRight[1] - topLeft[1];
    // const center = [topLeft[0] + width / 2, topLeft[1] + height / 2];

    // const nose = prediction.landmarks[2];

    const nose = leftEyeIris[0]; //not nose..
    const center = c;

    return { center, nose };
  }
}
