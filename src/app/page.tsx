'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Vote, Trophy, Sparkles } from 'lucide-react';
import HomeBanner from '@/components/home/banner/HomeBanner';
import HomeNotice from '@/components/home/notice/HomeNotice';
import HomeRanking from '@/components/home/ranking/HomeRanking';
import HomeCommunity from '@/components/home/community/HomeCommunity';
import HomeVote from '@/components/home/vote/HomeVote';
import FloatingActionButton from '@/components/common/floating/FloatingActionButton';
import AdSense from '@/components/common/adsense/AdSense';
import { getEventList } from '@/libs/api/event/eventApi';
import { Event } from '@/libs/interface/api/event/eventResponseInterface';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID || '';

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setIsLoading(true);
      const response = await getEventList({ page: 1, size: 10, search: '' });
      if (response.resultCode === 200 && response.result) {
        setEvents(response.result);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const getEventStatus = (event: Event) => {
    const now = new Date();
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);

    if (now < startDate) return '준비중';
    if (now >= startDate && now <= endDate) return '진행중';
    return '종료';
  };

  const getGradientColor = (index: number) => {
    const gradients = [
      'from-purple-400 via-pink-400 to-red-400',
      'from-blue-400 via-cyan-400 to-teal-400',
      'from-orange-400 via-yellow-400 to-amber-400',
      'from-green-400 via-emerald-400 to-lime-400',
      'from-rose-400 via-fuchsia-400 to-purple-400',
    ];
    return gradients[index % gradients.length];
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/50 via-pink-50/50 to-white">
      {/* 메인 콘텐츠 */}
      <div className="relative">
        <HomeBanner />

        {/* AdSense after Banner */}
        {adsenseId && (
          <div className="max-w-7xl mx-auto px-4 py-6">
            <AdSense
              adClient={adsenseId}
              adFormat="auto"
              fullWidthResponsive={true}
              style={{ display: 'block', minHeight: '100px' }}
            />
          </div>
        )}

        {/* 이벤트/광고 스크롤 섹션 */}
        {!isLoading && (
          <div className="bg-gradient-to-r from-purple-50/30 via-pink-50/30 to-purple-50/30 border-y border-purple-100 py-8">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="flex items-center justify-center space-x-2 mb-4"
                >
                  <h2 className="text-3xl font-bold text-gray-900">
                    🎉 이벤트
                  </h2>
                </motion.div>
                <p className="text-gray-600 text-lg">
                  펫크라운의 다양한 이벤트에 참여해보세요!
                </p>
              </div>

              <div className="overflow-x-auto scrollbar-hide">
                <div className="flex space-x-4 pb-2" style={{ minWidth: 'max-content' }}>
                  {/* 이벤트 카드들 */}
                  {events.length > 0 && events.map((event, index) => (
                    <Link
                      key={event.eventId}
                      href={`/event/${event.eventId}`}
                      className="flex-shrink-0 w-80 h-40 bg-gradient-to-r rounded-3xl text-white relative overflow-hidden cursor-pointer hover:scale-105 hover:shadow-2xl transition-all duration-300 shadow-lg"
                      style={{
                        backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`,
                      }}
                    >
                      {/* 배경 이미지 또는 디폴트 */}
                      {event.thumbnailUrl ? (
                        <>
                          <Image
                            src={event.thumbnailUrl}
                            alt={event.title}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                        </>
                      ) : (
                        <>
                          <div className={`absolute inset-0 bg-gradient-to-r ${getGradientColor(index)}`}></div>
                          <div className="absolute inset-0 bg-black/10"></div>
                          <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/20 rounded-full"></div>
                          <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-white/10 rounded-full"></div>
                        </>
                      )}

                      {/* 내용 */}
                      <div className="relative z-10 h-full flex flex-col justify-between p-6">
                        <div>
                          <div className="text-sm opacity-90 mb-1">EVENT {index + 1}</div>
                          <h3 className="text-xl font-bold mb-2 line-clamp-1">
                            {event.title}
                          </h3>
                          {event.content && (
                            <p className="text-sm opacity-90 line-clamp-2">
                              {event.content.replace(/<[^>]*>/g, '')}
                            </p>
                          )}
                        </div>
                        <div className="text-xs opacity-75">
                          {getEventStatus(event)}
                        </div>
                      </div>
                    </Link>
                  ))}

                  {/* 이벤트가 없을 때 표시 */}
                  {events.length === 0 && (
                    <div className="flex-shrink-0 w-80 h-40 border-2 border-dashed border-purple-300 rounded-3xl flex items-center justify-center text-purple-400 bg-white/50 backdrop-blur-sm">
                      <div className="text-center">
                        <div className="text-3xl mb-2">🎉</div>
                        <div className="font-bold text-purple-600">진행중인 이벤트가 없습니다</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AdSense after Event Section */}
        {adsenseId && (
          <div className="max-w-7xl mx-auto px-4 py-6">
            <AdSense
              adClient={adsenseId}
              adFormat="auto"
              fullWidthResponsive={true}
              style={{ display: 'block', minHeight: '100px' }}
            />
          </div>
        )}

        {/* 섹션들을 감싸는 컨테이너 */}
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
          {/* 인기 투표 섹션 */}
          <HomeVote />

          {/* AdSense after Vote */}
          {adsenseId && (
            <div className="my-8">
              <AdSense
                adClient={adsenseId}
                adFormat="auto"
                fullWidthResponsive={true}
                style={{ display: 'block', margin: '2rem 0', minHeight: '100px' }}
              />
            </div>
          )}

          {/* 랭킹 섹션 */}
          <HomeRanking />

          {/* AdSense after Ranking */}
          {adsenseId && (
            <div className="my-8">
              <AdSense
                adClient={adsenseId}
                adFormat="auto"
                fullWidthResponsive={true}
                style={{ display: 'block', margin: '2rem 0', minHeight: '100px' }}
              />
            </div>
          )}

          {/* 커뮤니티 섹션 */}
          <HomeCommunity />

          {/* AdSense after Community */}
          {adsenseId && (
            <div className="my-8">
              <AdSense
                adClient={adsenseId}
                adFormat="auto"
                fullWidthResponsive={true}
                style={{ display: 'block', margin: '2rem 0', minHeight: '100px' }}
              />
            </div>
          )}

          {/* 공지사항 섹션 */}
          <HomeNotice />

          {/* AdSense after Notice */}
          {adsenseId && (
            <div className="my-8">
              <AdSense
                adClient={adsenseId}
                adFormat="auto"
                fullWidthResponsive={true}
                style={{ display: 'block', margin: '2rem 0', minHeight: '100px' }}
              />
            </div>
          )}
        </div>
      </div>

      {/* 플로팅 액션 버튼 */}
      <FloatingActionButton />
    </div>
  );
}