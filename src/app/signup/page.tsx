'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { UserPlus, Mail, User, Lock, Heart, Sparkles, ArrowLeft } from 'lucide-react';
import CuteButton from '@/components/common/button/CuteButton';
import CuteCard from '@/components/common/card/CuteCard';
import Alert from '@/components/common/alert/Alert';
import Modal from '@/components/common/modal/Modal';
import {
  checkEmail,
  checkNickname,
  signup,
  sendEmailVerificationCode,
  checkEmailVerificationCode,
} from '@/libs/api/user/userApi';

export default function SignupPage() {
  const router = useRouter();

  const [emailWrite, setEmailWrite] = useState('');
  const [emailDomain, setEmailDomain] = useState('');
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');

  const [alertMessage, setAlertMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputCode, setInputCode] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isNicknameVerified, setIsNicknameVerified] = useState(false);
  const [emailCheckOk, setEmailCheckOk] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailDomainChange = (value: string) => {
    if (value === 'custom') {
      setEmailDomain('');
    } else {
      setEmailDomain(value);
    }
  };

  const handleCheckEmail = async () => {
    if (!emailWrite || !emailDomain) {
      setAlertMessage('이메일을 입력해주세요.');
      return;
    }

    const emailCheck = await checkEmail(emailWrite + '@' + emailDomain);

    if (emailCheck.resultCode !== 200) {
      if (emailCheck.resultCode >= 3000) {
        setAlertMessage(emailCheck.resultMessageKo);
        setIsEmailVerified(false);
        return;
      }
      setAlertMessage('이메일 중복 확인 중 오류가 발생했습니다.');
      setIsEmailVerified(false);
      return;
    }
    setAlertMessage('이메일이 사용 가능합니다!');
    setIsEmailVerified(true);
  };

  const handleCheckNickname = async () => {
    if (!nickname) {
      setAlertMessage('닉네임을 입력해주세요.');
      return;
    }

    const nicknameCheck = await checkNickname(nickname);

    if (nicknameCheck.resultCode !== 200) {
      if (nicknameCheck.resultCode >= 3000) {
        setAlertMessage(nicknameCheck.resultMessageKo);
        setIsNicknameVerified(false);
        return;
      }
      setAlertMessage('닉네임 중복 확인 중 오류가 발생했습니다.');
      setIsNicknameVerified(false);
      return;
    }
    setAlertMessage('닉네임이 사용 가능합니다!');
    setIsNicknameVerified(true);
  };

  const formatBirthDate = (date: string) => {
    return date.replace(/-/g, '');
  };

  const handleSignup = async () => {
    if (!emailWrite || !emailDomain) {
      setAlertMessage('이메일을 입력해주세요.');
      return;
    }
    if (!name) {
      setAlertMessage('이름을 입력해주세요.');
      return;
    }
    if (!nickname) {
      setAlertMessage('닉네임을 입력해주세요.');
      return;
    }
    if (!password) {
      setAlertMessage('비밀번호를 입력해주세요.');
      return;
    }
    if (!passwordCheck) {
      setAlertMessage('비밀번호 확인을 입력해주세요.');
      return;
    }
    if (password.length < 4) {
      setAlertMessage('비밀번호는 최소 4자리 이상이어야 합니다.');
      return;
    }
    if (password !== passwordCheck) {
      setAlertMessage('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (!isEmailVerified) {
      setAlertMessage('이메일 중복 확인을 완료해주세요.');
      return;
    }
    if (!isNicknameVerified) {
      setAlertMessage('닉네임 중복 확인을 완료해주세요.');
      return;
    }

    setIsLoading(true);
    const signupResult = await signup({
      email: emailWrite + '@' + emailDomain,
      name,
      nickname,
      password,
      passwordCheck,
    });

    setIsLoading(false);

    if (signupResult.resultCode !== 200) {
      if (signupResult.resultCode >= 3000) {
        setAlertMessage(signupResult.resultMessageKo);
        return;
      }
      setAlertMessage('회원가입 중 오류가 발생했습니다.');
      return;
    }

    setIsModalOpen(true);
  };

  const handleVerifyCode = async () => {
    if (!inputCode || inputCode.trim() === '') {
      setAlertMessage('인증번호를 입력해주세요.');
      return;
    }

    const codeCheck = await checkEmailVerificationCode({
      code: inputCode,
      email: emailWrite + '@' + emailDomain,
    });

    if (codeCheck.resultCode !== 200) {
      if (codeCheck.resultCode >= 3000) {
        setAlertMessage(codeCheck.resultMessageKo);
        return;
      }
      setAlertMessage('인증번호 확인 중 오류가 발생했습니다.');
      return;
    }

    setAlertMessage('인증이 완료되었습니다!');
    setEmailCheckOk(true);
    setIsModalOpen(false);
  };

  const handleResendCode = async () => {
    const sendResult = await sendEmailVerificationCode({ email: emailWrite + '@' + emailDomain });

    if (sendResult.resultCode !== 200) {
      if (sendResult.resultCode >= 3000) {
        setAlertMessage(sendResult.resultMessageKo);
        return;
      }
      setAlertMessage('인증번호 재전송 중 오류가 발생했습니다.');
      return;
    }
    setInputCode('');
    setAlertMessage('인증번호가 재전송되었습니다.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* 배경 장식 요소들 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* 큰 그라데이션 블롭들 */}
        <motion.div
          className="absolute -top-20 -left-20 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-20 -right-20 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* 떠다니는 아이콘들 */}
        <motion.div
          className="absolute top-20 left-10"
          animate={{
            y: [-20, 20, -20],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Heart className="w-8 h-8 text-pink-400/40" fill="currentColor" />
        </motion.div>

        <motion.div
          className="absolute top-32 right-20"
          animate={{
            y: [20, -20, 20],
            rotate: [0, -10, 10, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Sparkles className="w-6 h-6 text-purple-400/50" />
        </motion.div>

        <motion.div
          className="absolute bottom-40 left-1/4"
          animate={{
            y: [10, -10, 10],
            x: [-5, 5, -5],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Heart className="w-6 h-6 text-pink-300/30" fill="currentColor" />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl relative z-10"
      >
        {/* 뒤로가기 버튼 */}
        <div className="max-w-2xl mx-auto relative z-10 mb-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-purple-600 hover:text-purple-800 transition-colors duration-200"
          >
            ← 돌아가기
          </button>
        </div>
        <CuteCard className="space-y-6" padding="lg" glassmorphism>
          
          {/* 헤더 */}
          <div className="text-center space-y-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.2
              }}
              className="flex justify-center"
            >
              <div className="w-20 h-20 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 rounded-full flex items-center justify-center shadow-xl animate-pulse-glow">
                <UserPlus className="w-10 h-10 text-white" />
              </div>
            </motion.div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
              회원가입
            </h1>
            <p className="text-gray-700 text-lg">
              펫크라운의 가족이 되어주세요! 🐾
            </p>
          </div>

          {/* 폼 섹션 */}
          <div className="space-y-4">
            {/* 이메일 입력 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">이메일 주소</label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="이메일"
                    value={emailWrite}
                    onChange={(e) => setEmailWrite(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/50 border border-purple-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent focus:bg-white transition-all duration-200 placeholder:text-gray-400"
                  />
                </div>
                <span className="text-gray-500 font-medium">@</span>
                <input
                  type="text"
                  placeholder="도메인"
                  value={emailDomain}
                  onChange={(e) => setEmailDomain(e.target.value)}
                  className="w-28 px-4 py-3 bg-white/50 border border-purple-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent focus:bg-white transition-all duration-200 placeholder:text-gray-400"
                />
              </div>
              <div className="flex gap-2">
                <CuteButton
                  onClick={handleCheckEmail}
                  variant={isEmailVerified ? "success" : "primary"}
                  size="sm"
                >
                  {isEmailVerified ? "확인완료" : "중복확인"}
                </CuteButton>
                <select
                  onChange={(e) => handleEmailDomainChange(e.target.value)}
                  className="px-4 py-2 bg-white/50 border border-purple-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white transition-all duration-200"
                >
                  <option value="custom">직접 입력</option>
                  <option value="naver.com">naver.com</option>
                  <option value="gmail.com">gmail.com</option>
                  <option value="nate.com">nate.com</option>
                  <option value="daum.net">daum.net</option>
                </select>
              </div>
            </div>

            {/* 이름 입력 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">이름</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="실명을 입력해주세요"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={10}
                  className="w-full pl-10 pr-4 py-3 bg-white/50 border border-purple-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent focus:bg-white transition-all duration-200 placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* 닉네임 입력 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">닉네임</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="닉네임을 입력해주세요"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  maxLength={10}
                  className="w-full pl-10 pr-4 py-3 bg-white/50 border border-purple-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent focus:bg-white transition-all duration-200 placeholder:text-gray-400"
                />
              </div>
              <CuteButton
                onClick={handleCheckNickname}
                variant={isNicknameVerified ? "success" : "primary"}
                size="sm"
              >
                {isNicknameVerified ? "확인완료" : "중복확인"}
              </CuteButton>
            </div>

            {/* 비밀번호 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">비밀번호</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  placeholder="비밀번호 (최소 4자리)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={4}
                  maxLength={20}
                  className="w-full pl-10 pr-4 py-3 bg-white/50 border border-purple-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent focus:bg-white transition-all duration-200 placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">비밀번호 확인</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  placeholder="비밀번호 확인"
                  value={passwordCheck}
                  onChange={(e) => setPasswordCheck(e.target.value)}
                  minLength={4}
                  maxLength={20}
                  className="w-full pl-10 pr-4 py-3 bg-white/50 border border-purple-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent focus:bg-white transition-all duration-200 placeholder:text-gray-400"
                />
              </div>
            </div>

            <CuteButton
              onClick={handleSignup}
              loading={isLoading}
              className="w-full"
              variant="primary"
              size="lg"
              icon={<UserPlus className="w-5 h-5" />}
            >
              회원가입
            </CuteButton>
          </div>

          {/* 링크들 */}
          <div className="flex justify-center space-x-6 text-sm pt-4 border-t border-purple-100">
            <motion.button
              onClick={() => router.push('/login')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-purple-600 hover:text-purple-800 font-medium transition-colors"
            >
              이미 계정이 있으신가요?
            </motion.button>
          </div>
        </CuteCard>
      </motion.div>

      {/* 인증번호 모달 */}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <CuteCard padding="lg">
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">인증번호 확인</h3>
                <p className="text-gray-600 text-sm">
                  회원가입 완료<br />
                  이메일로 인증번호가 전송되었습니다.<br />
                  인증까지 완료해야 최종 가입이 완료됩니다.
                </p>
              </div>

              <input
                type="text"
                placeholder="인증번호 입력"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                className="w-full px-4 py-3 bg-white/50 border border-purple-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent focus:bg-white transition-all duration-200 placeholder:text-gray-400"
              />

              <div className="flex gap-3">
                <CuteButton
                  onClick={handleVerifyCode}
                  variant="primary"
                  className="flex-1"
                >
                  확인
                </CuteButton>
                <CuteButton
                  onClick={handleResendCode}
                  variant="secondary"
                  className="flex-1"
                >
                  재전송
                </CuteButton>
              </div>
            </div>
          </CuteCard>
        </Modal>
      )}

      {/* 알림창 */}
      <Alert
        message={alertMessage}
        onClose={async () => {
          if (emailCheckOk === true) {
            router.push('/');
          }
          setAlertMessage('');
        }}
      />
    </div>
  );
}
