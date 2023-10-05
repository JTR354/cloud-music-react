import { useSelector } from 'react-redux';

import { getCount } from '../../api/utils';
import { RootState } from '../../store';
import { TopDesc } from './style';

const AlbumTopDesc = () => {
  const { currentAlbum } = useSelector((state: RootState) => state.album);
  return (
    <TopDesc background={currentAlbum.coverImgUrl}>
      <div className="background">
        <div className="filter"></div>
      </div>
      <div className="img_wrapper">
        <div className="decorate"></div>
        <img src={currentAlbum.coverImgUrl} alt="" />
        <div className="play_count">
          <i className="iconfont play">&#xe885;</i>
          <span className="count">
            {getCount(currentAlbum.subscribedCount)}
          </span>
        </div>
      </div>
      <div className="desc_wrapper">
        <div className="title">{currentAlbum.name}</div>
        <div className="person">
          <div className="avatar">
            <img src={currentAlbum.creator.avatarUrl} alt="" />
          </div>
          <div className="name">{currentAlbum.creator.nickname}</div>
        </div>
      </div>
    </TopDesc>
  );
};

export default AlbumTopDesc;
