import React from 'react';
import Config from './Components/Config/Config.js';
import Game from './Components/Game/Game.js';
import InterpolateTest from './Components/InterpolateTest.js';
import WelcomeDemo from './Components/WelcomeDemo/WelcomeDemo.js';
import withNosePose from './modules/react-with-nosepose/withNosePose.js';

function App({ nosePose }) {
  return (
    <div>
      {/* <Config nosePose={nosePose} /> */}
      {/* <Game nosePose={nosePose} /> */}
      {/* <WelcomeDemo nosePose={nosePose} /> */}

      <InterpolateTest />
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
