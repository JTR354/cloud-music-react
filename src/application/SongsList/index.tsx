import { forwardRef } from 'react';
import { useDispatch } from 'react-redux';

import { getName } from '../../api/utils';
import {
  changeCurrentIndex,
  changePlayList,
  changeSequencePlayList,
} from '../Player/slice';
import { SingerItemState } from '../Singer/slice';
import { SongItem, SongList } from './style';

type PropType = {
  collectCount?: number;
  showCollect: boolean;
  songs: SingerItemState['songs'];
  showBackground?: boolean;
  musicAnimation: (x: number, y: number) => void;
};

const SongsList = forwardRef<HTMLDivElement, PropType>((props, refs) => {
  const {
    collectCount,
    showCollect,
    songs,
    showBackground = false,
    musicAnimation,
  } = props;

  const totalCount = songs.length;

  // const player = useSelector((state: RootState) => state.player);
  const dispatch = useDispatch();

  const selectItem = (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    index: number
  ) => {
    dispatch(changePlayList(songs));
    dispatch(changeSequencePlayList(songs));
    dispatch(changeCurrentIndex(index));
    musicAnimation(e.nativeEvent.clientX, e.nativeEvent.clientY);
  };

  const songList = (list: Pick<PropType, 'songs'>['songs']) => {
    const res = [];
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      res.push(
        <li key={item.id} onClick={(e) => selectItem(e, i)}>
          <span className="index">{i + 1}</span>
          <div className="info">
            <span>{item.name}</span>
            <span>
              {item.ar ? getName(item.ar) : getName(item.artists)} -{' '}
              {item.al ? item.al.name : item.album.name}
            </span>
          </div>
        </li>
      );
    }
    return res;
  };

  const collect = (
    count: Pick<PropType, 'collectCount'>['collectCount'] = 0
  ) => {
    return (
      <div className="add_list">
        <i className="iconfont">&#xe62d;</i>
        <span>收藏({Math.floor(count / 1000) / 10}万)</span>
      </div>
      // <div className="isCollected">
      //   <span>已收藏({Math.floor(count/1000)/10}万)</span>
      // </div>
    );
  };
  return (
    <SongList ref={refs} showBackground={showBackground}>
      <div className="first_line">
        <div className="play_all" onClick={(e) => selectItem(e, 0)}>
          <i className="iconfont">&#xe6e3;</i>
          <span>
            播放全部 <span className="sum">(共{totalCount}首)</span>
          </span>
        </div>
        {showCollect ? collect(collectCount) : null}
      </div>
      <SongItem>{songList(songs)}</SongItem>
    </SongList>
  );
});

export default SongsList;
