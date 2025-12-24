'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Gamepad2, Trophy, Star, ArrowLeft, Check, X, Users, Search } from 'lucide-react';
import Image from 'next/image';
import CuteButton from '@/components/common/button/CuteButton';
import CuteCard from '@/components/common/card/CuteCard';
import Alert from '@/components/common/alert/Alert';
import GameRulesModal from '@/components/game/GameRulesModal';
import GameShareButton from '@/components/game/GameShareButton';
import EditPetModal from '@/app/profile/components/EditPetModal';
import { useUserStore } from '@/libs/store/user/userStore';
import { findMyPet } from '@/libs/api/pet/petApi';
import { MyPetResponse } from '@/libs/interface/api/pet/petResponseInterface';
import { getMyWeeklyScore, getWeeklyRankings, getWeeklyScoreByNickname } from '@/libs/api/game/gameApi';
import { MyWeeklyScoreResponseDto, RankingItemDto } from '@/libs/interface/api/game/gameInterface';
import Link from 'next/link';
import AdSense from '@/components/common/adsense/AdSense';

export default function GameClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUserStore();
  const [selectedPetImage, setSelectedPetImage] = useState<string>('');
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);
  const [finalScore, setFinalScore] = useState<number>(0);
  const [showResult, setShowResult] = useState(false);
  const [myPets, setMyPets] = useState<MyPetResponse[]>([]);
  const [isLoadingPets, setIsLoadingPets] = useState(false);
  const [myWeeklyScore, setMyWeeklyScore] = useState<MyWeeklyScoreResponseDto | null>(null);
  const [weeklyRankings, setWeeklyRankings] = useState<RankingItemDto[]>([]);
  const [isLoadingScore, setIsLoadingScore] = useState(false);
  const [isLoadingRankings, setIsLoadingRankings] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [needsLogin, setNeedsLogin] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [challengerScore, setChallengerScore] = useState<MyWeeklyScoreResponseDto | null>(null);
  const [searchNickname, setSearchNickname] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isFromUrl, setIsFromUrl] = useState(false); // URL로 접속했는지 여부
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false); // 반려동물 등록 모달
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID || '';

  // 로그인 체크 - 알림 제거하고 UI만 변경
  useEffect(() => {
    const accessToken = localStorage.getItem('a_t');
    if (!accessToken) {
      setNeedsLogin(true);
    }
  }, []);

  // URL에서 닉네임 파라미터 확인 (도전장용)
  useEffect(() => {
    const nickname = searchParams.get('nickname');

    // 닉네임이 있으면 상대방 점수 조회 (URL로 접속)
    if (nickname && nickname.trim() !== '') {
      loadChallengerScore(nickname);
      setIsFromUrl(true);
    }
  }, [searchParams]);

  const loadChallengerScore = async (nickname: string) => {
    try {
      const response = await getWeeklyScoreByNickname(nickname);
      if (response.resultCode === 200 && response.result && response.result.score !== null) {
        setChallengerScore(response.result);
      } else {
        setChallengerScore(null);
      }
    } catch (error) {
      setChallengerScore(null);
    }
  };

  useEffect(() => {
    // 로그인한 사용자의 데이터 로드
    if (user) {
      loadMyPets();
      loadMyWeeklyScore();
    }
    // 주간 랭킹은 항상 로드
    loadWeeklyRankings();
  }, [user]);

  // 페이지에 돌아왔을 때마다 최신 점수 재로드 (게임 종료 후 업데이트된 점수 반영)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user) {
        loadMyWeeklyScore();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user]);

  const loadMyPets = async () => {
    setIsLoadingPets(true);
    try {
      const response = await findMyPet();
      if (response.resultCode === 200 && response.result && response.result.pets) {
        setMyPets(response.result.pets);
        // 첫 번째 펫을 기본 선택
        if (response.result.pets.length > 0) {
          setSelectedPetImage(response.result.pets[0].imageUrl || 'default');
          setSelectedPetId(response.result.pets[0].petId);
        }
      }
    } catch (error) {
      setMyPets([]);
    } finally {
      setIsLoadingPets(false);
    }
  };

  const loadMyWeeklyScore = async () => {
    setIsLoadingScore(true);
    try {
      const response = await getMyWeeklyScore();
      if (response.resultCode === 200 && response.result) {
        setMyWeeklyScore(response.result);
      }
    } catch (error) {
      setMyWeeklyScore(null);
    } finally {
      setIsLoadingScore(false);
    }
  };

  const loadWeeklyRankings = async () => {
    setIsLoadingRankings(true);
    try {
      const response = await getWeeklyRankings();
      if (response.resultCode === 200 && response.result && response.result.rankings) {
        setWeeklyRankings(response.result.rankings);
      }
    } catch (error) {
      setWeeklyRankings([]);
    } finally {
      setIsLoadingRankings(false);
    }
  };

  const handleStartGame = () => {
    // 펫 등록 여부 확인
    if (!selectedPetId) {
      setAlertMessage('게임 참여를 위해서는 반려동물을 등록해야 합니다.');
      return;
    }
    const imageUrl = selectedPetImage && selectedPetImage !== '' ? selectedPetImage : 'default';
    // 게임 플레이 페이지로 이동 (petImage와 petId 모두 전달)
    router.push(`/game/play?petImage=${encodeURIComponent(imageUrl)}&petId=${selectedPetId}`);
  };

  const handleRestart = () => {
    setShowResult(false);
    handleStartGame();
  };

  const handleSearchNickname = async () => {
    if (!searchNickname.trim()) {
      setAlertMessage('닉네임을 입력해주세요.');
      return;
    }

    setIsSearching(true);
    try {
      const response = await getWeeklyScoreByNickname(searchNickname.trim());
      if (response.resultCode === 200 && response.result && response.result.score !== null) {
        setChallengerScore(response.result);
        setIsFromUrl(false); // 검색으로 찾은 경우
      } else {
        setAlertMessage('해당 닉네임의 점수를 찾을 수 없습니다.');
        setChallengerScore(null);
      }
    } catch (error) {
      setAlertMessage('점수 조회에 실패했습니다.');
      setChallengerScore(null);
    } finally {
      setIsSearching(false);
    }
  };

  /**
   * 반려동물 등록 후 호출되는 함수
   */
  const handlePetRegistered = async () => {
    // 펫 목록 다시 조회
    await loadMyPets();

    // 모달 닫기
    setIsRegisterModalOpen(false);

    // 새로 조회한 펫 목록에서 가장 최근에 등록된 펫 (마지막 펫) 가져오기
    const response = await findMyPet();
    const newPets = response.result.pets;

    if (newPets.length > 0) {
      // 가장 최근에 등록된 펫을 선택
      const latestPet = newPets[newPets.length - 1];
      setSelectedPetImage(latestPet.imageUrl || 'default');
      setSelectedPetId(latestPet.petId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/50 via-pink-50/50 to-white py-8 px-4">
      {/* 알림 */}
      {alertMessage && (
        <Alert
          message={alertMessage}
          onClose={() => {
            setAlertMessage('');
            if (needsLogin) {
              setNeedsLogin(false);
              router.push('/login');
            }
          }}
        />
      )}

      <div className="max-w-4xl mx-auto">
        

        {/* AdSense - 상단 */}
        {adsenseId && (
          <div className="mb-6">
            <AdSense
              adClient={adsenseId}
              adFormat="auto"
              fullWidthResponsive={true}
              style={{ display: 'block', minHeight: '100px' }}
            />
          </div>
        )}

        {/* 게임 결과 모달 */}
        {showResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8"
          >
            <CuteCard padding="lg" className="bg-gradient-to-r from-yellow-50 to-orange-50 border-4 border-yellow-400">
              <div className="text-center space-y-4">
                <Trophy className="w-16 h-16 text-yellow-500 mx-auto" />
                <h2 className="text-3xl font-bold text-gray-900">게임 종료!</h2>
                <p className="text-5xl font-bold text-purple-600">{finalScore}초</p>

                {/* 신기록 달성 여부 표시 */}
                {user && myWeeklyScore && myWeeklyScore.score !== null && finalScore > myWeeklyScore.score && (
                  <div className="bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-400 rounded-xl p-3">
                    <p className="text-lg font-bold text-green-700 flex items-center justify-center space-x-2">
                      <span>🎉</span>
                      <span>신기록 달성!</span>
                      <span>🎉</span>
                    </p>
                    <p className="text-sm text-green-600 mt-1">
                      이전 기록: {myWeeklyScore.score.toFixed(1)}초 → 새 기록: {finalScore}초
                    </p>
                  </div>
                )}

                <p className="text-gray-600">
                  {user ? '랭킹에 등록되었습니다!' : '로그인하면 랭킹에 등록할 수 있어요!'}
                </p>
                <div className="flex gap-4 justify-center flex-wrap">
                  <CuteButton variant="primary" onClick={handleRestart}>
                    다시 도전하기
                  </CuteButton>
                  <CuteButton variant="secondary" onClick={() => router.push('/game/ranking')}>
                    랭킹 보기
                  </CuteButton>
                  {user && user.nickname && (
                    <GameShareButton
                      nickname={user.nickname}
                      score={finalScore}
                      variant="button"
                    />
                  )}
                </div>
              </div>
            </CuteCard>
          </motion.div>
        )}

        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Gamepad2 className="w-10 h-10 text-purple-500" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              게임
            </h1>
            <Gamepad2 className="w-10 h-10 text-pink-500" />
          </div>
          <p className="text-gray-600 text-lg">
            귀여운 반려동물과 장애물을 피해보세요! 🐾
          </p>
        </motion.div>

        {/* 닉네임 검색 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6"
        >
          <CuteCard padding="lg" className="bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Search className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <h2 className="text-base md:text-lg font-bold text-gray-900 break-keep">다른 유저 점수 조회</h2>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={searchNickname}
                  onChange={(e) => setSearchNickname(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearchNickname()}
                  placeholder="닉네임을 입력하세요"
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-blue-200 focus:border-blue-500 focus:outline-none transition-colors"
                  disabled={isSearching}
                />
                <CuteButton
                  variant="primary"
                  onClick={handleSearchNickname}
                  disabled={isSearching}
                  className="w-full sm:w-auto"
                >
                  {isSearching ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>검색 중...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <Search className="w-4 h-4" />
                      <span>검색</span>
                    </div>
                  )}
                </CuteButton>
              </div>
              <p className="text-sm text-gray-600 break-keep">
                💡 친구의 닉네임을 입력하면 주간 최고 점수를 확인할 수 있어요!
              </p>
            </div>
          </CuteCard>
        </motion.div>

        {/* 도전자 정보 */}
        {challengerScore && challengerScore.score !== null && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <CuteCard
              padding="lg"
              className={isFromUrl
                ? "bg-gradient-to-r from-orange-50 to-red-50 border-4 border-orange-400"
                : "bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300"
              }
            >
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center space-x-2">
                  <Users className={`w-6 h-6 ${isFromUrl ? 'text-orange-600' : 'text-blue-600'}`} />
                  <h2 className="text-2xl font-bold text-gray-900">
                    {isFromUrl ? '도전장이 도착했어요! 🔥' : '검색 결과'}
                  </h2>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-md">
                  <div className="flex items-center justify-center space-x-4 mb-4">
                    {challengerScore.imageUrl && (
                      <div
                        className={`relative w-20 h-20 rounded-xl overflow-hidden border-4 ${isFromUrl ? 'border-orange-400' : 'border-blue-400'} cursor-pointer hover:opacity-80 transition-opacity`}
                        onClick={() => setExpandedImage(challengerScore.imageUrl)}
                      >
                        <Image
                          src={challengerScore.imageUrl}
                          alt={challengerScore.name || "유저"}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    )}
                    <div className="text-left">
                      {challengerScore.nickname && (
                        <p className="text-lg font-bold text-gray-900">{challengerScore.nickname}</p>
                      )}
                      {challengerScore.name && (
                        <p className="text-sm text-gray-600">{challengerScore.name}</p>
                      )}
                      {!challengerScore.nickname && !challengerScore.name && (
                        <p className="text-lg font-bold text-gray-900">유저</p>
                      )}
                    </div>
                  </div>
                  <p className={`text-4xl font-bold mb-2 ${isFromUrl ? 'text-orange-600' : 'text-blue-600'}`}>
                    {challengerScore.score.toFixed(1)}초
                  </p>
                  <p className="text-gray-700 font-medium">
                    {isFromUrl ? '이 기록을 이길 수 있나요? 💪' : '유저의 주간 최고 점수입니다!'}
                  </p>
                </div>
              </div>
            </CuteCard>
          </motion.div>
        )}

        {/* 내 주간 점수 & 주간 랭킹 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* 내 주간 점수 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <CuteCard padding="lg" className="h-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span>내 주간 최고 점수</span>
                </h2>
                {myWeeklyScore && myWeeklyScore.score !== null && myWeeklyScore.nickname && (
                  <GameShareButton
                    nickname={myWeeklyScore.nickname}
                    score={myWeeklyScore.score}
                    variant="icon"
                  />
                )}
              </div>
              {!user ? (
                <div className="text-center py-8">
                  <div className="mb-4">
                    <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-600 font-medium mb-2">로그인이 필요합니다</p>
                    <p className="text-sm text-gray-500">로그인하고 게임 기록을 확인하세요!</p>
                  </div>
                  <CuteButton
                    variant="primary"
                    onClick={() => router.push('/login')}
                  >
                    로그인하러 가기
                  </CuteButton>
                </div>
              ) : isLoadingScore ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent"></div>
                </div>
              ) : myWeeklyScore && myWeeklyScore.score !== null ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    {myWeeklyScore.imageUrl ? (
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border-4 border-purple-300">
                        <Image
                          src={myWeeklyScore.imageUrl}
                          alt={myWeeklyScore.name || "내 캐릭터"}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center border-4 border-purple-300 flex-shrink-0">
                        <span className="text-3xl">🐾</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-3xl font-bold text-purple-600">{myWeeklyScore.score.toFixed(1)}초</p>
                      {myWeeklyScore.nickname && (
                        <p className="text-sm font-bold text-gray-800 mt-1">{myWeeklyScore.nickname}</p>
                      )}
                      {myWeeklyScore.name && (
                        <p className="text-sm text-gray-600">{myWeeklyScore.name}</p>
                      )}
                      {myWeeklyScore.weekStartDate && (
                        <p className="text-xs text-gray-500 mt-1">주 시작: {myWeeklyScore.weekStartDate}</p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <p>아직 이번 주 기록이 없습니다.</p>
                  <p className="text-sm mt-2">게임을 시작해보세요!</p>
                </div>
              )}
            </CuteCard>
          </motion.div>

          {/* 주간 랭킹 TOP 3 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <CuteCard padding="lg" className="h-full">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-500" fill="currentColor" />
                <span>주간 랭킹 TOP 3</span>
              </h2>
              {isLoadingRankings ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent"></div>
                </div>
              ) : weeklyRankings.length > 0 ? (
                <div className="space-y-3">
                  {weeklyRankings.slice(0, 3).map((rank, index) => (
                    <div
                      key={rank.scoreId || `${rank.userId}-${index}`}
                      className={`flex items-center space-x-3 p-3 rounded-xl ${
                        rank.ranking === 1
                          ? 'bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-400'
                          : rank.ranking === 2
                          ? 'bg-gradient-to-r from-gray-100 to-gray-200 border-2 border-gray-400'
                          : 'bg-gradient-to-r from-orange-50 to-orange-100 border-2 border-orange-300'
                      }`}
                    >
                      <div className="text-2xl font-bold min-w-[32px] text-center">
                        {rank.ranking === 1 ? '🥇' : rank.ranking === 2 ? '🥈' : '🥉'}
                      </div>
                      {rank.imageUrl && (
                        <div
                          className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border-2 border-white cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => setExpandedImage(rank.imageUrl)}
                        >
                          <Image
                            src={rank.imageUrl}
                            alt={rank.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">
                          {rank.nickname}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {rank.name}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">{rank.score.toFixed(1)}초</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <p>아직 랭킹 데이터가 없습니다.</p>
                  <p className="text-sm mt-2">첫 번째 랭커가 되어보세요!</p>
                </div>
              )}

              {/* 게임 랭킹 보기 버튼 */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  className="w-full inline-flex items-center justify-center space-x-2 text-purple-600 hover:text-purple-800 transition-colors duration-200 font-medium"
                  onClick={() => router.push('/game/ranking')}
                >
                  <Trophy className="w-5 h-5" />
                  <span>게임 랭킹 보기</span>
                </button>
              </div>
            </CuteCard>
          </motion.div>
        </div>

        {/* 게임 설명 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <CuteCard padding="lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                <Star className="w-6 h-6 text-yellow-500" fill="currentColor" />
                <span>게임 방법</span>
              </h2>
              <button
                onClick={() => setShowRulesModal(true)}
                className="text-sm md:text-base px-3 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 font-medium shadow-md hover:shadow-lg flex items-center space-x-1"
              >
                <span>규칙 보기</span>
              </button>
            </div>
            <div className="space-y-3 text-gray-700">
              <p className="flex items-start space-x-2">
                <span className="font-bold text-purple-600 min-w-[24px]">1.</span>
                <span>위에서 떨어지는 장애물을 피하세요!</span>
              </p>
              <p className="flex items-start space-x-2">
                <span className="font-bold text-purple-600 min-w-[24px]">2.</span>
                <span><strong>모바일:</strong> 화면을 터치하거나 드래그해서 좌우로 이동</span>
              </p>
              <p className="flex items-start space-x-2">
                <span className="font-bold text-purple-600 min-w-[24px]">3.</span>
                <span><strong>데스크톱:</strong> 화살표 키(← →) 또는 A/D 키로 이동</span>
              </p>
              <p className="flex items-start space-x-2">
                <span className="font-bold text-purple-600 min-w-[24px]">4.</span>
                <span className="text-red-600 font-semibold">시간이 지날수록 난이도가 올라갑니다!</span>
              </p>
              <p className="flex items-start space-x-2">
                <span className="font-bold text-purple-600 min-w-[24px]">5.</span>
                <span>최대한 오래 버티고 랭킹에 도전하세요! 🏆</span>
              </p>
            </div>
          </CuteCard>
        </motion.div>

        {/* 캐릭터 선택 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <CuteCard padding="lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              {user ? '캐릭터 선택' : '캐릭터'}
            </h2>

            {user ? (
              isLoadingPets ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
                </div>
              ) : myPets.length > 0 ? (
                <div>
                  <p className="text-gray-600 mb-6 text-center">
                    내 반려동물을 선택하여 게임에 참여하세요! 🐾
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* 사용자의 펫들 */}
                    {myPets.map((pet) => {
                      return (
                        <button
                          key={pet.petId}
                          onClick={() => {
                            setSelectedPetImage(pet.imageUrl || 'default');
                            setSelectedPetId(pet.petId);
                          }}
                          className={`relative rounded-2xl p-4 transition-all duration-200 ${
                            selectedPetId === pet.petId
                              ? 'bg-gradient-to-br from-purple-100 to-pink-100 border-4 border-purple-500 shadow-lg'
                              : 'bg-gray-50 border-2 border-gray-200 hover:border-purple-300'
                          }`}
                        >
                          <div className="aspect-square rounded-xl overflow-hidden mb-2 relative">
                            {pet.imageUrl ? (
                              <Image
                                src={pet.imageUrl}
                                alt={pet.name}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                                <span className="text-4xl">🐾</span>
                              </div>
                            )}
                          </div>
                          <p className="text-center font-semibold text-sm truncate">{pet.name}</p>
                          {selectedPetId === pet.petId && (
                            <div className="absolute top-2 right-2 bg-purple-500 rounded-full p-1">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-600 mb-4">
                    게임에 참여하려면 먼저 반려동물을 등록해주세요! 🐾
                  </p>
                  <CuteButton
                    variant="primary"
                    size="lg"
                    onClick={() => setIsRegisterModalOpen(true)}
                  >
                    반려동물 등록하기
                  </CuteButton>
                </div>
              )
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-600 mb-4">
                  게임에 참여하려면 먼저 로그인하고 반려동물을 등록해주세요! 🐾
                </p>
                <CuteButton
                  variant="primary"
                  size="lg"
                  onClick={() => router.push('/login')}
                >
                  로그인하기
                </CuteButton>
              </div>
            )}
          </CuteCard>
        </motion.div>

        {/* 시작 버튼 */}
        {user && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4 w-full md:w-auto">
              <CuteButton
                variant="primary"
                size="xl"
                onClick={handleStartGame}
                disabled={!selectedPetId}
                className="shadow-2xl w-full md:w-auto text-base md:text-xl"
              >
                게임 시작하기
              </CuteButton>
            </div>
          </motion.div>
        )}

        {/* 게임 규칙 모달 */}
        <GameRulesModal
          isOpen={showRulesModal}
          onClose={() => setShowRulesModal(false)}
          onStart={handleStartGame}
        />

        {/* 이미지 확대 모달 */}
        {expandedImage && (
          <div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setExpandedImage(null)}
          >
            {/* X 버튼 */}
            <button
              onClick={() => setExpandedImage(null)}
              className="absolute top-4 right-4 bg-white/90 hover:bg-white rounded-full p-2 transition-colors z-10"
              aria-label="닫기"
            >
              <X className="w-6 h-6 text-gray-800" />
            </button>

            <div className="relative max-w-3xl max-h-[90vh] w-full h-full flex items-center justify-center">
              <Image
                src={expandedImage}
                alt="확대된 이미지"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          </div>
        )}

        {/* 반려동물 등록 모달 */}
        {isRegisterModalOpen && (
          <EditPetModal
            pet={null}
            onClose={() => setIsRegisterModalOpen(false)}
            onSave={handlePetRegistered}
          />
        )}
      </div>
    </div>
  );
}
