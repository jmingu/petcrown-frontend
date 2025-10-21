'use client';

import { useEffect, useState } from 'react';
import { Share2 } from 'lucide-react';
import { useUserStore } from '@/libs/store/user/userStore';
import OwnerActions from './OwnerActions';

interface OwnerCheckProps {
  ownerEmail: string;
  voteId: number;
  petName: string;
}

export default function OwnerCheck({ ownerEmail, voteId, petName }: OwnerCheckProps) {
  const { user, initializeFromLocalStorage } = useUserStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // 컴포넌트 마운트 시 localStorage에서 사용자 정보 초기화
    initializeFromLocalStorage();
    setIsInitialized(true);
  }, [initializeFromLocalStorage]);

  // 초기화가 완료되지 않았으면 로딩 상태
  if (!isInitialized) {
    return null;
  }

  // 현재 로그인한 사용자의 이메일과 투표 소유자 이메일 비교
  const isOwner = user?.email === ownerEmail;

  if (isOwner) {
    return <OwnerActions voteId={voteId} />;
  }

  // 소유자가 아닌 경우 기본 액션 버튼들
  return (
    <div className="flex justify-center space-x-4 mt-8 pt-8 border-t border-gray-100">
      <div className="relative">
        <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-purple-600 transition-colors duration-200">
          <Share2 className="w-5 h-5" />
          <span>공유하기</span>
        </button>
      </div>
    </div>
  );
}