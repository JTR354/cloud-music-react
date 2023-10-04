import { FC } from 'react';

import { RankItem } from './slice';
import { List, ListItem, SongList } from './style';

const RankList: FC<{
  list: RankItem[];
  global?: boolean;
  onClick?: (name: string) => void;
}> = ({ list, global, onClick }) => {
  return (
    <List globalRank={global}>
      {list.map((item, index) => {
        return (
          <ListItem
            key={item.coverImgId + index}
            tracks={item.tracks}
            onClick={() => {
              onClick?.(item.name);
            }}
          >
            <div className="img_wrapper">
              <img src={item.coverImgUrl} alt="" />
              <div className="decorate"></div>
              <span className="update_frequency">{item.updateFrequency}</span>
            </div>
            {item.tracks.length ? (
              <SongList>
                {item.tracks.map((item, index) => {
                  return (
                    <li key={index}>
                      {index + 1}. {item.first} - {item.second}
                    </li>
                  );
                })}
              </SongList>
            ) : null}
          </ListItem>
        );
      })}
    </List>
  );
};

export default RankList;
