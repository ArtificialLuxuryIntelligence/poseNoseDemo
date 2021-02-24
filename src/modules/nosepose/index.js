import InterpolatedDetector from './classes/InterpolatedDetector';
import NoseVectorDetector from './classes/NoseVectorDetector';

export default function nosePose(configuration) {
  let detector = new NoseVectorDetector();
  let smoothDetector = new InterpolatedDetector(configuration, detector);
  return smoothDetector;
}
