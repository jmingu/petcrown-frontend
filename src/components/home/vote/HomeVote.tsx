'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Crown, ArrowRight } from 'lucide-react';
import CuteCard from '@/components/common/card/CuteCard';
import CuteButton from '@/components/common/button/CuteButton';
import CuteBadge from '@/components/common/badge/CuteBadge';
import { getVoteList } from '@/libs/api/vote/voteApi';
import { VotePetResponse } from '@/libs/interface/api/vote/voteResponseInterface';

export default function HomeVote() {
  const [votes, setVotes] = useState<VotePetResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadVotes();
  }, []);

  const loadVotes = async () => {
    setIsLoading(true);
    try {
      const response = await getVoteList({ page: 0, size: 3 }); // 최신 3개만 가져오기
      if (response.resultCode === 200 && response.result) {
        setVotes(response.result.votes);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  // 최신 3개의 투표만 표시
  const featuredVotes = votes.slice(0, 3);

  return (
    <section className="space-y-8">
      {/* 섹션 헤더 */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center space-x-2 mb-4"
        >
          <Crown className="w-8 h-8 text-yellow-500" />
          <h2 className="text-3xl font-bold text-gray-900">
            인기 투표
          </h2>
        </motion.div>
        <p className="text-gray-600 text-lg">
          최신 반려동물 투표에 참여해보세요!
        </p>
      </div>

      {/* 투표 카드들 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
          </div>
        ) : featuredVotes.length > 0 ? featuredVotes.map((vote, index) => (
          <motion.div
            key={vote.voteId}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Link href={`/vote/${vote.voteId}`}>
              <CuteCard hover className="h-full" padding="lg">
                {/* 펫 이미지 */}
                <div className="relative mb-4">
                  <div className="w-full aspect-square relative">
                    {vote.profileImageUrl ? (
                      <Image
                        src={vote.profileImageUrl}
                        alt={vote.name}
                        fill
                        className="rounded-2xl object-cover shadow-lg hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl">
                        <span className="text-6xl">🐾</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 펫 정보 */}
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center justify-center space-x-2">
                    <span>{vote.name}</span>
                    <Heart className="w-5 h-5 text-pink-500" fill="currentColor" />
                  </h3>

                  {/* 투표수 표시 */}
                  <div className="flex items-center justify-center space-x-1">
                    <Heart className="w-4 h-4 text-red-500" fill="currentColor" />
                    <span className="font-bold text-gray-900">{vote.weeklyVoteCount.toLocaleString()}표</span>
                  </div>

                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex justify-center items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        vote.gender === 'M'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-pink-100 text-pink-700'
                      }`}>
                        {vote.gender === 'M' ? '♂ 남아' : '♀ 여아'}
                      </span>
                    </div>

                    <p className="font-medium text-gray-700">
                      {vote.speciesName} {vote.speciesName === '강아지' || vote.speciesName === '개' ? '🐶' : vote.speciesName === '고양이' ? '🐱' : '🐹'}
                    </p>

                    {/* 품종 또는 커스텀 품종 표시 */}
                    {vote.breedId && vote.breedName ? (
                      <p className="text-gray-500 text-sm">{vote.breedName}</p>
                    ) : vote.customBreed ? (
                      <p className="text-gray-500 text-sm">{vote.customBreed}</p>
                    ) : null}
                  </div>
                </div>
              </CuteCard>
            </Link>
          </motion.div>
        )) : (
          <div className="col-span-full text-center py-12">
            <Crown className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">등록된 투표가 없습니다</p>
          </div>
        )}
      </div>

      {/* 더보기 버튼 */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-center"
      >
        <Link href="/vote">
          <CuteButton
            variant="primary"
            size="lg"
          >
            모든 투표 보기
          </CuteButton>
        </Link>
      </motion.div>
    </section>
  );
}