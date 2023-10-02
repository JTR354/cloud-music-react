import { FC, useEffect, useRef } from 'react';
import styled from 'styled-components';

import style from '../../assets/global-style';
import Scroll from '../scroll';

interface IProps {
  list: { key: string; name: string }[];
  oldVal?: string;
  title: string;
  handleClick?: (key: string) => void;
}

const Horizon: FC<IProps> = (props) => {
  const { list, oldVal, title, handleClick } = props;
  // 加入声明
  const Category = useRef(null);

  // 加入初始化内容宽度的逻辑
  useEffect(() => {
    const categoryDOM = Category.current as unknown as HTMLElement;
    const tagElements = categoryDOM.querySelectorAll('span');
    let totalWidth = 0;
    Array.from(tagElements).forEach((ele) => {
      totalWidth += ele.offsetWidth;
    });
    categoryDOM.style.width = `${totalWidth}px`;
  }, []);

  return (
    <Scroll direction={'horizontal'}>
      <div ref={Category}>
        <List>
          <span>{title}</span>
          {list.map((item) => {
            return (
              <ListItem
                key={item.key}
                className={`${oldVal === item.key ? 'selected' : ''}`}
                onClick={() => {
                  return handleClick?.(item.key);
                }}
              >
                {item.name}
              </ListItem>
            );
          })}
        </List>
      </div>
    </Scroll>
  );
};

// 首先考虑接受的参数
//list 为接受的列表数据
//oldVal 为当前的 item 值
//title 为列表左边的标题
//handleClick 为点击不同的 item 执行的方法
// 由于基础组件样式较少，直接写在 index.js 中
const List = styled.div`
  display: flex;
  align-items: center;
  height: 30px;
  overflow: hidden;
  > span:first-of-type {
    display: block;
    vertical-align: middle;
    flex: 0 0 auto;
    padding: 5px 0;
    margin-right: 5px;
    color: grey;
    font-size: ${style['font-size-m']};
  }
`;
const ListItem = styled.span`
  flex: 0 0 auto;
  font-size: ${style['font-size-m']};
  padding: 5px 8px;
  border-radius: 10px;
  &.selected {
    color: ${style['theme-color']};
    border: 1px solid ${style['theme-color']};
    opacity: 0.8;
  }
`;

export default Horizon;
