import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { playMode } from '../../api/config';
import { findIndex, getSongUrl, isEmptyObject, shuffle } from '../../api/utils';
import Toast, { ToastHandlerType } from '../../baseUI/toast';
import { RootState } from '../../store';
import MiniPlayer from './miniPlayer';
import NormalPlayer from './normalPlayer';
import PlayList from './playerList';
import {
  changeCurrentIndex,
  changeCurrentSong,
  changePlayingState,
  changePlayList,
  changePlayMode,
  PlayerState,
} from './slice';

const Player = () => {
  //目前播放时间
  const [currentTime, setCurrentTime] = useState(0);
  //歌曲总时长
  const [duration, setDuration] = useState(0);
  //歌曲播放进度
  const percent = isNaN(currentTime / duration) ? 0 : currentTime / duration;

  const {
    currentSong,
    playList,
    playing,
    currentIndex,
    mode,
    sequencePlayList,
  } = useSelector((state: RootState) => state.player);

  const audioRef = useRef<HTMLAudioElement>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isEmptyObject(currentSong)) return;
    if (audioRef.current === null) return;
    dispatch(changeCurrentIndex(0)); //currentIndex默认为-1，临时改成0
    const current = playList[0] as PlayerState['currentSong'];
    dispatch(changeCurrentSong(current)); //赋值currentSong
    audioRef.current.src = getSongUrl(current.id);
    setTimeout(() => {
      audioRef.current?.play();
    });
    dispatch(changePlayingState(true)); //播放状态
    setCurrentTime(0); //从头开始播放
    setDuration((Number(current.dt) / 1000) | 0); //时长
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    playing ? audioRef.current?.play() : audioRef.current?.pause();
  }, [playing]);

  const updateTime: React.DOMAttributes<HTMLAudioElement>['onTimeUpdate'] = (
    e
  ) => {
    const target = e.target as unknown as { currentTime: number };
    setCurrentTime(target.currentTime);
  };

  const onProgressChange = (curPercent: number) => {
    if (audioRef.current === null) return;
    const newTime = curPercent * duration;
    setCurrentTime(newTime);
    audioRef.current.currentTime = newTime;
    if (!playing) {
      dispatch(changePlayingState)(true);
    }
  };

  const handleEnd = () => {
    if (mode === playMode.loop) {
      handleLoop();
    } else {
      handleNext();
    }
  };

  //一首歌循环
  const handleLoop = () => {
    if (audioRef.current === null) return;
    audioRef.current.currentTime = 0;
    changePlayingState(true);
    audioRef.current.play();
  };
  const handlePrev = () => {
    //播放列表只有一首歌时单曲循环
    if (playList.length === 1) {
      handleLoop();
      return;
    }
    let index = currentIndex - 1;
    if (index < 0) index = playList.length - 1;
    if (!playing) dispatch(changePlayingState(true));
    dispatch(changeCurrentIndex(index));
  };

  const handleNext = () => {
    //播放列表只有一首歌时单曲循环
    if (playList.length === 1) {
      handleLoop();
      return;
    }
    let index = currentIndex + 1;
    if (index === playList.length) index = 0;
    if (!playing) dispatch(changePlayingState(true));
    dispatch(changeCurrentIndex(index));
  };
  //记录当前的歌曲，以便于下次重渲染时比对是否是一首歌
  const [preSong, setPreSong] = useState<PlayerState['currentSong']>({});

  // //先mock一份currentIndex
  // useEffect(() => {
  //   dispatch(changeCurrentIndex(0));
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);
  const songReady = useRef(true);

  const handleError = () => {
    songReady.current = true;
    alert('播放出错');
  };

  useEffect(() => {
    if (
      !playList.length ||
      currentIndex === -1 ||
      !playList[currentIndex] ||
      (playList[currentIndex] as PlayerState['currentSong']).id ===
        preSong.id ||
      !songReady.current // 标志位为 false
    )
      return;
    const current = playList[
      currentIndex
    ] as unknown as PlayerState['currentSong'];
    setPreSong(current);
    songReady.current = false; // 把标志位置为 false, 表示现在新的资源没有缓冲完成，不能切歌
    dispatch(changeCurrentSong(current)); //赋值currentSong
    if (audioRef.current === null) return;
    audioRef.current.src = getSongUrl(current.id);
    setTimeout(() => {
      audioRef.current?.play().then(() => {
        songReady.current = true;
      });
    });
    dispatch(changePlayingState(true)); //播放状态
    setCurrentTime(0); //从头开始播放
    setDuration(((current.dt || 0) / 1000) | 0); //时长
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playList, currentIndex]);

  //Player/index
  const changeMode = () => {
    const newMode = (mode + 1) % 3;
    if (newMode === 0) {
      //顺序模式
      dispatch(changePlayList(sequencePlayList));
      const index = findIndex(currentSong, sequencePlayList);
      dispatch(changeCurrentIndex(index));
      setModeText('顺序循环');
    } else if (newMode === 1) {
      //单曲循环
      dispatch(changePlayList(sequencePlayList));
      setModeText('单曲循环');
    } else if (newMode === 2) {
      //随机播放
      const newList = shuffle(sequencePlayList as []);
      const index = findIndex(currentSong, newList);
      dispatch(changePlayList(newList));
      dispatch(changeCurrentIndex(index));
      setModeText('随机播放');
    }
    dispatch(changePlayMode(newMode));
    toastRef.current?.show();
  };

  const [modeText, setModeText] = useState('');

  const toastRef = useRef<ToastHandlerType>(null);

  return (
    <>
      {isEmptyObject(currentSong) ? null : <MiniPlayer percent={percent} />}
      {isEmptyObject(currentSong) ? null : (
        <NormalPlayer
          handleNext={handleNext}
          handlePrev={handlePrev}
          currentTime={currentTime}
          duration={duration}
          percent={percent}
          onProgressChange={onProgressChange}
          changeMode={changeMode}
        />
      )}
      <audio
        ref={audioRef}
        onTimeUpdate={updateTime}
        onEnded={handleEnd}
        onError={handleError}
      ></audio>
      <PlayList></PlayList>
      <Toast text={modeText} ref={toastRef}></Toast>
    </>
  );
};

export default Player;
