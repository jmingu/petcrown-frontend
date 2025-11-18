'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  Heart, Plus,
  Calendar, Trophy, User, ArrowRight
} from 'lucide-react';
import CuteButton from '@/components/common/button/CuteButton';
import CuteCard from '@/components/common/card/CuteCard';
import CuteBadge from '@/components/common/badge/CuteBadge';
import CuteAvatar from '@/components/common/avatar/CuteAvatar';
import AdSense from '@/components/common/adsense/AdSense';
import { getVoteList } from '@/libs/api/vote/voteApi';
import { VotePetResponse } from '@/libs/interface/api/vote/voteResponseInterface';
import { calculateAge } from '@/common/util/calculateUtil';

type PeriodType = 'weekly' | 'monthly';

export default function VotePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [votes, setVotes] = useState<VotePetResponse[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('weekly');
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID || '';

  // URL에서 페이지 번호 가져오기
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const ITEMS_PER_PAGE = 12;

  // 페이지네이션
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  useEffect(() => {
    loadVotes();
  }, [currentPage]);

  const loadVotes = async () => {
    setIsLoading(true);
    try {
      const response = await getVoteList({ page: currentPage - 1, size: ITEMS_PER_PAGE });
      if (response.resultCode === 200) {
        setVotes(response.result.votes);
        setTotalCount(response.result.totalCount);
      }
    } catch (error) {
      
      // 개발/테스트 용도 - 임시 샘플 데이터
      const sampleVotes = Array.from({ length: 6 }, (_, i) => ({
        voteId: i + 1,
        petId: i + 1,
        name: `테스트펫${i + 1}`,
        gender: i % 2 === 0 ? 'M' : 'F',
        birthDate: '2020-01-01',
        breedId: 1,
        breedName: '골든 리트리버',
        speciesId: 1,
        speciesName: '개',
        dailyVoteCount: Math.floor(Math.random() * 50) + 10,
        weeklyVoteCount: Math.floor(Math.random() * 200) + 50,
        monthlyVoteCount: Math.floor(Math.random() * 1000) + 100,
        voteMonth: '2024-09',
        profileImageUrl: `https://images.unsplash.com/photo-155205383${i + 1}-71594a27632d?w=400`
      }));
      
      setVotes(sampleVotes);
      setTotalCount(sampleVotes.length);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    router.push(`/vote?page=${page}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/50 via-pink-50/50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* AdSense - 최상단 */}
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

        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Trophy className="w-10 h-10 text-yellow-500" />
            </motion.div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
              투표하기
            </h1>
            <motion.div
              animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
              <Trophy className="w-10 h-10 text-yellow-500" />
            </motion.div>
          </div>
          <p className="text-gray-700 text-xl font-medium">
            가장 귀여운 반려동물을 선택해주세요! 💕
          </p>
        </motion.div>

        {/* 투표 등록 버튼 (모바일 우선) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center md:justify-end mb-6"
        >
          <Link href="/vote/register">
            <CuteButton variant="primary" size="lg" icon={<Plus className="w-5 h-5" />}>
              투표 등록하기
            </CuteButton>
          </Link>
        </motion.div>

        {/* 기간별 탭 */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex bg-white rounded-2xl p-1.5 shadow-sm border border-gray-200">
            <button
              onClick={() => {
                setSelectedPeriod('weekly');
                setCurrentPage(1);
              }}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                selectedPeriod === 'weekly'
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>주간 투표</span>
              </div>
            </button>
            <button
              onClick={() => {
                setSelectedPeriod('monthly');
                setCurrentPage(1);
              }}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                selectedPeriod === 'monthly'
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Trophy className="w-4 h-4" />
                <span>월간 투표</span>
              </div>
            </button>
          </div>
        </motion.div> */}

        {/* 투표 목록 */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {votes.length > 0 ? (
                votes.map((vote, index) => (
                  <motion.div
                    key={vote.voteId}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Link href={`/vote/${vote.voteId}?from=page-${currentPage}`}>
                      <CuteCard hover className="h-full" padding="lg" glassmorphism>
                        {/* 펫 이미지 */}
                        <div className="relative mb-4">
                          <div className="w-full aspect-square relative">
                            {vote.profileImageUrl ? (
                              <Image
                                src={vote.profileImageUrl}
                                alt={vote.name}
                                fill
                                className="rounded-3xl object-cover shadow-xl hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl">
                                <span className="text-6xl">🐾</span>
                              </div>
                            )}
                            {/* 투표수 배지 */}
                            <div className="absolute top-3 right-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white backdrop-blur-sm rounded-2xl px-3 py-2 shadow-lg">
                              <div className="flex items-center space-x-1">
                                <Heart className="w-4 h-4" fill="currentColor" />
                                <span className="font-bold">{selectedPeriod === 'weekly' ? vote.weeklyVoteCount.toLocaleString() : vote.monthlyVoteCount.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 펫 정보 */}
                        <div className="text-center space-y-3">
                          <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center justify-center space-x-2">
                            <span>{vote.name}</span>
                            <Heart className="w-5 h-5 text-pink-500 animate-bounce-subtle" fill="currentColor" />
                          </h3>

                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex justify-center items-center space-x-2">
                              {vote.gender && (
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  vote.gender === 'M'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-pink-100 text-pink-700'
                                }`}>
                                  {vote.gender === 'M' ? '♂ 남아' : '♀ 여아'}
                                </span>
                              )}
                              {vote.birthDate && calculateAge(vote.birthDate) !== null && (
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                                  {calculateAge(vote.birthDate)}살
                                </span>
                              )}
                            </div>

                            <p className="font-medium text-gray-700">
                              {vote.speciesName} {vote.speciesName === '강아지' ? '🐶' : vote.speciesName === '고양이' ? '🐱' : '🐹'}
                            </p>

                            {/* 품종 또는 커스텀 품종 표시 */}
                            {vote.breedId && vote.breedName ? (
                              <p className="text-gray-500 text-sm">{vote.breedName}</p>
                            ) : vote.customBreed ? (
                              <p className="text-gray-500 text-sm">{vote.customBreed}</p>
                            ) : null}

                            {/* 감정 표시 */}
                            {vote.petModeName && (
                              <div className="flex justify-center mt-2">
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700">
                                  {vote.petModeName}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </CuteCard>
                    </Link>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-20">
                  <div className="text-gray-400 mb-4">
                    <Heart className="w-16 h-16 mx-auto mb-4" />
                    <p className="text-xl font-medium">해당하는 투표가 없습니다</p>
                    <p className="text-gray-500 mt-2">다른 필터 조건을 시도해보세요</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex justify-center items-center space-x-2"
          >
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl bg-white border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-50 transition-colors duration-200"
            >
              <ArrowRight className="w-5 h-5 transform rotate-180" />
            </button>
            
            <div className="flex space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-10 h-10 rounded-xl font-medium transition-all duration-200 ${
                      currentPage === pageNum
                        ? 'bg-purple-500 text-white shadow-md'
                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-purple-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl bg-white border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-50 transition-colors duration-200"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}