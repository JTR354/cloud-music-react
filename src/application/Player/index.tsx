import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../store';
import MiniPlayer from './miniPlayer';
import NormalPlayer from './normalPlayer';
import { changeFullScreen, PlayerHandler, PlayerState } from './slice';

const Player = () => {
  const { fullScreen } = useSelector((state: RootState) => state.player);

  const currentSong: PlayerState['currentSong'] = {
    al: {
      picUrl:
        'https://p1.music.126.net/JL_id1CFwNJpzgrXwemh4Q==/109951164172892390.jpg',
    },
    name: '木偶人',
    ar: [{ name: '薛之谦' }],
  };

  const dispatch = useDispatch();

  const toggleFullScreen: PlayerHandler['toggleFullScreen'] = (bool) => {
    dispatch(changeFullScreen(bool));
  };

  return (
    <>
      <MiniPlayer
        song={currentSong}
        fullScreen={fullScreen}
        toggleFullScreen={toggleFullScreen}
      />
      <NormalPlayer
        song={currentSong}
        fullScreen={fullScreen}
        toggleFullScreen={toggleFullScreen}
      />
    </>
  );
};

export default Player;
