import { FC, useRef } from 'react';
import { useSelector } from 'react-redux';
import { CSSTransition } from 'react-transition-group';

import { getName } from '../../../api/utils';
import ProgressCircle from '../../../baseUI/progress-circle';
import { RootState } from '../../../store';
import { usePlayerHandler } from '../slice';
import { MiniPlayerContainer } from './style';

const MiniPlayer: FC<{
  percent: number;
}> = ({ percent }) => {
  const {
    fullScreen,
    playing,
    currentSong: song,
  } = useSelector((state: RootState) => state.player);

  const { toggleFullScreen, clickPlaying } = usePlayerHandler();

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
              className={`play ${playing ? '' : 'pause'}`}
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
          <ProgressCircle radius={32} percent={percent}>
            {playing ? (
              <i
                className="icon-mini iconfont icon-pause"
                onClick={(e) => clickPlaying(e, false)}
              >
                &#xe650;
              </i>
            ) : (
              <i
                className="icon-mini iconfont icon-play"
                onClick={(e) => clickPlaying(e, true)}
              >
                &#xe61e;
              </i>
            )}
          </ProgressCircle>
        </div>
        <div className="control">
          <i className="iconfont">&#xe640;</i>
        </div>
      </MiniPlayerContainer>
    </CSSTransition>
  );
};

export default MiniPlayer;
