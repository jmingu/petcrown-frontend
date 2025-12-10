'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Megaphone, Pin, Eye, Calendar, Clock,
  ArrowRight, Sparkles, Star
} from 'lucide-react';
import CuteButton from '@/components/common/button/CuteButton';
import CuteCard from '@/components/common/card/CuteCard';
import CuteBadge from '@/components/common/badge/CuteBadge';
import AdSense from '@/components/common/adsense/AdSense';
import { getNoticeList } from '@/libs/api/notice/noticeApi';
import { Notice } from '@/libs/interface/api/notice/noticeResponseInterface';

const ITEMS_PER_PAGE = 5;

function NoticeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID || '';

  // URL에서 페이지 번호 가져오기
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  // isPinned가 'Y'인 공지사항을 pinOrder 순으로 정렬한 고정 공지사항
  const pinnedNotices = notices
    .filter(notice => notice.isPinned === 'Y')
    .sort((a, b) => (a.pinOrder || 0) - (b.pinOrder || 0));

  // isPinned가 'Y'가 아닌 일반 공지사항
  const regularNotices = notices.filter(notice => notice.isPinned !== 'Y');

  useEffect(() => {
    loadNotices();
  }, [currentPage]);

  const loadNotices = async () => {
    setIsLoading(true);
    try {
      const response = await getNoticeList({ page: currentPage, size: ITEMS_PER_PAGE });
      if (response.resultCode === 200 && response.result) {
        setNotices(response.result.notices || []);
        setTotalCount(response.result.totalCount || 0);
      }
    } catch (error) {
      setNotices([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    router.push(`/notice?page=${page}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNoticeClick = (noticeId: number) => {
    router.push(`/notice/${noticeId}?from=page-${currentPage}`);
  };

  // 총 페이지 수 계산
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/50 via-pink-50/50 to-white">
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
          <Star className="w-8 h-8 text-orange-300 opacity-40" fill="currentColor" />
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
          <Sparkles className="w-6 h-6 text-yellow-300 opacity-50" />
        </motion.div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 relative z-10">
        {/* AdSense - 최상단 */}
        {adsenseId && (
          <div className="mb-6">
            <AdSense
              adClient={adsenseId}
              adFormat="auto"
              fullWidthResponsive={true}
              style={{ display: 'block', minHeight: '100px' }}
            />
          </div>
        )}

        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Megaphone className="w-8 h-8 text-orange-500" />
            <h1 className="text-4xl font-bold text-gray-900">
              공지사항
            </h1>
            <Megaphone className="w-8 h-8 text-orange-500" />
          </div>
          <p className="text-gray-600 text-lg">
            PetCrown의 새로운 소식을 확인해보세요! 📢
          </p>
        </motion.div>

        {/* 고정 공지사항 */}
        {pinnedNotices.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex items-center space-x-2 mb-4">
              <Pin className="w-6 h-6 text-red-500" />
              <h2 className="text-xl font-bold text-gray-900">고정 공지</h2>
            </div>

            <CuteCard padding="sm">
              <div className="space-y-1">
                {pinnedNotices.map((notice: Notice, index: number) => (
                  <motion.div
                    key={notice.noticeId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    onClick={() => handleNoticeClick(notice.noticeId)}
                    className="flex items-center justify-between p-4 hover:bg-orange-50 rounded-2xl cursor-pointer transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      <Pin className="w-5 h-5 text-red-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <CuteBadge variant="danger" size="sm">고정</CuteBadge>
                        </div>
                        <h3 className="font-bold text-gray-900 line-clamp-1 text-lg">
                          {notice.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-xs text-gray-500 mt-2">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(notice.createDate).toLocaleDateString('ko-KR')}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="w-3 h-3" />
                            <span>{notice.viewCount}</span>
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

        {/* 일반 공지사항 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">전체 공지사항</h2>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
            </div>
          ) : (
            <CuteCard padding="sm">
              <div className="space-y-1">
                {regularNotices.length > 0 ? (
                  regularNotices.map((notice: Notice, index: number) => (
                    <motion.div
                      key={notice.noticeId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                        onClick={() => handleNoticeClick(notice.noticeId)}
                        className="flex items-center justify-between p-4 hover:bg-yellow-50 rounded-2xl cursor-pointer transition-colors duration-200"
                      >
                        <div className="flex items-center space-x-4 flex-1 min-w-0">
                          <div className="w-2 h-2 bg-orange-400 rounded-full flex-shrink-0"></div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 line-clamp-1 mb-2">
                              {notice.title}
                            </h3>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>{new Date(notice.createDate).toLocaleDateString('ko-KR')}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Eye className="w-3 h-3" />
                                <span>{notice.viewCount}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-20">
                    <Megaphone className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-xl font-medium text-gray-400">공지사항이 없습니다</p>
                    <p className="text-gray-500 mt-2">새로운 소식을 기다려주세요!</p>
                  </div>
                )}
              </div>
            </CuteCard>
          )}
        </motion.div>

        {/* 페이지네이션 */}
        {totalPages > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex justify-center items-center space-x-2 mt-8"
          >
            {/* 이전 버튼 */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-xl bg-white border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-50 transition-colors duration-200"
            >
              <ArrowRight className="w-5 h-5 transform rotate-180" />
            </button>

            {/* 페이지 번호들 */}
            <div className="flex space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // 현재 페이지를 기준으로 표시할 페이지 범위 계산
                let startPage = Math.max(1, currentPage - 2);
                const endPage = Math.min(totalPages, startPage + 4);

                // 끝에서 5개 미만일 때 시작 페이지 조정
                if (endPage - startPage < 4) {
                  startPage = Math.max(1, endPage - 4);
                }

                const pageNum = startPage + i;

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-10 h-10 rounded-xl font-medium transition-all duration-200 ${
                      currentPage === pageNum
                        ? 'bg-orange-500 text-white shadow-md'
                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-orange-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            {/* 다음 버튼 */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="p-2 rounded-xl bg-white border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-50 transition-colors duration-200"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function NoticePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-purple-50/50 via-pink-50/50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
      </div>
    }>
      <NoticeContent />
    </Suspense>
  );
}
