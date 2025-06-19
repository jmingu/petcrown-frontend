'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

import Button from '@/components/common/button/Button';
import Input from '@/components/common/input/Input';

import RadioGroup from '@/components/common/input/RadioGroup';

import DateInput from '@/components/common/input/DateInput';

import { petRegister } from '@/libs/api/pet/petApi';

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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string>('');

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

  // 이미지 파일 선택 핸들러
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && /image\/(jpeg|jpg|png)/.test(file.type)) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview('');
      alert('jpg, jpeg, png 파일만 업로드 가능합니다.');
    }
  };

  const handleSave = async () => {
    if (!name || !gender || !birthdate || !species || !imageUrl) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    // 회원가입
    const registerResult = await petRegister({
      name,
      gender,
      birthdate,
      species: Number(species),
      imageUrl: imageUrl || '/images/default-pet.png',
    });

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
                { label: '남', value: 'M' },
                { label: '여', value: 'F' },
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
              maxDate={new Date()} // 미래 날짜 선택 방지
            />
          </div>
          {/* 성별 선택 */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold">종류</label>
            <RadioGroup
              name="type"
              options={[
                { label: '고양이', value: '1' },
                { label: '강아지', value: '2' },
                { label: '기타', value: '0' },
              ]}
              selectedValue={species}
              onChange={(e) => setSpecies(e)}
            />
          </div>
          {/* 이미지 업로드 버튼 및 미리보기 */}
          <div className="mb-3">
            <label className="block text-gray-700 font-bold mb-1">
              프로필 사진 (선택)
            </label>
            <button
              type="button"
              className="border p-2 rounded bg-gray-100 hover:bg-gray-200"
              onClick={() =>
                document.getElementById('profile-image-input')?.click()
              }
            >
              이미지 선택
            </button>
            <input
              id="profile-image-input"
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              style={{ display: 'none' }}
              onChange={handleImageChange}
            />
            {imagePreview && (
              <div className="mt-2">
                <Image
                  src={imagePreview}
                  alt="미리보기"
                  width={128}
                  height={128}
                  className="w-32 h-32 object-cover rounded"
                />
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end mt-4 gap-2">
          <Button type="gray" onClick={onClose}>
            취소
          </Button>
          <Button onClick={handleSave}>{isEditMode ? '수정' : '등록'}</Button>
        </div>
      </motion.div>
    </div>
  );
}
