import BScroll from '@better-scroll/core';
import { useCallback, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CSSTransition } from 'react-transition-group';

import { playMode } from '../../../api/config';
import {
  findIndex,
  getName,
  hackCSSStyleType,
  prefixStyle,
  shuffle,
} from '../../../api/utils';
import Confirm, { ConfirmRef } from '../../../baseUI/confirm';
import Scroll from '../../../baseUI/scroll';
import { RootState } from '../../../store';
import {
  changeCurrentIndex,
  changeCurrentSong,
  changePlayingState,
  changePlayList,
  changePlayMode,
  changeSequencePlayList,
  changeShowPlayList,
  PlayerState,
} from '../slice';
import {
  ListContent,
  ListHeader,
  PlayListWrapper,
  ScrollWrapper,
} from './style';

const PlayList = () => {
  const {
    playList,
    mode,
    currentSong,
    currentIndex,
    sequencePlayList,
    showPlayList,
  } = useSelector((state: RootState) => state.player);

  const getCurrentIcon = (item: PlayerState['currentSong']) => {
    // 是不是当前正在播放的歌曲
    const current = currentSong.id === item.id;
    const className = current ? 'icon-play' : '';
    const content = current ? '&#xe6e3;' : '';
    return (
      <i
        className={`current iconfont ${className}`}
        dangerouslySetInnerHTML={{ __html: content }}
      ></i>
    );
  };
  const getPlayMode = () => {
    let content, text;
    if (mode === playMode.sequence) {
      content = '&#xe625;';
      text = '顺序播放';
    } else if (mode === playMode.loop) {
      content = '&#xe653;';
      text = '单曲循环';
    } else {
      content = '&#xe61b;';
      text = '随机播放';
    }
    return (
      <div>
        <i
          className="iconfont"
          onClick={(e) => changeMode(e)}
          dangerouslySetInnerHTML={{ __html: content }}
        ></i>
        <span className="text" onClick={(e) => changeMode(e)}>
          {text}
        </span>
      </div>
    );
  };
  // const changeMode: React.MouseEventHandler<HTMLElement> = (e) => {
  //   const newMode = (mode + 1) % 3;
  //   console.log(e, newMode);
  //   // 具体逻辑比较复杂 后面来实现
  // };

  const dispatch = useDispatch();

  const handleChangeCurrentIndex = (index: number) => {
    if (currentIndex === index) return;
    dispatch(changeCurrentIndex(index));
  };

  const listWrapperRef = useRef<HTMLDivElement>(null);

  const handleDeleteSong = (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    song: PlayerState['currentSong']
  ) => {
    e.stopPropagation();
    const fpIndex = findIndex(song, playList);
    let index = currentIndex;
    if (fpIndex < currentIndex) {
      index--;
    }
    dispatch(changePlayList(playList.filter((v) => v.id === song.id)));
    dispatch(
      changeSequencePlayList(sequencePlayList.filter((v) => v?.id === song.id))
    );
    dispatch(changeCurrentIndex(index));
  };

  const confirmRef = useRef<ConfirmRef>(null);

  const handleShowClear = () => {
    confirmRef.current?.show();
  };

  const handleConfirmClear = () => {
    // 1. 清空两个列表
    dispatch(changePlayList([]));
    dispatch(changeSequencePlayList([]));
    // 2. 初始 currentIndex
    dispatch(changeCurrentIndex(-1));
    // 3. 关闭 PlayList 的显示
    dispatch(changeShowPlayList(false));
    // 4. 将当前歌曲置空
    dispatch(changeCurrentSong({}));
    // 5. 重置播放状态
    dispatch(changePlayingState(false));
  };

  const changeMode: React.MouseEventHandler<HTMLElement> = (e) => {
    e.stopPropagation();
    const newMode = (mode + 1) % 3;
    if (newMode === 0) {
      //顺序模式
      dispatch(changePlayList(sequencePlayList));
      const index = findIndex(currentSong, sequencePlayList);
      dispatch(changeCurrentIndex(index));
    } else if (newMode === 1) {
      //单曲循环
      dispatch(changePlayList(sequencePlayList));
    } else if (newMode === 2) {
      //随机播放
      const newList = shuffle(sequencePlayList as []);
      const index = findIndex(currentSong, newList);
      dispatch(changePlayList(newList));
      dispatch(changeCurrentIndex(index));
    }
    dispatch(changePlayMode(newMode));
  };

  // 是否允许滑动事件生效
  const [canTouch, setCanTouch] = useState(true);
  //touchStart 后记录 y 值
  const [startY, setStartY] = useState(0);
  //touchStart 事件是否已经被触发
  const [initialed, setInitialed] = useState(false);
  // 用户下滑的距离
  const [distance, setDistance] = useState(0);

  const handleTouchStart: React.TouchEventHandler<HTMLElement> = (e) => {
    if (!canTouch || initialed) return;
    if (listWrapperRef.current === null) return;
    listWrapperRef.current.style['transition'] = '';
    setStartY(e.nativeEvent.touches[0].pageY); // 记录 y 值
    setInitialed(true);
  };

  const handleTouchMove: React.TouchEventHandler<HTMLElement> = (e) => {
    if (!canTouch || !initialed) return;
    const distance = e.nativeEvent.touches[0].pageY - startY;
    if (distance < 0) return;
    setDistance(distance); // 记录下滑距离
    if (listWrapperRef.current === null) return;
    listWrapperRef.current.style.transform = `translate3d (0, ${distance} px, 0)`;
  };
  const transform = prefixStyle('transform');
  const handleTouchEnd: React.TouchEventHandler<HTMLElement> = () => {
    setInitialed(false);
    // 这里设置阈值为 150px
    if (distance >= 150) {
      // 大于 150px 则关闭 PlayList
      dispatch(changeShowPlayList(false));
    } else {
      if (listWrapperRef.current === null) return;
      if (transform === false) return;
      // 否则反弹回去
      listWrapperRef.current.style['transition'] = 'all 0.3s';
      (listWrapperRef.current.style as unknown as hackCSSStyleType)[
        transform
      ] = `translate3d (0px, 0px, 0px)`;
    }
  };

  const listContentRef = useRef();
  const handleScroll = (pos: BScroll) => {
    // 只有当内容偏移量为 0 的时候才能下滑关闭 PlayList。否则一边内容在移动，一边列表在移动，出现 bug
    console.log(pos);
    const state = pos.y === 0;
    setCanTouch(state);
  };

  const [isShow, setIsShow] = useState(false);

  const onEnterCB = useCallback(() => {
    //让列表显示
    setIsShow(true);
    //最开始是隐藏在下面
    if (listWrapperRef.current === null) return;
    if (transform === false) return;
    (listWrapperRef.current.style as unknown as hackCSSStyleType)[
      transform
    ] = `translate3d(0, 100%, 0)`;
  }, [transform]);

  const onEnteringCB = useCallback(() => {
    //让列表展现
    if (listWrapperRef.current === null) return;
    if (transform === false) return;
    listWrapperRef.current.style['transition'] = 'all 0.3s';
    (listWrapperRef.current.style as unknown as hackCSSStyleType)[
      transform
    ] = `translate3d(0, 0, 0)`;
  }, [transform]);

  const onExitingCB = useCallback(() => {
    if (listWrapperRef.current === null) return;
    if (transform === false) return;
    listWrapperRef.current.style['transition'] = 'all 0.3s';
    (listWrapperRef.current.style as unknown as hackCSSStyleType)[
      transform
    ] = `translate3d(0px, 100%, 0px)`;
  }, [transform]);

  const onExitedCB = useCallback(() => {
    setIsShow(false);
    if (listWrapperRef.current === null) return;
    if (transform === false) return;
    (listWrapperRef.current.style as unknown as hackCSSStyleType)[
      transform
    ] = `translate3d(0px, 100%, 0px)`;
  }, [transform]);

  return (
    <CSSTransition
      in={showPlayList}
      timeout={300}
      classNames="list-fade"
      onEnter={onEnterCB}
      onEntering={onEnteringCB}
      onExiting={onExitingCB}
      onExited={onExitedCB}
      nodeRef={listWrapperRef}
    >
      <PlayListWrapper
        style={isShow === true ? { display: 'block' } : { display: 'none' }}
        onClick={() => dispatch(changeShowPlayList(false))}
      >
        <ListHeader>
          <h1 className="title">
            {getPlayMode()}
            <span className="iconfont clear" onClick={handleShowClear}>
              &#xe63d;
            </span>
          </h1>
        </ListHeader>
        <div
          className="list_wrapper"
          ref={listWrapperRef}
          onClick={(e) => e.stopPropagation()}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <ScrollWrapper>
            <Scroll
              ref={listContentRef}
              onScroll={(pos) => handleScroll(pos)}
              bounceTop={false}
            >
              <ListContent>
                {playList.map((item, index) => {
                  return (
                    <li
                      className="item"
                      key={item.id}
                      onClick={() => handleChangeCurrentIndex(index)}
                    >
                      {getCurrentIcon(item)}
                      <span className="text">
                        {item.name} - {getName(item.ar)}
                      </span>
                      <span className="like">
                        <i className="iconfont">&#xe601;</i>
                      </span>
                      <span
                        className="delete"
                        onClick={(e) => handleDeleteSong(e, item)}
                      >
                        <i className="iconfont">&#xe63d;</i>
                      </span>
                    </li>
                  );
                })}
              </ListContent>
            </Scroll>
          </ScrollWrapper>
          <Confirm
            ref={confirmRef}
            text={'是否删除全部？'}
            cancelBtnText={'取消'}
            confirmBtnText={'确定'}
            handleConfirm={handleConfirmClear}
          />
        </div>
      </PlayListWrapper>
    </CSSTransition>
  );
};
export default PlayList;
