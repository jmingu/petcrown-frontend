"use client";

import { useState } from "react";

export default function FindPasswordPage() {
  const [email, setEmail] = useState("");

  const handleFindPassword = async () => {
    // TODO: 백엔드 API 연결
    alert(`비밀번호 찾기 요청: ${email} (임시 처리)`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">비밀번호 찾기</h2>
        <input
          type="email"
          placeholder="가입한 이메일 입력"
          className="w-full p-3 mb-3 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          onClick={handleFindPassword}
          className="w-full bg-blue-500 text-white p-3 rounded font-bold"
        >
          비밀번호 찾기
        </button>
      </div>
    </div>
  );
}
