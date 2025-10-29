'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MessageCircle, Eye, ArrowRight, Clock } from 'lucide-react';
import CuteCard from '@/components/common/card/CuteCard';
import CuteButton from '@/components/common/button/CuteButton';
import CuteBadge from '@/components/common/badge/CuteBadge';
import { getCommunityList } from '@/libs/api/community/communityApi';
import { CommunityPost } from '@/libs/interface/api/community/communityResponseInterface';

export default function HomeCommunity() {
  const router = useRouter();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setIsLoading(true);
    try {
      const response = await getCommunityList({ page: 1, size: 3 }); // 최신 3개
      if (response.resultCode === 200 && response.result) {
        setPosts(response.result.posts || []);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'question':
        return 'from-blue-500 to-blue-600';
      case 'tip':
        return 'from-green-500 to-green-600';
      case 'daily':
        return 'from-purple-500 to-purple-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'question':
        return '🤔';
      case 'tip':
        return '💡';
      case 'daily':
        return '📝';
      default:
        return '💬';
    }
  };

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
          <MessageCircle className="w-8 h-8 text-purple-600" />
          <h2 className="text-3xl font-bold text-gray-900">
            최근 게시글
          </h2>
        </motion.div>
        <p className="text-gray-600 text-lg">
          반려인들의 생생한 이야기를 확인해보세요!
        </p>
      </div>

      {/* 게시글 카드들 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
          </div>
        ) : posts.length > 0 ? posts.map((post, index) => (
          <motion.div
            key={post.postId}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <CuteCard hover className="h-full cursor-pointer" onClick={() => router.push(`/community/${post.postId}`)}>
              <div className="space-y-4">
                {/* 게시글 내용 */}
                <div className="space-y-3">
                  {/* 카테고리 배지 */}
                  <div className="flex items-center justify-between">
                    <CuteBadge variant="cute">
                      {getCategoryIcon(post.category)} {post.category}
                    </CuteBadge>
                    {post.isPinned === 'Y' && (
                      <CuteBadge variant="success">📌 고정</CuteBadge>
                    )}
                  </div>

                  <h3 className="font-bold text-lg text-gray-900 line-clamp-2 hover:text-purple-600 transition-colors duration-200">
                    {post.title}
                  </h3>

                  {/* 작성자 정보 */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium truncate max-w-[100px]">
                        {post.nickname || '알 수 없음'}
                      </span>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(post.createDate).toLocaleDateString('ko-KR')}</span>
                      </div>
                    </div>
                  </div>

                  {/* 통계 정보 */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.commentCount}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-gray-400">
                      <Eye className="w-3 h-3" />
                      <span>{post.viewCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CuteCard>
          </motion.div>
        )) : (
          <div className="col-span-full text-center py-12">
            <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">준비중입니다</p>
          </div>
        )}
      </div>

      {/* 더보기 버튼 */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-center"
      >
        <Link href="/community">
          <CuteButton 
            variant="primary" 
            size="lg" 
            icon={<ArrowRight className="w-5 h-5" />}
          >
            모든 게시글 보기
          </CuteButton>
        </Link>
      </motion.div>
    </section>
  );
}
