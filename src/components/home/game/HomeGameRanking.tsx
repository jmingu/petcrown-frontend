'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Crown, Timer } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import CuteCard from '@/components/common/card/CuteCard';
import CuteButton from '@/components/common/button/CuteButton';
import ImageModal from '@/components/common/modal/ImageModal';
import { getWeeklyRankings } from '@/libs/api/game/gameApi';
import { RankingItemDto } from '@/libs/interface/api/game/gameInterface';

export default function HomeGameRanking() {
  const [rankings, setRankings] = useState<RankingItemDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageAlt, setSelectedImageAlt] = useState<string>('');

  useEffect(() => {
    loadRankings();
  }, []);

  const loadRankings = async () => {
    try {
      setIsLoading(true);
      const response = await getWeeklyRankings();
      if (response.resultCode === 200 && response.result) {
        setRankings(response.result.rankings.slice(0, 3)); // 상위 3개만
      }
    } catch (error) {
      setRankings([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="space-y-8 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 -mx-4 px-4 py-12 rounded-3xl">
      {/* 섹션 헤더 */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center space-x-2 mb-4"
        >
          <h2 className="text-3xl font-bold text-gray-900">
            🎮 게임 랭킹
          </h2>
        </motion.div>
        <p className="text-gray-700 text-lg font-medium">
          최고 기록을 달성한 플레이어들을 만나보세요!
        </p>
      </div>

      {/* 상위 3위 포디움 */}
      {!isLoading && rankings.length > 0 && (
        <div className="flex flex-col md:flex-row md:items-end justify-center gap-4 md:gap-6 mb-8">
          {/* 2위 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="order-2 md:order-1 flex-1 md:max-w-[200px] lg:max-w-xs"
          >
            {rankings.length >= 2 ? (
              <CuteCard hover padding="lg" className="bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="relative mb-4">
                  <div
                    className="w-full aspect-square relative cursor-pointer group"
                    onClick={(e) => {
                      e.preventDefault();
                      if (rankings[1].imageUrl) {
                        setSelectedImage(rankings[1].imageUrl);
                        setSelectedImageAlt(rankings[1].nickname);
                      }
                    }}
                  >
                    {rankings[1].imageUrl ? (
                      <Image
                        src={rankings[1].imageUrl}
                        alt={rankings[1].nickname}
                        fill
                        className="rounded-2xl object-cover shadow-lg group-hover:scale-105 transition-transform duration-300"
                        style={{ pointerEvents: 'none' }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl">
                        <span className="text-6xl">🐾</span>
                      </div>
                    )}
                    <div className="absolute top-2 left-2" style={{ pointerEvents: 'none' }}>
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-gray-300 to-gray-500 flex items-center justify-center shadow-lg">
                        <Trophy className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-gray-600">2위</div>
                  <h3 className="text-lg font-bold text-gray-800">{rankings[1].nickname}</h3>
                  <p className="text-sm text-gray-600">{rankings[1].name}</p>
                  <div className="flex items-center justify-center space-x-1 mt-2">
                    <Timer className="w-4 h-4 text-purple-500" />
                    <span className="font-bold text-gray-900">{rankings[1].score.toFixed(1)}초</span>
                  </div>
                </div>
              </CuteCard>
            ) : (
              <CuteCard padding="lg" className="bg-gradient-to-br from-gray-50 to-gray-100 opacity-50">
                <div className="relative mb-4">
                  <div className="w-full aspect-square relative bg-gray-200 rounded-2xl flex items-center justify-center">
                    <Trophy className="w-12 h-12 text-gray-400" />
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-gray-400">2위</div>
                  <p className="text-sm text-gray-500">비어있음</p>
                </div>
              </CuteCard>
            )}
          </motion.div>

          {/* 1위 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="order-1 md:order-2 flex-1 md:max-w-[220px] lg:max-w-xs md:-mt-8"
          >
            <CuteCard hover padding="lg" className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-400">
              <div className="relative mb-4">
                <div
                  className="w-full aspect-square relative cursor-pointer group"
                  onClick={(e) => {
                    e.preventDefault();
                    if (rankings[0].imageUrl) {
                      setSelectedImage(rankings[0].imageUrl);
                      setSelectedImageAlt(rankings[0].nickname);
                    }
                  }}
                >
                  {rankings[0].imageUrl ? (
                    <Image
                      src={rankings[0].imageUrl}
                      alt={rankings[0].nickname}
                      fill
                      className="rounded-2xl object-cover shadow-xl group-hover:scale-105 transition-transform duration-300"
                      style={{ pointerEvents: 'none' }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl">
                      <span className="text-6xl">🐾</span>
                    </div>
                  )}
                  <div className="absolute top-2 left-2" style={{ pointerEvents: 'none' }}>
                    <div className="w-14 h-14 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center shadow-xl animate-pulse">
                      <Crown className="w-7 h-7 text-white" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-yellow-600">1위</div>
                <h3 className="text-xl font-bold text-gray-800">{rankings[0].nickname}</h3>
                <p className="text-sm text-gray-600">{rankings[0].name}</p>
                <div className="flex items-center justify-center space-x-1 mt-2">
                  <Timer className="w-5 h-5 text-purple-500" />
                  <span className="font-bold text-yellow-600 text-lg">{rankings[0].score.toFixed(1)}초</span>
                </div>
              </div>
            </CuteCard>
          </motion.div>

          {/* 3위 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="order-3 flex-1 md:max-w-[200px] lg:max-w-xs"
          >
            {rankings.length >= 3 ? (
              <CuteCard hover padding="lg" className="bg-gradient-to-br from-amber-50 to-amber-100">
                <div className="relative mb-4">
                  <div
                    className="w-full aspect-square relative cursor-pointer group"
                    onClick={(e) => {
                      e.preventDefault();
                      if (rankings[2].imageUrl) {
                        setSelectedImage(rankings[2].imageUrl);
                        setSelectedImageAlt(rankings[2].nickname);
                      }
                    }}
                  >
                    {rankings[2].imageUrl ? (
                      <Image
                        src={rankings[2].imageUrl}
                        alt={rankings[2].nickname}
                        fill
                        className="rounded-2xl object-cover shadow-lg group-hover:scale-105 transition-transform duration-300"
                        style={{ pointerEvents: 'none' }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl">
                        <span className="text-6xl">🐾</span>
                      </div>
                    )}
                    <div className="absolute top-2 left-2" style={{ pointerEvents: 'none' }}>
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 flex items-center justify-center shadow-lg">
                        <Trophy className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-amber-600">3위</div>
                  <h3 className="text-lg font-bold text-gray-800">{rankings[2].nickname}</h3>
                  <p className="text-sm text-gray-600">{rankings[2].name}</p>
                  <div className="flex items-center justify-center space-x-1 mt-2">
                    <Timer className="w-4 h-4 text-purple-500" />
                    <span className="font-bold text-gray-900">{rankings[2].score.toFixed(1)}초</span>
                  </div>
                </div>
              </CuteCard>
            ) : (
              <CuteCard padding="lg" className="bg-gradient-to-br from-amber-50 to-amber-100 opacity-50">
                <div className="relative mb-4">
                  <div className="w-full aspect-square relative bg-amber-200 rounded-2xl flex items-center justify-center">
                    <Trophy className="w-12 h-12 text-amber-400" />
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-amber-400">3위</div>
                  <p className="text-sm text-gray-500">비어있음</p>
                </div>
              </CuteCard>
            )}
          </motion.div>
        </div>
      )}

      {/* 로딩 상태 */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
        </div>
      )}

      {/* 데이터 없음 */}
      {!isLoading && rankings.length === 0 && (
        <div className="text-center py-12">
          <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">등록된 게임 기록이 없습니다</p>
        </div>
      )}

      {/* 더보기 버튼 */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-center"
      >
        <Link href="/game/ranking">
          <CuteButton
            variant="primary"
            size="lg"
          >
            전체 랭킹 보기
          </CuteButton>
        </Link>
      </motion.div>

      {/* 이미지 확대 모달 */}
      <ImageModal
        isOpen={selectedImage !== null}
        onClose={() => setSelectedImage(null)}
        imageUrl={selectedImage || ''}
        alt={selectedImageAlt}
      />
    </section>
  );
}
