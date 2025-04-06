'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '@/components/common/button/Button';
import Input from '@/components/common/input/Input';
import api from '@/libs/axiosInstance';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const fetchData = async () => {
      try {
        const response = await api.get('/health-check/ok');
        console.log(response);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    console.log(fetchData());
    try {
      // TODO: 백엔드 API 연결
      console.log('로그인 시도:', { email, password });

      // 예제 사용자 데이터 (실제로는 API 응답에서 받아야 함)
      const userData = {
        email,
        nickname: '사용자닉네임', // 실제 닉네임 값으로 변경
        token: 'abc123xyz', // JWT 토큰 등 실제 로그인 정보
      };

      // localStorage에 저장
      localStorage.setItem('login', JSON.stringify(userData));

      alert('로그인 성공! (임시 처리)');

      // 홈으로 이동
      // router.push('/');
    } catch (error) {
      console.error('로그인 오류:', error);
      alert('로그인 실패!');
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
            value={email}
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
