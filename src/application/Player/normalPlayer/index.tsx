// 引入的代码
import BScroll from '@better-scroll/core';
import animations from 'create-keyframe-animation';
import React, { FC, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { CSSTransition } from 'react-transition-group';

import { playMode } from '../../../api/config';
import Lyric from '../../../api/lyric-parser';
import {
  formatPlayTime,
  getName,
  hackCSSStyleType,
  prefixStyle,
} from '../../../api/utils';
import ProgressBar from '../../../baseUI/progress-bar';
import Scroll from '../../../baseUI/scroll';
import { RootState } from '../../../store';
import { usePlayerHandler } from '../slice';
import {
  Bottom,
  CDWrapper,
  LyricContainer,
  LyricWrapper,
  Middle,
  NormalPlayerContainer,
  Operators,
  ProgressWrapper,
  Top,
} from './style';

const NormalPlayer: FC<{
  duration: number;
  currentTime: number;
  percent: number;
  onProgressChange: (percent: number) => void;
  changeMode: () => void;
  handlePrev: () => void;
  handleNext: () => void;
  currentPlayingLyric: string;
  currentLyric: Lyric | null;
  currentLineNum: number;
}> = ({
  duration,
  currentTime,
  percent,
  onProgressChange,
  handleNext,
  handlePrev,
  changeMode,
  currentPlayingLyric,
  currentLyric,
  currentLineNum,
}) => {
  const {
    fullScreen,
    playing,
    currentSong: song,
    mode,
  } = useSelector((state: RootState) => state.player);

  const { toggleFullScreen, clickPlaying, toggleShowPlayList } =
    usePlayerHandler();
  // const { song, fullScreen, toggleFullScreen } = props;
  const normalPlayerRef = useRef<HTMLDivElement>(null);
  const cdWrapperRef = useRef<HTMLDivElement>(null);
  // 启用帧动画
  const enter = () => {
    if (normalPlayerRef.current === null) return;
    if (cdWrapperRef.current === null) return;
    normalPlayerRef.current.style.display = 'block';
    const { x, y, scale } = _getPosAndScale(); // 获取 miniPlayer 图片中心相对 normalPlayer 唱片中心的偏移
    const animation = {
      0: {
        transform: `translate3d(${x}px,${y}px,0) scale(${scale})`,
      },
      60: {
        transform: `translate3d(0, 0, 0) scale(1.1)`,
      },
      100: {
        transform: `translate3d(0, 0, 0) scale(1)`,
      },
    };
    animations.registerAnimation({
      name: 'move',
      animation,
      presets: {
        duration: 400,
        easing: 'linear',
      },
    });
    animations.runAnimation(cdWrapperRef.current, 'move');
  };
  // 计算偏移的辅助函数
  const _getPosAndScale = () => {
    const targetWidth = 40;
    const paddingLeft = 40;
    const paddingBottom = 30;
    const paddingTop = 80;
    const width = window.innerWidth * 0.8;
    const scale = targetWidth / width;
    // 两个圆心的横坐标距离和纵坐标距离
    const x = -(window.innerWidth / 2 - paddingLeft);
    const y = window.innerHeight - paddingTop - width / 2 - paddingBottom;
    return {
      x,
      y,
      scale,
    };
  };
  const afterEnter = () => {
    // 进入后解绑帧动画
    if (cdWrapperRef.current === null) return;
    const cdWrapperDom = cdWrapperRef.current;
    animations.unregisterAnimation('move');
    cdWrapperDom.style.animation = '';
  };

  const transform = prefixStyle('transform');
  const leave = () => {
    if (!cdWrapperRef.current) return;
    if (transform === false) return;
    const cdWrapperDom = cdWrapperRef.current;
    cdWrapperDom.style.transition = 'all 0.4s';
    const { x, y, scale } = _getPosAndScale();
    (cdWrapperDom.style as unknown as hackCSSStyleType)[
      transform
    ] = `translate3d(${x}px,${y}px,0) scale(${scale})`;
  };

  const afterLeave = () => {
    if (!cdWrapperRef.current) return;
    if (normalPlayerRef.current === null) return;
    if (transform === false) return;
    const cdWrapperDom = cdWrapperRef.current;
    cdWrapperDom.style.transition = '';
    (cdWrapperDom.style as unknown as hackCSSStyleType)[transform] = '';
    // 一定要注意现在要把 normalPlayer 这个 DOM 给隐藏掉，因为 CSSTransition 的工作只是把动画执行一遍
    // 不置为 none 现在全屏播放器页面还是存在
    normalPlayerRef.current.style.display = 'none';
    currentState.current = '';
  };

  //getPlayMode方法
  const getPlayMode = () => {
    let content;
    if (mode === playMode.sequence) {
      content = '&#xe625;';
    } else if (mode === playMode.loop) {
      content = '&#xe653;';
    } else {
      content = '&#xe61b;';
    }
    return content;
  };

  const currentState = useRef('');
  const lyricScrollRef = useRef<BScroll>(null);
  const lyricLineRefs = useRef<React.RefObject<HTMLParagraphElement>[]>([]);

  useEffect(() => {
    if (!lyricScrollRef.current) return;
    const bScroll = lyricScrollRef.current.getBScroll();
    if (currentLineNum > 5) {
      // 保持当前歌词在第5条的位置
      const lineEl = lyricLineRefs.current[currentLineNum - 5].current;
      bScroll.scrollToElement(lineEl, 1000);
    } else {
      // 当前歌词行数<=5, 直接滚动到最顶端
      bScroll.scrollTo(0, 0, 1000);
    }
  }, [currentLineNum]);

  const toggleCurrentState = () => {
    if (currentState.current !== 'lyric') {
      currentState.current = 'lyric';
    } else {
      currentState.current = '';
    }
  };

  const cdRef = useRef<HTMLDivElement>(null);
  const lyricWrapperRef = useRef<HTMLDivElement>(null);

  return (
    <CSSTransition
      classNames="normal"
      in={fullScreen}
      timeout={400}
      mountOnEnter
      onEnter={enter}
      onEntered={afterEnter}
      onExit={leave}
      onExited={afterLeave}
      nodeRef={normalPlayerRef}
    >
      <NormalPlayerContainer ref={normalPlayerRef}>
        <div className="background">
          <img
            src={song.al?.picUrl + '?param=300x300'}
            width="100%"
            height="100%"
            alt="歌曲图片"
          />
        </div>
        <div className="background layer"></div>
        <Top className="top">
          <div className="back" onClick={() => toggleFullScreen(false)}>
            <i className="iconfont icon-back">&#xe662;</i>
          </div>
          <div className="text">
            <h1 className="title">{song.name}</h1>
            <h1 className="subtitle">{getName(song.ar)}</h1>
          </div>
        </Top>
        <Middle ref={cdWrapperRef} onClick={toggleCurrentState}>
          <CSSTransition
            timeout={400}
            classNames="fade"
            in={currentState.current !== 'lyric'}
            nodeRef={cdRef}
          >
            <CDWrapper
              ref={cdRef}
              style={{
                visibility:
                  currentState.current !== 'lyric' ? 'visible' : 'hidden',
              }}
            >
              <div className={`needle ${playing ? '' : 'pause'}`}></div>
              <div className="cd">
                <img
                  className={`image play ${playing ? '' : 'pause'}`}
                  src={song.al?.picUrl + '?param=400x400'}
                  alt=""
                />
              </div>
              <p className="playing_lyric">{currentPlayingLyric}</p>
            </CDWrapper>
          </CSSTransition>
          <CSSTransition
            timeout={400}
            classNames="fade"
            in={currentState.current === 'lyric'}
            nodeRef={lyricWrapperRef}
          >
            <LyricContainer>
              <Scroll ref={lyricScrollRef}>
                <LyricWrapper
                  ref={lyricWrapperRef}
                  style={{
                    visibility:
                      currentState.current === 'lyric' ? 'visible' : 'hidden',
                  }}
                  className="lyric_wrapper"
                >
                  {currentLyric ? (
                    currentLyric.lines.map((item, index) => {
                      lyricLineRefs.current[index] = React.createRef();
                      return (
                        <p
                          className={`text ${
                            currentLineNum === index ? 'current' : ''
                          }`}
                          key={item.txt + index}
                          ref={lyricLineRefs.current[index]}
                        >
                          {item.txt}
                        </p>
                      );
                    })
                  ) : (
                    <p className="text pure">纯音乐，请欣赏。</p>
                  )}
                </LyricWrapper>
              </Scroll>
            </LyricContainer>
          </CSSTransition>
        </Middle>
        <Bottom className="bottom">
          <ProgressWrapper>
            <span className="time time-l">{formatPlayTime(currentTime)}</span>
            <div className="progress-bar-wrapper">
              <ProgressBar
                percent={percent}
                percentChange={onProgressChange}
              ></ProgressBar>
            </div>
            <div className="time time-r">{formatPlayTime(duration)}</div>
          </ProgressWrapper>
          <Operators>
            <div className="icon i-left" onClick={changeMode}>
              {/* <i className="iconfont">&#xe625;</i> */}
              <i
                className="iconfont"
                dangerouslySetInnerHTML={{ __html: getPlayMode() }}
              ></i>
            </div>
            <div className="icon i-left" onClick={handlePrev}>
              <i className="iconfont">&#xe6e1;</i>
            </div>
            <div className="icon i-center">
              <i
                className="iconfont"
                onClick={(e) => clickPlaying(e, !playing)}
                dangerouslySetInnerHTML={{
                  __html: playing ? '&#xe723;' : '&#xe731;',
                }}
              ></i>
            </div>
            <div className="icon i-right" onClick={handleNext}>
              <i className="iconfont">&#xe718;</i>
            </div>
            <div
              className="icon i-right"
              onClick={(e) => toggleShowPlayList(e, true)}
            >
              <i className="iconfont">&#xe640;</i>
            </div>
          </Operators>
        </Bottom>
      </NormalPlayerContainer>
    </CSSTransition>
  );
};
export default NormalPlayer;
