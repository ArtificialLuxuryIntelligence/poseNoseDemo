## About

This model simply adds an extra object 'nosePose' to a face detection model.
Currently using tensorflow [blazeface](https://github.com/tensorflow/tfjs-models/tree/master/blazeface) face detection

## Usage

### Basic

load and confure detection model
`import NosePose from '../NosePose/index.js';`
`let nose = new NosePose();`
`let model = await nosepose.load();`
`model.nosePose.configure(OPTIONS);`

run detection loop

`async function detect(){`
`const output = await model.nosePose.detect(video);`
`// do what you want with the output `
`}`
`let detectionInterval = setInterval(()=>{detect()},1000/40)`

### Configuration options

- outer_bounding : pixels from central point (of face) to register maximum movement

e.g.
`const OPTIONS = {`
`central_bounding: { x: [-20, 20], y: [-30, 15] },`
`outer_bounding: { x: [-50, 50], y: [-35, 35] },`
`}`

### Advanced

See demo

- Issue to overcome found in basic setup:
  The raw output:
  a) will probably not be run at 60fps
  b) is quite shakey due to imperfect face-detection models
- Solution:
  As above in basic setup AND create a second, faster animation loop, (requestanimationframe), to interpolate the raw vector output and create a faster, smoothed output vector which can be used for fluid cursor control etc.

## Dev

### Modification

To change face-detection model used in this library:
In FaceDetector.js
Change:

- load function in FaceDetector
- detect function in FaceVectorDetector
- \_\_getPredictionData function in FaceVectorDetector
