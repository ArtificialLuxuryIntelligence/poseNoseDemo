import { mergeDeep } from './../helpers/helpers';
import Interpolater from './Interpolater';
import { defaults } from './../defaults';
//

// params
// detector: a detector with load, detect and configure function
// configs: e.g. :

export default class InterpolatedDetector {
  constructor(configs, detector) {
    this.detector = detector;
    this.interpolater = null;
    this.configs = mergeDeep({}, defaults, configs);
    // note : current implementation in react always provides a complete configuration object (mergeDeep alrady done)
    // reason: react needs to hold the config state so that sliders etc work
    // so  merge isnt really needed here (currently
  }

  async load() {
    // load and set up detector
    await this.detector.load();
    this.__configureDetector(this.configs.detector);

    this.__configureInterpolator(this.configs.interpolater);
  }

  configure(configuration) {
    // only update configurations which have changed: (slightly smoother UI when configuring)

    let detectorConfigChange =
      JSON.stringify(this.configs.detector) !==
      JSON.stringify(configuration.detector);

    let interpolaterConfigChange =
      JSON.stringify(this.configs.interpolater) !==
      JSON.stringify(configuration.interpolater);

    //configure detector
    detectorConfigChange && this.__configureDetector(configuration.detector);

    // init new Interpolater (with new configuration)
    interpolaterConfigChange &&
      this.__configureInterpolator(configuration.interpolater);

    //update configs
    this.configs = mergeDeep({}, this.configs, configuration);
  }

  __configureDetector(config) {
    this.detector.configure(config);
  }
  __configureInterpolator(config) {
    this.interpolater = new Interpolater(
      (video) => this.detector.detect(video),
      config.initialVal,
      config.stepToward,
      config.sensitivity,
      config.fps
    );
  }

  detect(video) {
    return this.interpolater.interpolate(video);
  }
}
