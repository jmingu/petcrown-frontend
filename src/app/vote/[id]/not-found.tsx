'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, ArrowLeft, Search } from 'lucide-react';
import CuteButton from '@/components/common/button/CuteButton';
import CuteCard from '@/components/common/card/CuteCard';

export default function VoteNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <CuteCard className="text-center p-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Search className="w-10 h-10 text-white" />
            </motion.div>

            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              투표를 찾을 수 없습니다
            </h1>
            
            <p className="text-gray-600 mb-6 leading-relaxed">
              요청하신 투표가 존재하지 않거나 삭제되었을 수 있습니다.
              다른 귀여운 반려동물들의 투표를 확인해보세요!
            </p>

            <div className="space-y-3">
              <Link href="/vote">
                <CuteButton 
                  variant="primary" 
                  size="lg" 
                  className="w-full"
                  icon={<Heart className="w-5 h-5" />}
                >
                  투표 목록 보기
                </CuteButton>
              </Link>
              
              <Link href="/">
                <CuteButton 
                  variant="secondary" 
                  size="md" 
                  className="w-full"
                  icon={<ArrowLeft className="w-4 h-4" />}
                >
                  홈으로 돌아가기
                </CuteButton>
              </Link>
            </div>

            {/* 귀여운 장식 요소들 */}
            <div className="absolute top-4 left-4 w-2 h-2 bg-purple-200 rounded-full opacity-40"></div>
            <div className="absolute top-8 left-8 w-1 h-1 bg-pink-200 rounded-full opacity-60"></div>
            <div className="absolute bottom-4 right-4 w-2 h-2 bg-purple-200 rounded-full opacity-30"></div>
            <div className="absolute bottom-8 right-8 w-1 h-1 bg-pink-200 rounded-full opacity-50"></div>
          </CuteCard>
        </motion.div>
      </div>
    </div>
  );
}