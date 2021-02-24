import InterpolatedDetector from './InterpolatedDetector';
import NoseVectorDetector from './NoseVectorDetector';

export default function nosePose(configuration) {
  let detector = new NoseVectorDetector();
  let smoothDetector = new InterpolatedDetector(configuration, detector);
  return smoothDetector;
}
