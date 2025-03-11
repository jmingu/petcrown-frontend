"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isEmailChecked, setIsEmailChecked] = useState(false);

  // 이메일 중복 확인
  const checkEmailDuplicate = async () => {
    if (!email) {
      alert("이메일을 입력해주세요.");
      return;
    }

    // TODO: 실제 API 연동
    console.log("이메일 중복 확인 요청:", email);
    alert("이메일 사용 가능! (임시 처리)");
    setIsEmailChecked(true);
  };

  // 회원가입 처리
  const handleSignup = async () => {
    if (!email || !nickname || !password || !confirmPassword) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    if (!isEmailChecked) {
      alert("이메일 중복 확인을 해주세요.");
      return;
    }

    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    // TODO: 백엔드 API 연동
    console.log("회원가입 요청:", { email, nickname, password });
    alert("회원가입 성공! (임시 처리)");
    router.push("/login"); // 회원가입 성공 후 로그인 페이지로 이동
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-sm bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">회원가입</h2>

        {/* 이메일 입력 + 중복 확인 버튼 */}
        <div className="flex gap-2 mb-3">
          <input
            type="email"
            placeholder="이메일"
            className="flex-1 p-3 border rounded"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setIsEmailChecked(false); // 이메일 변경 시 중복 확인 상태 초기화
            }}
          />
          <button
            onClick={checkEmailDuplicate}
            className="bg-gray-500 text-white px-3 rounded"
          >
            중복 확인
          </button>
        </div>

        <input
          type="text"
          placeholder="닉네임"
          className="w-full p-3 mb-3 border rounded"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호"
          className="w-full p-3 mb-3 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호 확인"
          className="w-full p-3 mb-3 border rounded"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          onClick={handleSignup}
          className="w-full bg-blue-500 text-white p-3 rounded font-bold"
        >
          회원가입
        </button>
      </div>
    </div>
  );
}
