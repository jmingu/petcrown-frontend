'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  MessageCircle, Plus, Eye,
  ArrowRight
} from 'lucide-react';
import CuteButton from '@/components/common/button/CuteButton';
import CuteCard from '@/components/common/card/CuteCard';
import CuteBadge from '@/components/common/badge/CuteBadge';
import AdSense from '@/components/common/adsense/AdSense';
import { getCommunityList } from '@/libs/api/community/communityApi';

const CATEGORY_MAP: { [key: string]: string } = {
  DAILY: '일상',
  QUESTION: '질문',
  TIP: '팁/정보공유',
};

export default function CommunityPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [posts, setPosts] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID || '';

  const POSTS_PER_PAGE = 5;

  // URL에서 페이지 번호 가져오기
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  useEffect(() => {
    loadPosts();
  }, [currentPage]);

  const loadPosts = async () => {
    setIsLoading(true);
    try {
      const response = await getCommunityList({
        page: currentPage,
        size: POSTS_PER_PAGE,
      });
      if (response.resultCode === 200 && response.result) {
        setPosts(response.result.posts || []);
        setTotalCount(response.result.totalCount || 0);
      }
    } catch (error) {
      setPosts([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    router.push(`/community?page=${page}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePostClick = (postId: number) => {
    router.push(`/community/${postId}?from=page-${currentPage}`);
  };

  // 총 페이지 수 계산
  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/50 via-pink-50/50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* AdSense at the top */}
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
            <MessageCircle className="w-8 h-8 text-blue-500" />
            <h1 className="text-4xl font-bold text-gray-900">
              커뮤니티
            </h1>
            <MessageCircle className="w-8 h-8 text-blue-500" />
          </div>
          <p className="text-gray-600 text-lg">
            반려동물 이야기를 나누고 소통해보세요! 🐾
          </p>
        </motion.div>

        {/* 게시글 작성 버튼 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center md:justify-end mb-6"
        >
          <Link href="/community/register">
            <CuteButton variant="primary" size="lg" icon={<Plus className="w-5 h-5" />}>
              게시글 작성
            </CuteButton>
          </Link>
        </motion.div>

        {/* 게시글 목록 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">전체 게시글</h2>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            </div>
          ) : (
            <CuteCard padding="sm">
              <div className="space-y-1">
                {posts.length > 0 ? (
                  posts.map((post, index) => (
                    <motion.div
                      key={post.postId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      onClick={() => handlePostClick(post.postId)}
                      className="flex items-center justify-between p-4 hover:bg-purple-50 rounded-2xl cursor-pointer transition-colors duration-200"
                    >
                      <div className="flex items-start space-x-4 flex-1 min-w-0">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <CuteBadge variant="default" size="sm">
                              {CATEGORY_MAP[post.category] || post.category}
                            </CuteBadge>
                            {post.isPinned === 'Y' && (
                              <CuteBadge variant="warning" size="sm">📌</CuteBadge>
                            )}
                          </div>

                          <h3 className="font-semibold text-gray-900 line-clamp-1 mb-2">
                            {post.title}
                          </h3>

                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span className="truncate max-w-[150px]">
                              {post.nickname || '알 수 없음'}
                            </span>
                            <span>{new Date(post.createDate).toLocaleDateString('ko-KR')}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 text-xs text-gray-500 flex-shrink-0 ml-4">
                        <div className="flex items-center space-x-1">
                          <Eye className="w-3 h-3" />
                          <span>{post.viewCount}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="w-3 h-3" />
                          <span>{post.commentCount}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-20">
                    <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-xl font-medium text-gray-400">게시글이 없습니다</p>
                    <p className="text-gray-500 mt-2">첫 번째 게시글을 작성해보세요!</p>
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
              className="p-2 rounded-xl bg-white border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50 transition-colors duration-200"
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
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-blue-50'
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
              className="p-2 rounded-xl bg-white border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50 transition-colors duration-200"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
