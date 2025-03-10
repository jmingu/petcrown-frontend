'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay } from 'swiper/modules';

export default function Notice() {
  return (
    <div>
      <div className="flex items-center">
        <span className="font-bold">공지</span>
        <Swiper
          className="h-[50px] !pl-[20px] !m-0"
          direction="vertical"
          modules={[Autoplay]}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
        >
          <SwiperSlide className="!flex items-center justify-center">
            공지 Slide 1
          </SwiperSlide>
          <SwiperSlide className="!flex items-center justify-center">
            공지 Slide 2
          </SwiperSlide>
          <SwiperSlide className="!flex items-center justify-center">
            공지 Slide 3
          </SwiperSlide>
          <SwiperSlide className="!flex items-center justify-center">
            공지 Slide 4
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
}
