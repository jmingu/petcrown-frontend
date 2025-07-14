'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Pagination from 'react-js-pagination';
import Button from '@/components/common/button/Button';
import { getVoteList } from '@/libs/api/vote/voteApi'; // API 호출 함수

const VOTE_ITEMS = [
  { id: 1, name: '코코', gender: 'F', type: '개', image: '/images/coco.jpg', period: 'daily' },
  { id: 2, name: '바둑이', gender: 'M', type: '개', image: '/images/baduk.jpg', period: 'weekly' },
  { id: 3, name: '초코', gender: 'F', type: '개', image: '/images/choco.jpg', period: 'monthly' },
  { id: 4, name: '흰둥이', gender: 'M', type: '개', image: '/images/whindung.jpg', period: 'daily' },
  { id: 5, name: '몽이', gender: 'F', type: '고양이', image: '/images/mong.jpg', period: 'weekly' },
  { id: 6, name: '밤비', gender: 'M', type: '고양이', image: '/images/bambi.jpg', period: 'monthly' },
  { id: 7, name: '루이', gender: 'F', type: '고양이', image: '/images/lui.jpg', period: 'daily' },
  { id: 8, name: '탄이', gender: 'M', type: '고양이', image: '/images/tani.jpg', period: 'weekly' },
  { id: 9, name: '다롱이', gender: 'F', type: '개', image: '/images/darong.jpg', period: 'monthly' },
  { id: 10, name: '똘이', gender: 'M', type: '개', image: '/images/ddoli.jpg', period: 'daily' },
  { id: 11, name: '미미', gender: 'F', type: '고양이', image: '/images/mimi.jpg', period: 'weekly' },
  { id: 12, name: '까미', gender: 'M', type: '고양이', image: '/images/kami.jpg', period: 'monthly' },
  { id: 13, name: '보리', gender: 'F', type: '개', image: '/images/bori.jpg', period: 'daily' },
  { id: 14, name: '초롱이', gender: 'M', type: '개', image: '/images/chorong.jpg', period: 'weekly' },
  { id: 15, name: '나비', gender: 'F', type: '고양이', image: '/images/nabi.jpg', period: 'monthly' },
  { id: 16, name: '토리', gender: 'M', type: '고양이', image: '/images/tori.jpg', period: 'daily' },
  { id: 17, name: '두부', gender: 'F', type: '개', image: '/images/dubu.jpg', period: 'weekly' },
  { id: 18, name: '모찌', gender: 'M', type: '개', image: '/images/mochi.jpg', period: 'monthly' },
  { id: 19, name: '밀키', gender: 'F', type: '고양이', image: '/images/milky.jpg', period: 'daily' },
  { id: 20, name: '설이', gender: 'M', type: '고양이', image: '/images/seol.jpg', period: 'weekly' },
  { id: 21, name: '까망이', gender: 'F', type: '개', image: '/images/kamangi.jpg', period: 'monthly' },
  { id: 22, name: '단비', gender: 'M', type: '개', image: '/images/danbi.jpg', period: 'daily' },
  { id: 23, name: '초이', gender: 'F', type: '고양이', image: '/images/choi.jpg', period: 'weekly' },
  { id: 24, name: '레오', gender: 'M', type: '고양이', image: '/images/leo.jpg', period: 'monthly' },
  { id: 25, name: '바니', gender: 'F', type: '개', image: '/images/bani.jpg', period: 'daily' },
  { id: 26, name: '호야', gender: 'M', type: '개', image: '/images/hoya.jpg', period: 'weekly' },
  { id: 27, name: '체리', gender: 'F', type: '고양이', image: '/images/cherry.jpg', period: 'monthly' },
  { id: 28, name: '쿠키', gender: 'M', type: '고양이', image: '/images/cookie.jpg', period: 'daily' },
  { id: 29, name: '카이', gender: 'F', type: '개', image: '/images/kai.jpg', period: 'weekly' },
  { id: 30, name: '루루', gender: 'M', type: '개', image: '/images/lulu.jpg', period: 'monthly' },
];


const ITEMS_PER_PAGE = 6;

export default function VotePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedType, setSelectedType] = useState<'all' | '개' | '고양이'>('all'); // 🐶🐱 필터 상태 추가
  const [rankingPeriod, setRankingPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily'); // 📅 일간/주간/월간 선택 상태

  // 🔹 선택된 기간과 필터에 맞는 항목 필터링
  const filteredItems = VOTE_ITEMS.filter(
    (item) => item.period === rankingPeriod && (selectedType === 'all' || item.type === selectedType)
  );

  // 페이지네이션 처리
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
      getVote(); // 컴포넌트 마운트 시 나의 펫 조회
      
  }, []);

  /**
   * 투표 리스트 조회
   */

    const getVote = async () => {
      try {
        const response = await getVoteList({page:1, size: 100});
  
      } catch (error) {
      }
    }


  return (
    <div className="p-6 global-wrapper">
      <h1 className="text-2xl font-bold text-center mb-6">투표하기</h1>
      <div className="flex justify-end mb-4">
        <Link href="/vote/register">
          <Button>
            등록
          </Button>
        </Link>
      </div>

      {/* 🔹 일간/주간/월간 탭 */}
      <div className="flex justify-evenly mb-4">
        {['daily', 'weekly', 'monthly'].map((tab) => (
          <div
            key={tab}
            className={`text-lg py-2 px-5 cursor-pointer transition-all duration-300 text-center ${
              rankingPeriod === tab
                ? 'font-bold text-[var(--color-theme-sky)] border-b-2 border-[var(--color-theme-sky)]'
                : 'hover:text-[var(--color-theme-sky)]'
            }`}
            onClick={() => {
              setRankingPeriod(tab as 'daily' | 'weekly' | 'monthly');
              setCurrentPage(1); // 탭 변경 시 페이지 초기화
            }}
          >
            {tab === 'daily' ? '일간' : tab === 'weekly' ? '주간' : '월간'}
          </div>
        ))}
      </div>

      {/* 🔹 강아지/고양이 필터 버튼 */}
      <div className="flex justify-center gap-4 mb-6">
        {['all', '개', '고양이'].map((type) => (
          <Button
            type='accent'
            key={type}
            onClick={() => {
              setSelectedType(type as 'all' | '개' | '고양이');
              setCurrentPage(1); // 필터 변경 시 페이지 리셋
            }}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedType === type ? '' : '!bg-gray-200 !text-black'
            }`}
          >
            {type === 'all' ? '전체' : type}
          </Button>
        ))}
      </div>

      {/* 🔹 투표 리스트 */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {currentItems.length > 0 ? (
          currentItems.map(({ id, name, gender, image }) => (
            <Link key={id} href={`/vote/${id}`} className="block text-center border p-4 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="w-full aspect-square overflow-hidden rounded-lg">
                <img src={image} alt={name} className="w-full h-full object-cover" />
              </div>
              <p className="mt-2 text-lg font-bold">{name}</p>
              <p className="text-gray-500">{gender}</p>
            </Link>
          ))
        ) : (
          <p className="text-center col-span-2 md:col-span-3 text-gray-500">해당 항목이 없습니다.</p>
        )}
      </div>

      {/* 🔹 페이지네이션 */}
      {filteredItems.length > ITEMS_PER_PAGE && (
        <div className="mt-6 flex justify-center">
          <Pagination
            activePage={currentPage}
            itemsCountPerPage={ITEMS_PER_PAGE}
            totalItemsCount={filteredItems.length}
            pageRangeDisplayed={3}
            onChange={setCurrentPage}
            innerClass="flex gap-2"
            itemClass="px-3 py-1 rounded-md cursor-pointer"
            activeClass="text-black font-bold"
            linkClass="hover:text-blue-500"
            disabledClass="opacity-50 cursor-not-allowed"
          />
        </div>
      )}
    </div>
  );
}
