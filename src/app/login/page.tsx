'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Heart, Sparkles } from 'lucide-react';
import CuteButton from '@/components/common/button/CuteButton';
import CuteCard from '@/components/common/card/CuteCard';

import CheckboxGroup from '@/components/common/input/CheckboxGroup';
import Modal from '@/components/common/modal/Modal';
import Alert from '@/components/common/alert/Alert';
import {
  login,
  findUser,
  checkEmailVerificationCode,
  sendEmailVerificationCode,
} from '@/libs/api/user/userApi';
import { LoginRequest } from '@/libs/interface/api/user/userRequestInterface';
import { useUserStore } from '@/libs/store/user/userStore';
import { SendEmailVerificationCodeRequest, CheckEmailVerificationCodeRequest} from '@/libs/interface/api/user/userRequestInterface';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertAction, setAlertAction] = useState<(() => void) | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputCode, setInputCode] = useState('');
  const [autoLogin, setAutoLogin] = useState(
    typeof window !== 'undefined' && localStorage.getItem('auto_login') === 'Y'
  );
  const [isLoading, setIsLoading] = useState(false);


  const handleLogin = async () => {
    if (!email.trim()) {
      setAlertMessage('이메일을 입력해주세요.');
      return;
    }

    if (!password.trim()) {
      setAlertMessage('비밀번호를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const loginData: LoginRequest = { email, password };
      const loginResult = await login(loginData);
      if (loginResult.resultCode !== 200) {
        if (loginResult.resultCode >= 3000) {
          setAlertMessage(loginResult.resultMessageKo);
          if(loginResult.resultCode === 3114){
            // handleResendCode(''); 인증번호 재전송
            setIsModalOpen(true);
            return;
          }
          return;
        }
        setAlertMessage('로그인에 실패했습니다. 다시 시도해주세요.');
        return;
      }

      localStorage.setItem('a_t', loginResult.result.accessToken);
      localStorage.setItem('r_t', loginResult.result.refreshToken);

      const userResult = await findUser();
      if (userResult.resultCode !== 200) {
        if (userResult.resultCode >= 3000) {
          setAlertMessage(userResult.resultMessageKo);
          return;
        }
        setAlertMessage('사용자 정보를 가져오는 데 실패했습니다. 다시 시도해주세요.');
        return;
      }

      const sessData = {
        loginTime: new Date().toISOString(),
      };
      sessionStorage.setItem('sess', JSON.stringify(sessData));
      useUserStore.getState().setUser(userResult.result);
      router.push('/');
    } catch (error) {
      setAlertMessage('로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 코드 확인
   */
  const handleVerifyCode = async () => {
    if (!inputCode.trim()) {
      setAlertMessage('인증번호를 입력해주세요.');
      return;
    }

     const emailCode: CheckEmailVerificationCodeRequest = {
      code: inputCode,
      email: email
    };
    const codeCheck = await checkEmailVerificationCode(emailCode);

    if (codeCheck.resultCode !== 200) {
      if (codeCheck.resultCode >= 3000) {
        setAlertMessage(codeCheck.resultMessageKo);
        return;
      }
      setAlertMessage('인증번호 확인 중 오류가 발생했습니다.');
      return;
    }

    setAlertMessage('인증이 완료되었습니다!');
    setIsModalOpen(false);
  };

  const handleResendCode = async (value: string) => {
    const emailCodeSend: SendEmailVerificationCodeRequest = {
          email: email
        };
        const sendResult = await sendEmailVerificationCode(
          emailCodeSend
        );

    if (sendResult.resultCode !== 200) {
      if (sendResult.resultCode >= 3000) {
        setAlertMessage(sendResult.resultMessageKo);
        return;
      }
      setAlertMessage('인증번호 재전송 중 오류가 발생했습니다.');
      return;
    }
    if (value === 'resend') {
      setAlertMessage('인증번호가 재전송되었습니다.');
    }
    setInputCode('');
  };

  const handleAutoLoginChange = (values: string[]) => {
    const checked = values.includes('auto_login');
    setAutoLogin(checked);
    if (checked) {
      localStorage.setItem('auto_login', 'Y');
    } else {
      localStorage.removeItem('auto_login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* 배경 장식 요소들 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
          <Heart className="w-8 h-8 text-pink-300 opacity-40" fill="currentColor" />
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
          <Sparkles className="w-6 h-6 text-purple-300 opacity-50" />
        </motion.div>
      </div>

      {/* 메인 로그인 카드 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <CuteCard className="space-y-6" padding="lg">
          {/* 헤더 */}
          <div className="text-center space-y-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex justify-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" fill="currentColor" />
              </div>
            </motion.div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              PetCrown
            </h1>
            <p className="text-gray-600">
              우리 반려동물과 함께하는 특별한 공간 💕
            </p>
          </div>

          {/* 로그인 폼 */}
          <div className="space-y-4">
            {/* 이메일 입력 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                이메일
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="이메일을 입력해주세요"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* 비밀번호 입력 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                비밀번호
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="비밀번호를 입력해주세요"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* 자동로그인 체크박스 */}
            <CheckboxGroup
              name="autoLogin"
              options={[{ label: '자동로그인', value: 'auto_login' }]}
              selectedValues={autoLogin ? ['auto_login'] : []}
              onChange={handleAutoLoginChange}
            />

            {/* 로그인 버튼 */}
            <CuteButton
              onClick={handleLogin}
              loading={isLoading}
              className="w-full"
              variant="primary"
              size="lg"
            >
              로그인
            </CuteButton>
          </div>

          {/* 링크들 */}
          <div className="space-y-4">
            <div className="flex justify-center space-x-6 text-sm">
              <Link href="/find-id" className="text-gray-500 hover:text-purple-600 transition-colors">
                아이디 찾기
              </Link>
              <span className="text-gray-300">|</span>
              <Link href="/find-password" className="text-gray-500 hover:text-purple-600 transition-colors">
                비밀번호 찾기
              </Link>
            </div>
            
            <div className="text-center">
              <span className="text-gray-500 text-sm">아직 회원이 아니신가요? </span>
              <Link href="/signup" className="text-purple-600 hover:text-purple-800 font-medium transition-colors">
                회원가입
              </Link>
            </div>
          </div>
        </CuteCard>
      </motion.div>

      {/* 인증번호 모달 */}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <CuteCard className="max-w-sm mx-auto" padding="lg">
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">인증번호 확인</h3>
                <p className="text-gray-600 text-sm">
                  이메일로 인증번호가 전송되었습니다.<br />
                  인증까지 완료해야 최종 가입이 완료됩니다.
                </p>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  인증번호
                </label>
                <input
                  type="text"
                  placeholder="인증번호를 입력해주세요"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              
              <div className="flex space-x-3">
                <CuteButton onClick={handleVerifyCode} variant="primary" className="flex-1">
                  확인
                </CuteButton>
                <CuteButton
                  onClick={() => handleResendCode('resend')}
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
        onClose={() => {
          setAlertMessage('');
          if (alertAction) {
            alertAction();
            setAlertAction(null);
          }
        }}
      />
    </div>
  );
}