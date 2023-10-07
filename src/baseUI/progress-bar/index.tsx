import { FC, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import style from '../../assets/global-style';
import { hackCSSStyleType, prefixStyle } from './../../api/utils';

const ProgressBarWrapper = styled.div`
  height: 30px;
  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, 0.3);
    .progress {
      position: absolute;
      height: 100%;
      background: ${style['theme-color']};
    }
    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;
      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid ${style['border-color']};
        border-radius: 50%;
        background: ${style['theme-color']};
      }
    }
  }
`;

type TouchType = {
  initiated?: boolean;
  startX?: number;
  left?: number;
};

const ProgressBar: FC<{
  percent: number;
  percentChange: (percent: number) => void;
}> = (props) => {
  const progressBar = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const progressBtn = useRef<HTMLDivElement>(null);
  const [touch, setTouch] = useState<TouchType>({});

  const { percent, percentChange } = props;

  const progressBtnWidth = 16;
  // const progressBtnWidth = 16;

  const transform = prefixStyle('transform');

  useEffect(() => {
    if (percent >= 0 && percent <= 1 && !touch.initiated) {
      if (progressBar.current === null) return;
      if (progress.current === null) return;
      if (progressBtn.current === null) return;
      if (transform === false) return;
      const barWidth = progressBar.current.clientWidth - progressBtnWidth;
      const offsetWidth = percent * barWidth;
      progress.current.style.width = `${offsetWidth}px`;
      (progressBtn.current.style as unknown as hackCSSStyleType)[
        transform
      ] = `translate3d(${offsetWidth}px, 0, 0)`;
    }
    // eslint-disable-next-line
  }, [percent]);

  const _changePercent = () => {
    if (progressBar.current === null) return;
    if (progress.current === null) return;
    const barWidth = progressBar.current.clientWidth - progressBtnWidth;
    const curPercent = progress.current.clientWidth / barWidth;
    percentChange(curPercent);
  };

  const _offset = (offsetWidth: number) => {
    if (progress.current === null) return;
    if (progressBtn.current === null) return;
    progress.current.style.width = `${offsetWidth}px`;
    progressBtn.current.style.transform = `translate3d(${offsetWidth}px, 0, 0)`;
  };

  const progressClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (progressBar.current === null) return;
    const rect = progressBar.current.getBoundingClientRect();
    const offsetWidth = e.pageX - rect.left;
    _offset(offsetWidth);
    _changePercent();
  };

  const progressTouchStart: React.TouchEventHandler<HTMLDivElement> = (e) => {
    if (progress.current === null) return;
    const startTouch: TouchType = {};
    //initial为true表示滑动动作开始了
    startTouch.initiated = true;
    startTouch.startX = e.touches[0].pageX;
    startTouch.left = progress.current.clientWidth;
    setTouch(startTouch);
  };

  const progressTouchMove: React.TouchEventHandler<HTMLDivElement> = (e) => {
    if (!touch.initiated) return;
    if (progressBar.current === null) return;
    //滑动距离
    const deltaX = e.touches[0].pageX - (touch.startX || 0);
    const barWidth = progressBar.current.clientWidth - progressBtnWidth;
    const offsetWidth = Math.min(
      Math.max(0, (touch.left || 0) + deltaX),
      barWidth
    );
    _offset(offsetWidth);
  };

  const progressTouchEnd: React.TouchEventHandler<HTMLDivElement> = () => {
    const endTouch = JSON.parse(JSON.stringify(touch));
    endTouch.initiated = false;
    setTouch(endTouch);
    _changePercent();
  };

  return (
    <ProgressBarWrapper>
      <div className="bar-inner" ref={progressBar} onClick={progressClick}>
        <div className="progress" ref={progress}></div>
        <div
          className="progress-btn-wrapper"
          ref={progressBtn}
          onTouchStart={progressTouchStart}
          onTouchMove={progressTouchMove}
          onTouchEnd={progressTouchEnd}
        >
          <div className="progress-btn"></div>
        </div>
      </div>
    </ProgressBarWrapper>
  );
};

export default ProgressBar;
