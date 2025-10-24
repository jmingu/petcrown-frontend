'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { doVote } from '@/libs/api/vote/voteApi';

interface VoteActionButtonProps {
  voteId: number;
  isVoted: boolean;
  isActive: boolean;
  voteCount: number;
}

export default function VoteActionButton({
  voteId,
  isVoted: initialIsVoted,
  isActive,
  voteCount: initialVoteCount,
}: VoteActionButtonProps) {
  const [isVoted, setIsVoted] = useState(initialIsVoted);
  const [voteCount, setVoteCount] = useState(initialVoteCount);
  const [isLoading, setIsLoading] = useState(false);

  const handleVote = async () => {
    if (!isActive || isVoted || isLoading) return;

    setIsLoading(true);
    try {
      // TODO: 실제 API 연동시 주석 해제
      // const response = await doVote({ voteId });
      // if (response.resultCode === 200) {
      //   setIsVoted(true);
      //   setVoteCount(prev => prev + 1);
      // }
      
      // 임시 로직 (샘플용)
      await new Promise(resolve => setTimeout(resolve, 1000)); // 로딩 시뮬레이션
      setIsVoted(true);
      setVoteCount(prev => prev + 1);
    } catch (error) {
      alert('투표에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isActive) {
    return (
      <div className="text-center">
        <button
          disabled
          className="bg-gray-100 text-gray-500 px-8 py-4 rounded-2xl font-bold text-lg cursor-not-allowed"
        >
          투표가 종료되었습니다
        </button>
        <p className="text-gray-500 mt-2">총 {voteCount}표</p>
      </div>
    );
  }

  if (isVoted) {
    return (
      <div className="text-center">
        <button
          disabled
          className="bg-green-100 text-green-700 px-8 py-4 rounded-2xl font-bold text-lg cursor-default flex items-center space-x-2 mx-auto"
        >
          <Check className="w-6 h-6" />
          <span>투표 완료!</span>
        </button>
        <p className="text-gray-600 mt-2">총 {voteCount}표</p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <button
        onClick={handleVote}
        disabled={isLoading}
        className={`
          relative px-8 py-4 rounded-2xl font-bold text-lg text-white transition-all duration-300 transform
          ${isLoading 
            ? 'bg-purple-300 cursor-not-allowed' 
            : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 hover:scale-105 shadow-lg hover:shadow-xl'
          }
        `}
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
            <span>투표 중...</span>
          </div>
        ) : (
          <span>투표하기</span>
        )}
      </button>
      <p className="text-gray-600 mt-2">현재 {voteCount}표</p>
      <p className="text-sm text-gray-500 mt-1">하루에 한 번 투표할 수 있어요!</p>
    </div>
  );
}