import { memo } from 'react';
import { SliderContainer } from './style';
import { Autoplay, Pagination } from 'swiper';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

function Slider(props) {
	const { bannerList = [] } = props;
	return (
		<SliderContainer>
			<div className="before"></div>
			<div className="slider-container">
				<div className="swiper-wrapper">
					<Swiper
						// install Swiper modules
						modules={[Pagination, Autoplay]}
						spaceBetween={'1%'}
						slidesPerView={1}
						loop
						autoplay={{ delay: 3000, disableOnInteraction: false }}
						pagination={{ clickable: true, el: '.swiper-pagination' }}
						onSwiper={(swiper) => console.log(swiper)}
						onSlideChange={() => console.log('slide change')}
					>
						{bannerList.map((slider, index) => {
							return (
								<SwiperSlide key={index + slider.imageUrl}>
									<img
										src={slider.imageUrl}
										width="100%"
										height="100%"
										alt="推荐"
									/>
								</SwiperSlide>
							);
						})}
					</Swiper>
				</div>
				<div className="swiper-pagination"></div>
			</div>
		</SliderContainer>
	);
}

export default memo(Slider);
