import BScroll from '@better-scroll/core';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

import { getSingerInfoRequest } from '../../api/request';
import Header from '../../baseUI/header';
import Loading from '../../baseUI/loading';
import MusicNote, { MusicNoteRef } from '../../baseUI/music-note';
import Scroll from '../../baseUI/scroll';
import { RootState } from '../../store';
import SongsList from '../SongsList';
import { HEADER_HEIGHT } from './../../api/config';
import { changeArtist, changeSongs } from './slice';
import {
  BgLayer,
  CollectButton,
  Container,
  ImgWrapper,
  SongListWrapper,
} from './style';
//往上偏移的尺寸，露出圆角
const OFFSET = 5;

const Singer = () => {
  const { id = '' } = useParams<{ id: string }>();
  const htmlEl = useRef(null);
  const navigate = useNavigate();
  const [showStatus, setShowStatus] = useState(true);

  const initialHeight = useRef(0);
  const collectButton = useRef<HTMLDivElement>(null);
  const imageWrapper = useRef<HTMLDivElement>(null);
  const songScrollWrapper = useRef<HTMLDivElement>(null);
  const songScroll = useRef<BScroll>(null);
  const header = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);

  const { artist, songs } = useSelector((state: RootState) => state.singer);

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // console.log(artist);
    // if (!isEmptyObject(artist) && String(artist.id) === id) {
    //   setLoading(false);
    //   return;
    // }
    getSingerInfoRequest(id)
      .then((data) => {
        dispatch(changeArtist(data.artist));
        dispatch(changeSongs(data.hotSongs));
      })
      .finally(() => {
        setLoading(false);
      });
    if (imageWrapper.current === null) return;
    const h = imageWrapper.current.offsetHeight;
    initialHeight.current = h;
    if (songScrollWrapper.current === null) return;
    songScrollWrapper.current.style.top = `${h - OFFSET}px`;
    //把遮罩先放在下面，以裹住歌曲列表
    if (layer.current === null) return;
    layer.current.style.top = `${h - OFFSET}px`;
    if (songScroll.current === null) return;
    songScroll.current.refresh();
    // eslint-disable-next-line
  }, []);

  const handleScroll = useCallback((pos: BScroll) => {
    const height = initialHeight.current;
    const newY = pos.y;
    const imageDOM = imageWrapper.current;
    const buttonDOM = collectButton.current;
    const headerDOM = header.current;
    const layerDOM = layer.current;
    const minScrollY = -(height - OFFSET) + HEADER_HEIGHT;

    //指的是滑动距离占图片高度的百分比
    const percent = Math.abs(newY / height);

    if (imageDOM === null) return;
    if (buttonDOM === null) return;
    if (layerDOM === null) return;
    if (headerDOM === null) return;
    if (newY > 0) {
      imageDOM.style['transform'] = `scale(${1 + percent})`;
      buttonDOM.style['transform'] = `translate3d(0, ${newY}px, 0)`;
      layerDOM.style.top = `${height - OFFSET + newY}px`;
    } else if (newY >= minScrollY) {
      layerDOM.style.top = `${height - OFFSET - Math.abs(newY)}px`;
      //这时候保证遮罩的层叠优先级比图片高，不至于被图片挡住
      layerDOM.style.zIndex = '1';
      imageDOM.style.paddingTop = '75%';
      imageDOM.style.height = '0';
      imageDOM.style.zIndex = '-1';
      //按钮跟着移动且渐渐变透明
      buttonDOM.style['transform'] = `translate3d(0, ${newY}px, 0)`;
      buttonDOM.style['opacity'] = `${1 - percent * 2}`;
    } else if (newY < minScrollY) {
      //往上滑动，但是超过Header部分
      layerDOM.style.top = `${HEADER_HEIGHT - OFFSET}px`;
      layerDOM.style.zIndex = '1';
      //防止溢出的歌单内容遮住Header
      headerDOM.style.zIndex = '100';
      //此时图片高度与Header一致
      imageDOM.style.height = `${HEADER_HEIGHT}px`;
      imageDOM.style.paddingTop = '0';
      imageDOM.style.zIndex = '99';
    }
  }, []);

  const setShowStatusFalse = useCallback(() => {
    setShowStatus(false);
    setLoading(false);
  }, []);

  const musicNoteRef = useRef<MusicNoteRef>(null);

  const musicAnimation = (x = 0, y = 0) => {
    musicNoteRef.current?.startAnimation({ x, y });
  };

  return (
    <CSSTransition
      nodeRef={htmlEl}
      in={showStatus}
      timeout={300}
      classNames="fly"
      appear={true}
      unmountOnExit
      onExited={() => navigate('..', { relative: 'route' })}
    >
      <Container ref={htmlEl}>
        <Header
          handleClick={setShowStatusFalse}
          title={artist.name}
          ref={header}
        ></Header>
        <ImgWrapper ref={imageWrapper} bgUrl={artist.picUrl}>
          <div className="filter"></div>
        </ImgWrapper>
        <CollectButton ref={collectButton}>
          <i className="iconfont">&#xe62d;</i>
          <span className="text">收藏</span>
        </CollectButton>
        <BgLayer ref={layer}></BgLayer>
        <SongListWrapper ref={songScrollWrapper}>
          <Scroll ref={songScroll} onScroll={handleScroll}>
            <SongsList
              songs={songs}
              showCollect={false}
              musicAnimation={musicAnimation}
            ></SongsList>
          </Scroll>
        </SongListWrapper>
        {loading ? <Loading></Loading> : null}
        <MusicNote ref={musicNoteRef}></MusicNote>
      </Container>
    </CSSTransition>
  );
};

export default Singer;
