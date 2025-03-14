'use client';

import { motion } from 'framer-motion';

import Button from "@/components/common/button/Button";

interface PetModalProps {
  isOpen: boolean;
  onClose: () => void;
  pet: {
    name: string;
    image: string;
    gender: string;
    type: 'dog' | 'cat';
  };
}

export default function PetModal({ isOpen, onClose, pet }: PetModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <motion.div
        className="relative bg-white p-6 rounded-lg shadow-lg w-80 md:w-96"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        {/* 오른쪽 상단 X 버튼 */}
        <button
          className="absolute top-2 right-2 text-gray-500 text-xl cursor-pointer"
          onClick={onClose}
        >
          ✖
        </button>

        <h2 className="text-xl font-bold text-center">{pet.name}</h2>
        <img
          src={pet.image}
          alt={pet.name}
          className="w-full h-48 object-cover rounded-md mt-4"
        />
        <p className="text-gray-700 text-sm mt-2">성별: {pet.gender}</p>
        <p className="text-gray-700 text-sm">종류: {pet.type === 'dog' ? '강아지' : '고양이'}</p>

        <div className="flex justify-between mt-4">
          <Button
						type='accent'
            onClick={() => alert(`${pet.name}의 현재 사진으로 등록 완료!`)}
          >
            현재 사진으로 등록
          </Button>
          <Button
            onClick={() => alert('새로운 사진 업로드 기능 추가 예정')}
          >
            새로운 사진으로 등록
          </Button>
        </div>

        {/* 하단 닫기 버튼 */}
        <button className="mt-4 w-full text-center text-gray-500 cursor-pointer" onClick={onClose}>
          닫기
        </button>
      </motion.div>
    </div>
  );
}
