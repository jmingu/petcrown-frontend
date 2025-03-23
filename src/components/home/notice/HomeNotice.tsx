'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay } from 'swiper/modules';
import { useState } from 'react';

interface NoticeItem {
  id: number;
  text: string;
  link?: string;
}

export default function Notice() {
  const [notices] = useState<NoticeItem[]>([
    { id: 1, text: '신규 이벤트 안내', link: '/event' },
    { id: 2, text: '서비스 점검 예정 안내', link: '/maintenance' },
    { id: 3, text: '업데이트 소식 확인하기', link: '/update' },
    { id: 4, text: '공지사항 4번입니다.', link: '/notice' },
  ]);

  // 공지사항이 없으면 렌더링하지 않음
  if (notices.length === 0) return null;

  return (
    <div className="flex items-center">
      <span className="font-bold">공지</span>
      <Swiper
        className="h-[50px] !pl-[20px] !m-0 cursor-pointer"
        direction="vertical"
        modules={[Autoplay]}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
      >
        {notices.map((notice) => (
          <SwiperSlide key={notice.id} className="!flex items-center">
            {notice.link ? (
              <a href={notice.link} className="text-gray-700">
                {notice.text}
              </a>
            ) : (
              <span className="text-gray-700">{notice.text}</span>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
