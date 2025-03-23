'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import Button from '@/components/common/button/Button';
import Input from '@/components/common/input/Input';

import RadioGroup from '@/components/common/input/RadioGroup';

import DateInput from '@/components/common/input/DateInput';

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
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <motion.div 
        initial={{ opacity: 0, y: -50 }} 
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="bg-white p-6 rounded-lg shadow-lg w-96"
      >
        <h2 className="text-xl font-bold mb-4">
          {isEditMode ? '반려동물 수정' : '반려동물 등록'}
        </h2>
        <div className="flex flex-col">
        <label className="block text-gray-700 font-bold">이름</label>
          <Input
            name="name"
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e)}
            maxLength={10}
          />
          {/* 성별 선택 */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold">성별</label>
            <RadioGroup
              name="gender"
              options={[
                { label: '남아', value: '남아' },
                { label: '여아', value: '여아' },
              ]}
              selectedValue={gender}
              onChange={(e) => setGender(e)}
            />
          </div>
          {/* 생년월일 (캘린더) */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold">생년월일</label>
            <DateInput
              value={birthdate}
              onChange={(e) => setBirthdate(e)}
              placeholder="YYYY-MM-DD"
              maxDate={new Date()}  // 미래 날짜 선택 방지
            />
          </div>
          {/* 성별 선택 */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold">종류</label>
            <RadioGroup
              name="type"
              options={[
                { label: '고양이', value: '고양이' },
                { label: '강아지', value: '강아지' },
              ]}
              selectedValue={species}
              onChange={(e) => setSpecies(e)}
            />
          </div>
          <input type="text" placeholder="사진 URL (선택)" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="border p-2 rounded" />
        </div>
        <div className="flex justify-end mt-4 gap-2">
          <Button type='gray' onClick={onClose}>취소</Button>     
          <Button onClick={handleSave}>{isEditMode ? '수정' : '등록'}</Button>
        </div>
      </motion.div>
    </div>
  );
}
