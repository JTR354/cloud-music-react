import BScroll from '@better-scroll/core';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

import { HEADER_HEIGHT } from '../../api/config';
import { getAlbumDetailRequest } from '../../api/request';
import { isEmptyObject } from '../../api/utils';
import style from '../../assets/global-style';
import Header from '../../baseUI/header';
import Loading from '../../baseUI/loading';
import MusicNote, { MusicNoteRef } from '../../baseUI/music-note';
import Scroll from '../../baseUI/scroll';
import { RootState } from '../../store';
import AlbumMenu from './menu';
import { changeCurrentAlbum } from './slice';
import AlbumSongList from './song-list';
import { Container } from './style';
import AlbumTopDesc from './top-desc';

const Album = () => {
  const { id } = useParams<{ id: string | undefined }>();
  const [showStatus, setShowStatus] = useState(true);
  const nodeRef = useRef(null);

  const handleBack = () => {
    setShowStatus(false);
    setEnterLoading(false);
  };

  const navigate = useNavigate();

  const { currentAlbum } = useSelector((state: RootState) => state.album);

  const [enterLoading, setEnterLoading] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!isEmptyObject(currentAlbum) && String(currentAlbum?.id) === id) {
      setEnterLoading(false);
      return;
    }
    getAlbumDetailRequest(id)
      .then((res) => {
        const data = res.playlist;
        dispatch(changeCurrentAlbum(data));
      })
      .catch(() => {
        console.log('获取album数据失败!');
      })
      .finally(() => {
        setEnterLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [title, setTitle] = useState('歌单');
  const [isMarquee, setIsMarquee] = useState(false); //是否跑马灯

  const handleScroll = useCallback(
    (pos: BScroll) => {
      const minScrollY = -HEADER_HEIGHT;
      const percent = Math.abs(pos.y / minScrollY);
      const headerDom = headerEl.current;
      if (headerDom == null) return;
      //滑过顶部的高度开始变化
      if (pos.y < minScrollY) {
        headerDom.style.backgroundColor = style['theme-color'];
        headerDom.style.opacity = '' + Math.min(1, (percent - 1) / 2);
        setTitle(currentAlbum.name || '');
        setIsMarquee(true);
      } else {
        headerDom.style.backgroundColor = '';
        headerDom.style.opacity = '1';
        setTitle('歌单');
        setIsMarquee(false);
      }
    },
    [currentAlbum]
  );
  const headerEl = useRef<HTMLDivElement>(null);

  const musicNoteRef = useRef<MusicNoteRef>(null);

  const musicAnimation = (x = 0, y = 0) => {
    musicNoteRef.current?.startAnimation({ x, y });
  };

  return (
    <CSSTransition
      nodeRef={nodeRef}
      in={showStatus}
      timeout={300}
      classNames="fly"
      appear={true}
      unmountOnExit
      onExited={() => {
        navigate('..', { relative: 'route' });
      }}
    >
      <Container ref={nodeRef}>
        <Header
          ref={headerEl}
          title={title}
          handleClick={handleBack}
          isMarquee={isMarquee}
        ></Header>
        {!isEmptyObject(currentAlbum) ? (
          <Scroll bounceTop={false} onScroll={handleScroll}>
            <div>
              <AlbumTopDesc />
              <AlbumMenu />
              <AlbumSongList musicAnimation={musicAnimation} />
            </div>
          </Scroll>
        ) : null}
        {enterLoading ? <Loading></Loading> : null}
        <MusicNote ref={musicNoteRef}></MusicNote>
      </Container>
    </CSSTransition>
  );
};

export default Album;
