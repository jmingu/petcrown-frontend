'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  Trophy, Crown, Medal, Star
} from 'lucide-react';
import CuteCard from '@/components/common/card/CuteCard';
import CuteBadge from '@/components/common/badge/CuteBadge';
import AdSense from '@/components/common/adsense/AdSense';
import { getCurrentWeekRanking, getLastWeekRanking } from '@/libs/api/ranking/rankingApi';

export default function RankingPage() {
  const [currentWeekRankings, setCurrentWeekRankings] = useState<any[]>([]);
  const [lastWeekRankings, setLastWeekRankings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID || '';

  useEffect(() => {
    loadRankings();
  }, []);

  const loadRankings = async () => {
    setIsLoading(true);
    try {
      const [currentResponse, lastResponse] = await Promise.all([
        getCurrentWeekRanking(),
        getLastWeekRanking(),
      ]);

      if (currentResponse.resultCode === 200 && currentResponse.result) {
        setCurrentWeekRankings(currentResponse.result.ranking || []);
      }

      if (lastResponse.resultCode === 200 && lastResponse.result) {
        setLastWeekRankings(lastResponse.result.ranking || []);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
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

  const calculateAge = (birthDate: string | null | undefined) => {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    const today = new Date();
    return today.getFullYear() - birth.getFullYear();
  };

  const renderPodium = (rankings: any[], title: string) => {
    const topThree = rankings.slice(0, 3);
    const otherRankings = rankings.slice(3);

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
          {/* 모바일: 세로 배치, 데스크톱: 가로 배치 */}
          <div className="flex flex-col md:flex-row md:items-end justify-center gap-4 md:gap-6">
            {/* 모바일에서는 1위가 먼저 */}
            <div className="order-2 md:order-1 flex-1 md:max-w-[200px] lg:max-w-xs">
              {/* 2위 */}
              {topThree[1] ? (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <CuteCard className="text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-gray-300 to-gray-500"></div>
                    <div className="pt-4 pb-3 px-2">
                      <div className="flex justify-center mb-3">
                        {getRankIcon(2)}
                      </div>
                      <div className="relative w-16 h-16 md:w-20 md:h-20 mx-auto mb-3">
                        {topThree[1].profileImageUrl ? (
                          <Image
                            src={topThree[1].profileImageUrl}
                            alt={topThree[1].name}
                            fill
                            className="object-cover rounded-full ring-4 ring-gray-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-2xl">🐾</span>
                          </div>
                        )}
                      </div>
                      <h3 className="font-bold text-base md:text-lg text-gray-900 mb-1 truncate px-2">
                        {topThree[1].name}
                      </h3>
                      <p className="text-xs md:text-sm text-gray-500 mb-2 truncate px-2">
                        {topThree[1].breedName || topThree[1].speciesName}
                        {calculateAge(topThree[1].birthDate) !== null && ` • ${calculateAge(topThree[1].birthDate)}살`}
                      </p>
                      <div className="flex items-center justify-center space-x-2">
                        <Trophy className="w-3 h-3 md:w-4 md:h-4 text-yellow-500" />
                        <span className="font-bold text-sm md:text-base text-gray-900">
                          {topThree[1].weeklyVoteCount.toLocaleString()}표
                        </span>
                      </div>
                    </div>
                  </CuteCard>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <CuteCard className="text-center relative overflow-hidden opacity-50">
                    <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-gray-300 to-gray-500"></div>
                    <div className="pt-4 pb-3">
                      <div className="flex justify-center mb-3">
                        {getRankIcon(2)}
                      </div>
                      <div className="relative w-16 h-16 md:w-20 md:h-20 mx-auto mb-3 bg-gray-200 rounded-full"></div>
                      <p className="text-gray-400 text-xs md:text-sm">2위 자리 비어있음</p>
                    </div>
                  </CuteCard>
                </motion.div>
              )}
            </div>

            {/* 1위 */}
            <div className="order-1 md:order-2 flex-1 md:max-w-[220px] lg:max-w-xs md:-mt-8">
              {topThree[0] ? (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <CuteCard className="text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-yellow-400 to-yellow-600"></div>
                    <div className="pt-6 pb-4 px-2">
                      <div className="flex justify-center mb-3">
                        <motion.div
                          animate={{ rotate: [0, -5, 5, 0] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                          {getRankIcon(1)}
                        </motion.div>
                      </div>
                      <div className="relative w-20 h-20 md:w-24 md:h-24 mx-auto mb-3">
                        {topThree[0].profileImageUrl ? (
                          <>
                            <Image
                              src={topThree[0].profileImageUrl}
                              alt={topThree[0].name}
                              fill
                              className="object-cover rounded-full ring-4 ring-yellow-400"
                            />
                            <div className="absolute -top-2 -right-2">
                              <Crown className="w-6 h-6 md:w-8 md:h-8 text-yellow-500" />
                            </div>
                          </>
                        ) : (
                          <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center ring-4 ring-yellow-400">
                            <span className="text-3xl">🐾</span>
                          </div>
                        )}
                      </div>
                      <h3 className="font-bold text-lg md:text-xl text-gray-900 mb-1 truncate px-2">
                        {topThree[0].name}
                      </h3>
                      <p className="text-xs md:text-sm text-gray-500 mb-3 truncate px-2">
                        {topThree[0].breedName || topThree[0].speciesName}
                        {calculateAge(topThree[0].birthDate) !== null && ` • ${calculateAge(topThree[0].birthDate)}살`}
                      </p>
                      <div className="flex items-center justify-center space-x-2 mb-3">
                        <Trophy className="w-4 h-4 md:w-5 md:h-5 text-yellow-500" />
                        <span className="font-bold text-lg md:text-xl text-yellow-600">
                          {topThree[0].weeklyVoteCount.toLocaleString()}표
                        </span>
                      </div>
                      <CuteBadge variant="cute" size="sm">
                        👑 1등
                      </CuteBadge>
                    </div>
                  </CuteCard>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <CuteCard className="text-center relative overflow-hidden opacity-50">
                    <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-yellow-400 to-yellow-600"></div>
                    <div className="pt-6 pb-4">
                      <div className="flex justify-center mb-3">
                        <Crown className="w-6 h-6 md:w-8 md:h-8 text-gray-400" />
                      </div>
                      <div className="relative w-20 h-20 md:w-24 md:h-24 mx-auto mb-3 bg-gray-200 rounded-full"></div>
                      <p className="text-gray-400 text-xs md:text-sm">1위 자리 비어있음</p>
                    </div>
                  </CuteCard>
                </motion.div>
              )}
            </div>

            {/* 3위 */}
            <div className="order-3 flex-1 md:max-w-[200px] lg:max-w-xs">
              {topThree[2] ? (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <CuteCard className="text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-orange-300 to-orange-500"></div>
                    <div className="pt-4 pb-3 px-2">
                      <div className="flex justify-center mb-3">
                        {getRankIcon(3)}
                      </div>
                      <div className="relative w-16 h-16 md:w-20 md:h-20 mx-auto mb-3">
                        {topThree[2].profileImageUrl ? (
                          <Image
                            src={topThree[2].profileImageUrl}
                            alt={topThree[2].name}
                            fill
                            className="object-cover rounded-full ring-4 ring-orange-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-2xl">🐾</span>
                          </div>
                        )}
                      </div>
                      <h3 className="font-bold text-base md:text-lg text-gray-900 mb-1 truncate px-2">
                        {topThree[2].name}
                      </h3>
                      <p className="text-xs md:text-sm text-gray-500 mb-2 truncate px-2">
                        {topThree[2].breedName || topThree[2].speciesName}
                        {calculateAge(topThree[2].birthDate) !== null && ` • ${calculateAge(topThree[2].birthDate)}살`}
                      </p>
                      <div className="flex items-center justify-center space-x-2">
                        <Trophy className="w-3 h-3 md:w-4 md:h-4 text-yellow-500" />
                        <span className="font-bold text-sm md:text-base text-gray-900">
                          {topThree[2].weeklyVoteCount.toLocaleString()}표
                        </span>
                      </div>
                    </div>
                  </CuteCard>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <CuteCard className="text-center relative overflow-hidden opacity-50">
                    <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-orange-300 to-orange-500"></div>
                    <div className="pt-4 pb-3">
                      <div className="flex justify-center mb-3">
                        {getRankIcon(3)}
                      </div>
                      <div className="relative w-16 h-16 md:w-20 md:h-20 mx-auto mb-3 bg-gray-200 rounded-full"></div>
                      <p className="text-gray-400 text-xs md:text-sm">3위 자리 비어있음</p>
                    </div>
                  </CuteCard>
                </motion.div>
              )}
            </div>
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
                    key={`${item.petId}-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className="flex items-center p-3 md:p-4 hover:bg-orange-50 rounded-2xl transition-colors duration-200"
                  >
                    <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
                      <div className="flex-shrink-0">
                        {getRankIcon(index + 4)}
                      </div>

                      <div className="relative w-10 h-10 md:w-12 md:h-12 flex-shrink-0">
                        {item.profileImageUrl ? (
                          <Image
                            src={item.profileImageUrl}
                            alt={item.name}
                            fill
                            className="object-cover rounded-full"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-lg">🐾</span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm md:text-base text-gray-900 truncate">
                          {item.name}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-500 truncate">
                          {item.breedName || item.speciesName}
                          {calculateAge(item.birthDate) !== null && ` • ${calculateAge(item.birthDate)}살`}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Trophy className="w-3 h-3 md:w-4 md:h-4 text-yellow-500" />
                        <span className="font-medium text-xs md:text-sm text-gray-900 whitespace-nowrap">
                          {item.weeklyVoteCount.toLocaleString()}표
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
            <Trophy className="w-6 h-6 md:w-8 md:h-8 text-yellow-500" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              랭킹
            </h1>
            <Trophy className="w-6 h-6 md:w-8 md:h-8 text-yellow-500" />
          </div>
          <p className="text-gray-600 text-base md:text-lg px-4">
            가장 인기 있는 반려동물들을 만나보세요! 🏆
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-500 border-t-transparent"></div>
          </div>
        ) : (
          <>
            {/* 이번주 랭킹 */}
            {renderPodium(currentWeekRankings, '🔥 이번주 실시간 랭킹')}

            {/* 지난주 랭킹 */}
            {renderPodium(lastWeekRankings, '🏆 지난주 확정 랭킹')}
          </>
        )}
      </div>
    </div>
  );
}
