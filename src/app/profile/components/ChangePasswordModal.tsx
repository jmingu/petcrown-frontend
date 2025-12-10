'use client';

import { useState } from 'react';
import { X, Eye, EyeOff, Lock, Key, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import Modal from '@/components/common/modal/Modal';
import CuteButton from '@/components/common/button/CuteButton';
import Alert from '@/components/common/alert/Alert';
import { changePassword } from '@/libs/api/user/userApi';
import { ChangePasswordRequest } from '@/libs/interface/api/user/userRequestInterface';
import { validatePassword, validatePasswordConfirm, validatePasswordChange } from '@/common/util/passwordValidator';

interface ChangePasswordModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function ChangePasswordModal({ onClose, onSuccess }: ChangePasswordModalProps) {
  const [formData, setFormData] = useState<ChangePasswordRequest>({
    currentPassword: '',
    newPassword: '',
    newPasswordConfirm: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [errors, setErrors] = useState({
    currentPassword: '',
    newPassword: '',
    newPasswordConfirm: '',
  });

  // 입력값 변경 처리
  const handleInputChange = (field: keyof ChangePasswordRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 에러 메시지 초기화
    setErrors(prev => ({ ...prev, [field]: '' }));
  };


  // 폼 유효성 검사
  const validateForm = (): boolean => {
    const newErrors = { currentPassword: '', newPassword: '', newPasswordConfirm: '' };
    let isValid = true;

    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword = '현재 비밀번호를 입력해주세요.';
      isValid = false;
    }

    // 새 비밀번호 유효성 검사
    const passwordError = validatePassword(formData.newPassword);
    if (passwordError) {
      newErrors.newPassword = passwordError;
      isValid = false;
    }

    // 새 비밀번호 확인 검사
    const passwordConfirmError = validatePasswordConfirm(formData.newPassword, formData.newPasswordConfirm);
    if (passwordConfirmError) {
      newErrors.newPasswordConfirm = passwordConfirmError;
      isValid = false;
    }

    // 현재 비밀번호와 새 비밀번호 중복 검사
    const passwordChangeError = validatePasswordChange(formData.currentPassword, formData.newPassword);
    if (passwordChangeError) {
      newErrors.newPassword = passwordChangeError;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // 비밀번호 변경 처리
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await changePassword(formData);
      
      if (response.resultCode === 200) {
        setAlertMessage('비밀번호가 성공적으로 변경되었습니다.');
        setTimeout(() => {
          onClose();
          onSuccess();
        }, 1500);
      } else {
        setAlertMessage(response.resultMessageKo || '비밀번호 변경에 실패했습니다.');
      }
    } catch (error) {
      setAlertMessage('비밀번호 변경 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 비밀번호 보기/숨기기 토글
  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <Modal onClose={onClose}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">비밀번호 변경</h2>
                <p className="text-purple-100 text-sm">보안을 위해 주기적으로 변경해주세요</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 본문 */}
        <div className="p-6 space-y-6">
          {/* 현재 비밀번호 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Lock className="w-4 h-4 inline mr-1" />
              현재 비밀번호
            </label>
            <div className="relative">
              <input
                type={showPasswords.current ? 'text' : 'password'}
                value={formData.currentPassword}
                onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                className={`w-full px-4 py-3 pr-12 border rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                  errors.currentPassword ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="현재 비밀번호"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('current')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700"
              >
                {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.currentPassword}</p>
            )}
          </div>

          {/* 새 비밀번호 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Key className="w-4 h-4 inline mr-1" />
              새 비밀번호
            </label>
            <div className="relative">
              <input
                type={showPasswords.new ? 'text' : 'password'}
                value={formData.newPassword}
                onChange={(e) => handleInputChange('newPassword', e.target.value)}
                className={`w-full px-4 py-3 pr-12 border rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                  errors.newPassword ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="새 비밀번호"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700"
              >
                {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>
            )}
            <p className="text-gray-500 text-xs mt-1">
              4자 이상 입력해주세요
            </p>
          </div>

          {/* 새 비밀번호 확인 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Key className="w-4 h-4 inline mr-1" />
              새 비밀번호 확인
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                value={formData.newPasswordConfirm}
                onChange={(e) => handleInputChange('newPasswordConfirm', e.target.value)}
                className={`w-full px-4 py-3 pr-12 border rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                  errors.newPasswordConfirm ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="비밀번호 재입력"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700"
              >
                {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.newPasswordConfirm && (
              <p className="text-red-500 text-xs mt-1">{errors.newPasswordConfirm}</p>
            )}
          </div>

          {/* 버튼들 */}
          <div className="flex space-x-3 pt-4">
            <CuteButton
              onClick={onClose}
              variant="secondary"
              size="md"
              className="flex-1"
              disabled={isLoading}
            >
              취소
            </CuteButton>
            <CuteButton
              onClick={handleSubmit}
              variant="primary"
              size="md"
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? '변경 중...' : '변경'}
            </CuteButton>
          </div>
        </div>
      </motion.div>

      {/* 알림창 */}
      <Alert
        message={alertMessage}
        onClose={() => setAlertMessage('')}
      />
    </Modal>
  );
}