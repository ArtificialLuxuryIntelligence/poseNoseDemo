import React from 'react';
import Config from './Components/Config/Config.js';
import Game from './Components/Game/Game.js';
import InterpolateTest from './Components/InterpolateTest.js';
import WelcomeDemo from './Components/WelcomeDemo/WelcomeDemo.js';
import withNosePose from './modules/react-with-nosepose/withNosePose.js';
import withNosePoseNew from './modules/react-with-nosepose/withNosePoseNew.js';

function App({ nosePose }) {
  return (
    <div>
      {/* <Config nosePose={nosePose} /> */}
      {/* <Game nosePose={nosePose} /> */}
      {/* <WelcomeDemo nosePose={nosePose} /> */}

      <InterpolateTest nosePose={nosePose} />
    </div>
  );
}

export default withNosePoseNew(App);
