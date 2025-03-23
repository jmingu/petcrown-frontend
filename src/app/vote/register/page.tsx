'use client';

import { useState } from 'react';
import Link from 'next/link';
import Pagination from 'react-js-pagination';
import Button from '@/components/common/button/Button';
import PetModal from '@/components/vote/PetRegisterModal';

const MY_PETS = [
  { id: 1, name: '코코', gender: '♀', type: 'dog', image: '/images/coco.jpg', age: 3, awards: 5 },
  { id: 2, name: '바둑이', gender: '♂', type: 'dog', image: '/images/baduk.jpg', age: 2, awards: 2 },
  { id: 3, name: '몽이', gender: '♀', type: 'cat', image: '/images/mong.jpg', age: 4, awards: 3 },
  { id: 4, name: '밤비', gender: '♂', type: 'cat', image: '/images/bambi.jpg', age: 1, awards: 1 },
  { id: 5, name: '초코', gender: '♀', type: 'dog', image: '/images/choco.jpg', age: 2, awards: 0 },
  { id: 6, name: '루이', gender: '♂', type: 'cat', image: '/images/lui.jpg', age: 5, awards: 4 },
  { id: 7, name: '탄이', gender: '♀', type: 'dog', image: '/images/tani.jpg', age: 3, awards: 2 },
  { id: 8, name: '다롱이', gender: '♂', type: 'cat', image: '/images/darong.jpg', age: 6, awards: 0 }
];

const ITEMS_PER_PAGE = 4;

export default function MyPetsPage() {
  const [selectedType, setSelectedType] = useState<'all' | 'dog' | 'cat'>('all');
  const [selectedPet, setSelectedPet] = useState<any>(null); // 선택된 반려동물 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // 필터링된 목록
  const filteredPets = MY_PETS.filter(
    (pet) => selectedType === 'all' || pet.type === selectedType
  );

  // 페이지네이션 처리
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = filteredPets.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* 페이지 제목 */}
      <h1 className="text-3xl font-bold text-center mb-6">내 반려동물</h1>

      {/* 🔹 강아지/고양이 필터 버튼 */}
      <div className="flex justify-center gap-4 mb-6">
        {['all', 'dog', 'cat'].map((type) => (
          <Button
            type='accent'
            key={type}
            onClick={() => {
              setSelectedType(type as 'all' | 'dog' | 'cat');
              setCurrentPage(1); // 필터 변경 시 페이지 리셋
            }}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedType === type ? '' : '!bg-gray-200 !text-black'
            }`}
          >
            {type === 'all' ? '전체' : type === 'dog' ? '강아지' : '고양이'}
          </Button>
        ))}
      </div>

      {/* 반려동물 목록 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {currentItems.length > 0 ? (
          currentItems.map((pet) => (
            <div
              key={pet.id}
              className={`relative bg-white p-4 rounded-lg shadow-md flex items-center space-x-4 border hover:shadow-lg transition cursor-pointer ${
                selectedPet?.id === pet.id ? 'border-[var(--color-theme-sky)] border-2' : ''
              }`}
              onClick={() => {
                setSelectedPet(pet); // 반려동물 선택
                setIsModalOpen(true); // 모달 열기
              }}
            >
              {/* 반려동물 이미지 */}
              <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-full border">
                <img src={pet.image} alt={pet.name} className="w-full h-full object-cover" />
              </div>

              {/* 반려동물 정보 */}
              <div className="flex-1">
                <p className="text-lg font-bold">{pet.name}</p>
                <p className="text-gray-500">{pet.gender === '♀' ? '♀ 암컷' : '♂ 수컷'}</p>
                <p className="text-gray-500">나이: {pet.age}살</p>
                <p className="text-gray-500">수상횟수: {pet.awards}회</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-2">등록된 반려동물이 없습니다.</p>
        )}
      </div>

      {/* 🔹 페이지네이션 */}
      {filteredPets.length > ITEMS_PER_PAGE && (
        <div className="mt-6 flex justify-center">
          <Pagination
            activePage={currentPage}
            itemsCountPerPage={ITEMS_PER_PAGE}
            totalItemsCount={filteredPets.length}
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

      {/* 반려동물 정보 모달 */}
      {selectedPet && (
        <PetModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedPet(null); // 모달이 닫힐 때 선택된 반려동물 초기화
          }}
          pet={selectedPet}
        />
      )}
    </div>
  );
}
