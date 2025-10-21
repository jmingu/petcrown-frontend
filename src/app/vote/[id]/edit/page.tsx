'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Camera, Save, Trash2, ArrowLeft } from 'lucide-react';
import { getVoteDetail, updateVote, deleteVote } from '@/libs/api/vote/voteApi';
import { VoteDetailResponse } from '@/libs/interface/api/vote/voteResponseInterface';
import { useUserStore } from '@/libs/store/user/userStore';

export default function VoteEditPage() {
  const router = useRouter();
  const params = useParams();
  const voteId = Number(params.id);

  const { user, getAccessToken, initializeFromLocalStorage } = useUserStore();
  const [voteData, setVoteData] = useState<VoteDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    initializeFromLocalStorage();
  }, [initializeFromLocalStorage]);

  useEffect(() => {
    const fetchVoteData = async () => {
      try {
        const response = await getVoteDetail(voteId);
        if (response.resultCode === 200) {
          const data = response.result;

          // 소유자 확인
          if (!user?.email || user.email !== data.ownerEmail) {
            alert('수정 권한이 없습니다.');
            router.push(`/vote/${voteId}`);
            return;
          }

          setVoteData(data);

          // 이미지 URL 검증 및 설정
          if (data.profileImageUrl && data.profileImageUrl.trim()) {
            setImageLoading(true);
            setImageError(false);
            setPreviewUrl(data.profileImageUrl);
          } else {
            console.warn('이미지 URL이 없습니다:', data.profileImageUrl);
            setPreviewUrl('');
            setImageError(true);
          }

        } else {
          alert('투표 정보를 불러올 수 없습니다.');
          router.push('/vote');
        }
      } catch (error) {
        console.error('투표 상세 조회 실패:', error);
        alert('투표 정보를 불러오는 중 오류가 발생했습니다.');
        router.push('/vote');
      } finally {
        setIsLoading(false);
      }
    };

    if (user !== undefined) { // user가 초기화된 후에 실행
      fetchVoteData();
    }
  }, [voteId, user, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!voteData || isSaving || !selectedImage) return;

    setIsSaving(true);
    try {
      const response = await updateVote(voteId, {
        petId: voteData.petId,
        image: selectedImage,
        profileImageUrl: voteData.profileImageUrl
      });

      if (response.resultCode === 200) {
        alert('투표가 성공적으로 수정되었습니다.');
        router.push(`/vote/${voteId}`);
      } else {
        alert('투표 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('투표 수정 실패:', error);
      alert('투표 수정 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!voteData || isDeleting) return;

    setIsDeleting(true);
    try {
      const response = await deleteVote(voteId);
      if (response.resultCode === 200) {
        alert('투표가 삭제되었습니다.');
        router.push('/vote');
      } else {
        alert('투표 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('투표 삭제 실패:', error);
      alert('투표 삭제 중 오류가 발생했습니다.');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">투표 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!voteData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">투표 정보를 찾을 수 없습니다.</p>
          <Link href="/vote" className="text-purple-600 hover:text-purple-800">
            투표 목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href={`/vote/${voteId}`}
            className="inline-flex items-center text-purple-600 hover:text-purple-800 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            투표 상세로 돌아가기
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">투표 수정</h1>
        </div>

        {/* 메인 카드 */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* 펫 정보 헤더 */}
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{voteData.name}</h2>
              <p className="text-gray-600">
                {voteData.breedName || voteData.speciesName} • {voteData.gender === 'M' ? '남아' : '여아'}
              </p>
              <p className="text-purple-600 font-semibold mt-1">
                현재 {voteData.monthlyVoteCount.toLocaleString()}표 획득
              </p>
            </div>
          </div>

          {/* 이미지 수정 섹션 */}
          <div className="p-8">
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-4">
                프로필 이미지
              </label>

              {/* 이미지 미리보기 */}
              <div className="relative mb-6">
                <div className="relative h-80 bg-gradient-to-b from-purple-100 to-pink-100 rounded-2xl overflow-hidden">
                  {previewUrl && !imageError ? (
                    <>
                      {imageLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-purple-50">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                        </div>
                      )}
                      <Image
                        src={previewUrl}
                        alt={`${voteData.name} 프로필`}
                        fill
                        className={`object-cover transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                        priority
                        unoptimized
                        onError={(e) => {
                          console.error('이미지 로드 실패:', previewUrl);
                          setImageError(true);
                          setImageLoading(false);
                        }}
                        onLoad={() => {
                          setImageLoading(false);
                          setImageError(false);
                        }}
                      />
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full text-center p-4">
                      <div>
                        <Camera className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm">이미지를 불러올 수 없습니다</p>
                        <p className="text-gray-400 text-xs mt-1">새로운 이미지를 선택해주세요</p>
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
                    <label className="cursor-pointer bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-3 transition-all duration-200">
                      <Camera className="w-6 h-6 text-purple-600" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* 이미지 변경 버튼 */}
              <div className="text-center">
                <label className="inline-flex items-center px-6 py-3 bg-purple-100 text-purple-700 rounded-xl hover:bg-purple-200 transition-colors duration-200 cursor-pointer">
                  <Camera className="w-5 h-5 mr-2" />
                  이미지 선택
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                {selectedImage && (
                  <p className="text-sm text-green-600 mt-2">
                    새 이미지가 선택되었습니다: {selectedImage.name}
                  </p>
                )}
              </div>
            </div>

            {/* 액션 버튼들 */}
            <div className="flex flex-col space-y-4">
              {/* 저장 버튼 */}
              <button
                onClick={handleSave}
                disabled={isSaving || !selectedImage}
                className="flex items-center justify-center px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <Save className="w-5 h-5 mr-2" />
                {isSaving ? '저장 중...' : '변경사항 저장'}
              </button>

              {/* 삭제 버튼 */}
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center justify-center px-6 py-3 bg-red-50 text-red-600 border border-red-200 rounded-xl hover:bg-red-100 transition-colors duration-200"
              >
                <Trash2 className="w-5 h-5 mr-2" />
                투표 삭제
              </button>
            </div>
          </div>
        </div>

        {/* 삭제 확인 모달 */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md mx-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">투표 삭제</h3>
                <p className="text-gray-600 mb-6">
                  &quot;{voteData.name}&quot; 투표를 정말 삭제하시겠습니까?<br/>
                  이 작업은 되돌릴 수 없습니다.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                    disabled={isDeleting}
                  >
                    취소
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    {isDeleting ? '삭제 중...' : '삭제'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}