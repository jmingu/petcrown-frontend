'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Eye, Calendar, PartyPopper,
  Star, Sparkles, Pin, Gift
} from 'lucide-react';
import CuteButton from '@/components/common/button/CuteButton';
import CuteCard from '@/components/common/card/CuteCard';
import CuteBadge from '@/components/common/badge/CuteBadge';
import AdSense from '@/components/common/adsense/AdSense';
import { getEventDetail } from '@/libs/api/event/eventApi';
import { EventDetailResponse } from '@/libs/interface/api/event/eventResponseInterface';

export default function EventDetail() {
  const router = useRouter();
  const params = useParams();
  const [event, setEvent] = useState<EventDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID || '';

  useEffect(() => {
    loadEventDetail();
  }, [params.id]);

  const loadEventDetail = async () => {
    setIsLoading(true);
    try {
      const response = await getEventDetail(Number(params.id));
      if (response.resultCode === 200 && response.result) {
        setEvent(response.result);
      }
    } catch (error) {
      console.error('이벤트 상세 조회 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <CuteCard className="text-center" padding="lg">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-300 to-purple-400 rounded-full flex items-center justify-center mx-auto">
              <PartyPopper className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-600">이벤트를 찾을 수 없습니다</h2>
            <CuteButton onClick={() => router.back()} variant="primary">
              돌아가기
            </CuteButton>
          </div>
        </CuteCard>
      </div>
    );
  }

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
          <Star className="w-8 h-8 text-pink-300 opacity-40" fill="currentColor" />
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

      <div className="max-w-4xl mx-auto relative z-10">
        {/* 뒤로가기 버튼 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <CuteButton
            onClick={() => router.back()}
            variant="secondary"
            size="md"
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            목록으로
          </CuteButton>
        </motion.div>

        {/* 이벤트 메인 카드 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <CuteCard className="space-y-6" padding="lg">
            {/* 이벤트 헤더 */}
            <div className="space-y-4">
              {/* 고정 여부 표시 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {event.isPinned === 'Y' ? (
                    <CuteBadge
                      variant="danger"
                      size="md"
                      icon={<Pin className="w-4 h-4" />}
                    >
                      진행중인 이벤트
                    </CuteBadge>
                  ) : (
                    <CuteBadge
                      variant="info"
                      size="md"
                      icon={<Gift className="w-4 h-4" />}
                    >
                      이벤트
                    </CuteBadge>
                  )}
                </div>
              </div>

              {/* 제목 */}
              <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                {event.title}
              </h1>

              {/* 메타 정보 */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center">
                      <PartyPopper className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold text-gray-700">관리자</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(event.startDate).toLocaleDateString('ko-KR')} - {new Date(event.endDate).toLocaleDateString('ko-KR')}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>{event.viewCount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 이벤트 내용 */}
            <div className="prose prose-lg max-w-none">
              {event.contentType === 'HTML' ? (
                <div
                  className="text-gray-800 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: event.content }}
                />
              ) : (
                <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {event.content}
                </div>
              )}
            </div>

            {/* 구분선 */}
            <div className="border-t border-gray-100"></div>

            {/* 액션 버튼 */}
            <div className="flex justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <CuteButton
                  onClick={() => router.push('/event')}
                  variant="primary"
                  size="lg"
                  icon={<PartyPopper className="w-5 h-5" />}
                >
                  다른 이벤트 보기
                </CuteButton>
              </motion.div>
            </div>
          </CuteCard>
        </motion.div>

        {/* AdSense at the end */}
        {adsenseId && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8"
          >
            <AdSense
              adClient={adsenseId}
              adFormat="auto"
              fullWidthResponsive={true}
              style={{ display: 'block', margin: '2rem 0', minHeight: '100px' }}
            />
          </motion.div>
        )}

      </div>
    </div>
  );
}
