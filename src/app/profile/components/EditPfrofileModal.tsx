'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import Button from '@/components/common/button/Button';
import Input from '@/components/common/input/Input';


import UserService from '@/model/user/service/UserService';
import UserSignUp from '@/model/user/dto/UserSignUpDto';

import { useRouter } from 'next/navigation';

import RadioGroup from '@/components/common/input/RadioGroup';

import DateInput from '@/components/common/input/DateInput';

interface UserInfo {
  id: number;
  name: string;
  email: string;
  gender: string;
  birthdate: string;
  profileImageUrl: string;
}

interface EditProfileModalProps {
  user: UserInfo;
  onClose: () => void;
  onSave: (updatedUser: UserInfo) => void;
}

export default function EditProfileModal({ user, onClose, onSave }: EditProfileModalProps) {
  const userService = new UserService(); // 인스턴스 생성
    const router = useRouter();
    const [form, setForm] = useState(new UserSignUp());
    const [alertMessage, setAlertMessage] = useState('');
  
    // 폰번호 합치기
    const handlePhoneChange = (name: string, value: string) => {
      let newPhoneNumber = form.phoneNumber;
    
      if (name === 'phone1') {
        newPhoneNumber = `${value}-${form.phoneNumber.split('-')[1] || ''}-${form.phoneNumber.split('-')[2] || ''}`;
      } else if (name === 'phone2') {
        newPhoneNumber = `${form.phoneNumber.split('-')[0] || ''}-${value}-${form.phoneNumber.split('-')[2] || ''}`;
      } else if (name === 'phone3') {
        newPhoneNumber = `${form.phoneNumber.split('-')[0] || ''}-${form.phoneNumber.split('-')[1] || ''}-${value}`;
      }
    
      // { ...prev }: 기존 form의 모든 속성을 그대로 복사합니다.
      // 기존 phoneNumber를 newPhoneNumber 값으로 업데이트합니다.
      setForm((prev) => ({ ...prev, phoneNumber: newPhoneNumber }));
      
    };
  
  
    // 닉네임 중복검사
    const handleCheckNickname = async () => {
  
      const isAvailable = await userService.checkNicknameDuplicate(form.nickname);
      if (isAvailable) {
        setAlertMessage('사용 가능!');
      } else {
        setAlertMessage('이미 사용 중입니다.');
      }
    };
  
    // 값 넣기기
    const handleChange = (name: string, value: string) => {
      setForm((prev) => ({ ...prev, [name]: value }));
    };
  
    const handleSave = () => {

      onClose();
    }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <motion.div 
        initial={{ opacity: 0, y: -50 }} 
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="bg-white p-6 rounded-lg shadow-lg w-96"
      >
        <h2 className="text-xl font-bold mb-4">프로필 수정</h2>
        <div className="flex flex-col">
          {/* 이메일 입력 */}
          <label className="block text-gray-700 font-bold">이메일</label>
          <Input
            name="name"
            placeholder="이메일"
            value={form.name}
            onChange={(value) => handleChange('name', value)}
            maxLength={10}
          />

          {/* 이름 */}
          <label className="block text-gray-700 font-bold">이름</label>
          <Input
            name="name"
            placeholder="이름"
            value={form.name}
            onChange={(value) => handleChange('name', value)}
            maxLength={10}
          />

          {/* 닉네임 */}
          <label className="block text-gray-700 font-bold">닉네임</label>
          <div className='flex'>
            <Input
              name="nickname"
              placeholder="닉네임"
              value={form.nickname}
              onChange={(value) => handleChange('nickname', value)}
              className='flex-1'
              maxLength={10}
            />
            <Button onClick={handleCheckNickname} type="accent" className='!w-[45%] mb-3'>
              중복 확인
            </Button>
          </div>

          {/* 성별 선택 */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold">성별</label>
            <RadioGroup
              name="gender"
              options={[
                { label: '남성', value: 'male' },
                { label: '여성', value: 'female' },
              ]}
              selectedValue={form.gender}
              onChange={(value) => handleChange('gender', value)}
            />
          </div>

          {/* 생년월일 (캘린더) */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold">생년월일</label>
            <DateInput
              value={form.birthDate}
              onChange={(value) => handleChange('birthDate', value)}
              placeholder="YYYY-MM-DD"
              maxDate={new Date()}  // 미래 날짜 선택 방지
            />
          </div>

          {/* 핸드폰 번호 입력 */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold">핸드폰 번호</label>
            <div className="flex gap-2">
              <Input
                name="phone1"
                placeholder="010"
                value={form.phoneNumber.split('-')[0] || ''}
                onChange={(value) => handlePhoneChange('phone1', value)}
                maxLength={3}
                className="w-1/3"
              />
              <Input
                name="phone2"
                placeholder="1234"
                value={form.phoneNumber.split('-')[1] || ''}
                onChange={(value) => handlePhoneChange('phone2', value)}
                maxLength={4}
                className="w-1/3"
              />
              <Input
                name="phone3"
                placeholder="5678"
                value={form.phoneNumber.split('-')[2] || ''}
                onChange={(value) => handlePhoneChange('phone3', value)}
                maxLength={4}
                className="w-1/3"
              />
            </div>
          </div>
        {/* 비밀번호 */}
        <label className="block text-gray-700 font-bold">비밀번호</label>
        <Input
          type="password"
          name="password"
          placeholder="비밀번호"
          value={form.password}
          onChange={(value) => handleChange('password', value)}
          minLength={4}
          maxLength={20}
        />
        <Input
          type="password"
          name="confirmPassword"
          placeholder="비밀번호 확인"
          value={form.confirmPassword}
          onChange={(value) => handleChange('confirmPassword', value)}
          minLength={4}
          maxLength={20}
        />
        </div>
        <div className="flex justify-end mt-4 gap-2">
          <Button type='gray' onClick={onClose}>취소</Button>
          <Button onClick={handleSave}>저장</Button>
        </div>
      </motion.div>
    </div>
  );
}
