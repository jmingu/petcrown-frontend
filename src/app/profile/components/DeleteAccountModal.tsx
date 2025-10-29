'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, AlertTriangle } from 'lucide-react';
import CuteButton from '@/components/common/button/CuteButton';
import Input from '@/components/common/input/Input';
import Alert from '@/components/common/alert/Alert';
import { deleteAccount } from '@/libs/api/user/userApi';

interface DeleteAccountModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function DeleteAccountModal({ onClose, onSuccess }: DeleteAccountModalProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteAccount = async () => {
    // 입력 검증
    if (!email || !name || !password) {
      setAlertMessage('모든 필드를 입력해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await deleteAccount({
        email,
        name,
        password,
      });

      if (result.resultCode === 200) {
        setAlertMessage('회원탈퇴가 완료되었습니다.');
        setTimeout(() => {
          onSuccess();
        }, 1500);
      } else {
        setAlertMessage(result.resultMessageKo || '회원탈퇴에 실패했습니다.');
      }
    } catch (error) {
      setAlertMessage('회원탈퇴 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* 배경 오버레이 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* 모달 컨텐츠 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* 헤더 */}
          <div className="bg-gradient-to-r from-red-500 to-pink-500 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Trash2 className="w-6 h-6 text-white" />
                <h2 className="text-xl font-bold text-white">회원탈퇴</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* 경고 메시지 */}
          <div className="px-6 py-4 bg-red-50 border-l-4 border-red-500">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">
                  회원탈퇴 시 모든 데이터가 삭제됩니다.
                </p>
                <p className="text-xs text-red-600 mt-1">
                  탈퇴 후에는 복구가 불가능하니 신중하게 결정해주세요.
                </p>
              </div>
            </div>
          </div>

          {/* 폼 */}
          <div className="px-6 py-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이메일
              </label>
              <Input
                type="email"
                name="email"
                value={email}
                onChange={(value) => setEmail(value)}
                placeholder="가입한 이메일을 입력하세요"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이름
              </label>
              <Input
                type="text"
                name="name"
                value={name}
                onChange={(value) => setName(value)}
                placeholder="가입한 이름을 입력하세요"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호
              </label>
              <Input
                type="password"
                name="password"
                value={password}
                onChange={(value) => setPassword(value)}
                placeholder="비밀번호를 입력하세요"
              />
            </div>
          </div>

          {/* 버튼 */}
          <div className="px-6 pb-6 flex flex-col sm:flex-row gap-3">
            <CuteButton
              onClick={onClose}
              variant="secondary"
              className="flex-1 w-full"
              disabled={isLoading}
            >
              취소
            </CuteButton>
            <CuteButton
              onClick={handleDeleteAccount}
              variant="danger"
              className="flex-1 w-full"
              disabled={isLoading}
              icon={<Trash2 className="w-4 h-4" />}
            >
              {isLoading ? '처리 중...' : '탈퇴'}
            </CuteButton>
          </div>
        </motion.div>
      </div>

      {/* 알림창 */}
      <Alert
        message={alertMessage}
        onClose={() => setAlertMessage('')}
      />
    </>
  );
}
