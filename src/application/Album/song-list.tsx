import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getCount, getName } from '../../api/utils';
import { RootState } from '../../store';
import {
  changeCurrentIndex,
  changePlayList,
  changeSequencePlayList,
} from '../Player/slice';
import { SongItem, SongList } from './style';

const AlbumSongList: FC<{
  musicAnimation: (x: number, y: number) => void;
}> = ({ musicAnimation }) => {
  const { currentAlbum } = useSelector((state: RootState) => state.album);
  const dispatch = useDispatch();
  return (
    <SongList>
      <div className="first_line">
        <div
          className="play_all"
          onClick={(e) => {
            const index = 0;
            const songs = currentAlbum.tracks;
            musicAnimation(e.nativeEvent.clientX, e.nativeEvent.clientY);
            dispatch(changePlayList(songs));
            dispatch(changeSequencePlayList(songs));
            dispatch(changeCurrentIndex(index));
          }}
        >
          <i className="iconfont">&#xe6e3;</i>
          <span>
            播放全部{' '}
            <span className="sum">(共{currentAlbum.tracks.length}首)</span>
          </span>
        </div>
        <div className="add_list">
          <i className="iconfont">&#xe62d;</i>
          <span>收藏({getCount(currentAlbum.subscribedCount)})</span>
        </div>
      </div>
      <SongItem>
        {currentAlbum.tracks.map((item, index, songs) => {
          return (
            <li
              key={index}
              onClick={(e) => {
                musicAnimation(e.nativeEvent.clientX, e.nativeEvent.clientY);
                dispatch(changePlayList(songs));
                dispatch(changeSequencePlayList(songs));
                dispatch(changeCurrentIndex(index));
              }}
            >
              <span className="index">{index + 1}</span>
              <div className="info">
                <span>{item.name}</span>
                <span>
                  {getName(item.ar)} - {item.al.name}
                </span>
              </div>
            </li>
          );
        })}
      </SongItem>
    </SongList>
  );
};

export default AlbumSongList;
