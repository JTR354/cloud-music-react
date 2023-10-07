import { useCallback, useEffect, useRef, useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

import { getName } from '../../api/utils';
import Loading from '../../baseUI/loading';
import MusicNote, { MusicNoteRef } from '../../baseUI/music-note';
import Scroll from '../../baseUI/scroll';
import SearchBox from '../../baseUI/search-box';
import PlaceholderImage from '../../components/list/music.png';
import { RootState } from '../../store';
import { SongItem } from '../Album/style';
import { List, ListItem } from './../Singers/style';
import PlaceholderImageSinger from './singer.png';
import { useSearchDispatch } from './slice';
import { Container, HotKey, ShortcutWrapper } from './style';

function Search() {
  // 控制动画
  const [query, setQuery] = useState('');
  const [show, setShow] = useState(false);
  const musicNoteRef = useRef<MusicNoteRef>(null);

  const { enterLoading, hotList, songsList, suggestList } = useSelector(
    (state: RootState) => state.search
  );

  const {
    changeEnterLoadingDispatch,
    getSuggestListDispatch,
    getSongDetailDispatch,
    getHotKeyWordsDispatch,
  } = useSearchDispatch();

  useEffect(() => {
    setShow(true);
    if (!hotList.length) getHotKeyWordsDispatch();
    // eslint-disable-next-line
  }, []);

  const renderHotKey = () => {
    const list = hotList;
    return (
      <ul>
        {list.map((item) => {
          return (
            <li
              className="item"
              key={item.first}
              onClick={() => setQuery(item.first)}
            >
              <span>{item.first}</span>
            </li>
          );
        })}
      </ul>
    );
  };

  const handleQuery = (q: string) => {
    setQuery(q);
    if (!q) return;
    changeEnterLoadingDispatch(true);
    getSuggestListDispatch(q);
  };

  const navigate = useNavigate();

  const renderSingers = () => {
    const singers = suggestList.artists;
    if (!singers || !singers.length) return;
    return (
      <List>
        <h1 className="title">相关歌手</h1>
        {singers.map((item, index) => {
          return (
            <ListItem
              key={item.accountId + '' + index}
              onClick={() => navigate(`/singers/${item.id}`)}
            >
              <div className="img_wrapper">
                <LazyLoadImage
                  src={item.picUrl}
                  width="100%"
                  height="100%"
                  alt="music"
                  placeholderSrc={PlaceholderImageSinger}
                  effect="blur"
                />
              </div>
              <span className="name">歌手: {item.name}</span>
            </ListItem>
          );
        })}
      </List>
    );
  };

  const renderAlbum = () => {
    const albums = suggestList.playlists;
    if (!albums || !albums.length) return;
    return (
      <List>
        <h1 className="title">相关歌单</h1>
        {albums.map((item, index) => {
          return (
            <ListItem
              key={item.accountId + '' + index}
              onClick={() => navigate(`/album/${item.id}`)}
            >
              <div className="img_wrapper">
                <LazyLoadImage
                  src={item.coverImgUrl}
                  width="100%"
                  height="100%"
                  alt="music"
                  placeholderSrc={PlaceholderImage}
                  effect="blur"
                />
              </div>
              <span className="name">歌单: {item.name}</span>
            </ListItem>
          );
        })}
      </List>
    );
  };

  const selectItem = (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    id: string | number | undefined = ''
  ) => {
    getSongDetailDispatch('' + id);
    musicNoteRef.current?.startAnimation({
      x: e.nativeEvent.clientX,
      y: e.nativeEvent.clientY,
    });
  };

  const searchBack = useCallback(() => {
    setShow(false);
  }, []);

  const renderSongs = () => {
    return (
      <SongItem style={{ paddingLeft: '20px' }}>
        {songsList.map((item) => {
          return (
            <li key={item.id} onClick={(e) => selectItem(e, item.id)}>
              <div className="info">
                <span>{item.name}</span>
                <span>
                  {getName(item.artists)} - {item.album?.name}
                </span>
              </div>
            </li>
          );
        })}
      </SongItem>
    );
  };

  const searchRef = useRef<HTMLDivElement>(null);

  return (
    <CSSTransition
      in={show}
      timeout={300}
      appear={true}
      classNames="fly"
      unmountOnExit
      onExited={() => navigate('..', { relative: 'route' })}
      nodeRef={searchRef}
    >
      <Container play={1} ref={searchRef}>
        <div className="search_box_wrapper">
          <SearchBox
            back={searchBack}
            newQuery={query}
            handleQuery={handleQuery}
          ></SearchBox>
        </div>
        <ShortcutWrapper show={!query}>
          <Scroll>
            <div>
              <HotKey>
                <h1 className="title">热门搜索</h1>
                {renderHotKey()}
              </HotKey>
              {/* <SearchHistory>
                <h1 className="title">
                  <span className="text">搜索历史</span>
                  <span className="clear">
                    <i className="iconfont">&#xe63d;</i>
                  </span>
                </h1>
                {renderHistoryList()}
              </SearchHistory> */}
            </div>
          </Scroll>
        </ShortcutWrapper>
        {/* 下面为搜索结果 */}
        <ShortcutWrapper show={query}>
          <Scroll>
            <div>
              {renderSingers()}
              {renderAlbum()}
              {renderSongs()}
            </div>
          </Scroll>
        </ShortcutWrapper>
        {enterLoading ? <Loading></Loading> : null}
        <MusicNote ref={musicNoteRef}></MusicNote>
      </Container>
    </CSSTransition>
  );
}

export default Search;
