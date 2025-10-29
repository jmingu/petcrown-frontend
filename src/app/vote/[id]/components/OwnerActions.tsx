'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { deleteVote } from '@/libs/api/vote/voteApi';
import Alert from '@/components/common/alert/Alert';

interface OwnerActionsProps {
  voteId: number;
  petName?: string;
}

export default function OwnerActions({ voteId, petName }: OwnerActionsProps) {
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleEdit = () => {
    // 수정 페이지로 이동
    router.push(`/vote/${voteId}/edit`);
  };

  const handleDelete = async () => {
    if (isDeleting) return;

    setIsDeleting(true);
    try {
      const response = await deleteVote(voteId);
      if (response.resultCode === 200) {
        setAlertMessage('투표가 삭제되었습니다.');
        setTimeout(() => router.push('/vote'), 1500);
      } else {
        setAlertMessage('투표 삭제에 실패했습니다.');
      }
    } catch (error) {
      setAlertMessage('투표 삭제 중 오류가 발생했습니다.');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <>
      <div className="flex justify-center space-x-4 mt-6 pt-6 border-t border-gray-100">
        {/* 투표 수정 버튼 - 임시 주석 처리 (투표 수정은 이치에 맞지 않음) */}
        {/* <button
          onClick={handleEdit}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
        >
          <Edit className="w-4 h-4" />
          <span>투표 수정</span>
        </button> */}

        {/* 투표 삭제 버튼 */}
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
        >
          <Trash2 className="w-4 h-4" />
          <span>투표 삭제</span>
        </button>
      </div>

      {/* 삭제 확인 모달 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md mx-4 w-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">투표 삭제</h3>
              <p className="text-gray-600 mb-6 break-keep">
                {petName ? `"${petName}"` : '이'} 투표를 정말 삭제하시겠습니까?<br/>
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

      {/* Alert 컴포넌트 */}
      <Alert
        message={alertMessage}
        onClose={() => setAlertMessage('')}
      />
    </>
  );
}