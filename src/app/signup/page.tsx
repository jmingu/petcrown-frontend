'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/common/button/Button';
import Input from '@/components/common/input/Input';
import RadioGroup from '@/components/common/input/RadioGroup';
import DateInput from '@/components/common/input/DateInput';
import Alert from '@/components/common/alert/Alert';
import UserService from '@/model/user/service/UserService';
import UserSignUp from '@/model/user/dto/UserSignUpDto';

export default function SignupPage() {
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

  // 이메일 합치기
  const handleEmailChange = (name: string, value: string) => {
    let newEmail = form.email;
  
    if (name === 'email') {
      newEmail = `${value}@${form.email.split('@')[1] || ''}`;
    } else if (name === 'emailDomain') {
      newEmail = `${form.email.split('@')[0] || ''}@${value}`;
    }
  
    setForm((prev) => ({ ...prev, email: newEmail }));
  };

  // 이메일 중복 확인
  const handleCheckEmail = async () => {

    const isAvailable = await userService.checkEmailDuplicate(form.email);
    if (isAvailable) {
      setAlertMessage('사용 가능!');
    } else {
      setAlertMessage('이미 사용 중입니다.');
    }
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

  // 이메일 도메인 선택
  const handleEmailDomainChange = (value: string) => {
    if (value === 'custom') {
      setForm((prev) => ({ ...prev, email: `${prev.email.split('@')[0]}@` })); // 도메인 비우기
    } else {
      setForm((prev) => ({...prev, email: `${prev.email.split('@')[0]}@${value}`, // 새로운 도메인 적용
      }));
    }
  };

  const handleSignup = async () => {
    console.log(form)
    // router.push('/login');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-sm bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">회원가입</h2>

        {/* 이메일 입력 */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold">이메일</label>
          <div className="flex items-center gap-2">
            <Input
              name="email"
              placeholder="아이디 입력"
              value={form.email.split('@')[0] || ''}
              onChange={(value) => handleEmailChange('email', value)}
              divClass="flex-1"
            />
            <span className="text-lg font-bold">@</span>
            <Input
              name="emailDomain"
              placeholder="도메인 입력"
              value={form.email.split('@')[1] || ''}
              onChange={(value) => handleEmailChange('emailDomain', value)}
              divClass="!w-[45%]"
            />
          </div>
          <div className="flex justify-between">
            <Button onClick={handleCheckEmail} type="accent">
              중복 확인
            </Button>
            <select
              onChange={(e) => handleEmailDomainChange(e.target.value)}
              className="p-3 border rounded border-gray-300"
            >
              <option value="">선택</option>
              <option value="naver.com">naver.com</option>
              <option value="gmail.com">gmail.com</option>
              <option value="nate.com">nate.com</option>
              <option value="daum.net">daum.net</option>
              <option value="custom">직접 입력</option>
            </select>
          </div>
        </div>

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

        {/* 회원가입 버튼 */}
        <Button onClick={handleSignup} className="w-full">
          회원가입
        </Button>
      </div>

      {/* 알림창 */}
      <Alert message={alertMessage} onClose={() => setAlertMessage('')} />
    </div>
  );
}
