'use client';

import { motion } from 'framer-motion';
import Button from "@/components/common/button/Button";
import {MyPetResponse} from '@/libs/interface/api/pet/petResponseInterface'; 
import {VoteRegistrationRequest} from '@/libs/interface/api/vote/voteRequestInterface'; // 투표 등록 요청 인터페이스
import {voteRegistration} from '@/libs/api/vote/voteApi'; // 투표 등록 API

interface PetModalProps {
  isOpen: boolean;
  onClose: () => void;
  pet: MyPetResponse
}

export default function PetModal({ isOpen, onClose, pet }: PetModalProps) {

    
  if (!isOpen) return null;

  const handleSave = async () => {
  const voteResult = await voteRegistration({petId: pet.petId, profileImageUrl: ""}); // 사용자 정보 받아오기
      
  };

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
          src={pet.imageUrl}
          alt={pet.name}
          className="w-full h-48 object-cover rounded-md mt-4"
        />
        <p className="text-gray-700 text-sm mt-2">성별: {pet.gender === 'F' ? '여자' : '남자'}</p>
        <p className="text-gray-700 text-sm">종류: {pet.speciesName }</p>

        <div className="flex justify-between mt-4">
          <Button
						type='accent'
            onClick={() => handleSave()}
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
        <div className="mt-4 w-full text-center">
          <Button type="gray" onClick={onClose}>취소</Button>
        </div>
      </motion.div>
    </div>
  );
}
