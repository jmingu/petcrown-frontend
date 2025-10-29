import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Share2, Calendar, Edit, Trash2 } from 'lucide-react';
import { getVoteDetail } from '@/libs/api/vote/voteApi';
import { VoteDetailResponse } from '@/libs/interface/api/vote/voteResponseInterface';
import ShareButton from './components/ShareButton';
import OwnerActions from './components/OwnerActions';
import OwnerCheck from './components/OwnerCheck';
import VoteButton from './components/VoteButton';
import AdSense from '@/components/common/adsense/AdSense';

interface VoteDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

// 투표 상세 데이터 조회
async function getVoteData(id: number): Promise<VoteDetailResponse | null> {
  try {
    const response = await getVoteDetail(id);
    if (response.resultCode === 200) {
      return response.result;
    }
    return null;
  } catch (error) {
    return null;
  }
}

// 메타데이터 생성 (SSR용 - 미리보기 및 공유 최적화)
export async function generateMetadata({
  params,
}: VoteDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const voteData = await getVoteData(Number(id));

  if (!voteData) {
    return {
      title: '투표를 찾을 수 없습니다 | PetCrown',
      description: '요청하신 투표가 존재하지 않습니다.',
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://petcrown.com';
  const imageUrl = voteData.profileImageUrl && voteData.profileImageUrl.startsWith('http')
    ? voteData.profileImageUrl
    : voteData.profileImageUrl
    ? `${baseUrl}${voteData.profileImageUrl}`
    : `${baseUrl}/opengraph-image.png`;

  const age = voteData.birthDate ? new Date().getFullYear() - new Date(voteData.birthDate).getFullYear() : null;
  const genderText = voteData.gender === 'M' ? '남아' : voteData.gender === 'F' ? '여아' : null;

  const petInfoText = [
    voteData.breedName || voteData.customBreed || voteData.speciesName,
    age !== null && `${age}살`,
    genderText
  ].filter(Boolean).join(' ');

  const petDescription = `🐾 귀여운 ${voteData.name}${petInfoText ? `(${petInfoText})` : ''}에게 투표해주세요! 현재 이번주 ${voteData.weeklyVoteCount.toLocaleString()}표 획득 중이에요 💕`;

  return {
    title: `${voteData.name}에게 투표해주세요! 🏆 | PetCrown`,
    description: petDescription,
    openGraph: {
      title: `🏆 ${voteData.name}에게 투표해주세요!`,
      description: petDescription,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${voteData.name} - ${voteData.breedName || voteData.speciesName}`,
          type: 'image/jpeg',
        },
      ],
      type: 'website',
      url: `${baseUrl}/vote/${id}`,
      siteName: 'PetCrown',
      locale: 'ko_KR',
    },
    twitter: {
      card: 'summary_large_image',
      title: `🏆 ${voteData.name}에게 투표해주세요!`,
      description: petDescription,
      images: [imageUrl],
      creator: '@PetCrown',
      site: '@PetCrown',
    },
    robots: {
      index: true,
      follow: true,
    },
    // 카카오톡을 위한 추가 메타태그들
    other: {
      'og:image:secure_url': imageUrl,
      'og:image:type': 'image/jpeg',
      'og:image:width': '1200',
      'og:image:height': '630',
      'al:web:url': `${baseUrl}/vote/${id}`,
      'article:author': 'PetCrown',
      'article:publisher': 'PetCrown',
    },
  };
}

export default async function VoteDetailPage({ params }: VoteDetailPageProps) {
  const { id } = await params;
  const voteData = await getVoteData(Number(id));

  if (!voteData) {
    notFound();
  }

  // 백엔드 API 구조에 맞춘 데이터 처리
  const isActive = true; // 투표 활성화 (백엔드에서 상태 정보가 제공되면 해당 값 사용)
  const age = voteData.birthDate ? new Date().getFullYear() - new Date(voteData.birthDate).getFullYear() : null;
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID || '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/50 via-pink-50/50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 뒤로가기 버튼 */}
        <div className="mb-6">
          <Link 
            href="/vote" 
            className="inline-flex items-center text-purple-600 hover:text-purple-800 transition-colors duration-200"
          >
            ← 투표 목록으로 돌아가기
          </Link>
        </div>

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

        {/* 메인 카드 */}
        <div className="glass rounded-3xl shadow-2xl overflow-hidden border border-purple-100">
          <div className="relative">

            {/* 공유 버튼 */}
            <div className="absolute top-4 right-4 z-10">
              <ShareButton
                url={`${process.env.NEXT_PUBLIC_BASE_URL || ''}/vote/${id}`}
                title={voteData.name}
                description={`${voteData.name}에게 투표해주세요!`}
              />
            </div>

            {/* 펫 이미지 */}
            <div className="relative h-96 bg-gradient-to-b from-purple-100 to-pink-100">
              {voteData.profileImageUrl ? (
                <Image
                  src={voteData.profileImageUrl}
                  alt={`${voteData.name} - ${voteData.breedName || voteData.speciesName}`}
                  fill
                  className="object-contain"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span className="text-6xl">🐾</span>
                </div>
              )}
            </div>
          </div>

          {/* 투표 정보 */}
          <div className="p-4 md:p-8">
            <div className="text-center mb-6 md:mb-8">
              <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4 break-words">
                🏆 {voteData.name}에게 투표해주세요!
              </h1>
              <p className="text-gray-600 text-base md:text-xl leading-relaxed">
                {[
                  voteData.breedName || voteData.customBreed || voteData.speciesName,
                  voteData.gender && (voteData.gender === 'M' ? '남아' : '여아'),
                  age !== null && `${age}살`
                ].filter(Boolean).join(' • ')}
              </p>
            </div>

            {/* 펫 정보 카드 */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 md:p-6 mb-6 md:mb-8">
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div>
                  <p className="text-xs md:text-sm text-gray-500">이름</p>
                  <p className="font-semibold text-sm md:text-lg text-gray-900 break-words">{voteData.name}</p>
                </div>
                <div>
                  <p className="text-xs md:text-sm text-gray-500">품종</p>
                  <p className="font-semibold text-sm md:text-lg text-gray-900 break-words">{voteData.breedName || voteData.customBreed || voteData.speciesName}</p>
                </div>
                {voteData.gender && (
                  <div>
                    <p className="text-xs md:text-sm text-gray-500">성별</p>
                    <p className="font-semibold text-sm md:text-lg text-gray-900">
                      {voteData.gender === 'M' ? '남아' : '여아'}
                    </p>
                  </div>
                )}
                {voteData.birthDate && (
                  <div>
                    <p className="text-xs md:text-sm text-gray-500">생년월일</p>
                    <p className="font-semibold text-sm md:text-lg text-gray-900 break-words">
                      {new Date(voteData.birthDate).toLocaleDateString('ko-KR')}
                    </p>
                  </div>
                )}
              </div>

              {/* 감정 표시 */}
              {voteData.petModeName && (
                <div className="mt-6 pt-6 border-t border-purple-200">
                  <div className="flex items-center justify-center space-x-2">
                    <p className="text-sm text-gray-500">이 사진의 감정</p>
                    <span className="px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700">
                      {voteData.petModeName}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* 투표 안내 */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-50 rounded-full">
                <Calendar className="w-4 h-4 md:w-5 md:h-5 text-blue-600 flex-shrink-0" />
                <span className="text-blue-600 font-medium text-xs md:text-sm break-keep">
                  공유하여 더 많은 투표를 받아보세요!
                </span>
              </div>
            </div>

            {/* 투표 버튼 */}
            <VoteButton
              voteId={voteData.voteId}
              currentVoteCount={voteData.weeklyVoteCount}
              petName={voteData.name}
              isActive={isActive}
            />

            {/* 하단 액션 */}
            <OwnerCheck
              ownerEmail={voteData.ownerEmail}
              voteId={voteData.voteId}
              petName={voteData.name}
            />
          </div>
        </div>
      </div>
    </div>
  );
}