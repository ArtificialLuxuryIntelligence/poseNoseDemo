import React from 'react';
import Game from './Components/Game/Game.js';
import WelcomeDemo from './Components/WelcomeDemo/WelcomeDemo.js';
import ConfigPage from './Components/ConfigPage/ConfigPage';

import withNosePoseNew from './modules/react-with-nosepose/withNosePoseNew.js';

function App({ nosePose }) {
  return (
    <div>
      <Game nosePose={nosePose} />
      {/* <WelcomeDemo nosePose={nosePose} /> */}

      {/* <ConfigPage nosePose={nosePose} /> */}
    </div>
  );
}

export default withNosePoseNew(App);
