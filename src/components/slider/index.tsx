import 'swiper/css';

import { FC, useEffect, useState } from 'react';
import Swiper from 'swiper';

import { SliderContainer } from './style';
export type SliderPropType = {
  bannerList: { imageUrl: string }[];
};
const Slider: FC<SliderPropType> = ({ bannerList }) => {
  const [sliderSwiper, setSliderSwiper] = useState<Swiper | null>(null);
  useEffect(() => {
    if (bannerList.length && !sliderSwiper) {
      const newSliderSwiper = new Swiper('.slider-container', {
        loop: true,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false,
        },
        pagination: { el: '.swiper-pagination' },
      });
      setSliderSwiper(newSliderSwiper);
    }
  }, [bannerList.length, sliderSwiper]);

  return (
    <SliderContainer>
      <div className="before"></div>
      <div className="slider-container">
        <div className="swiper-wrapper">
          {bannerList.map((slider) => {
            return (
              <div className="swiper-slide" key={slider.imageUrl}>
                <div className="slider-nav">
                  <img
                    src={slider.imageUrl}
                    width="100%"
                    height="100%"
                    alt="推荐"
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="swiper-pagination"></div>
      </div>
    </SliderContainer>
  );
};
export default Slider;
