'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Send, ArrowLeft, Heart, Sparkles, MessageCircle } from 'lucide-react';
import CuteButton from '@/components/common/button/CuteButton';
import CuteCard from '@/components/common/card/CuteCard';

export default function ContactPage() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('kjkj173173@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
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

      {/* 뒤로가기 버튼 */}
      <div className="max-w-2xl mx-auto relative z-10 mb-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center text-purple-600 hover:text-purple-800 transition-colors duration-200"
        >
          ← 돌아가기
        </button>
      </div>

      <div className="max-w-2xl mx-auto relative z-10">

        {/* 메인 카드 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
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
                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
              </motion.div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                문의하기
              </h1>
              <p className="text-gray-600">
                궁금하신 사항이나 건의사항을 보내주세요
              </p>
            </div>

            {/* 이메일 정보 */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center space-x-2">
                  <Mail className="w-6 h-6 text-purple-600" />
                  <h2 className="text-xl font-bold text-gray-900">이메일 문의</h2>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <p className="text-gray-600 mb-2 text-sm">문의 이메일</p>
                  <a
                    href="mailto:kjkj173173@gmail.com"
                    className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-purple-600 hover:text-purple-800 transition-colors duration-200 break-all"
                  >
                    kjkj173173@gmail.com
                  </a>
                </div>

                <CuteButton
                  onClick={handleCopyEmail}
                  variant={copied ? "secondary" : "primary"}
                  size="lg"
                  icon={copied ? <Mail className="w-5 h-5" /> : <Send className="w-5 h-5" />}
                  className="w-full"
                >
                  {copied ? '복사되었습니다!' : '복사하기'}
                </CuteButton>
              </div>
            </div>

            {/* 안내 사항 */}
            <div className="bg-yellow-50 rounded-2xl p-6">
              <div className="space-y-3">
                <h3 className="font-bold text-yellow-900 flex items-center space-x-2">
                  <Sparkles className="w-5 h-5" />
                  <span>문의 안내</span>
                </h3>
                <ul className="space-y-2 text-sm text-yellow-800">
                  <li className="flex items-start space-x-2">
                    <span className="text-yellow-600 mt-0.5">•</span>
                    <span>서비스 이용 중 불편사항이나 개선 의견을 자유롭게 보내주세요.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-yellow-600 mt-0.5">•</span>
                    <span>회원정보, 반려동물 정보 등 개인정보가 포함된 내용은 이메일로 문의해주세요.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-yellow-600 mt-0.5">•</span>
                    <span>순차적으로 답변드리고 있으니 조금만 기다려주세요! 😊</span>
                  </li>
                </ul>
              </div>
            </div>
          </CuteCard>
        </motion.div>
      </div>
    </div>
  );
}
