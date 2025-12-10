import { Metadata } from 'next';
import { Suspense } from 'react';
import GameClient from './GameClient';
import { getWeeklyRankings, getWeeklyScoreByNickname } from '@/libs/api/game/gameApi';

interface GamePageProps {
  searchParams: Promise<{
    score?: string;
    nickname?: string;
  }>;
}

// SSR 메타데이터 생성 (공유용)
export async function generateMetadata({
  searchParams,
}: GamePageProps): Promise<Metadata> {
  const params = await searchParams;
  const score = params.score;
  const nickname = params.nickname;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://petcrown.com';
  const ogImageUrl = `${baseUrl}/opengraph-image.png`;
  const gameDefaultImageUrl = `/info/game-default-og.jpg`; // 게임 기본 이미지 (장애물 피하기 테마)

  // 닉네임이 있는 경우 (누군가가 공유한 경우) - 도전장
  if (nickname && nickname.trim() !== '') {
    try {
      const userScoreData = await getWeeklyScoreByNickname(decodeURIComponent(nickname));

      if (userScoreData.resultCode === 200 && userScoreData.result && userScoreData.result.score !== null) {
        const scoreValue = userScoreData.result.score;
        const petName = userScoreData.result.name;
        const petImage = userScoreData.result.imageUrl;
        const challengeText = `${nickname}님이 ${scoreValue.toFixed(1)}초 생존 기록으로 도전장을 보냈어요!`;
        const petInfo = petName ? ` (${petName})` : '';

        // 이미지 URL 우선순위: 펫 이미지 -> 게임 기본 이미지 -> 일반 OG 이미지
        const imageUrl = petImage && petImage.startsWith('http') ? petImage : gameDefaultImageUrl;

        return {
          title: `펫 크라운 피하기 - ${nickname}님의 ${scoreValue.toFixed(1)}초 기록 도전! 🎮 | PetCrown`,
          description: `🎮 ${challengeText}${petInfo} 귀여운 반려동물과 함께 장애물을 피하며 최고 기록에 도전하세요! 내 기록을 깰 수 있나요?`,
          openGraph: {
            title: `🎮 ${nickname}님의 ${scoreValue.toFixed(1)}초 기록에 도전하세요!`,
            description: `${challengeText} 지금 바로 도전해보세요!`,
            images: [
              {
                url: imageUrl,
                width: 1200,
                height: 630,
                alt: `${nickname}님의 반려동물 ${petName || ''}`,
              },
            ],
            type: 'website',
            url: `${baseUrl}/game?nickname=${encodeURIComponent(nickname)}`,
            siteName: 'PetCrown',
            locale: 'ko_KR',
          },
          twitter: {
            card: 'summary_large_image',
            title: `🎮 ${nickname}님의 ${scoreValue.toFixed(1)}초 기록에 도전하세요!`,
            description: `${challengeText} 지금 바로 도전해보세요!`,
            images: [imageUrl],
            creator: '@PetCrown',
            site: '@PetCrown',
          },
          robots: {
            index: true,
            follow: true,
          },
          other: {
            'og:image:alt': `${nickname}님의 반려동물 ${petName || ''}`,
          },
        };
      }
    } catch (error) {
      // API 조회 실패 시 기본 메타데이터 반환
    }
  }

  // 기본 메타데이터 (게임 소개)
  let topScoreText = '';
  try {
    const rankings = await getWeeklyRankings();
    if (rankings.resultCode === 200 && rankings.result && rankings.result.rankings.length > 0) {
      const topScore = rankings.result.rankings[0].score;
      topScoreText = ` 현재 1위 기록은 ${topScore.toFixed(1)}초! 도전해보세요!`;
    }
  } catch (error) {
    // 랭킹 조회 실패 시 기본 텍스트만 사용
  }

  return {
    title: '펫 크라운 피하기 - 귀여운 장애물 피하기 게임! 🎮 | PetCrown',
    description: `🎮 귀여운 반려동물과 함께 떨어지는 장애물을 피해보세요! 🐾 시간이 지날수록 난이도가 증가하는 스릴 넘치는 게임.${topScoreText} 지금 바로 플레이하고 주간 랭킹에 도전하세요!`,
    openGraph: {
      title: '🎮 펫 크라운 피하기',
      description: `귀여운 반려동물과 함께 장애물을 피하고 주간 랭킹에 도전하세요!${topScoreText}`,
      images: [
        {
          url: gameDefaultImageUrl,
          width: 1200,
          height: 630,
          alt: '펫 크라운 피하기 게임',
          type: 'image/png',
        },
      ],
      type: 'website',
      url: `${baseUrl}/game`,
      siteName: 'PetCrown',
      locale: 'ko_KR',
    },
    twitter: {
      card: 'summary_large_image',
      title: '🎮 펫 크라운 피하기',
      description: `귀여운 반려동물과 함께 장애물을 피하고 주간 랭킹에 도전하세요!${topScoreText}`,
      images: [gameDefaultImageUrl],
      creator: '@PetCrown',
      site: '@PetCrown',
    },
    robots: {
      index: true,
      follow: true,
    },
    keywords: ['펫크라운', '반려동물', '게임', '피하기게임', '온라인게임', '무료게임', '랭킹', '장애물피하기', '펫게임'],
    other: {
      'og:image:alt': '펫 크라운 피하기 게임',
    },
  };
}

// SSR 페이지 (클라이언트 컴포넌트 렌더링)
export default function GamePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
      </div>
    }>
      <GameClient />
    </Suspense>
  );
}
