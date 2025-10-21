'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  PartyPopper, Pin, Eye, Calendar, Clock,
  ArrowRight, Sparkles, Star, ImageOff
} from 'lucide-react';
import CuteButton from '@/components/common/button/CuteButton';
import CuteCard from '@/components/common/card/CuteCard';
import CuteBadge from '@/components/common/badge/CuteBadge';
import AdSense from '@/components/common/adsense/AdSense';
import { getEventList } from '@/libs/api/event/eventApi';
import { Event } from '@/libs/interface/api/event/eventResponseInterface';

const ITEMS_PER_PAGE = 10;

export default function EventPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [events, setEvents] = useState<Event[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID || '';

  // isPinned가 'Y'인 이벤트를 pinOrder 순으로 정렬한 고정 이벤트
  const pinnedEvents = events
    .filter(event => event.isPinned === 'Y')
    .sort((a, b) => (a.pinOrder || 0) - (b.pinOrder || 0));

  // isPinned가 'Y'가 아닌 일반 이벤트
  const regularEvents = events.filter(event => event.isPinned !== 'Y');

  useEffect(() => {
    loadEvents();
  }, [currentPage]);

  const loadEvents = async () => {
    setIsLoading(true);
    try {
      const response = await getEventList({ page: currentPage, size: ITEMS_PER_PAGE });
      if (response.resultCode === 200 && response.result) {
        setEvents(Array.isArray(response.result) ? response.result : []);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('이벤트 로드 실패:', error);
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEventClick = (eventId: number) => {
    router.push(`/event/${eventId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
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

      <div className="max-w-4xl mx-auto px-4 py-8 relative z-10">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center space-x-2 mb-4">
            <PartyPopper className="w-8 h-8 text-pink-500" />
            <h1 className="text-4xl font-bold text-gray-900">
              이벤트
            </h1>
            <PartyPopper className="w-8 h-8 text-pink-500" />
          </div>
          <p className="text-gray-600 text-lg">
            PetCrown의 특별한 이벤트를 확인해보세요! 🎉
          </p>
        </motion.div>

        {/* 고정 이벤트 */}
        {pinnedEvents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex items-center space-x-2 mb-4">
              <Pin className="w-6 h-6 text-red-500" />
              <h2 className="text-xl font-bold text-gray-900">진행중인 이벤트</h2>
            </div>

            <CuteCard padding="sm">
              <div className="space-y-1">
                {pinnedEvents.map((event: Event, index: number) => (
                  <motion.div
                    key={event.eventId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    onClick={() => handleEventClick(event.eventId)}
                    className="flex items-center justify-between p-4 hover:bg-pink-50 rounded-2xl cursor-pointer transition-colors duration-200"
                  >
                    {/* 썸네일 */}
                    <div className="flex-shrink-0 mr-4">
                      {event.thumbnailUrl ? (
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100">
                          <img
                            src={event.thumbnailUrl}
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                          <ImageOff className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <Pin className="w-4 h-4 text-red-500" />
                          <CuteBadge variant="danger" size="sm">진행중</CuteBadge>
                        </div>
                        <h3 className="font-bold text-gray-900 line-clamp-1 text-lg">
                          {event.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-xs text-gray-500 mt-2">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(event.startDate).toLocaleDateString('ko-KR')} - {new Date(event.endDate).toLocaleDateString('ko-KR')}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="w-3 h-3" />
                            <span>{event.viewCount}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  </motion.div>
                ))}
              </div>
            </CuteCard>
          </motion.div>
        )}

        {/* 일반 이벤트 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">전체 이벤트</h2>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
            </div>
          ) : (
            <CuteCard padding="sm">
              <div className="space-y-1">
                {adsenseId && (
                  <div className="my-4 py-4">
                    <AdSense
                      adClient={adsenseId}
                      adFormat="auto"
                      fullWidthResponsive={true}
                      style={{ display: 'block', minHeight: '100px' }}
                    />
                  </div>
                )}
                {regularEvents.length > 0 ? (
                  regularEvents.map((event: Event, index: number) => (
                    <>
                      <motion.div
                        key={event.eventId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                        onClick={() => handleEventClick(event.eventId)}
                        className="flex items-center justify-between p-4 hover:bg-purple-50 rounded-2xl cursor-pointer transition-colors duration-200"
                      >
                        {/* 썸네일 */}
                        <div className="flex-shrink-0 mr-4">
                          {event.thumbnailUrl ? (
                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100">
                              <img
                                src={event.thumbnailUrl}
                                alt={event.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                              <ImageOff className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </div>

                        <div className="flex items-center space-x-4 flex-1 min-w-0">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 line-clamp-1 mb-2">
                              {event.title}
                            </h3>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>{new Date(event.startDate).toLocaleDateString('ko-KR')} - {new Date(event.endDate).toLocaleDateString('ko-KR')}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Eye className="w-3 h-3" />
                                <span>{event.viewCount}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      </motion.div>
                      {adsenseId && (index + 1) % 4 === 0 && index !== regularEvents.length - 1 && (
                        <div className="my-4 py-4">
                          <AdSense
                            adClient={adsenseId}
                            adFormat="auto"
                            fullWidthResponsive={true}
                            style={{ display: 'block', minHeight: '100px' }}
                          />
                        </div>
                      )}
                    </>
                  ))
                ) : (
                  <div className="text-center py-20">
                    <PartyPopper className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-xl font-medium text-gray-400">이벤트가 없습니다</p>
                    <p className="text-gray-500 mt-2">새로운 이벤트를 기다려주세요!</p>
                  </div>
                )}
              </div>
            </CuteCard>
          )}
        </motion.div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex justify-center items-center space-x-2 mt-8"
          >
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl bg-white border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-pink-50 transition-colors duration-200"
            >
              <ArrowRight className="w-5 h-5 transform rotate-180" />
            </button>

            <div className="flex space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-10 h-10 rounded-xl font-medium transition-all duration-200 ${
                      currentPage === pageNum
                        ? 'bg-pink-500 text-white shadow-md'
                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-pink-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl bg-white border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-pink-50 transition-colors duration-200"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
