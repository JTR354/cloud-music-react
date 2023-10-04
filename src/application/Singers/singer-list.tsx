import { FC } from 'react';

import type { PropType as ScrollPropType } from '../../baseUI/scroll';
import Scroll from '../../baseUI/scroll';
import { SingerState } from './slice';
import { List, ListContainer, ListItem } from './style';

const SignerList: FC<
  ScrollPropType & Pick<SingerState, 'singerList'> & React.PropsWithChildren
> = ({
  pullDown,
  pullUp,
  pullUpLoading,
  pullDownLoading,
  singerList,
  children,
}) => {
  // const singerList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(() => {
  //   return {
  //     picUrl:
  //       'https://p2.music.126.net/uTwOm8AEFFX_BYHvfvFcmQ==/109951164232057952.jpg',
  //     name: '隔壁老樊',
  //     accountId: 277313426,
  //   };
  // });
  return (
    <ListContainer>
      <Scroll
        pullDown={pullDown}
        pullUp={pullUp}
        pullUpLoading={pullUpLoading}
        pullDownLoading={pullDownLoading}
      >
        <List>
          {singerList.map((item, index) => {
            return (
              <ListItem key={item.accountId + '' + index}>
                <div className="img_wrapper">
                  <img
                    src={`${item.picUrl}?param=300x300`}
                    width="100%"
                    height="100%"
                    alt="music"
                  />
                </div>
                <span className="name">{item.name}</span>
              </ListItem>
            );
          })}
        </List>
      </Scroll>
      {children}
    </ListContainer>
  );
};

export default SignerList;
