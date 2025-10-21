'use client';

import { useRouter } from 'next/navigation';
import { Edit } from 'lucide-react';

interface OwnerActionsProps {
  voteId: number;
}

export default function OwnerActions({ voteId }: OwnerActionsProps) {
  const router = useRouter();

  const handleEdit = () => {
    // 수정 페이지로 이동
    router.push(`/vote/${voteId}/edit`);
  };

  return (
    <div className="flex justify-center space-x-4 mt-6 pt-6 border-t border-gray-100">
      {/* 투표 수정 버튼 */}
      <button
        onClick={handleEdit}
        className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
      >
        <Edit className="w-4 h-4" />
        <span>투표 수정</span>
      </button>
    </div>
  );
}