import Interpolater from './Interpolater';
//

// params
// detector: a detector with load, detect and configure function
// configs: e.g. :

// configs: {
//     detector: {
//       central_bounding: { x: [-20, 20], y: [-30, 15] },
//       outer_bounding: { x: [-50, 50], y: [-35, 35] },
//     },
//     interpolater: {
//       fps: 1,
//       initialVal: {
//         vectors: {
//           direction_word: '',
//           vector: [], //absolute value in face bounding rect
//           vector_normalized_square: [0, 0], //normalized square [0,1]x [0,1]y
//           vector_normalized_circle: [0, 0], //normalized circle [0,1]r
//         },
//         predictions: {},
//         config: {},
//       },
//       stepToward: stepTowardDetector,
//     },
//   },

export default class InterpolatedDetector {
  constructor(configs, detector) {
    this.detector = detector;
    this.interpolater = null;
    this.configs = configs;
  }

  async load() {
    // load detector
    await this.detector.load();
    this.detector.configure(this.configs.detector);

    // set up interpolater
    this.interpolater = new Interpolater(
      (video) => this.detector.detect(video),
      this.configs.interpolater.initialVal,
      this.configs.interpolater.stepToward,
      this.configs.interpolater.fps
    );
  }
  configure(configs) {
    //config detector/ config interpolator separated? so it doesnt get restarted every time? lets see..

    this.configs = configs; //TO DO object assign wiht defaults
    this.detector.configure(this.configs.detector);

    this.interpolater = new Interpolater(
      this.detector.detect(this.configs.detector),
      this.configs.interpolater.initialVal,
      this.configs.interpolater.stepToward,
      this.configs.interpolater.fps
    );
  }
  detect(video) {
    return this.interpolater.interpolate(video);
  }
}
