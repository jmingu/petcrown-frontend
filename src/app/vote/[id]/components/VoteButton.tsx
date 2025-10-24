'use client';

import { useState } from 'react';
import { doVote } from '@/libs/api/vote/voteApi';
import { useUserStore } from '@/libs/store/user/userStore';
import Alert from '@/components/common/alert/Alert';
import EmailVerificationModal from './EmailVerificationModal';

interface VoteButtonProps {
  voteId: number;
  currentVoteCount: number;
  petName: string;
  isActive?: boolean;
}

export default function VoteButton({ voteId, currentVoteCount, petName, isActive = true }: VoteButtonProps) {
  const { user } = useUserStore();
  const [isVoting, setIsVoting] = useState(false);
  const [voteCount, setVoteCount] = useState(currentVoteCount);
  const [alertMessage, setAlertMessage] = useState('');
  const [showEmailModal, setShowEmailModal] = useState(false);

  const handleVote = async () => {
    // 로그인하지 않은 사용자 - 이메일 인증 모달 표시
    if (!user?.email) {
      setShowEmailModal(true);
      return;
    }

    // 로그인한 사용자 - 직접 투표
    setIsVoting(true);
    try {
      const response = await doVote(voteId, { email: user.email });

      if (response.resultCode === 200) {
        setVoteCount(prev => prev + 1);
        setAlertMessage('투표가 완료되었습니다! 🎉');
      } else {
        setAlertMessage(response.resultMessageKo || '투표에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      setAlertMessage('투표 중 오류가 발생했습니다.');
    } finally {
      setIsVoting(false);
    }
  };

  const handleEmailVoteSuccess = () => {
    setVoteCount(prev => prev + 1);
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
        <p className="text-gray-500 mt-2">총 {voteCount.toLocaleString()}표</p>
      </div>
    );
  }

  return (
    <>
      <div className="text-center">
        <button
          onClick={handleVote}
          disabled={isVoting}
          className={`
            inline-flex items-center justify-center space-x-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-200 min-w-[200px]
            ${isVoting
              ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 shadow-lg hover:shadow-xl'
            }
          `}
        >
          {isVoting ? (
            <>
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              <span>투표 중...</span>
            </>
          ) : (
            <span>투표하기</span>
          )}
        </button>

        <p className="text-gray-600 mt-3">
          현재 <span className="font-bold text-purple-600">{voteCount.toLocaleString()}</span>표
        </p>

        {!user && (
          <p className="text-sm text-gray-500 mt-2">
            로그인하지 않아도 이메일 인증으로 투표할 수 있습니다
          </p>
        )}
      </div>

      {/* 이메일 인증 모달 */}
      <EmailVerificationModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        voteId={voteId}
        petName={petName}
        onVoteSuccess={handleEmailVoteSuccess}
      />

      {/* 알림 메시지 */}
      {alertMessage && (
        <Alert
          message={alertMessage}
          type={alertMessage.includes('완료') ? 'success' : 'error'}
          onClose={() => setAlertMessage('')}
        />
      )}
    </>
  );
}