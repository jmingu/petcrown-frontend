"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/common/button/Button"
import Input from "@/components/common/input/Input"
import Alert from "@/components/common/alert/Alert";
import UserService from "@/model/user/service/UserService";

export default function SignupPage() {
  const userService = new UserService(); // 인스턴스 생성
  
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleCheckEmail = async () => {
    const isAvailable = await userService.checkEmailDuplicate(email);
    if (isAvailable) {
      setAlertMessage("이메일 사용 가능!");
      setIsEmailChecked(true);
    } else {
      setAlertMessage("이메일이 이미 사용 중입니다.");
    }
  };


  const [form, setForm] = useState({
    nickname: "",
    email: "",
    password: "",
    age: "",
  });

  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
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
        <Input
          name="email"
          placeholder="이메일"
          value={""}
          onChange={(value) => handleChange("email", value)}
          maxLength={12}
          minLength={2}
          required
        />
          <Button onClick={handleCheckEmail} type="accent">중복 확인</Button>
        
        </div>

        <Input
          name="nickname"
          placeholder="닉네임"
          value={""}
          onChange={(value) => handleChange("nickname", value)}
          maxLength={12}
          minLength={2}
          required
        />
        <Input
          type="password"
          name="비밀번호"
          placeholder="비밀번호"
          value={""}
          onlyNumbers={true}
          onChange={(value) => handleChange("password", value)}
          max={12}
          min={2}
          required
        />
        <Input
          type="password"
          name="비밀번호 확인"
          placeholder="비밀번호 확인"
          value={""}
          onlyNumbers={true}
          onChange={(value) => handleChange("password", value)}
          max={12}
          min={2}
          required
        />

        <Button
          onClick={handleSignup}
          className="w-full"
        >
          회원가입
        </Button>
      </div>
      <Alert message={alertMessage} onClose={() => setAlertMessage("")} />
    </div>
  );
}
