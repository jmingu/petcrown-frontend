'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Heart, Star, Crown, Sparkles } from 'lucide-react';
import CuteButton from '@/components/common/button/CuteButton';

export default function HomeBanner() {
  return (
    <div className="relative overflow-hidden bg-white border-b border-gray-100">
      {/* 깔끔한 배경 패턴 */}
      <div className="absolute inset-0 bg-gray-50/30">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-50 rounded-full opacity-40"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-50 rounded-full opacity-30"></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-pink-50 rounded-full opacity-50"></div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Crown className="w-10 h-10 text-yellow-500" />
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
                PetCrown
              </h1>
            </div>
            
            <p className="text-lg md:text-2xl text-gray-700 mb-2 font-medium break-keep">
              우리 반려동물이 세상에서 제일 귀여워요! 💕
            </p>
            <p className="text-base md:text-xl text-gray-600 mb-8 break-keep">
              투표하고, 공유하고, 함께 소통해보세요
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
          >
            <Link href="/vote">
              <CuteButton variant="primary" size="lg">
                투표 참여하기
              </CuteButton>
            </Link>

            <Link href="/community">
              <CuteButton variant="secondary" size="lg">
                커뮤니티 구경하기
              </CuteButton>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
