'use client';

import { useState } from 'react';
import Link from 'next/link';
import Ranking from '@/components/home/ranking/HomeRankingPodium';

export default function HomeRanking() {
  const [rankingPeriod, setRankingPeriod] = useState('daily'); // 상태로 일간, 주간, 월간 관리

  const handleTabChange = (tab: string) => {
    setRankingPeriod(tab);
  };

  const dogRanking = [
    { id: 2, name: '멍멍이', img: '/pets/coco.jpg', rank: 2 },
    { id: 1, name: '바둑이', img: '/pets/badugi.jpg', rank: 1 },
    { id: 3, name: '몽이', img: '/pets/mong.jpg', rank: 3 },
  ];

  const catRanking = [
    { id: 2, name: '냐옹이', img: '/pets/nyaong.jpg', rank: 2 },
    { id: 1, name: '냥냥', img: '/pets/nyang.jpg', rank: 1 },
    { id: 3, name: '미옹', img: '/pets/miyong.jpg', rank: 3 },
  ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-left text-xl font-bold">랭킹</h2>
        <Link href="/vote" className="text-blue-500 hover:underline">
          투표하러가기 {' >'}
        </Link>
      </div>

      <div className="mx-[10%] mt-4">
        <div className="flex justify-evenly">
          {['daily', 'weekly', 'monthly'].map((tab) => (
            <div
              key={tab}
              className={`text-lg py-2 px-5 cursor-pointer transition-all duration-300 text-center ${
                rankingPeriod === tab
                  ? 'font-bold text-blue-500 border-b-2 border-blue-500'
                  : 'hover:text-blue-500'
              }`}
              onClick={() => handleTabChange(tab)}
            >
              {tab === 'daily' ? '일간' : tab === 'weekly' ? '주간' : '월간'}
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-12 mt-6 flex-wrap">
          <Ranking title="🐶 강아지 랭킹" pets={dogRanking} />
          <Ranking title="🐱 고양이 랭킹" pets={catRanking} />
        </div>
      </div>
    </div>
  );
}
