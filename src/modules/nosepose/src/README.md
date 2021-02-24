## About

nosepose outputs vectors corresponding to the direction a face in a video stream (i.e. webcam) faces.

The output is smoothed using interpolation and can be called 60+fps (i.e. using requestAnimationFrame) while the face detection model calls are limited internally

Currently using tensorflow [blazeface](https://github.com/tensorflow/tfjs-models/tree/master/blazeface) for face detection

## Usage

### Basic

load and confure detection model
`import nosePose from '../nosepose/src/index';`
` let detector = nosePose(configs)`
`await detector.load();`
``

run detection loop

` function detect(){`
` const prediction = detector.detect(video);`
`// do what you want with the output `
`}`
`... run detect in a loop`

### Configuration options

(optional)

`detector.configure(configs)`

see "./defaults.js"
example config object:

```
const config = {
  detector: {
    central_bounding: { x: [-20, 20], y: [-30, 15] },
    outer_bounding: { x: [-50, 50], y: [-35, 35] },
  },
  interpolater: {
    fps: 15,
    sensitivity: 0.04,
  /// advanced
  stepToward: function(currentValue,targetValue,stepSize){
    ...
  }
  }

}
```

### advanced

stepToward takes the current value and returns the next value for the interpolation iteration
it is a function of the targetValue and a stepSize parameter.
explanation: the iteration will happen many times before the targetValue changes if the
model is slow/fps config is low and the detection is called very frequently (i.e. in an animation loop)

```

```
