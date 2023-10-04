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
