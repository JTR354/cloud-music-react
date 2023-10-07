import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import styled from 'styled-components';

import style from '../../assets/global-style';

const ToastWrapper = styled.div`
  position: fixed;
  bottom: 0;
  z-index: 1000;
  width: 100%;
  height: 50px;
  /* background: ${style['highlight-background-color']}; */
  &.drop-enter {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
  }
  &.drop-enter-active {
    opacity: 1;
    transition: all 0.3s;
    transform: translate3d(0, 0, 0);
  }
  &.drop-exit-active {
    opacity: 0;
    transition: all 0.3s;
    transform: translate3d(0, 100%, 0);
  }
  .text {
    line-height: 50px;
    text-align: center;
    color: #fff;
    font-size: ${style['font-size-l']};
  }
`;
export type ToastHandlerType = {
  show: () => void;
};
//外面组件需要拿到这个函数组件的ref，因此用forwardRef
const Toast = forwardRef<ToastHandlerType, { text: string }>((props, ref) => {
  const [show, setShow] = useState(false);
  const timerRef = useRef(0);
  const { text } = props;
  //外面组件拿函数组件ref的方法，用useImperativeHandle这个hook
  useImperativeHandle(ref, () => ({
    show() {
      // 做了防抖处理
      clearTimeout(timerRef.current);
      setShow(true);
      timerRef.current = setTimeout(() => {
        setShow(false);
      }, 3000);
    },
  }));
  const toastRef = useRef<HTMLDivElement>(null);
  return (
    <CSSTransition
      nodeRef={toastRef}
      in={show}
      timeout={300}
      classNames="drop"
      unmountOnExit
    >
      <ToastWrapper ref={toastRef}>
        <div className="text">{text}</div>
      </ToastWrapper>
    </CSSTransition>
  );
});

export default Toast;
