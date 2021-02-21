import React from 'react';
import Demo from './Components/Demo/Demo.js';
import Game from './Components/Game/Game.js';
import withNosePose from './modules/react-with-nosepose/withNosePose.js';

function App({ nosePose }) {
  return (
    <div>
      {/* <Demo nosePose={nosePose} /> */}
      <Game nosePose={nosePose} />
    </div>
  );
}

export default withNosePose(App, {
  // render: {
  //   responsiveness: {
  //     value: 0.08,
  //   },
  //   performance: {
  //     fps: 10,
  //   },
  // },
  // model: {
  //   central_bounding: {
  //     x: [-20, 20],
  //     y: [-30, 15],
  //   },
  //   outer_bounding: {
  //     x: [-50, 50],
  //     y: [-35, 35],
  //   },
  // },
});
