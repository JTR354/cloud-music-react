import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import styled from 'styled-components';

import style from '../../assets/global-style';
import { hackCSSStyleType, prefixStyle } from './../../api/utils';

const Container = styled.div`
  .icon_wrapper {
    position: fixed;
    z-index: 1000;
    margin-top: -10px;
    margin-left: -10px;
    color: ${style['theme-color']};
    font-size: 14px;
    display: none;
    transition: transform 1s cubic-bezier(0.62, -0.1, 0.86, 0.57);
    transform: translate3d(0, 0, 0);
    > div {
      transition: transform 1s;
    }
  }
`;

export type MusicNoteRef = {
  startAnimation: ({ x, y }: { x: number; y: number }) => void;
};

type NodeItem = HTMLDivElement & { running: boolean };
const MusicNote = forwardRef<MusicNoteRef>((props, ref) => {
  const iconsRef = useRef<HTMLDivElement>(null);
  // 容器中有 3 个音符，也就是同时只能有 3 个音符下落
  const ICON_NUMBER = 3;

  const transform = prefixStyle('transform');

  // 原生 DOM 操作，返回一个 DOM 节点对象
  const createNode = (txt: string) => {
    const template = `<div class='icon_wrapper'>${txt}</div>`;
    const tempNode = document.createElement('div');
    tempNode.innerHTML = template;
    return tempNode.firstChild as HTMLDivElement;
  };

  useEffect(() => {
    if (transform === false) return;
    for (let i = 0; i < ICON_NUMBER; i++) {
      const node = createNode(`<div class="iconfont">&#xe642;</div>`);
      iconsRef.current?.appendChild(node);
    }
    // 类数组转换成数组，当然也可以用 [...xxx] 解构语法或者 Array.from ()
    const domArray = [].slice.call(iconsRef.current?.children);
    domArray.forEach((item: NodeItem) => {
      item.running = false;
      item.addEventListener(
        'transitionend',
        function () {
          this.style['display'] = 'none';
          (this.style as unknown as hackCSSStyleType)[
            transform
          ] = `translate3d(0, 0, 0)`;
          (this as typeof item).running = false;

          const icon = this.querySelector('div') as HTMLDivElement;
          (icon.style as unknown as hackCSSStyleType)[
            transform
          ] = `translate3d(0, 0, 0)`;
        },
        false
      );
    });
    //eslint-disable-next-line
  }, []);

  const startAnimation = ({ x = 0, y = 0 }) => {
    if (iconsRef.current === null) return;
    if (transform === false) return;
    for (let i = 0; i < ICON_NUMBER; i++) {
      const domArray = [].slice.call(iconsRef.current.children);
      const item: NodeItem = domArray[i];
      // 选择一个空闲的元素来开始动画
      if (item.running === false) {
        item.style.left = x + 'px';
        item.style.top = y + 'px';
        item.style.display = 'inline-block';

        setTimeout(() => {
          item.running = true;
          (item.style as unknown as hackCSSStyleType)[
            transform
          ] = `translate3d(0, 750px, 0)`;
          const icon = item.querySelector('div') as HTMLDivElement;
          (icon.style as unknown as hackCSSStyleType)[
            transform
          ] = `translate3d(-40px, 0, 0)`;
        }, 20);
        break;
      }
    }
  };
  // 外界调用的 ref 方法
  useImperativeHandle(ref, () => ({
    startAnimation,
  }));
  return <Container ref={iconsRef}></Container>;
});

export default MusicNote;
