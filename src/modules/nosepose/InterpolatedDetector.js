import Interpolater from './Interpolater';
import { configs } from './presets';
//

// params
// detector: a detector with load, detect and configure function
// configs: e.g. :

export default class InterpolatedDetector {
  constructor(configs, detector) {
    this.detector = detector;
    this.interpolater = null;
    this.configs = configs;
  }

  async load() {
    // load and set up detector
    await this.detector.load();
    this.configure(configs);
  }

  configure(configuration) {
    let detectorConfigs = Object.assign(
      {},
      configs.detector,
      configuration.detector
    );
    let interpolaterConfigs = Object.assign(
      {},
      configs.interpolater,
      configuration.detector
    );
    this.configs = {
      detector: detectorConfigs,
      interpolater: interpolaterConfigs,
    };

    //configure detector
    this.detector.configure(this.configs.detector);

    // init new Interpolater (with new configuration)
    // no point in having a configure method in interpolater (? maybe fps ?)
    this.interpolater = new Interpolater(
      (video) => this.detector.detect(video),
      this.configs.interpolater.initialVal,
      this.configs.interpolater.stepToward,
      this.configs.interpolater.fps
    );
  }

  detect(video) {
    return this.interpolater.interpolate(video);
  }
}
