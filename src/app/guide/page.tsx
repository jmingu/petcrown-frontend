'use client';

import { motion } from 'framer-motion';
import { Heart, Vote, Trophy, UserPlus, Award, Sparkles, Crown } from 'lucide-react';
import CuteCard from '@/components/common/card/CuteCard';
import AdSense from '@/components/common/adsense/AdSense';

export default function GuidePage() {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID || '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/50 via-pink-50/50 to-white">
      {/* 배경 장식 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10"
          animate={{
            y: [-20, 20, -20],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Heart className="w-8 h-8 text-pink-300 opacity-40" fill="currentColor" />
        </motion.div>

        <motion.div
          className="absolute top-40 right-20"
          animate={{
            y: [20, -20, 20],
            rotate: [0, -10, 10, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Sparkles className="w-6 h-6 text-purple-300 opacity-50" />
        </motion.div>

        <motion.div
          className="absolute bottom-32 left-1/4"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Trophy className="w-10 h-10 text-yellow-300 opacity-30" />
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12 relative z-10">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <Crown className="w-10 h-10 md:w-12 md:h-12 text-purple-600 mr-2 md:mr-3 flex-shrink-0" />
            <h1 className="text-2xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent break-keep">
              펫크라운 이용안내
            </h1>
          </div>
          <p className="text-gray-600 text-base md:text-xl break-keep">
            사랑스러운 반려동물과 함께하는 투표 플랫폼 🐾
          </p>
        </motion.div>

        {/* AdSense */}
        {adsenseId && (
          <div className="mb-8">
            <AdSense
              adClient={adsenseId}
              adFormat="auto"
              fullWidthResponsive={true}
              style={{ display: 'block', minHeight: '100px' }}
            />
          </div>
        )}

        {/* 사이트 소개 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <CuteCard padding="lg">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mr-3 md:mr-4 flex-shrink-0">
                <Heart className="w-5 h-5 md:w-6 md:h-6 text-white" fill="currentColor" />
              </div>
              <h2 className="text-xl md:text-3xl font-bold text-gray-900 break-keep">
                펫크라운이란?
              </h2>
            </div>
            <p className="text-gray-700 text-base md:text-lg leading-relaxed break-keep">
              <strong className="text-purple-600">펫크라운</strong>은 사랑스러운 반려동물의 사진을 공유하고,
              투표를 통해 가장 인기 있는 반려동물을 선정하는 커뮤니티 플랫폼입니다.
              <br /><br />
              여러분의 소중한 가족을 자랑하고, 다른 분들의 귀여운 반려동물도 만나보세요! 🎉
            </p>
          </CuteCard>
        </motion.div>

        {/* 투표 참여 방법 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <CuteCard padding="lg">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center mr-3 md:mr-4 flex-shrink-0">
                <Vote className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <h2 className="text-xl md:text-3xl font-bold text-gray-900 break-keep">
                투표 참여하기
              </h2>
            </div>

            <div className="space-y-6">
              <div className="bg-blue-50 rounded-2xl p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-blue-900 mb-4 flex items-center break-keep">
                  <span className="bg-blue-500 text-white w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center mr-2 md:mr-3 flex-shrink-0 text-sm md:text-base">1</span>
                  이메일 인증으로 투표
                </h3>
                <ul className="space-y-2 text-gray-700 ml-9 md:ml-11 text-sm md:text-base">
                  <li className="flex items-start">
                    <span className="text-blue-600 font-bold mr-2 flex-shrink-0">•</span>
                    <span className="break-keep">회원가입 없이 <strong>이메일 인증</strong>만으로 투표 가능</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 font-bold mr-2 flex-shrink-0">•</span>
                    <span className="break-keep">이메일 인증 시 <strong className="text-blue-600">1표</strong> 획득</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 font-bold mr-2 flex-shrink-0">•</span>
                    <span className="text-xs md:text-sm text-gray-600 break-keep">간편하고 빠르게 투표에 참여하세요!</span>
                  </li>
                </ul>
              </div>

              <div className="bg-purple-50 rounded-2xl p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-purple-900 mb-4 flex items-center break-keep">
                  <span className="bg-purple-500 text-white w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center mr-2 md:mr-3 flex-shrink-0 text-sm md:text-base">2</span>
                  회원가입 후 추가 투표
                </h3>
                <ul className="space-y-2 text-gray-700 ml-9 md:ml-11 text-sm md:text-base">
                  <li className="flex items-start">
                    <span className="text-purple-600 font-bold mr-2 flex-shrink-0">•</span>
                    <span className="break-keep"><strong>회원가입</strong> 후 로그인하여 투표하면 <strong className="text-purple-600">추가 1표</strong></span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 font-bold mr-2 flex-shrink-0">•</span>
                    <span className="break-keep">회원은 최대 <strong className="text-purple-600">2표</strong>까지 투표 가능!</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 font-bold mr-2 flex-shrink-0">•</span>
                    <span className="text-xs md:text-sm text-gray-600 break-keep">회원가입하고 더 많은 혜택을 받으세요</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-4 md:p-6 border-2 border-yellow-200">
                <div className="flex items-center mb-3">
                  <Award className="w-5 h-5 md:w-6 md:h-6 text-yellow-600 mr-2 flex-shrink-0" />
                  <h3 className="text-base md:text-lg font-bold text-gray-900 break-keep">투표 팁!</h3>
                </div>
                <p className="text-gray-700 text-sm md:text-base break-keep">
                  투표는 <strong>주간 랭킹</strong>에 반영됩니다.
                  매주 새로운 랭킹이 시작되니 자주 방문해서 응원해주세요! 🎯
                </p>
              </div>
            </div>
          </CuteCard>
        </motion.div>

        {/* 반려동물 등록 방법 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <CuteCard padding="lg">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-pink-400 to-pink-600 rounded-full flex items-center justify-center mr-3 md:mr-4 flex-shrink-0">
                <UserPlus className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <h2 className="text-xl md:text-3xl font-bold text-gray-900 break-keep">
                내 반려동물 등록하기
              </h2>
            </div>

            <div className="space-y-6">
              <div className="bg-pink-50 rounded-2xl p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-pink-900 mb-4 flex items-center break-keep">
                  <span className="bg-pink-500 text-white w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center mr-2 md:mr-3 flex-shrink-0 text-sm md:text-base">1</span>
                  회원가입하기
                </h3>
                <ul className="space-y-2 text-gray-700 ml-9 md:ml-11 text-sm md:text-base">
                  <li className="flex items-start">
                    <span className="text-pink-600 font-bold mr-2 flex-shrink-0">•</span>
                    <span className="break-keep">이메일, 이름, 닉네임, 비밀번호만으로 <strong>간편 가입</strong></span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-600 font-bold mr-2 flex-shrink-0">•</span>
                    <span className="break-keep">가입 후 바로 반려동물 등록 가능</span>
                  </li>
                </ul>
              </div>

              <div className="bg-purple-50 rounded-2xl p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-purple-900 mb-4 flex items-center break-keep">
                  <span className="bg-purple-500 text-white w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center mr-2 md:mr-3 flex-shrink-0 text-sm md:text-base">2</span>
                  프로필에서 반려동물 등록
                </h3>
                <ul className="space-y-2 text-gray-700 ml-9 md:ml-11 text-sm md:text-base">
                  <li className="flex items-start">
                    <span className="text-purple-600 font-bold mr-2 flex-shrink-0">•</span>
                    <span className="break-keep"><strong>프로필 페이지</strong>에서 반려동물 추가하기</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 font-bold mr-2 flex-shrink-0">•</span>
                    <span className="break-keep">이름, 사진 등 <strong>필수 정보</strong>만 입력하면 OK!</span>
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 rounded-2xl p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-blue-900 mb-4 flex items-center break-keep">
                  <span className="bg-blue-500 text-white w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center mr-2 md:mr-3 flex-shrink-0 text-sm md:text-base">3</span>
                  투표 등록하기
                </h3>
                <ul className="space-y-2 text-gray-700 ml-9 md:ml-11 text-sm md:text-base">
                  <li className="flex items-start">
                    <span className="text-blue-600 font-bold mr-2 flex-shrink-0">•</span>
                    <span className="break-keep"><strong>투표 등록하기</strong> 메뉴에서 내 반려동물 선택</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 font-bold mr-2 flex-shrink-0">•</span>
                    <span className="break-keep">승인 후 투표 페이지에 등록됩니다</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 font-bold mr-2 flex-shrink-0">•</span>
                    <span className="text-xs md:text-sm text-gray-600 break-keep">이제 랭킹 1위에 도전하세요! 🏆</span>
                  </li>
                </ul>
              </div>
            </div>
          </CuteCard>
        </motion.div>

        {/* 랭킹 안내 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <CuteCard padding="lg">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mr-3 md:mr-4 flex-shrink-0">
                <Trophy className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <h2 className="text-xl md:text-3xl font-bold text-gray-900 break-keep">
                랭킹 시스템
              </h2>
            </div>

            <div className="space-y-4 text-gray-700">
              <div className="flex items-start">
                <Trophy className="w-5 h-5 text-yellow-500 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-base md:text-lg text-gray-900 mb-2 break-keep">주간 랭킹</h3>
                  <p className="text-sm md:text-base break-keep">매주 월요일 0시에 새로운 랭킹이 시작됩니다. 한 주 동안 가장 많은 투표를 받은 반려동물이 1위를 차지합니다!</p>
                </div>
              </div>

              <div className="flex items-start">
                <Award className="w-5 h-5 text-purple-500 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-base md:text-lg text-gray-900 mb-2 break-keep">공정한 투표</h3>
                  <p className="text-sm md:text-base break-keep">이메일 인증으로 중복 투표를 방지하여 공정한 랭킹을 유지합니다.</p>
                </div>
              </div>

              <div className="flex items-start">
                <Sparkles className="w-5 h-5 text-pink-500 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-base md:text-lg text-gray-900 mb-2 break-keep">공유하기</h3>
                  <p className="text-sm md:text-base break-keep">투표 페이지 공유 기능으로 SNS에 홍보하고 더 많은 투표를 받아보세요!</p>
                </div>
              </div>
            </div>
          </CuteCard>
        </motion.div>
      </div>
    </div>
  );
}
