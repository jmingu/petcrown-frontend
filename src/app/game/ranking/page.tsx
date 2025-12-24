'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, ArrowLeft, Gamepad2, Crown, Medal, Timer, X, LogIn } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import CuteCard from '@/components/common/card/CuteCard';
import CuteBadge from '@/components/common/badge/CuteBadge';
import CuteButton from '@/components/common/button/CuteButton';
import AdSense from '@/components/common/adsense/AdSense';
import { getWeeklyRankings, getLastWeeklyRankings, getMyWeeklyRanking } from '@/libs/api/game/gameApi';
import { RankingItemDto, MyWeeklyRankingResponse } from '@/libs/interface/api/game/gameInterface';
import { useUserStore } from '@/libs/store/user/userStore';

export default function GameRankingPage() {
  const [currentWeekRankings, setCurrentWeekRankings] = useState<RankingItemDto[]>([]);
  const [lastWeekRankings, setLastWeekRankings] = useState<RankingItemDto[]>([]);
  const [myRanking, setMyRanking] = useState<MyWeeklyRankingResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMyRanking, setIsLoadingMyRanking] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [showAllModal, setShowAllModal] = useState<{ items: RankingItemDto[], rank: number } | null>(null);
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID || '';

  const accessToken = useUserStore(state => state.getAccessToken());

  useEffect(() => {
    setIsMounted(true);
  }, []);


  useEffect(() => {
    loadRankings();
    if (accessToken) {
      loadMyRanking();
    }
  }, [accessToken]);

  const loadRankings = async () => {
    try {
      setIsLoading(true);
      const [currentResponse, lastResponse] = await Promise.all([
        getWeeklyRankings(),
        getLastWeeklyRankings(),
      ]);

      if (currentResponse.resultCode === 200 && currentResponse.result) {
        setCurrentWeekRankings(currentResponse.result.rankings);
      }

      if (lastResponse.resultCode === 200 && lastResponse.result) {
        setLastWeekRankings(lastResponse.result.rankings);
      }
    } catch (error) {
      setCurrentWeekRankings([]);
      setLastWeekRankings([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMyRanking = async () => {
    setIsLoadingMyRanking(true);
    try {
      const response = await getMyWeeklyRanking();
      if (response.resultCode === 200 && response.result) {
        setMyRanking(response.result);
      } else {
        setMyRanking(null);
      }
    } catch (error) {
      setMyRanking(null);
    } finally {
      setIsLoadingMyRanking(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-8 h-8 text-yellow-500" />;
      case 2:
        return <Medal className="w-7 h-7 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-orange-400" />;
      default:
        return (
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="font-bold text-gray-600">{rank}</span>
          </div>
        );
    }
  };

  const renderSinglePodiumCard = (item: RankingItemDto, rank: number, orderClass: string, delay: number) => {
    const isFirst = rank === 1;
    const gradientClass = isFirst
      ? 'from-yellow-400 to-yellow-600'
      : rank === 2
      ? 'from-gray-300 to-gray-500'
      : 'from-orange-300 to-orange-500';

    const ringClass = isFirst
      ? 'ring-yellow-400'
      : rank === 2
      ? 'ring-gray-300'
      : 'ring-orange-300';

    const heightClass = isFirst ? 'h-3' : 'h-2';
    const imageSize = isFirst ? 'w-20 h-20 md:w-24 md:h-24' : 'w-16 h-16 md:w-20 md:h-20';

    return (
      <div className={`${orderClass} flex-1 md:max-w-[${isFirst ? '220' : '200'}px] lg:max-w-xs`}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay }}
        >
          <CuteCard className="text-center relative overflow-visible">
            <div className={`absolute top-0 left-0 right-0 ${heightClass} bg-gradient-to-r ${gradientClass} pointer-events-none`}></div>
            <div className={`${isFirst ? 'pt-6 pb-4' : 'pt-4 pb-3'} px-2`}>
              <div className="flex justify-center mb-3 pointer-events-none">
                {isFirst ? (
                  <motion.div
                    animate={{ rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    {getRankIcon(rank)}
                  </motion.div>
                ) : (
                  getRankIcon(rank)
                )}
              </div>
              <div
                className={`relative ${imageSize} mx-auto mb-3 cursor-pointer hover:opacity-80 transition-opacity z-10`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (item.imageUrl) {
                    setExpandedImage(item.imageUrl);
                  }
                }}
              >
                {item.imageUrl ? (
                  <>
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className={`object-cover rounded-xl ring-4 ${ringClass} pointer-events-none`}
                      unoptimized
                    />
                    {isFirst && (
                      <div className="absolute -top-2 -right-2 pointer-events-none">
                        <Crown className="w-6 h-6 md:w-8 md:h-8 text-yellow-500" />
                      </div>
                    )}
                  </>
                ) : (
                  <div className={`w-full h-full bg-gray-200 rounded-xl flex items-center justify-center ring-4 ${ringClass}`}>
                    <span className={isFirst ? 'text-3xl' : 'text-2xl'}>🐾</span>
                  </div>
                )}
              </div>
              <h3 className={`font-bold ${isFirst ? 'text-lg md:text-xl' : 'text-base md:text-lg'} text-gray-900 mb-1 truncate px-2`}>
                {item.nickname}
              </h3>
              <p className="text-xs md:text-sm text-gray-500 mb-2 truncate px-2">
                {item.name}
              </p>
              <div className={`flex items-center justify-center space-x-2 ${isFirst ? 'mb-3' : ''}`}>
                <Timer className={`${isFirst ? 'w-4 h-4 md:w-5 md:h-5' : 'w-3 h-3 md:w-4 md:h-4'} text-purple-500`} />
                <span className={`font-bold ${isFirst ? 'text-lg md:text-xl text-purple-600' : 'text-sm md:text-base text-gray-900'}`}>
                  {item.score.toFixed(1)}초
                </span>
              </div>
              {isFirst && (
                <CuteBadge variant="cute" size="sm">
                  👑 1등
                </CuteBadge>
              )}
            </div>
          </CuteCard>
        </motion.div>
      </div>
    );
  };

  const renderMultiplePodiumCard = (items: RankingItemDto[], rank: number, orderClass: string, delay: number) => {
    const isFirst = rank === 1;
    const isSecond = rank === 2;
    const gradientClass = isFirst
      ? 'from-yellow-400 to-yellow-600'
      : rank === 2
      ? 'from-gray-300 to-gray-500'
      : 'from-orange-300 to-orange-500';

    const ringClass = isFirst
      ? 'ring-yellow-400'
      : rank === 2
      ? 'ring-gray-300'
      : 'ring-orange-300';

    const heightClass = isFirst ? 'h-3' : isSecond ? 'h-2' : 'h-1.5';
    const scaleClass = isFirst ? 'scale-110' : isSecond ? 'scale-105' : 'scale-100';

    return (
      <div className={`${orderClass} flex-1 ${isFirst ? 'md:max-w-[340px]' : isSecond ? 'md:max-w-[300px]' : 'md:max-w-[280px]'} lg:max-w-sm`}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay }}
        >
          <CuteCard className="text-center relative">
            <div className={`absolute top-0 left-0 right-0 ${heightClass} bg-gradient-to-r ${gradientClass} pointer-events-none z-0`}></div>
            <div className={`${isFirst ? 'pt-6 pb-4' : 'pt-4 pb-3'} px-2 relative z-10`}>
              <div className="flex justify-center mb-3 pointer-events-none">
                {isFirst ? (
                  <motion.div
                    animate={{ rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Crown className="w-8 h-8 text-yellow-500" />
                  </motion.div>
                ) : (
                  getRankIcon(rank)
                )}
              </div>
              <div className="mb-3">
                <p className={`font-bold ${isFirst ? 'text-lg md:text-xl' : 'text-base md:text-lg'} text-gray-900`}>공동 {rank}위</p>
                <p className="text-xs md:text-sm text-gray-500 mb-2">{items.length}명</p>
              </div>

              {/* 프로필 이미지 그리드 */}
              <div className={`${
                items.length === 3 ? 'flex flex-wrap justify-center' :
                `grid ${
                  items.length === 1 ? 'grid-cols-1' :
                  items.length === 2 ? 'grid-cols-2' :
                  'grid-cols-2'
                }`
              } gap-2 mb-3 px-2 relative z-20`}>
                {items.slice(0, items.length > 3 ? 3 : items.length).map((item, idx) => (
                  <div
                    key={item.scoreId || `${item.userId}-${idx}`}
                    className={`relative ${items.length === 3 ? 'w-[calc(50%-0.25rem)]' : ''}`}
                  >
                    <div
                      className="relative aspect-square cursor-pointer hover:opacity-80 transition-opacity group"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (item.imageUrl) {
                          setExpandedImage(item.imageUrl);
                        }
                      }}
                    >
                      {item.imageUrl ? (
                        <>
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            className={`object-cover rounded-lg ring-2 ${ringClass} pointer-events-none`}
                            unoptimized
                          />
                          {isFirst && (
                            <div className="absolute -top-1 -right-1 pointer-events-none z-10">
                              <Crown className="w-4 h-4 text-yellow-500" />
                            </div>
                          )}
                        </>
                      ) : (
                        <div className={`w-full h-full bg-gray-200 rounded-lg flex items-center justify-center ring-2 ${ringClass}`}>
                          <span className="text-xl">🐾</span>
                        </div>
                      )}
                    </div>
                    {/* 닉네임과 펫 이름 표시 */}
                    <div className="mt-1 text-center">
                      <p className="text-xs font-medium text-gray-900 truncate">{item.nickname}</p>
                      <p className="text-[10px] text-gray-500 truncate">{item.name}</p>
                    </div>
                  </div>
                ))}

                {/* 4명 이상일 경우 "+N" 더보기 표시 */}
                {items.length > 3 && (
                  <div
                    className="relative aspect-square bg-gray-100 rounded-lg ring-2 ring-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowAllModal({ items, rank });
                    }}
                  >
                    <div className="text-center pointer-events-none">
                      <p className="text-2xl font-bold text-gray-600 pointer-events-none">+{items.length - 3}</p>
                      <p className="text-[10px] text-gray-500 pointer-events-none">더보기</p>
                    </div>
                  </div>
                )}
              </div>

              <div className={`flex items-center justify-center space-x-2 ${isFirst ? 'mb-3' : ''}`}>
                <Timer className={`${isFirst ? 'w-4 h-4 md:w-5 md:h-5' : 'w-3 h-3 md:w-4 md:h-4'} text-purple-500`} />
                <span className={`font-bold ${isFirst ? 'text-lg md:text-xl text-purple-600' : 'text-sm md:text-base text-gray-900'}`}>
                  {items[0].score.toFixed(1)}초
                </span>
              </div>
              {isFirst && (
                <CuteBadge variant="cute" size="sm">
                  👑 1등
                </CuteBadge>
              )}
            </div>
          </CuteCard>
        </motion.div>
      </div>
    );
  };

  const renderEmptyPodium = (rank: number, orderClass: string, delay: number) => {
    const gradientClass = rank === 1
      ? 'from-yellow-400 to-yellow-600'
      : rank === 2
      ? 'from-gray-300 to-gray-500'
      : 'from-orange-300 to-orange-500';

    const heightClass = rank === 1 ? 'h-3' : 'h-2';
    const imageSize = rank === 1 ? 'w-20 h-20 md:w-24 md:h-24' : 'w-16 h-16 md:w-20 md:h-20';

    return (
      <div className={`${orderClass} flex-1 md:max-w-[${rank === 1 ? '220' : '200'}px] lg:max-w-xs`}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay }}
        >
          <CuteCard className="text-center relative overflow-hidden opacity-50">
            <div className={`absolute top-0 left-0 right-0 ${heightClass} bg-gradient-to-r ${gradientClass}`}></div>
            <div className={rank === 1 ? 'pt-6 pb-4' : 'pt-4 pb-3'}>
              <div className="flex justify-center mb-3">
                {rank === 1 ? (
                  <Crown className="w-6 h-6 md:w-8 md:h-8 text-gray-400" />
                ) : (
                  getRankIcon(rank)
                )}
              </div>
              <div className={`relative ${imageSize} mx-auto mb-3 bg-gray-200 rounded-xl`}></div>
              <p className="text-gray-400 text-xs md:text-sm">{rank}위 자리 비어있음</p>
            </div>
          </CuteCard>
        </motion.div>
      </div>
    );
  };

  const renderMyRanking = () => {
    if (!isMounted) {
      return null;
    }

    if (isLoadingMyRanking) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <CuteCard>
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent"></div>
            </div>
          </CuteCard>
        </motion.div>
      );
    }

    if (!accessToken) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <CuteCard>
            <div className="text-center py-8">
              <LogIn className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">내 랭킹 확인하기</h3>
              <p className="text-gray-600 mb-4">로그인하고 내 게임 랭킹을 확인하세요!</p>
              <Link href="/login">
                <CuteButton variant="primary" size="md">
                  로그인하기
                </CuteButton>
              </Link>
            </div>
          </CuteCard>
        </motion.div>
      );
    }

    if (!myRanking) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <CuteCard>
            <div className="text-center py-8">
              <Gamepad2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">아직 내 랭킹이 없어요</h3>
              <p className="text-gray-600 mb-4">게임하고 랭킹에 도전해보세요!</p>
              <Link href="/game">
                <CuteButton variant="primary" size="md">
                  게임하러 가기
                </CuteButton>
              </Link>
            </div>
          </CuteCard>
        </motion.div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="text-center mb-4">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
            내 랭킹
          </h2>
        </div>
        <CuteCard>
          <div className="flex items-center p-4 md:p-6">
            <div className="flex-shrink-0 mr-4">
              {getRankIcon(myRanking.ranking)}
            </div>

            {myRanking.imageUrl ? (
              <div
                className="relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 mr-4 cursor-pointer hover:opacity-80 transition-opacity z-20"
                onClick={(e) => {
                  e.stopPropagation();
                  setExpandedImage(myRanking.imageUrl);
                }}
              >
                <Image
                  src={myRanking.imageUrl}
                  alt={myRanking.name}
                  fill
                  className="object-cover rounded-xl ring-4 ring-purple-400 pointer-events-none"
                  unoptimized
                />
              </div>
            ) : (
              <div className="relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 mr-4">
                <div className="w-full h-full bg-gray-200 rounded-xl flex items-center justify-center ring-4 ring-purple-400">
                  <span className="text-3xl">🐾</span>
                </div>
              </div>
            )}

            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg md:text-xl text-gray-900 mb-1">
                {myRanking.nickname}
              </h3>
              <p className="text-sm md:text-base text-gray-600 mb-2">{myRanking.name}</p>
              <div className="flex items-center gap-2 flex-wrap">
                <CuteBadge variant="cute" size="sm">
                  {myRanking.ranking}위
                </CuteBadge>
                <div className="flex items-center gap-1">
                  <Timer className="w-4 h-4 text-purple-500" />
                  <span className="font-semibold text-gray-900">
                    {myRanking.score.toFixed(1)}초
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CuteCard>
      </motion.div>
    );
  };

  const renderPodium = (rankings: RankingItemDto[], title: string) => {
    const rank1Items = rankings.filter(item => item.ranking === 1);
    const rank2Items = rankings.filter(item => item.ranking === 2);
    const rank3Items = rankings.filter(item => item.ranking === 3);
    const otherRankings = rankings.filter(item => item.ranking > 3);

    return (
      <div className="mb-8 md:mb-12">
        <div className="text-center mb-6 md:mb-10">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent px-4">{title}</h2>
        </div>

        {/* 상위 3위 포디움 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-center gap-4 md:gap-6">
            {/* 2위 */}
            {rank2Items.length > 0 ? (
              rank2Items.length === 1 ? (
                renderSinglePodiumCard(rank2Items[0], 2, 'order-2 md:order-1', 0.5)
              ) : (
                renderMultiplePodiumCard(rank2Items, 2, 'order-2 md:order-1', 0.5)
              )
            ) : (
              renderEmptyPodium(2, 'order-2 md:order-1', 0.5)
            )}

            {/* 1위 */}
            {rank1Items.length > 0 ? (
              rank1Items.length === 1 ? (
                renderSinglePodiumCard(rank1Items[0], 1, 'order-1 md:order-2 md:-mt-8', 0.4)
              ) : (
                renderMultiplePodiumCard(rank1Items, 1, 'order-1 md:order-2 md:-mt-8', 0.4)
              )
            ) : (
              renderEmptyPodium(1, 'order-1 md:order-2 md:-mt-8', 0.4)
            )}

            {/* 3위 */}
            {rank3Items.length > 0 ? (
              rank3Items.length === 1 ? (
                renderSinglePodiumCard(rank3Items[0], 3, 'order-3', 0.6)
              ) : (
                renderMultiplePodiumCard(rank3Items, 3, 'order-3', 0.6)
              )
            ) : (
              renderEmptyPodium(3, 'order-3', 0.6)
            )}
          </div>
        </motion.div>

        {/* 4위 이하 목록 */}
        {otherRankings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <CuteCard padding="sm">
              <div className="space-y-2">
                {otherRankings.map((item, index) => (
                  <motion.div
                    key={item.scoreId || `${item.userId}-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className="flex items-center p-3 md:p-4 hover:bg-purple-50 rounded-2xl transition-colors duration-200"
                  >
                    <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
                      <div className="flex-shrink-0">
                        {getRankIcon(item.ranking)}
                      </div>

                      <div
                        className="relative w-10 h-10 md:w-12 md:h-12 flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (item.imageUrl) {
                            setExpandedImage(item.imageUrl);
                          }
                        }}
                      >
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            className="object-cover rounded-full pointer-events-none"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-lg">🐾</span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm md:text-base text-gray-900 truncate">
                          {item.nickname}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-500 truncate">
                          {item.name}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Timer className="w-3 h-3 md:w-4 md:h-4 text-purple-500" />
                        <span className="font-medium text-xs md:text-sm text-gray-900 whitespace-nowrap">
                          {item.score.toFixed(1)}초
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CuteCard>
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/50 via-pink-50/50 to-white">
      <div className="max-w-6xl mx-auto px-3 md:px-4 py-6 md:py-8">
        {/* AdSense - 최상단 */}
        {adsenseId && (
          <div className="mb-6 md:mb-8">
            <AdSense
              adClient={adsenseId}
              adFormat="auto"
              fullWidthResponsive={true}
              style={{ display: 'block', minHeight: '100px' }}
            />
          </div>
        )}


        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 md:mb-8"
        >
          <div className="flex items-center justify-center space-x-2 mb-3 md:mb-4">
            <Gamepad2 className="w-6 h-6 md:w-8 md:h-8 text-purple-500" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              게임 랭킹
            </h1>
            <Trophy className="w-6 h-6 md:w-8 md:h-8 text-yellow-500" />
          </div>
          <p className="text-gray-600 text-base md:text-lg px-4">
            이번 주 최고 기록을 달성한 플레이어들! 🎮
          </p>
        </motion.div>

        {/* 내 랭킹 */}
        {renderMyRanking()}

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
          </div>
        ) : (
          <>
            {/* 이번주 랭킹 */}
            {renderPodium(currentWeekRankings, '🔥 이번주 실시간 랭킹')}

            {/* 지난주 랭킹 */}
            {renderPodium(lastWeekRankings, '🏆 지난주 확정 랭킹')}
          </>
        )}

        {/* 게임하러 가기 버튼 */}
        <div className="mt-8 text-center">
          <Link href="/game">
            <CuteButton variant="primary" size="lg">
              게임하러 가기
            </CuteButton>
          </Link>
        </div>

        {/* 이미지 확대 모달 */}
        {expandedImage && (
          <div
            className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-4"
            onClick={() => {
              setExpandedImage(null);
            }}
          >
            {/* X 버튼 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setExpandedImage(null);
              }}
              className="absolute top-4 right-4 bg-white/90 hover:bg-white rounded-full p-2 transition-colors z-[10000]"
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

        {/* 공동 순위 전체 보기 모달 */}
        {showAllModal && (
          <div
            className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-4"
            onClick={() => {
              setShowAllModal(null);
            }}
          >
            <div
              className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 헤더 */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
                <div className="flex items-center gap-3">
                  {getRankIcon(showAllModal.rank)}
                  <h2 className="text-2xl font-bold text-gray-900">
                    공동 {showAllModal.rank}위 ({showAllModal.items.length}명)
                  </h2>
                </div>
                <button
                  onClick={() => setShowAllModal(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="닫기"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              {/* 플레이어 목록 */}
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {showAllModal.items.map((item, idx) => (
                    <motion.div
                      key={item.scoreId || `${item.userId}-${idx}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                    >
                      <CuteCard className="text-center" padding="sm">
                        <div
                          className="relative aspect-square mb-2 cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => {
                            if (item.imageUrl) {
                              setShowAllModal(null);
                              setExpandedImage(item.imageUrl);
                            }
                          }}
                        >
                          {item.imageUrl ? (
                            <Image
                              src={item.imageUrl}
                              alt={item.name}
                              fill
                              className="object-cover rounded-xl"
                              unoptimized
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 rounded-xl flex items-center justify-center">
                              <span className="text-3xl">🐾</span>
                            </div>
                          )}
                        </div>
                        <h3 className="font-bold text-sm text-gray-900 truncate">
                          {item.nickname}
                        </h3>
                        <p className="text-xs text-gray-500 truncate">{item.name}</p>
                        <div className="flex items-center justify-center gap-1 mt-2">
                          <Timer className="w-3 h-3 text-purple-500" />
                          <span className="text-xs font-medium text-gray-700">
                            {item.score.toFixed(1)}초
                          </span>
                        </div>
                      </CuteCard>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
