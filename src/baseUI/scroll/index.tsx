import BScroll from '@better-scroll/core';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
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

type PropType = React.PropsWithChildren & {
  direction?: 'horizontal' | 'vertical';
  click?: boolean;
  refresh?: boolean;
  onScroll?: (scroll: BScroll) => void;
  pullUpLoading?: boolean;
  pullDownLoading?: boolean;
  pullUp?: () => void;
  pullDown?: () => void;
  bounceTop?: boolean;
  bounceBottom?: boolean;
};

const Scroll = forwardRef<unknown, PropType>(
  (
    {
      children,
      direction = 'vertical',
      click = true,
      refresh = true,
      onScroll = null,
      pullUp = null,
      pullDown = null,
      bounceTop = true,
      bounceBottom = true,
    },
    ref
  ) => {
    const wrapper = useRef(null);
    const [bScroll, setBScroll] = useState<BScroll | null>(null);
    useEffect(() => {
      if (wrapper.current === null) return;
      const scroll = new BScroll(wrapper.current, {
        scrollX: direction === 'horizontal',
        scrollY: direction === 'vertical',
        probeType: 3,
        click: click,
        bounce: {
          top: bounceTop,
          bottom: bounceBottom,
        },
      });
      setBScroll(scroll);
      return () => {
        setBScroll(null);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 每次重新渲染都要刷新实例，防止无法滑动
    useEffect(() => {
      if (refresh && bScroll) {
        bScroll.refresh();
      }
    });

    // 给实例绑定 scroll 事件，
    useEffect(() => {
      if (!bScroll || !onScroll) return;
      bScroll.on('scroll', (scroll: BScroll) => {
        onScroll(scroll);
      });
      return () => {
        bScroll.off('scroll');
      };
    }, [onScroll, bScroll]);

    useEffect(() => {
      if (!bScroll || !pullUp) return;
      bScroll.on('scrollEnd', () => {
        // 判断是否滑动到了底部
        if (bScroll.y <= bScroll.maxScrollY + 100) {
          pullUp();
        }
      });
      return () => {
        bScroll.off('scrollEnd');
      };
    }, [pullUp, bScroll]);

    useEffect(() => {
      if (!bScroll || !pullDown) return;
      bScroll.on('touchEnd', (pos: BScroll) => {
        // 判断用户的下拉动作
        if (pos.y > 50) {
          pullDown();
        }
      });
      return () => {
        bScroll.off('touchEnd');
      };
    }, [pullDown, bScroll]);

    // 一般和 forwardRef 一起使用，ref 已经在 forWardRef 中默认传入
    useImperativeHandle(ref, () => {
      return {
        // 给外界暴露 refresh 方法
        refresh() {
          if (bScroll) {
            bScroll.refresh();
            bScroll.scrollTo(0, 0);
          }
        },
        // 给外界暴露 getBScroll 方法，提供 bs 实例
        getBScroll() {
          if (bScroll) {
            return bScroll;
          }
        },
      };
    });

    return <ScrollContainer ref={wrapper}>{children}</ScrollContainer>;
  }
);

export default Scroll;
