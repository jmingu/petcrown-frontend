'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

export default function Banner() {
  return (
    <div className="mt-8 h-[250px] sm:h-[200px]">
      <Swiper
        className="h-full"
        modules={[Navigation, Pagination, Autoplay]}
        slidesPerView={1}
        spaceBetween={50}
        loop={true}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        navigation={true}
        pagination={{ clickable: true }}
        breakpoints={{
          480: { slidesPerView: 1, spaceBetween: 20 },
          768: { slidesPerView: 2, spaceBetween: 30 },
          1024: { slidesPerView: 2, spaceBetween: 40 },
        }}
      >
        <SwiperSlide className="!flex items-center justify-center">
          <div>배너 Slide 1</div>
        </SwiperSlide>
        <SwiperSlide className="!flex items-center justify-center">
          <div>배너 Slide 2</div>
        </SwiperSlide>
        <SwiperSlide className="!flex items-center justify-center">
          <div>배너 Slide 3</div>
        </SwiperSlide>
        <SwiperSlide className="!flex items-center justify-center">
          <div>배너 Slide 4</div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
