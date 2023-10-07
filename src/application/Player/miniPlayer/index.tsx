import { FC, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';

import { getName } from '../../../api/utils';
import { PlayerHandler, PlayerState } from '../slice';
import { MiniPlayerContainer } from './style';

const MiniPlayer: FC<{
  song: PlayerState['currentSong'];
  fullScreen: PlayerState['fullScreen'];
  toggleFullScreen: PlayerHandler['toggleFullScreen'];
}> = (props) => {
  const { song, fullScreen, toggleFullScreen } = props;

  const miniPlayerRef = useRef<HTMLDivElement>(null);
  return (
    <CSSTransition
      in={!fullScreen}
      timeout={400}
      classNames="mini"
      onEnter={() => {
        if (miniPlayerRef.current === null) return;
        miniPlayerRef.current.style.display = 'flex';
      }}
      onExited={() => {
        if (miniPlayerRef.current === null) return;
        miniPlayerRef.current.style.display = 'none';
      }}
      nodeRef={miniPlayerRef}
    >
      <MiniPlayerContainer
        ref={miniPlayerRef}
        onClick={() => toggleFullScreen(true)}
      >
        <div className="icon">
          <div className="imgWrapper">
            <img
              className="play"
              src={song.al?.picUrl}
              width="40"
              height="40"
              alt="img"
            />
          </div>
        </div>
        <div className="text">
          <h2 className="name">{song.name}</h2>
          <p className="desc">{getName(song.ar)}</p>
        </div>
        <div className="control">
          <i className="iconfont">&#xe650;</i>
        </div>
        <div className="control">
          <i className="iconfont">&#xe640;</i>
        </div>
      </MiniPlayerContainer>
    </CSSTransition>
  );
};

export default MiniPlayer;
