'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Mail, User, Calendar, ArrowLeft, Heart, Sparkles, Key } from 'lucide-react';
import CuteButton from '@/components/common/button/CuteButton';
import CuteCard from '@/components/common/card/CuteCard';
import DateInput from '@/components/common/input/DateInput';
import Alert from '@/components/common/alert/Alert';

export default function FindPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFindPassword = async () => {
    if (!email.trim()) {
      setAlertMessage('이메일을 입력해주세요.');
      return;
    }
    if (!name.trim()) {
      setAlertMessage('이름을 입력해주세요.');
      return;
    }
    if (!birthDate.trim()) {
      setAlertMessage('생년월일을 입력해주세요.');
      return;
    }

    if (!email.includes('@')) {
      setAlertMessage('올바른 이메일 형식을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: 백엔드 API 연결
      await new Promise(resolve => setTimeout(resolve, 1000)); // 임시 지연
      setAlertMessage('임시 비밀번호를 이메일로 전송했습니다! 📧');
    } catch (error) {
      setAlertMessage('비밀번호 찾기 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
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
              <div className="w-16 h-16 bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center">
                <Key className="w-8 h-8 text-white" />
              </div>
            </motion.div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
              비밀번호 찾기
            </h1>
            <p className="text-gray-600">
              가입 정보를 입력하여 비밀번호를 재설정하세요 🔐
            </p>
          </div>

          {/* 정보 입력 폼 */}
          <div className="space-y-4">
            {/* 이메일 입력 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                이메일 주소
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="가입할 때 사용한 이메일"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* 이름 입력 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                이름
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="실명을 입력해주세요"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                  maxLength={20}
                />
              </div>
            </div>

            {/* 생년월일 입력 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                생년월일
              </label>
              <DateInput
                value={birthDate}
                onChange={(value) => setBirthDate(value)}
                placeholder="YYYY-MM-DD"
                minDate={new Date('1900-01-01')}
                maxDate={new Date()}
              />
            </div>

            <CuteButton
              onClick={handleFindPassword}
              loading={isLoading}
              className="w-full"
              variant="primary"
              size="lg"
              icon={<Lock className="w-5 h-5" />}
            >
              비밀번호 찾기
            </CuteButton>
          </div>

          {/* 보안 안내 */}
          <div className="bg-yellow-50 rounded-2xl p-4">
            <div className="flex items-start space-x-3">
              <Lock className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <h3 className="font-semibold text-yellow-900">보안 안내</h3>
                <p className="text-sm text-yellow-700">
                  입력하신 정보가 일치하면 임시 비밀번호를<br />
                  이메일로 전송해드립니다. 로그인 후 반드시<br />
                  새로운 비밀번호로 변경해주세요.
                </p>
              </div>
            </div>
          </div>

          {/* 링크들 */}
          <div className="flex justify-center space-x-6 text-sm">
            <button
              onClick={() => router.push('/find-id')}
              className="text-pink-600 hover:text-pink-800 transition-colors"
            >
              아이디 찾기
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={() => router.push('/login')}
              className="text-pink-600 hover:text-pink-800 transition-colors"
            >
              로그인
            </button>
          </div>
        </CuteCard>

        {/* 뒤로가기 버튼 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6"
        >
          <CuteButton
            onClick={() => router.back()}
            variant="secondary"
            size="md"
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            돌아가기
          </CuteButton>
        </motion.div>
      </motion.div>

      {/* 알림창 */}
      <Alert
        message={alertMessage}
        onClose={() => setAlertMessage('')}
      />
    </div>
  );
}
