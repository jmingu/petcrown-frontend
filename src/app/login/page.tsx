'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '@/components/common/button/Button';
import Input from '@/components/common/input/Input';
import {login, findUser} from '@/libs/api/user/userApi';
import { useUserStore } from '@/libs/store/user/userStore';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    
    try {
      await login({ email, password }); // 로그인 요청

      const user = await findUser(); // 로그인 후 사용자 정보 받아오기
      
      console.log('로그인 성공, 사용자 정보:', user);

      useUserStore.getState().setUser(user); // 전역 상태에 저장
      // 로그인 성공 시 사용자 정보 조회 or 메인 페이지 이동
      router.push('/'); // 또는 getMyInfo()로 사용자 상태 업데이트
    } catch (err) {
      console.error('로그인 실패:', err);
      alert('로그인 정보가 올바르지 않습니다.');
    }



  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">로그인</h2>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold">이메일</label>
          <Input
            name="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold">비밀번호</label>
          <Input
            name="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e)}
          />
        </div>

        <Button onClick={handleLogin} className="w-full">
          로그인
        </Button>
        <div className="flex justify-between mt-4 text-sm">
          <Link href="/find-id" className="text-gray-600 hover:underline">
            아이디 찾기
          </Link>
          <Link href="/find-password" className="text-gray-600 hover:underline">
            비밀번호 찾기
          </Link>
          <Link
            href="/signup"
            className="text-[var(--color-theme-sky)] hover:underline"
          >
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
}
