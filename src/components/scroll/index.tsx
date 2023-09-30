import BScroll from '@better-scroll/core';
import { FC, useEffect, useRef } from 'react';
import styled from 'styled-components';

import style from '../../assets/global-style';

const ScrollContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  .before {
    position: absolute;
    top: -300px;
    height: 400px;
    width: 100%;
    background: ${style['theme-color']};
  }
`;

type PropType = React.PropsWithChildren;
const Scroll: FC<PropType> = ({ children }) => {
  const wrapper = useRef(null);
  useEffect(() => {
    if (wrapper.current === null) return;
    const bs = new BScroll(wrapper.current);
    console.log(bs);
  }, []);

  return (
    <ScrollContainer ref={wrapper}>
      <div>
        <div className="before"></div>
        {children}
      </div>
    </ScrollContainer>
  );
};

export default Scroll;
