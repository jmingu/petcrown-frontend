'use client';

import { useState } from 'react';
import { X, Mail, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CuteButton from '@/components/common/button/CuteButton';
import Alert from '@/components/common/alert/Alert';
import { doVote } from '@/libs/api/vote/voteApi';
import { sendVotingVerificationEmail, checkVerifiedEmailToday } from '@/libs/api/user/userApi';

interface EmailVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  voteId: number;
  petName: string;
  onVoteSuccess: () => void;
}

export default function EmailVerificationModal({
  isOpen,
  onClose,
  voteId,
  petName,
  onVoteSuccess
}: EmailVerificationModalProps) {
  const [email, setEmail] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error'>('error');

  const handleSendVerification = async () => {
    if (!email) {
      setAlertMessage('이메일을 입력해주세요.');
      setAlertType('error');
      return;
    }

    // 이메일 유효성 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setAlertMessage('올바른 이메일 형식을 입력해주세요.');
      setAlertType('error');
      return;
    }

    setIsVerifying(true);
    try {
      const response = await sendVotingVerificationEmail({ email });

      if (response.resultCode === 200) {
        setAlertMessage('인증 이메일이 발송되었습니다. 이메일을 확인해주세요.');
        setAlertType('success');
      } else {
        setAlertMessage(response.resultMessageKo || '이메일 인증 발송에 실패했습니다. 다시 시도해주세요.');
        setAlertType('error');
      }
    } catch (error) {
      setAlertMessage('이메일 인증 발송에 실패했습니다.');
      setAlertType('error');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVote = async () => {
    if (!email) {
      setAlertMessage('이메일을 입력해주세요.');
      setAlertType('error');
      return;
    }

    setIsVoting(true);
    try {
      // 1. 오늘 인증된 이메일인지 확인
      const verificationCheck = await checkVerifiedEmailToday(email);

      if (verificationCheck.resultCode !== 200) {
        setAlertMessage(verificationCheck.resultMessageKo || '이메일 인증이 완료되지 않았습니다. 먼저 이메일 인증을 완료해주세요.');
        setAlertType('error');
        setIsVoting(false);  
        return;
      }

      // 2. 투표하기
      const voteResponse = await doVote(voteId, { email });

      if (voteResponse.resultCode === 200) {
        setAlertMessage('완료되었습니다!');
        setAlertType('success');
        // 투표 성공 시 페이지 새로고침
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        setAlertMessage(voteResponse.resultMessageKo || '투표에 실패했습니다. 다시 시도해주세요.');
        setAlertType('error');
        setIsVoting(false);
      }
    } catch (error) {
      setAlertMessage('투표 중 오류가 발생했습니다.');
      setAlertType('error');
      setIsVoting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 300,
            duration: 0.3
          }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-md mx-auto relative overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 헤더 */}
          <div className="relative bg-gradient-to-r from-purple-100 to-pink-100 p-6">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {petName}에게 투표하기
              </h2>
              <p className="text-gray-600">
                이메일 인증 후 투표해주세요
              </p>
            </div>
          </div>

          {/* 본문 */}
          <div className="p-6 space-y-6">
            {/* 이메일 입력 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                이메일 주소
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* 안내 메시지 */}
            <div className="bg-blue-50 rounded-2xl p-4">
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-1">투표 절차</p>
                  <ol className="list-decimal list-inside space-y-1 text-xs">
                    <li>이메일 주소를 입력하고 "인증하기" 버튼을 클릭</li>
                    <li>이메일로 받은 인증 링크를 클릭하여 인증 완료</li>
                    <li>"투표하기" 버튼을 클릭하여 투표 완료</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* 버튼들 */}
            <div className="space-y-3">
              {/* 인증 버튼 */}
              <CuteButton
                onClick={handleSendVerification}
                loading={isVerifying}
                variant="secondary"
                size="lg"
                className="w-full"
                disabled={!email || isVerifying}
                icon={<Mail className="w-5 h-5" />}
              >
                {isVerifying ? '인증 메일 발송 중...' : '이메일 인증하기'}
              </CuteButton>

              {/* 투표 버튼 */}
              <CuteButton
                onClick={handleVote}
                loading={isVoting}
                variant="primary"
                size="lg"
                className="w-full"
                disabled={!email || isVoting}
              >
                {isVoting ? '투표 중...' : '투표하기'}
              </CuteButton>
            </div>

            {/* 주의사항 */}
            <div className="text-center">
              <p className="text-xs text-gray-500">
                하루에 한 번만 투표할 수 있습니다
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* 알림 메시지 */}
      {alertMessage && (
        <Alert
          message={alertMessage}
          type={alertType}
          onClose={() => setAlertMessage('')}
        />
      )}
    </AnimatePresence>
  );
}