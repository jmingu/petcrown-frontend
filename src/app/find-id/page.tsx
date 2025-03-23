"use client";

import { useState } from "react";

export default function FindIdPage() {
  const [email, setEmail] = useState("");

  const handleFindId = async () => {
    // TODO: 백엔드 API 연결
    alert(`아이디 찾기 요청: ${email} (임시 처리)`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">아이디 찾기</h2>
        <div className="text-center text-gray-600">
          <p>가입된 이메일을 모른다면 <br /> 아래로 문의해주세요.</p>
          <p className="mt-5 font-bold">kjkj173173@gmail.com</p>
        </div>
        {/* <input
          type="email"
          placeholder="가입한 이메일 입력"
          className="w-full p-3 mb-3 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          onClick={handleFindId}
          className="w-full bg-blue-500 text-white p-3 rounded font-bold"
        >
          아이디 찾기
        </button> */}
      </div>
    </div>
  );
}
