'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { PenTool, FileText, ArrowLeft, Save, X, Upload, Image as ImageIcon } from 'lucide-react';
import CuteButton from '@/components/common/button/CuteButton';
import CuteCard from '@/components/common/card/CuteCard';
import Alert from '@/components/common/alert/Alert';
import { getCommunityDetail, updateCommunityPost } from '@/libs/api/community/communityApi';
import { CommunityDetailResponse } from '@/libs/interface/api/community/communityResponseInterface';

export default function CommunityEdit() {
  const router = useRouter();
  const params = useParams();
  const postId = Number(params.id);

  const [post, setPost] = useState<CommunityDetailResponse | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    loadPostData();
  }, [postId]);

  const loadPostData = async () => {
    try {
      const response = await getCommunityDetail(postId);
      if (response.resultCode === 200 && response.result) {
        const postData = response.result;

        // 작성자 확인
        if (postData.postWriteYn !== 'Y') {
          setAlertMessage('수정 권한이 없습니다.');
          setTimeout(() => router.push(`/community/${postId}`), 1500);
          return;
        }

        setPost(postData);
        setTitle(postData.title);
        setCategory(postData.category);
        setContent(postData.content);

        // 기존 이미지 미리보기 설정
        if (postData.imageUrls && postData.imageUrls.length > 0) {
          setImagePreviews(postData.imageUrls);
        }
      } else {
        setAlertMessage('게시글을 불러올 수 없습니다.');
        setTimeout(() => router.push('/community'), 1500);
      }
    } catch (error) {
      setAlertMessage('게시글을 불러오는 중 오류가 발생했습니다.');
      setTimeout(() => router.push('/community'), 1500);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0]; // 첫 번째 파일만 사용

    setImages([file]); // 배열로 유지하되 1개만

    // 이미지 미리보기 생성
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreviews([reader.result as string]);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImages([]);
    setImagePreviews([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setAlertMessage('제목을 입력해주세요.');
      return;
    }
    if (!category.trim()) {
      setAlertMessage('카테고리를 선택해주세요.');
      return;
    }
    if (!content.trim()) {
      setAlertMessage('내용을 입력해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await updateCommunityPost(postId, {
        title,
        category,
        content,
        contentType: 'TEXT',
        images: images.length > 0 ? images : undefined,
      });

      if (response.resultCode === 200) {
        setAlertMessage('게시글이 성공적으로 수정되었습니다! 🎉');
        setTimeout(() => {
          router.push(`/community/${postId}`);
        }, 1500);
      } else {
        setAlertMessage(response.resultMessageKo || '게시글 수정에 실패했습니다.');
      }
    } catch (error) {
      setAlertMessage('게시글 수정 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto relative z-10">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mr-4">
              <PenTool className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                게시글 수정
              </h1>
              <p className="text-gray-600 mt-2">
                게시글 내용을 수정해보세요
              </p>
            </div>
          </div>
        </motion.div>

        {/* 작성 폼 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <CuteCard className="space-y-6" padding="lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 제목 입력 */}
              <div className="space-y-3">
                <label className="block text-lg font-semibold text-gray-800 flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-purple-600" />
                  <span>제목</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="제목을 입력해주세요"
                  maxLength={100}
                />
                <div className="text-right text-sm text-gray-500">
                  {title.length}/100
                </div>
              </div>

              {/* 카테고리 선택 */}
              <div className="space-y-3">
                <label className="block text-lg font-semibold text-gray-800 flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-purple-600" />
                  <span>카테고리</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">카테고리를 선택해주세요</option>
                  <option value="DAILY">일상</option>
                  <option value="QUESTION">질문</option>
                  <option value="TIP">팁/정보공유</option>
                </select>
              </div>

              {/* 내용 입력 */}
              <div className="space-y-3">
                <label className="block text-lg font-semibold text-gray-800 flex items-center space-x-2">
                  <PenTool className="w-5 h-5 text-purple-600" />
                  <span>내용</span>
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="반려동물과의 소중한 이야기를 들려주세요!"
                  rows={8}
                  maxLength={1000}
                />
                <div className="text-right text-sm text-gray-500">
                  {content.length}/1000
                </div>
              </div>

              {/* 이미지 업로드 */}
              <div className="space-y-3">
                <label className="block text-lg font-semibold text-gray-800 flex items-center space-x-2">
                  <ImageIcon className="w-5 h-5 text-purple-600" />
                  <span>이미지 (선택사항)</span>
                </label>

                {/* 이미지 미리보기 */}
                {imagePreviews.length > 0 ? (
                  <div className="relative group">
                    <img
                      src={imagePreviews[0]}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-xl border-2 border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center justify-center w-full h-64 px-4 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-all duration-200">
                    <div className="text-center">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">클릭하여 이미지 업로드</p>
                      <p className="text-xs text-gray-400 mt-1">JPG, PNG 파일</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* 버튼들 */}
              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 pt-6">
                <CuteButton
                  variant="primary"
                  size="md"
                  loading={isLoading}
                  icon={<Save className="w-4 h-4 sm:w-5 sm:h-5" />}
                  className="w-full sm:w-auto sm:min-w-32 text-sm sm:text-base"
                >
                  수정 완료
                </CuteButton>

                <CuteButton
                  onClick={() => router.push(`/community/${postId}`)}
                  variant="secondary"
                  size="md"
                  icon={<X className="w-4 h-4 sm:w-5 sm:h-5" />}
                  className="w-full sm:w-auto sm:min-w-32 text-sm sm:text-base"
                  disabled={isLoading}
                >
                  취소
                </CuteButton>
              </div>
            </form>
          </CuteCard>
        </motion.div>

        {/* 뒤로가기 버튼 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8"
        >
          <CuteButton
            onClick={() => router.push(`/community/${postId}`)}
            variant="secondary"
            size="md"
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            상세로 돌아가기
          </CuteButton>
        </motion.div>
      </div>

      {/* 알림창 */}
      <Alert
        message={alertMessage}
        onClose={() => setAlertMessage('')}
      />
    </div>
  );
}
