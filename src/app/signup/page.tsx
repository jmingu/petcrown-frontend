'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/common/button/Button';
import Input from '@/components/common/input/Input';
import Alert from '@/components/common/alert/Alert';
import UserService from '@/model/user/service/UserService';
import UserSignUp from '@/model/user/dto/UserSignUpDto';

export default function SignupPage() {
  const userService = new UserService(); // 인스턴스 생성
  const emailDomainRef = useRef<HTMLInputElement | null>(null); // 직접 입력 포커스용
  const router = useRouter();

  const [form, setForm] = useState(new UserSignUp());

  const [alertMessage, setAlertMessage] = useState('');

  const handleCheckEmail = async () => {
    const isAvailable = await userService.checkEmailDuplicate(email);
    if (isAvailable) {
      setAlertMessage('이메일 사용 가능!');
    } else {
      setAlertMessage('이메일이 이미 사용 중입니다.');
    }
  };

  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmailDomainChange = (value: string) => {
    if (value === 'custom') {
      setForm((prev) => ({ ...prev, emailDomain: '', isCustomDomain: true }));
      setTimeout(() => emailDomainRef.current?.focus(), 0); // 직접 입력 포커스 이동
    } else {
      setForm((prev) => ({
        ...prev,
        emailDomain: value,
        isCustomDomain: false,
      }));
    }
  };

  const handleSignup = async () => {
    const {
      emailId,
      emailDomain,
      nickname,
      password,
      confirmPassword,
      birthDate,
      gender,
      phone1,
      phone2,
      phone3,
    } = form;

    if (
      !emailId ||
      !emailDomain ||
      !nickname ||
      !password ||
      !confirmPassword ||
      !birthDate ||
      !gender ||
      !phone1 ||
      !phone2 ||
      !phone3
    ) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    console.log('회원가입 요청:', {
      email: `${emailId}@${emailDomain}`,
      nickname,
      password,
      birthDate,
      gender,
      phone: `${phone1}-${phone2}-${phone3}`,
    });
    alert('회원가입 성공! (임시 처리)');
    router.push('/login');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-sm bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">회원가입</h2>

        {/* 이메일 입력 */}
        <div className="mb-4">
          <label className="block text-gray-700">이메일</label>
          <div className="flex items-center gap-2">
            <Input
              name="emailId"
              placeholder="아이디 입력"
              value={form.emailId}
              onChange={(value) => handleChange('emailId', value)}
              required
              divClass="flex-1"
            />
            <span className="text-lg font-bold">@</span>
            <Input
              name="emailDomain"
              placeholder="도메인 입력"
              value={form.emailDomain}
              onChange={(value) => handleChange('emailDomain', value)}
              required
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

        {/* 닉네임 */}
        <Input
          name="name"
          placeholder="이름"
          value={form.nickname}
          onChange={(value) => handleChange('nickname', value)}
          required
        />
        <Input
          name="nickname"
          placeholder="닉네임"
          value={form.nickname}
          onChange={(value) => handleChange('nickname', value)}
          required
        />

        {/* 성별 선택 */}
        <div className="mb-4">
          <label className="block text-gray-700">성별</label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="male"
                onChange={(e) => handleChange('gender', e.target.value)}
                className="mr-2"
              />{' '}
              남성
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="female"
                onChange={(e) => handleChange('gender', e.target.value)}
                className="mr-2"
              />{' '}
              여성
            </label>
          </div>
        </div>

        {/* 생년월일 (캘린더) */}
        <div className="mb-4">
          <label className="block text-gray-700">생년월일</label>
          <Input
            type="date"
            name="birthDate"
            placeholder="2000-01-01"
            value={form.birthDate}
            onChange={(value) => handleChange('birthDate', value)}
            required
          />
        </div>

        {/* 핸드폰 번호 입력 */}
        <div className="mb-4">
          <label className="block text-gray-700">핸드폰 번호</label>
          <div className="flex gap-2">
            <Input
              name="phone1"
              placeholder="010"
              value={form.phone1}
              onChange={(value) => handleChange('phone1', value)}
              maxLength={3}
              required
              className="w-1/3"
            />
            <Input
              name="phone2"
              placeholder="1234"
              value={form.phone2}
              onChange={(value) => handleChange('phone2', value)}
              maxLength={4}
              required
              className="w-1/3"
            />
            <Input
              name="phone3"
              placeholder="5678"
              value={form.phone3}
              onChange={(value) => handleChange('phone3', value)}
              maxLength={4}
              required
              className="w-1/3"
            />
          </div>
        </div>
        {/* 비밀번호 */}
        <Input
          type="password"
          name="password"
          placeholder="비밀번호"
          value={form.password}
          onChange={(value) => handleChange('password', value)}
          required
        />
        <Input
          type="password"
          name="confirmPassword"
          placeholder="비밀번호 확인"
          value={form.confirmPassword}
          onChange={(value) => handleChange('confirmPassword', value)}
          required
        />

        {/* 회원가입 버튼 */}
        <Button onClick={handleSignup} className="w-full">
          회원가입
        </Button>
      </div>
      <Alert message={alertMessage} onClose={() => setAlertMessage('')} />
    </div>
  );
}
