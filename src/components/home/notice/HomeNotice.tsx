'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Megaphone, AlertCircle, TrendingUp, ArrowRight, Calendar, Eye } from 'lucide-react';
import CuteCard from '@/components/common/card/CuteCard';
import CuteButton from '@/components/common/button/CuteButton';
import CuteBadge from '@/components/common/badge/CuteBadge';
import { getNoticeList } from '@/libs/api/notice/noticeApi';
import { Notice } from '@/libs/interface/api/notice/noticeResponseInterface';

export default function HomeNotice() {
  const router = useRouter();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadNotices();
  }, []);

  const loadNotices = async () => {
    setIsLoading(true);
    try {
      const response = await getNoticeList({ page: 1, size: 3 }); // 최신 3개만
      if (response.resultCode === 200 && response.result) {
        setNotices(response.result.notices || []);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  // 로딩 중이거나 공지사항이 없으면 렌더링하지 않음
  if (isLoading || notices.length === 0) return null;

  return (
    <section className="space-y-8">
      {/* 섹션 헤더 */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center space-x-2 mb-4"
        >
          <Megaphone className="w-8 h-8 text-orange-600" />
          <h2 className="text-3xl font-bold text-gray-900">
            공지사항
          </h2>
        </motion.div>
        <p className="text-gray-600 text-lg">
          PetCrown의 최신 소식을 확인하세요!
        </p>
      </div>

      {/* 공지사항 카드들 */}
      <div className="space-y-4">
        {notices.map((notice, index) => (
          <motion.div
            key={notice.noticeId}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <CuteCard hover className="cursor-pointer" onClick={() => router.push(`/notice/${notice.noticeId}`)}>
              <div className="flex items-center space-x-4">
                {/* 중요도 아이콘 */}
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center
                  ${notice.isPinned === 'Y'
                    ? 'bg-gradient-to-r from-red-500 to-red-600'
                    : 'bg-gradient-to-r from-blue-500 to-blue-600'
                  }
                `}>
                  {notice.isPinned === 'Y' ? (
                    <AlertCircle className="w-6 h-6 text-white" />
                  ) : (
                    <Megaphone className="w-6 h-6 text-white" />
                  )}
                </div>

                {/* 공지사항 내용 */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center space-x-3">
                    {notice.isPinned === 'Y' && (
                      <CuteBadge variant="danger" icon={<TrendingUp className="w-4 h-4" />}>
                        중요
                      </CuteBadge>
                    )}
                    <h3 className="font-bold text-lg text-gray-900 truncate hover:text-orange-600 transition-colors duration-200">
                      {notice.title}
                    </h3>
                  </div>

                  {/* 메타 정보 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(notice.createDate).toLocaleDateString('ko-KR')}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="w-3 h-3" />
                        <span>{notice.viewCount.toLocaleString()}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-orange-600 transition-colors duration-200" />
                  </div>
                </div>
              </div>
            </CuteCard>
          </motion.div>
        ))}
      </div>

      {/* 더보기 버튼 */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-center"
      >
        <Link href="/notice">
          <CuteButton
            variant="primary"
            size="lg"
          >
            모든 공지사항 보기
          </CuteButton>
        </Link>
      </motion.div>
    </section>
  );
}
