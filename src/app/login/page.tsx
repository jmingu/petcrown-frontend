"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    // TODO: 백엔드 API 연결
    console.log("로그인 시도:", { email, password });
    alert("로그인 성공! (임시 처리)");
    router.push("/"); // 로그인 성공 후 홈으로 이동
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">로그인</h2>
        <input
          type="email"
          placeholder="이메일"
          className="w-full p-3 mb-3 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호"
          className="w-full p-3 mb-3 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white p-3 rounded font-bold"
        >
          로그인
        </button>
        <div className="flex justify-between mt-4 text-sm">
          <Link href="/find-id" className="text-gray-600 hover:underline">
            아이디 찾기
          </Link>
          <Link href="/find-password" className="text-gray-600 hover:underline">
            비밀번호 찾기
          </Link>
          <Link href="/signup" className="text-blue-500 hover:underline">
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
}
