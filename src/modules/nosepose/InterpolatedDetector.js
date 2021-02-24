import { mergeDeep } from './helpers';
import Interpolater from './Interpolater';
import { defaults } from './defaults';
//

// params
// detector: a detector with load, detect and configure function
// configs: e.g. :

export default class InterpolatedDetector {
  constructor(configs, detector) {
    this.detector = detector;
    this.interpolater = null;
    this.configs = mergeDeep(defaults, configs);
    // note : current implementation in react always provides a complete configuration object
    // so any merge isnt really needed
  }

  async load() {
    // load and set up detector
    await this.detector.load();
    this.configure(this.configs);
  }

  configure(configuration) {
    this.configs = mergeDeep(this.configs, configuration);

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
