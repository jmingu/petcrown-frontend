'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Vote, Trophy, UserPlus, Award, Sparkles, Crown, Gamepad2, Timer, Target, Share2 } from 'lucide-react';
import Image from 'next/image';
import CuteCard from '@/components/common/card/CuteCard';
import AdSense from '@/components/common/adsense/AdSense';

export default function GuidePage() {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID || '';
  const [activeTab, setActiveTab] = useState<'vote' | 'game'>('vote');

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

        {/* 탭 메뉴 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex gap-2 md:gap-4 bg-white rounded-2xl p-2 shadow-lg">
            <button
              onClick={() => setActiveTab('vote')}
              className={`flex-1 py-3 md:py-4 px-4 md:px-6 rounded-xl font-bold text-sm md:text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === 'vote'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Vote className="w-4 h-4 md:w-5 md:h-5" />
              <span>투표 가이드</span>
            </button>
            <button
              onClick={() => setActiveTab('game')}
              className={`flex-1 py-3 md:py-4 px-4 md:px-6 rounded-xl font-bold text-sm md:text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === 'game'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Gamepad2 className="w-4 h-4 md:w-5 md:h-5" />
              <span>게임 가이드</span>
            </button>
          </div>
        </motion.div>

        {/* 투표 가이드 콘텐츠 */}
        {activeTab === 'vote' && (
          <>
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
                    <span className="break-keep"><strong>회원가입</strong> 후 투표 등록하면 <strong className="text-purple-600">추가 1표</strong></span>
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
                  투표하기
                </h3>
                <ul className="space-y-2 text-gray-700 ml-9 md:ml-11 text-sm md:text-base">
                  <li className="flex items-start">
                    <span className="text-blue-600 font-bold mr-2 flex-shrink-0">•</span>
                    <span className="break-keep"><strong>투표하기</strong> 메뉴에서 마음에 드는 반려동물에게 투표</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 font-bold mr-2 flex-shrink-0">•</span>
                    <span className="break-keep">투표 화면 예시:</span>
                  </li>
                </ul>
                <div className="mt-4 rounded-xl overflow-hidden border-2 border-blue-200">
                  <Image
                    src="/info/cat-vote.jpg"
                    alt="투표 화면 예시"
                    width={600}
                    height={400}
                    className="w-full h-auto"
                  />
                </div>
                <ul className="space-y-2 text-gray-700 ml-9 md:ml-11 text-sm md:text-base mt-4">
                  <li className="flex items-start">
                    <span className="text-blue-600 font-bold mr-2 flex-shrink-0">•</span>
                    <span className="break-keep">
                      <Share2 className="w-4 h-4 inline mr-1" />
                      <strong>공유하기</strong> 버튼을 누르면 투표 링크를 공유할 수 있습니다
                    </span>
                  </li>
                </ul>
                <div className="mt-4 rounded-xl overflow-hidden border-2 border-green-200">
                  <Image
                    src="/info/vote.jpg"
                    alt="투표 공유 화면"
                    width={600}
                    height={400}
                    className="w-full h-auto"
                  />
                </div>
                <ul className="space-y-2 text-gray-700 ml-9 md:ml-11 text-sm md:text-base mt-4">
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
                  <p className="text-sm md:text-base break-keep">
                    이메일 인증으로 중복 투표를 방지하여 공정한 랭킹을 유지합니다.
                    <br />
                    <strong className="text-purple-600">본인이 등록한 투표(내 펫)에는 투표할 수 없습니다.</strong> 공정성 유지를 위해 자신의 반려동물에게는 투표가 불가능합니다.
                  </p>
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
          </>
        )}

        {/* 게임 가이드 콘텐츠 */}
        {activeTab === 'game' && (
          <>
            {/* 게임 소개 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <CuteCard padding="lg">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mr-3 md:mr-4 flex-shrink-0">
                    <Gamepad2 className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <h2 className="text-xl md:text-3xl font-bold text-gray-900 break-keep">
                    펫 크라운 피하기란?
                  </h2>
                </div>
                <p className="text-gray-700 text-base md:text-lg leading-relaxed break-keep">
                  <strong className="text-purple-600">펫 크라운 피하기</strong>는 귀여운 반려동물 캐릭터로 떨어지는 장애물을 피하는 게임입니다.
                  <br /><br />
                  시간이 지날수록 난이도가 높아지며, 최고 기록에 도전하여 주간 랭킹에 도전해보세요! 🎮
                </p>
              </CuteCard>
            </motion.div>

            {/* 게임 방법 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-8"
            >
              <CuteCard padding="lg">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center mr-3 md:mr-4 flex-shrink-0">
                    <Target className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <h2 className="text-xl md:text-3xl font-bold text-gray-900 break-keep">
                    게임 조작 방법
                  </h2>
                </div>

                <div className="space-y-6">
                  <div className="bg-blue-50 rounded-2xl p-4 md:p-6">
                    <h3 className="text-lg md:text-xl font-bold text-blue-900 mb-4 flex items-center break-keep">
                      <span className="bg-blue-500 text-white w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center mr-2 md:mr-3 flex-shrink-0 text-sm md:text-base">📱</span>
                      모바일 조작법
                    </h3>
                    <ul className="space-y-2 text-gray-700 ml-9 md:ml-11 text-sm md:text-base">
                      <li className="flex items-start">
                        <span className="text-blue-600 font-bold mr-2 flex-shrink-0">•</span>
                        <span className="break-keep"><strong>화면 터치</strong> 또는 <strong>드래그</strong>로 캐릭터를 좌우로 이동</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 font-bold mr-2 flex-shrink-0">•</span>
                        <span className="break-keep">손가락을 움직이는 방향으로 캐릭터가 따라옵니다</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 font-bold mr-2 flex-shrink-0">•</span>
                        <span className="text-xs md:text-sm text-gray-600 break-keep">빠르게 움직여 장애물을 피하세요!</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-purple-50 rounded-2xl p-4 md:p-6">
                    <h3 className="text-lg md:text-xl font-bold text-purple-900 mb-4 flex items-center break-keep">
                      <span className="bg-purple-500 text-white w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center mr-2 md:mr-3 flex-shrink-0 text-sm md:text-base">⌨️</span>
                      데스크톱 조작법
                    </h3>
                    <ul className="space-y-2 text-gray-700 ml-9 md:ml-11 text-sm md:text-base">
                      <li className="flex items-start">
                        <span className="text-purple-600 font-bold mr-2 flex-shrink-0">•</span>
                        <span className="break-keep"><strong>화살표 키 (← →)</strong> 또는 <strong>A/D 키</strong>로 이동</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-purple-600 font-bold mr-2 flex-shrink-0">•</span>
                        <span className="break-keep">키보드로 정확하게 컨트롤 가능</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-purple-600 font-bold mr-2 flex-shrink-0">•</span>
                        <span className="text-xs md:text-sm text-gray-600 break-keep">빠른 반응 속도가 핵심!</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-4 md:p-6 border-2 border-yellow-200">
                    <div className="flex items-center mb-3">
                      <Timer className="w-5 h-5 md:w-6 md:h-6 text-yellow-600 mr-2 flex-shrink-0" />
                      <h3 className="text-base md:text-lg font-bold text-gray-900 break-keep">게임 팁!</h3>
                    </div>
                    <p className="text-gray-700 text-sm md:text-base break-keep">
                      <strong className="text-red-600">시간이 지날수록 난이도가 올라갑니다!</strong>
                      <br />
                      장애물이 점점 빠르게 떨어지니 집중력을 유지하고 최대한 오래 버티세요! ⏱️
                    </p>
                  </div>

                  <div className="bg-pink-50 rounded-2xl p-4 md:p-6 border-2 border-pink-200">
                    <h3 className="text-base md:text-lg font-bold text-pink-900 mb-4 flex items-center break-keep">
                      <span className="mr-2">🎯</span>
                      장애물 종류
                    </h3>
                    <p className="text-sm md:text-base text-gray-700 break-keep mb-4">
                      게임에서는 귀여운 반려동물 관련 5가지 장애물이 랜덤으로 떨어집니다:
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                      <div className="flex flex-col items-center bg-white/70 rounded-xl p-3 border border-pink-200">
                        <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center mb-2">
                          <Image src="/game/obstacles/paw.svg" alt="발바닥" width={50} height={50} className="w-full h-full object-contain" />
                        </div>
                        <p className="text-xs md:text-sm font-bold text-gray-800 text-center">발바닥</p>
                      </div>
                      <div className="flex flex-col items-center bg-white/70 rounded-xl p-3 border border-pink-200">
                        <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center mb-2">
                          <Image src="/game/obstacles/bone.svg" alt="뼈다귀" width={60} height={30} className="w-full h-full object-contain" />
                        </div>
                        <p className="text-xs md:text-sm font-bold text-gray-800 text-center">뼈다귀</p>
                      </div>
                      <div className="flex flex-col items-center bg-white/70 rounded-xl p-3 border border-pink-200">
                        <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center mb-2">
                          <Image src="/game/obstacles/heart.svg" alt="하트" width={50} height={40} className="w-full h-full object-contain" />
                        </div>
                        <p className="text-xs md:text-sm font-bold text-gray-800 text-center">하트</p>
                      </div>
                      <div className="flex flex-col items-center bg-white/70 rounded-xl p-3 border border-pink-200">
                        <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center mb-2">
                          <Image src="/game/obstacles/fish.svg" alt="물고기" width={50} height={30} className="w-full h-full object-contain" />
                        </div>
                        <p className="text-xs md:text-sm font-bold text-gray-800 text-center">물고기</p>
                      </div>
                      <div className="flex flex-col items-center bg-white/70 rounded-xl p-3 border border-pink-200 col-span-2 md:col-span-1 mx-auto md:mx-0">
                        <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center mb-2">
                          <Image src="/game/obstacles/ball.svg" alt="공" width={50} height={50} className="w-full h-full object-contain" />
                        </div>
                        <p className="text-xs md:text-sm font-bold text-gray-800 text-center">공</p>
                      </div>
                    </div>
                    <p className="text-xs md:text-sm text-gray-600 text-center break-keep bg-white/50 rounded-lg p-3">
                      💡 <strong>팁:</strong> 게임에서 보는 장애물과 똑같은 모양입니다!
                    </p>
                  </div>

                  <div className="bg-blue-50 rounded-2xl p-4 md:p-6 border-2 border-blue-200">
                    <h3 className="text-base md:text-lg font-bold text-blue-900 mb-4 flex items-center break-keep">
                      <span className="mr-2">⚡</span>
                      파워업 아이템
                    </h3>
                    <p className="text-sm md:text-base text-gray-700 break-keep mb-4">
                      게임 중 랜덤으로 나타나는 파워업 아이템을 먹으면 특별한 효과를 얻을 수 있습니다:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-start space-x-3 bg-white/70 rounded-xl p-4 border border-blue-200">
                        <div className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center flex-shrink-0">
                          <Image src="/game/obstacles/shield.svg" alt="실드" width={40} height={40} className="w-full h-full object-contain" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm md:text-base font-bold text-gray-800 mb-1">물 (실드)</p>
                          <p className="text-xs md:text-sm text-gray-600 break-keep">5초간 무적 상태가 되어 장애물을 파괴할 수 있습니다</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3 bg-white/70 rounded-xl p-4 border border-blue-200">
                        <div className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center flex-shrink-0">
                          <Image src="/game/obstacles/hourglass.svg" alt="슬로우" width={40} height={40} className="w-full h-full object-contain" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm md:text-base font-bold text-gray-800 mb-1">슬로우</p>
                          <p className="text-xs md:text-sm text-gray-600 break-keep">5초간 장애물 속도가 50% 감소합니다</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs md:text-sm text-gray-600 text-center break-keep bg-white/50 rounded-lg p-3">
                      💡 <strong>팁:</strong> 파워업은 10초마다 무작위로 나타나니 놓치지 마세요!
                    </p>
                  </div>
                </div>
              </CuteCard>
            </motion.div>

            {/* 게임 참여 방법 */}
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
                    게임 참여하기
                  </h2>
                </div>

                <div className="space-y-6">
                  <div className="bg-pink-50 rounded-2xl p-4 md:p-6">
                    <h3 className="text-lg md:text-xl font-bold text-pink-900 mb-4 flex items-center break-keep">
                      <span className="bg-pink-500 text-white w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center mr-2 md:mr-3 flex-shrink-0 text-sm md:text-base">1</span>
                      회원가입 및 로그인
                    </h3>
                    <ul className="space-y-2 text-gray-700 ml-9 md:ml-11 text-sm md:text-base">
                      <li className="flex items-start">
                        <span className="text-pink-600 font-bold mr-2 flex-shrink-0">•</span>
                        <span className="break-keep">게임 참여를 위해서는 <strong>로그인</strong>이 필요합니다</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-pink-600 font-bold mr-2 flex-shrink-0">•</span>
                        <span className="break-keep">아직 회원이 아니라면 간편하게 회원가입하세요</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-purple-50 rounded-2xl p-4 md:p-6">
                    <h3 className="text-lg md:text-xl font-bold text-purple-900 mb-4 flex items-center break-keep">
                      <span className="bg-purple-500 text-white w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center mr-2 md:mr-3 flex-shrink-0 text-sm md:text-base">2</span>
                      반려동물 등록
                    </h3>
                    <ul className="space-y-2 text-gray-700 ml-9 md:ml-11 text-sm md:text-base">
                      <li className="flex items-start">
                        <span className="text-purple-600 font-bold mr-2 flex-shrink-0">•</span>
                        <span className="break-keep"><strong>프로필 페이지</strong>에서 반려동물을 등록하세요</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-purple-600 font-bold mr-2 flex-shrink-0">•</span>
                        <span className="break-keep">등록한 반려동물이 게임 캐릭터가 됩니다! 🐾</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 rounded-2xl p-4 md:p-6">
                    <h3 className="text-lg md:text-xl font-bold text-blue-900 mb-4 flex items-center break-keep">
                      <span className="bg-blue-500 text-white w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center mr-2 md:mr-3 flex-shrink-0 text-sm md:text-base">3</span>
                      게임하기
                    </h3>
                    <ul className="space-y-2 text-gray-700 ml-9 md:ml-11 text-sm md:text-base">
                      <li className="flex items-start">
                        <span className="text-blue-600 font-bold mr-2 flex-shrink-0">•</span>
                        <span className="break-keep">게임 페이지에서 <strong>캐릭터를 선택</strong>하고 시작!</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 font-bold mr-2 flex-shrink-0">•</span>
                        <span className="break-keep">게임 화면 예시:</span>
                      </li>
                    </ul>
                    <div className="mt-4 rounded-xl overflow-hidden border-2 border-blue-200">
                      <Image
                        src="/info/game.jpg"
                        alt="게임 화면 예시"
                        width={600}
                        height={400}
                        className="w-full h-auto"
                      />
                    </div>
                    <ul className="space-y-2 text-gray-700 ml-9 md:ml-11 text-sm md:text-base mt-4">
                      <li className="flex items-start">
                        <span className="text-blue-600 font-bold mr-2 flex-shrink-0">•</span>
                        <span className="break-keep">
                          <Share2 className="w-4 h-4 inline mr-1" />
                          <strong>공유하기</strong> 버튼을 누르면 내 점수를 친구에게 도전장으로 보낼 수 있습니다
                        </span>
                      </li>
                    </ul>
                    <div className="mt-4 rounded-xl overflow-hidden border-2 border-green-200">
                      <Image
                        src="/info/game-invitation.jpg"
                        alt="게임 점수 공유 화면"
                        width={600}
                        height={400}
                        className="w-full h-auto"
                      />
                    </div>
                    <ul className="space-y-2 text-gray-700 ml-9 md:ml-11 text-sm md:text-base mt-4">
                      <li className="flex items-start">
                        <span className="text-blue-600 font-bold mr-2 flex-shrink-0">•</span>
                        <span className="text-xs md:text-sm text-gray-600 break-keep">최고 기록에 도전하세요! 🏆</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CuteCard>
            </motion.div>

            {/* 게임 랭킹 안내 */}
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
                    게임 랭킹 시스템
                  </h2>
                </div>

                <div className="space-y-4 text-gray-700">
                  <div className="flex items-start">
                    <Trophy className="w-5 h-5 text-yellow-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-base md:text-lg text-gray-900 mb-2 break-keep">주간 최고 기록</h3>
                      <p className="text-sm md:text-base break-keep">
                        매주 월요일 0시에 새로운 주간 랭킹이 시작됩니다.
                        <br />
                        한 주 동안의 <strong className="text-purple-600">최고 생존 기록</strong>이 랭킹에 등록됩니다!
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Timer className="w-5 h-5 text-purple-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-base md:text-lg text-gray-900 mb-2 break-keep">기록 갱신</h3>
                      <p className="text-sm md:text-base break-keep">
                        더 좋은 기록을 세우면 자동으로 <strong className="text-purple-600">최고 기록이 업데이트</strong>됩니다.
                        <br />
                        무제한으로 도전 가능하니 계속 연습해서 1위에 도전하세요!
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Award className="w-5 h-5 text-pink-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-base md:text-lg text-gray-900 mb-2 break-keep">공유하기</h3>
                      <p className="text-sm md:text-base break-keep">
                        게임 종료 후 나의 기록을 SNS에 공유할 수 있습니다.
                        <br />
                        친구들에게 도전장을 내밀어보세요! 🎮
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Sparkles className="w-5 h-5 text-orange-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-base md:text-lg text-gray-900 mb-2 break-keep">랭킹 확인</h3>
                      <p className="text-sm md:text-base break-keep">
                        게임 페이지와 게임 랭킹 페이지에서 <strong className="text-purple-600">실시간 랭킹</strong>을 확인할 수 있습니다.
                        <br />
                        이번 주와 지난 주의 확정 랭킹을 모두 볼 수 있어요!
                      </p>
                    </div>
                  </div>
                </div>
              </CuteCard>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
