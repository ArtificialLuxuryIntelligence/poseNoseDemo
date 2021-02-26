import InterpolatedDetector from './classes/InterpolatedDetector';
import NoseVectorDetector from './classes/NoseVectorDetector';
import NVDBlaze from './classes/NVDBlaze';
import NVDMesh from './classes/NVDMesh';
import IVDMesh from './classes/IVDMesh';

export default function nosePose(configuration, type) {
  let detector;

  //no need to configure detectors, config is done by interpolatedDetector on load
  switch (type) {
    case 'iris':
      detector = new IVDMesh();
      break;
    case 'mesh':
      detector = new NVDMesh();
      break;
    default:
      detector = new NVDBlaze();
      break;
  }

  let smoothDetector = new InterpolatedDetector(configuration, detector);
  return smoothDetector;
}
