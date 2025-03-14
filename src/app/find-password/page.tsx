"use client";
import Button from '@/components/common/button/Button';
import { useState } from "react";
import Input from '@/components/common/input/Input';
import DateInput from '@/components/common/input/DateInput';

export default function FindPasswordPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");

  const handleFindPassword = async () => {
    // TODO: 백엔드 API 연결
    alert(`비밀번호 찾기 요청:
    이메일: ${email}
    이름: ${name}
    생년월일: ${birthDate} (임시 처리)`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">비밀번호 찾기</h2>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold">이메일</label>
          <Input
            name="email"
            placeholder="이메일 입력"
            value={email}
            onChange={(e) => setEmail(e)}
            
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold">이름</label>
          <Input
            name="name"
            placeholder="이름"
            value={name}
            onChange={(e) => setEmail(e)}
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 font-bold">생년월일</label>
          <DateInput
            value={birthDate}
            onChange={(e) => setBirthDate(e)}
            placeholder="YYYY-MM-DD"
            maxDate={new Date()}  // 미래 날짜 선택 방지
          />
        </div>

        <Button onClick={handleFindPassword} className="w-full">
          비밀번호 찾기
        </Button>
      </div>
    </div>
  );
}
