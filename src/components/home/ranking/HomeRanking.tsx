'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Trophy, Crown, Heart, X, Medal } from 'lucide-react';
import CuteCard from '@/components/common/card/CuteCard';
import CuteButton from '@/components/common/button/CuteButton';
import CuteBadge from '@/components/common/badge/CuteBadge';
import ImageModal from '@/components/common/modal/ImageModal';
import { getCurrentWeekRanking } from '@/libs/api/ranking/rankingApi';
import { VotePetRanking } from '@/libs/interface/api/ranking/rankingResponseInterface';

export default function HomeRanking() {
  const [rankings, setRankings] = useState<VotePetRanking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageAlt, setSelectedImageAlt] = useState<string>('');
  const [showAllModal, setShowAllModal] = useState<{ items: VotePetRanking[], rank: number } | null>(null);

  useEffect(() => {
    loadRankings();
  }, []);

  const loadRankings = async () => {
    setIsLoading(true);
    try {
      const response = await getCurrentWeekRanking();
      if (response.resultCode === 200 && response.result) {
        setRankings(response.result.ranking);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const getRankingIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Trophy className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Trophy className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="text-2xl font-bold text-gray-600">#{rank}</span>;
    }
  };

  const renderSinglePodiumCard = (item: VotePetRanking, rank: number, orderClass: string, delay: number) => {
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
    const imageSize = isFirst ? 'w-20 h-20 md:w-24 md:h-24' : 'w-16 h-16 md:w-20 md:h-20';

    return (
      <div className={`${orderClass} flex-1 ${isFirst ? 'md:max-w-[280px]' : isSecond ? 'md:max-w-[240px]' : 'md:max-w-[220px]'} lg:max-w-sm`}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay }}
        >
          <CuteCard className="text-center relative overflow-visible">
            <div className={`absolute top-0 left-0 right-0 ${heightClass} bg-gradient-to-r ${gradientClass}`} style={{ pointerEvents: 'none' }}></div>
            <div className={`${isFirst ? 'pt-6 pb-4' : 'pt-4 pb-3'} px-2`}>
              <div className="flex justify-center mb-3" style={{ pointerEvents: 'none' }}>
                {getRankingIcon(rank)}
              </div>
              <div
                className={`relative ${imageSize} mx-auto mb-3 cursor-pointer hover:opacity-80 transition-opacity z-10`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (item.profileImageUrl) {
                    setSelectedImage(item.profileImageUrl);
                    setSelectedImageAlt(item.name);
                  }
                }}
              >
                {item.profileImageUrl ? (
                  <>
                    <Image
                      src={item.profileImageUrl}
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
              <Link href={`/vote/${item.voteId}`}>
                <h3 className={`font-bold ${isFirst ? 'text-lg md:text-xl' : 'text-base md:text-lg'} text-gray-900 mb-1 truncate px-2 cursor-pointer hover:opacity-80 transition-opacity`}>
                  {item.nickname || item.name}
                </h3>
              </Link>
              <p className="text-xs md:text-sm text-gray-500 mb-2 truncate px-2">
                {item.name}
              </p>
              <div className={`flex items-center justify-center space-x-2 ${isFirst ? 'mb-3' : ''}`}>
                <Heart className={`${isFirst ? 'w-4 h-4 md:w-5 md:h-5' : 'w-3 h-3 md:w-4 md:h-4'} text-red-500`} fill="currentColor" />
                <span className={`font-bold ${isFirst ? 'text-lg md:text-xl text-yellow-600' : 'text-sm md:text-base text-gray-900'}`}>
                  {item.weeklyVoteCount.toLocaleString()}표
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

  const renderMultiplePodiumCard = (items: VotePetRanking[], rank: number, orderClass: string, delay: number) => {
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
                {getRankingIcon(rank)}
              </div>
              <div className="mb-3">
                <p className={`font-bold ${isFirst ? 'text-lg md:text-xl' : 'text-base md:text-lg'} text-gray-900`}>공동 {rank}위</p>
                <p className="text-xs md:text-sm text-gray-500 mb-2">{items.length}명</p>
              </div>

              {/* 펫 프로필 이미지 그리드 */}
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
                    key={`${item.voteId}-${idx}`}
                    className={`relative ${items.length === 3 ? 'w-[calc(50%-0.25rem)]' : ''}`}
                  >
                    <div
                      className="relative aspect-square cursor-pointer hover:opacity-80 transition-opacity group"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (item.profileImageUrl) {
                          setSelectedImage(item.profileImageUrl);
                          setSelectedImageAlt(item.name);
                        }
                      }}
                    >
                      {item.profileImageUrl ? (
                        <>
                          <Image
                            src={item.profileImageUrl}
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
                      <p className="text-xs font-medium text-gray-900 truncate">{item.nickname || '익명'}</p>
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
                <Heart className={`${isFirst ? 'w-4 h-4 md:w-5 md:h-5' : 'w-3 h-3 md:w-4 md:h-4'} text-red-500`} fill="currentColor" />
                <span className={`font-bold ${isFirst ? 'text-lg md:text-xl text-yellow-600' : 'text-sm md:text-base text-gray-900'}`}>
                  {items[0].weeklyVoteCount.toLocaleString()}표
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
    const isFirst = rank === 1;
    const isSecond = rank === 2;
    const gradientClass = rank === 1
      ? 'from-yellow-400 to-yellow-600'
      : rank === 2
      ? 'from-gray-300 to-gray-500'
      : 'from-orange-300 to-orange-500';

    const heightClass = isFirst ? 'h-3' : isSecond ? 'h-2' : 'h-1.5';
    const imageSize = rank === 1 ? 'w-20 h-20 md:w-24 md:h-24' : 'w-16 h-16 md:w-20 md:h-20';

    return (
      <div className={`${orderClass} flex-1 ${isFirst ? 'md:max-w-[280px]' : isSecond ? 'md:max-w-[240px]' : 'md:max-w-[220px]'} lg:max-w-sm`}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay }}
        >
          <CuteCard className="text-center relative overflow-hidden opacity-50">
            <div className={`absolute top-0 left-0 right-0 ${heightClass} bg-gradient-to-r ${gradientClass}`}></div>
            <div className={isFirst ? 'pt-6 pb-4' : 'pt-4 pb-3'}>
              <div className="flex justify-center mb-3">
                {rank === 1 ? (
                  <Crown className="w-6 h-6 md:w-8 md:h-8 text-gray-400" />
                ) : (
                  getRankingIcon(rank)
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

  const renderPodium = () => {
    const rank1Items = rankings.filter(item => item.rank === 1);
    const rank2Items = rankings.filter(item => item.rank === 2);
    const rank3Items = rankings.filter(item => item.rank === 3);

    return (
      <div className="flex flex-col md:flex-row md:items-end justify-center gap-4 md:gap-6 mb-8">
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
    );
  };

  return (
    <section className="space-y-8 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 -mx-4 px-4 py-12 rounded-3xl">
      {/* 섹션 헤더 */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center space-x-2 mb-4"
        >
          <h2 className="text-3xl font-bold text-gray-900">
            🏆 이번 주 랭킹
          </h2>
        </motion.div>
        <p className="text-gray-700 text-lg font-medium">
          가장 사랑받는 반려동물들을 만나보세요!
        </p>
      </div>

      {/* 상위 3위 포디움 */}
      {!isLoading && rankings.length > 0 && renderPodium()}

      {/* 로딩 상태 */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-500 border-t-transparent"></div>
        </div>
      )}

      {/* 데이터 없음 */}
      {!isLoading && rankings.length === 0 && (
        <div className="text-center py-12">
          <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">등록된 투표가 없습니다</p>
        </div>
      )}

      {/* 더보기 버튼 */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-center"
      >
        <Link href="/ranking">
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
                {getRankingIcon(showAllModal.rank)}
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

            {/* 펫 목록 */}
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {showAllModal.items.map((item, idx) => (
                  <motion.div
                    key={`${item.voteId}-${idx}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                  >
                    <Link href={`/vote/${item.voteId}`}>
                      <CuteCard className="text-center cursor-pointer hover:shadow-xl transition-shadow" padding="sm">
                        <div
                          className="relative aspect-square mb-2"
                          onClick={(e) => {
                            e.preventDefault();
                            if (item.profileImageUrl) {
                              setShowAllModal(null);
                              setSelectedImage(item.profileImageUrl);
                              setSelectedImageAlt(item.name);
                            }
                          }}
                        >
                          {item.profileImageUrl ? (
                            <Image
                              src={item.profileImageUrl}
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
                          {item.nickname || item.name}
                        </h3>
                        <p className="text-xs text-gray-500 truncate">{item.name}</p>
                        <div className="flex items-center justify-center gap-1 mt-2">
                          <Heart className="w-3 h-3 text-red-500" fill="currentColor" />
                          <span className="text-xs font-medium text-gray-700">
                            {item.weeklyVoteCount.toLocaleString()}표
                          </span>
                        </div>
                      </CuteCard>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
