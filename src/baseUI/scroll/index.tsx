import BScroll from '@better-scroll/core';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';

import { debounce } from '../../api/utils';
import style from '../../assets/global-style';
import Loading from '../loading';
import LoadingV2 from '../loading-v2';

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

const PullUpLoading = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 5px;
  width: 60px;
  height: 60px;
  margin: auto;
  z-index: 100;
`;

export const PullDownLoading = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0px;
  height: 30px;
  margin: auto;
  z-index: 100;
`;

export type PropType = React.PropsWithChildren & {
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
      click = false,
      refresh = true,
      onScroll = null,
      pullUp = null,
      pullDown = null,
      bounceTop = true,
      bounceBottom = true,
      pullUpLoading = false,
      pullDownLoading = false,
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
        click,
        preventDefault: false,
        stopPropagation: true,
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

    const pullUpDebounce = useMemo(() => {
      return debounce(pullUp, 300);
    }, [pullUp]);
    // 千万注意，这里不能省略依赖，
    // 不然拿到的始终是第一次 pullUp 函数的引用，相应的闭包作用域变量都是第一次的，产生闭包陷阱。下同。

    const pullDownDebounce = useMemo(() => {
      return debounce(pullDown, 300);
    }, [pullDown]);

    useEffect(() => {
      if (!bScroll || !pullUp) return;
      const handlePullUp = () => {
        //判断是否滑动到了底部
        if (bScroll.y <= bScroll.maxScrollY + 100) {
          pullUpDebounce();
        }
      };
      bScroll.on('scrollEnd', handlePullUp);
      // 解绑
      return () => {
        bScroll.off('scrollEnd', handlePullUp);
      };
    }, [pullUp, bScroll, pullUpDebounce]);

    useEffect(() => {
      if (!bScroll || !pullDown) return;
      const handlePullDown = (pos: BScroll) => {
        //判断用户的下拉动作
        if (pos.y > 50) {
          pullDownDebounce();
        }
      };
      bScroll.on('touchEnd', handlePullDown);
      return () => {
        bScroll.off('touchEnd', handlePullDown);
      };
    }, [pullDown, bScroll, pullDownDebounce]);

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

    const PullUpDisplayStyle = pullUpLoading
      ? { display: '' }
      : { display: 'none' };
    const PullDownDisplayStyle = pullDownLoading
      ? { display: '' }
      : { display: 'none' };
    return (
      <ScrollContainer ref={wrapper}>
        {children}
        {/* 滑到底部加载动画 */}
        <PullUpLoading style={PullUpDisplayStyle}>
          <Loading></Loading>
        </PullUpLoading>
        {/* 顶部下拉刷新动画 */}
        <PullDownLoading style={PullDownDisplayStyle}>
          <LoadingV2></LoadingV2>
        </PullDownLoading>
      </ScrollContainer>
    );
  }
);

export default Scroll;
