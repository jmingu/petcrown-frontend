'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Pet {
  id: number;
  name: string;
  gender: string;
  birthdate: string;
  species: string;
  imageUrl: string;
  awards: number;
}

interface PetModalProps {
  pet?: Pet; // 선택적 속성 (수정 시 기존 반려동물 데이터 전달)
  onClose: () => void;
  onSave: (pet: Pet) => void;
}

export default function PetModal({ pet, onClose, onSave }: PetModalProps) {
  const isEditMode = !!pet; // pet이 있으면 수정 모드, 없으면 추가 모드
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [species, setSpecies] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // pet이 있으면 기존 데이터를 기본값으로 설정
  useEffect(() => {
    if (pet) {
      setName(pet.name);
      setGender(pet.gender);
      setBirthdate(pet.birthdate);
      setSpecies(pet.species);
      setImageUrl(pet.imageUrl);
    }
  }, [pet]);

  const handleSave = () => {
    if (!name || !gender || !birthdate || !species) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    const updatedPet: Pet = {
      id: pet ? pet.id : Date.now(), // 수정 시 기존 ID 유지, 추가 시 새로운 ID 생성
      name,
      gender,
      birthdate,
      species,
      imageUrl: imageUrl || '/images/default-pet.png',
      awards: pet ? pet.awards : 0, // 수정 시 기존 awards 유지, 추가 시 0으로 설정
    };

    onSave(updatedPet);
    onClose();
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div 
        initial={{ opacity: 0, y: -50 }} 
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="bg-white p-6 rounded-lg shadow-lg w-96"
      >
        <h2 className="text-xl font-bold mb-4">
          {isEditMode ? '반려동물 수정' : '반려동물 등록'}
        </h2>
        <div className="flex flex-col gap-3">
          <input type="text" placeholder="이름" value={name} onChange={(e) => setName(e.target.value)} className="border p-2 rounded" />
          <select value={gender} onChange={(e) => setGender(e.target.value)} className="border p-2 rounded">
            <option value="">성별 선택</option>
            <option value="남아">남아</option>
            <option value="여아">여아</option>
          </select>
          <input type="date" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} className="border p-2 rounded" />
          <input type="text" placeholder="종 (예: 강아지, 고양이)" value={species} onChange={(e) => setSpecies(e.target.value)} className="border p-2 rounded" />
          <input type="text" placeholder="사진 URL (선택)" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="border p-2 rounded" />
        </div>
        <div className="flex justify-end mt-4 gap-2">
          <button onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded">취소</button>
          <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">
            {isEditMode ? '수정' : '등록'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
