'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Trophy, Sparkles, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import PetDodgeGame from '@/components/game/PetDodgeGame';
import AdSense from '@/components/common/adsense/AdSense';
import CuteButton from '@/components/common/button/CuteButton';
import { useUserStore } from '@/libs/store/user/userStore';
import { getMyWeeklyScore, saveScore } from '@/libs/api/game/gameApi';

function GamePlayContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUserStore();
  const [finalScore, setFinalScore] = useState<number>(0);
  const [showResult, setShowResult] = useState(false);
  const [isNewRecord, setIsNewRecord] = useState(false);
  const [previousRecord, setPreviousRecord] = useState<number>(0);
  const [showShareCopied, setShowShareCopied] = useState(false);
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID || '';

  // URL 파라미터에서 펫 이미지와 펫 ID 가져오기
  const petImageUrl = searchParams.get('petImage') || 'default';
  const petId = searchParams.get('petId') ? parseInt(searchParams.get('petId')!, 10) : null;

  const handleGameOver = async (score: number) => {
    setFinalScore(score);
    setShowResult(true);

    // 로그인한 사용자인 경우 점수 저장 로직
    if (user) {
      try {
        // 내 주간 최고 점수 조회
        const weeklyScoreResponse = await getMyWeeklyScore();

        const currentWeeklyScore = weeklyScoreResponse.result?.score || 0;

        setPreviousRecord(currentWeeklyScore);

        // 현재 점수가 주간 최고 점수보다 높은 경우에만 저장
        if (score > currentWeeklyScore) {
          setIsNewRecord(true);

          if (petId) {
            const saveRequest = {
              score: score,
              petId: petId,
            };

            const saveResponse = await saveScore(saveRequest);
          }
        } else {
          setIsNewRecord(false);
        }
      } catch (error) {
        // 주간 점수가 없는 경우 (첫 플레이)
        try {
          setIsNewRecord(true);

          if (petId) {
            const saveRequest = {
              score: score,
              petId: petId,
            };

            const saveResponse = await saveScore(saveRequest);
          }
        } catch (saveError) {
          setIsNewRecord(false);
        }
      }
    }
  };

  const handleRestart = () => {
    setShowResult(false);
    setIsNewRecord(false);
    setPreviousRecord(0);
    // 페이지 리로드하여 게임 재시작
    window.location.reload();
  };

  const handleGoBack = () => {
    router.push('/game');
  };

  const handleShareScore = async () => {
    if (!user || !user.nickname) {
      return;
    }

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    // 캐시 무효화를 위한 타임스탬프 추가
    const timestamp = Date.now();
    const shareUrl = `${baseUrl}/game?nickname=${encodeURIComponent(user.nickname)}&t=${timestamp}`;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setShowShareCopied(true);
      setTimeout(() => setShowShareCopied(false), 2000);
    } catch (error) {
      // 복사 실패 시 무시
    }
  };

  return (
    <div className="min-h-[75vh] md:min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex flex-col relative overflow-hidden">
      {/* 배경 애니메이션 효과 (귀여운 파스텔) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-300/15 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* 뒤로가기 (게임 진행 중에는 숨김) */}
      {/* {!showResult && (
        <div className="absolute top-4 left-4 z-50">
          <Link
            href="/game"
            className="inline-flex items-center text-pink-600 hover:text-pink-700 transition-colors duration-200 bg-white/90 backdrop-blur-sm border-2 border-pink-300 px-4 py-2 rounded-full shadow-lg shadow-pink-200/50 hover:shadow-pink-300/60"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            게임 메뉴로
          </Link>
        </div>
      )} */}

      {/* 상단 광고 (모바일 최적화) */}
      {adsenseId && !showResult && (
        <div className="w-full bg-white/40 backdrop-blur-sm border-b border-pink-200/50 relative z-10">
          <div className="max-w-7xl mx-auto px-2">
            <AdSense
              adClient={adsenseId}
              adFormat="auto"
              adSlot=""
              fullWidthResponsive={true}
            />
          </div>
        </div>
      )}

      {/* 게임 영역 */}
      {!showResult ? (
        <div className="flex-1 flex items-center justify-center pt-2 relative z-10">
          <PetDodgeGame
            petImageUrl={petImageUrl}
            onGameOver={handleGameOver}
          />
        </div>
      ) : (
        /* 게임 결과 화면 */
        <div className="flex-1 flex items-center justify-center p-4 relative z-10">
          <div className="max-w-md w-full bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border-4 border-purple-300 p-8 text-center">
            {/* 신기록 여부 */}
            {isNewRecord && (
              <div className="mb-6 animate-bounce">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-6 py-3 rounded-full shadow-lg">
                  <Sparkles className="w-6 h-6" />
                  <span className="font-bold text-lg">신기록 달성!</span>
                  <Sparkles className="w-6 h-6" />
                </div>
              </div>
            )}

            {/* 트로피 아이콘 */}
            <div className="mb-4">
              <Trophy className={`w-20 h-20 mx-auto ${isNewRecord ? 'text-yellow-500' : 'text-purple-500'}`} />
            </div>

            {/* 점수 표시 */}
            <h2 className="text-3xl font-bold text-gray-800 mb-2">게임 오버!</h2>
            <div className="mb-6">
              <p className="text-gray-600 mb-2">생존 시간</p>
              <p className="text-5xl font-bold text-purple-600 mb-2">{finalScore.toFixed(1)}초</p>
              {previousRecord > 0 && !isNewRecord && (
                <p className="text-sm text-gray-500">
                  이번 주 최고 기록: {previousRecord.toFixed(1)}초
                </p>
              )}
              {isNewRecord && previousRecord > 0 && (
                <p className="text-sm text-green-600 font-semibold">
                  이전 기록: {previousRecord.toFixed(1)}초 → {finalScore.toFixed(1)}초
                </p>
              )}
            </div>

            {/* 버튼들 */}
            <div className="flex flex-col gap-3">
              <CuteButton
                onClick={handleRestart}
                variant="primary"
                size="lg"
                className="w-full"
              >
                다시하기
              </CuteButton>

              {/* 공유하기 버튼 (로그인한 사용자 + 신기록 달성 시만) */}
              {user && user.nickname && isNewRecord && (
                <div className="relative">
                  <CuteButton
                    onClick={handleShareScore}
                    variant="primary"
                    size="lg"
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <Share2 className="w-5 h-5" />
                      <span>점수 공유하기</span>
                    </div>
                  </CuteButton>

                  {/* 복사 완료 알림 */}
                  {showShareCopied && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm whitespace-nowrap"
                    >
                      링크가 복사되었습니다! 📋
                    </motion.div>
                  )}
                </div>
              )}

              <CuteButton
                onClick={handleGoBack}
                variant="secondary"
                size="lg"
                className="w-full"
              >
                돌아가기
              </CuteButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function GamePlayPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[75vh] md:min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
      </div>
    }>
      <GamePlayContent />
    </Suspense>
  );
}
