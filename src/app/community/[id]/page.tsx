'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Eye, Calendar, User, MessageCircle,
  Sparkles, Heart
} from 'lucide-react';
import CuteButton from '@/components/common/button/CuteButton';
import CuteCard from '@/components/common/card/CuteCard';
import CuteBadge from '@/components/common/badge/CuteBadge';
import Alert from '@/components/common/alert/Alert';
import AdSense from '@/components/common/adsense/AdSense';
import Comment from '@/app/community/commponents/Comment';
import { getCommunityDetail, getCommentList } from '@/libs/api/community/communityApi';
import { CommunityDetailResponse } from '@/libs/interface/api/community/communityResponseInterface';
import Image from 'next/image';

const CATEGORY_MAP: { [key: string]: string } = {
  DAILY: '일상',
  QUESTION: '질문',
  TIP: '팁/정보공유',
};

export default function PostDetail() {
  const router = useRouter();
  const params = useParams();
  const [post, setPost] = useState<CommunityDetailResponse | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState('');
  const [needsLogin, setNeedsLogin] = useState(false);
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID || '';

  useEffect(() => {
    // 로그인 체크
    const accessToken = localStorage.getItem('a_t');
    if (!accessToken) {
      setAlertMessage('로그인이 필요한 페이지입니다.');
      setNeedsLogin(true);
      return;
    }

    loadPostDetail();
    loadComments();
  }, [params.id]);

  const loadPostDetail = async () => {
    setIsLoading(true);
    try {
      const response = await getCommunityDetail(Number(params.id));
      if (response.resultCode === 200 && response.result) {
        setPost(response.result);
      }
    } catch (error) {
      console.error('게시글 상세 조회 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      const response = await getCommentList(Number(params.id), 1, 100);
      if (response.resultCode === 200 && response.result) {
        setComments(Array.isArray(response.result) ? response.result : []);
      }
    } catch (error) {
      console.error('댓글 조회 실패:', error);
    }
  };

  // 로그인이 필요한 경우
  if (needsLogin) {
    return (
      <>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <CuteCard className="text-center" padding="lg">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                <User className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-600">로그인이 필요합니다</h2>
              <p className="text-gray-500">커뮤니티 상세보기는 로그인 후 이용할 수 있습니다.</p>
            </div>
          </CuteCard>
        </div>
        <Alert
          message={alertMessage}
          onClose={() => {
            setAlertMessage('');
            router.push('/login');
          }}
        />
      </>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <CuteCard className="text-center" padding="lg">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full flex items-center justify-center mx-auto">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-600">게시글을 찾을 수 없습니다</h2>
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

        {/* 게시글 메인 카드 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <CuteCard className="space-y-6" padding="lg">
            {/* 게시글 헤더 */}
            <div className="space-y-4">
              {/* 카테고리와 메타 정보 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CuteBadge variant="default" size="md">
                    {CATEGORY_MAP[post.category] || post.category}
                  </CuteBadge>
                  {post.isPinned === 'Y' && (
                    <CuteBadge variant="warning" size="md">📌 고정</CuteBadge>
                  )}
                </div>
              </div>

              {/* 제목 */}
              <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                {post.title}
              </h1>

              {/* 작성자 정보 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span className="font-medium text-gray-700">{post.nickname || '알 수 없음'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(post.createDate).toLocaleDateString('ko-KR')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{post.viewCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 구분선 */}
            <div className="border-t border-gray-100"></div>

            {/* 게시글 내용 */}
            <div className="prose prose-lg max-w-none">
              {post.contentType === 'HTML' ? (
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              ) : (
                <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {post.content}
                </div>
              )}
            </div>

            {/* 이미지들 */}
            {post.imageUrls && post.imageUrls.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {post.imageUrls.map((imageUrl, index) => (
                  <div key={index} className="relative w-full h-64 rounded-2xl overflow-hidden">
                    <Image
                      src={imageUrl}
                      alt={`게시글 이미지 ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* 구분선 */}
            <div className="border-t border-gray-100"></div>

            {/* 상호작용 정보 */}
            <div className="flex items-center space-x-2 text-gray-500">
              <MessageCircle className="w-5 h-5" />
              <span>댓글 {post.commentCount}</span>
            </div>
          </CuteCard>
        </motion.div>

        {/* AdSense at the end of content */}
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

        {/* 댓글 섹션 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8"
        >
          <Comment postId={post.postId} comments={comments} onCommentAdded={loadComments} />
        </motion.div>
      </div>
    </div>
  );
}
