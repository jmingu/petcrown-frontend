'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { BREAKPOINTS } from '@/constants/constants';
import { useState } from 'react';

interface BannerItem {
  id: number;
  imageUrl: string;
  link?: string;
  alt: string;
}

export default function Banner() {
  const [banners] = useState<BannerItem[]>([
    { id: 1, imageUrl: '/images/banner1.jpg', link: '/event1', alt: '이벤트 배너 1' },
    { id: 2, imageUrl: '/images/banner2.jpg', link: '/event2', alt: '이벤트 배너 2' },
    { id: 3, imageUrl: '/images/banner3.jpg', link: '/event1', alt: '이벤트 배너 3' },
    { id: 4, imageUrl: '/images/banner4.jpg', link: '/event1', alt: '이벤트 배너 4' },
  ]);

  // 배너가 없으면 렌더링하지 않음
  if (banners.length === 0) return null;

  return (
    <div className="mt-8 h-[250px] sm:h-[200px]">
      <Swiper
        className="h-full"
        modules={[Navigation, Pagination, Autoplay]}
        slidesPerView={1}
        spaceBetween={50}
        loop={true}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        pagination={{
          clickable: true,
          renderBullet: (index, className) => {
            return `<span class="${className} !bg-theme-sky opacity-50"></span>`;
          },
        }}
        breakpoints={{
          [BREAKPOINTS.mobile]: { slidesPerView: 1, spaceBetween: 20 },
          [BREAKPOINTS.tablet]: { slidesPerView: 2, spaceBetween: 30 },
          [BREAKPOINTS.desktop]: { slidesPerView: 2, spaceBetween: 40 },
        }}
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id} className="!flex items-center justify-center">
            {banner.link ? (
              <a href={banner.link} target="_blank" rel="noopener noreferrer">
                <img src={banner.imageUrl} alt={banner.alt} className="w-full h-full object-cover" />
              </a>
            ) : (
              <img src={banner.imageUrl} alt={banner.alt} className="w-full h-full object-cover" />
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
