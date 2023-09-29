import { FC } from 'react';

import { getCount } from '../../api/utils';
import { List, ListItem, ListWrapper } from './style';
type PropType = {
  recommendList: {
    id: number;
    picUrl: string;
    playCount: number;
    name: string;
  }[];
};
const RecommendList: FC<PropType> = (props) => {
  return (
    <ListWrapper>
      <h1 className="title"> 推荐歌单 </h1>
      <List>
        {props.recommendList.map((item, index) => {
          return (
            <ListItem key={item.id + index}>
              <div className="img_wrapper">
                <div className="decorate"></div>
                {/* 加此参数可以减小请求的图片资源大小 */}
                <img
                  src={item.picUrl + '?param=300x300'}
                  width="100%"
                  height="100%"
                  alt="music"
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
    </ListWrapper>
  );
};

export default RecommendList;