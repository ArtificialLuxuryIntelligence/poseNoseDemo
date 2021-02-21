# Parameters

wrapped component
display options //optional
render options //optional
model options //optional

(optional - see js/defaults.js)

e.g.
`export default withNosePose(App,`
` { video: true, circleControl: true, squareControl: true },`
` {`
` responsiveness: {`
` value: 0.1,`
`},`
`performance: {`
` fps: 10,`
`}`
`},`
`{`
` outer_bounding: {`
` x: [-50, 50],`
` y: [-35, 35],`
`},`
`})`

# props provided

withNosePose provides wrapped component with the nosePose prop:
` nosePose = { unitCirclePositionRef, unitSquarePositionRef, configure, configs: { render: renderConfig, model: modelConfig }, };`

- unitCirclePositionRef. access vector with unitCirclePositionRef.current
- unitSquarePositionRef. access vector with unitSquarePositionRef.current

- configs. the current configurations (think of configs and configure function as get and set)
- configure function. takes similar argument to withNosePose wrapper BUT is slightly different:
- You cannot update the display options (should only really be used for testing/developing)
- One object:
  options={model:{}, render:{}} // as above
