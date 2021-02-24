import InterpolatedDetector from './InterpolatedDetector';
import NoseVectorDetector from './NoseVectorDetector';

import { configs } from './presets';

export default function nosePose(configuration) {
  configuration = Object.assign(configs, configuration);
  let detector = new NoseVectorDetector();
  let smoothDetector = new InterpolatedDetector(configuration, detector);
  return smoothDetector;
}
