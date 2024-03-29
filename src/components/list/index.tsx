import 'react-lazy-load-image-component/src/effects/blur.css';

import { FC } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Outlet, useNavigate } from 'react-router-dom';

import { getCount } from '../../api/utils';
import PlaceholderImage from './music.png';
import { List, ListItem, ListWrapper } from './style';
export type ListPropType = {
  recommendList: {
    id: number;
    picUrl: string;
    playCount: number;
    name: string;
  }[];
};
const RecommendList: FC<ListPropType> = (props) => {
  const navigate = useNavigate();
  return (
    <ListWrapper>
      <h1 className="title"> 推荐歌单 </h1>
      <List>
        {props.recommendList.map((item, index) => {
          return (
            <ListItem
              key={item.id + index}
              onClick={() => {
                navigate(`/recommend/${item.id}`);
              }}
            >
              <div className="img_wrapper">
                <div className="decorate"></div>
                {/* 加此参数可以减小请求的图片资源大小 */}
                <LazyLoadImage
                  src={item.picUrl + '?param=300x300'}
                  width="100%"
                  height="100%"
                  alt="music"
                  placeholderSrc={PlaceholderImage}
                  effect="blur"
                />
                <div className="play_count">
                  <i className="iconfont play">&#xe885;</i>
                  <span className="count">{getCount(item.playCount)}</span>
                </div>
              </div>
              <div className="desc">{item.name}</div>
              <div className="decorate"></div>
            </ListItem>
          );
        })}
      </List>
      <Outlet />
    </ListWrapper>
  );
};

export default RecommendList;
