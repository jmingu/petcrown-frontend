'use client';
export const dynamic = 'force-dynamic';
export const runtime = 'edge'; // 또는 'nodejs'

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import CuteCard from '@/components/common/card/CuteCard';
import CuteButton from '@/components/common/button/CuteButton';
import api from '@/libs/axiosInstance';

export default function VerifyVotingEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('이메일 인증을 처리중입니다...');

  useEffect(() => {
    const verifyEmail = async () => {
      const email = searchParams.get('email');
      const token = searchParams.get('token');

      if (!email || !token) {
        setStatus('error');
        setMessage('이메일 또는 토큰 정보가 없습니다.');
        return;
      }

      try {
        const response = await api.get('/users/v1/verify-voting-email', {
          params: { email, token }
        });

        if (response.data.resultCode === 200) {
          setStatus('success');
          setMessage('이메일 인증이 완료되었습니다! 이제 투표하실 수 있습니다.');
        } else {
          setStatus('error');
          setMessage(response.data.resultMessageKo || '이메일 인증에 실패했습니다.');
        }
      } catch (error: any) {
        setStatus('error');
        if (error.response?.data?.resultMessageKo) {
          setMessage(error.response.data.resultMessageKo);
        } else {
          setMessage('이메일 인증 중 오류가 발생했습니다.');
        }
      }
    };

    verifyEmail();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <CuteCard padding="lg">
          <div className="text-center space-y-6">
            {/* 아이콘 */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex justify-center"
            >
              {status === 'loading' && (
                <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                  <Loader className="w-10 h-10 text-white animate-spin" />
                </div>
              )}
              {status === 'success' && (
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
              )}
              {status === 'error' && (
                <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-pink-400 rounded-full flex items-center justify-center">
                  <XCircle className="w-10 h-10 text-white" />
                </div>
              )}
            </motion.div>

            {/* 제목 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {status === 'loading' && '인증 처리중'}
                {status === 'success' && '인증 완료! 🎉'}
                {status === 'error' && '인증 실패'}
              </h1>
              <p className="text-gray-600 text-lg">
                {message}
              </p>
            </motion.div>

            {/* 버튼 */}
            {status !== 'loading' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="space-y-3"
              >
                {status === 'success' && (
                  <CuteButton
                    onClick={() => router.push('/vote')}
                    variant="primary"
                    size="lg"
                    className="w-full"
                  >
                    투표하러 가기
                  </CuteButton>
                )}
                <CuteButton
                  onClick={() => router.push('/')}
                  variant="secondary"
                  size="lg"
                  className="w-full"
                >
                  홈으로 돌아가기
                </CuteButton>
              </motion.div>
            )}

            {/* 추가 안내 */}
            {status === 'success' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-green-50 rounded-2xl p-4"
              >
                <p className="text-sm text-green-800">
                  ✅ 오늘 하루 동안 이메일 인증 없이 투표하실 수 있습니다.
                </p>
              </motion.div>
            )}

            {status === 'error' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-red-50 rounded-2xl p-4"
              >
                <p className="text-sm text-red-800">
                  💡 인증 링크가 만료되었거나 이미 사용된 링크일 수 있습니다.<br />
                  다시 투표를 시도해주세요.
                </p>
              </motion.div>
            )}
          </div>
        </CuteCard>
      </motion.div>
    </div>
  );
}
