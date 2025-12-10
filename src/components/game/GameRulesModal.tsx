'use client';

import { X, Gamepad2, Trophy, Zap, AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import Modal from '@/components/common/modal/Modal';
import CuteButton from '@/components/common/button/CuteButton';

interface GameRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: () => void;
}

export default function GameRulesModal({ isOpen, onClose, onStart }: GameRulesModalProps) {
  if (!isOpen) return null;

  return (
    <Modal onClose={onClose}>
      <div className="bg-white rounded-3xl p-4 md:p-6 lg:p-8 max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div className="flex items-center space-x-2 md:space-x-3 flex-1 min-w-0">
            <div className="p-2 md:p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex-shrink-0">
              <Gamepad2 className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 truncate">게임 규칙</h2>
          </div>
        </div>

        {/* 게임 목표 */}
        <div className="mb-4 md:mb-6">
          <div className="flex items-center space-x-2 mb-2 md:mb-3">
            <Trophy className="w-4 h-4 md:w-5 md:h-5 text-yellow-500 flex-shrink-0" />
            <h3 className="text-lg md:text-xl font-bold text-gray-900">게임 목표</h3>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-3 md:p-4 border-2 border-purple-200">
            <p className="text-sm md:text-base text-gray-700 leading-relaxed break-keep">
              떨어지는 장애물을 피하면서 <span className="font-bold text-purple-600">최대한 오래 생존</span>하세요!
              <br />
              시간이 지날수록 난이도가 증가합니다. 🎮
            </p>
          </div>
        </div>

        {/* 조작 방법 */}
        <div className="mb-4 md:mb-6">
          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">조작 방법</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 md:space-x-3 p-2 md:p-3 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                <span className="text-lg md:text-xl">⌨️</span>
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm md:text-base text-gray-900">키보드</p>
                <p className="text-xs md:text-sm text-gray-600 break-keep">← → 방향키 또는 A, D 키</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 md:space-x-3 p-2 md:p-3 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                <span className="text-lg md:text-xl">👆</span>
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm md:text-base text-gray-900">터치/마우스</p>
                <p className="text-xs md:text-sm text-gray-600 break-keep">화면을 터치하거나 클릭하여 이동</p>
              </div>
            </div>
          </div>
        </div>

        {/* 장애물 종류 */}
        <div className="mb-4 md:mb-6">
          <div className="flex items-center space-x-2 mb-2 md:mb-3">
            <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 text-red-500 flex-shrink-0" />
            <h3 className="text-lg md:text-xl font-bold text-gray-900">장애물 종류</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
            <div className="bg-pink-50 rounded-xl p-2 md:p-3 border-2 border-pink-200 text-center">
              <div className="flex items-center justify-center h-10 md:h-12 mb-1 md:mb-2">
                <Image src="/game/obstacles/paw.svg" alt="발바닥" width={40} height={40} className="w-10 h-10 md:w-12 md:h-12 object-contain" />
              </div>
              <p className="text-xs md:text-sm font-semibold text-gray-900">발바닥</p>
            </div>
            <div className="bg-orange-50 rounded-xl p-2 md:p-3 border-2 border-orange-200 text-center">
              <div className="flex items-center justify-center h-10 md:h-12 mb-1 md:mb-2">
                <Image src="/game/obstacles/bone.svg" alt="뼈다귀" width={48} height={24} className="w-10 h-10 md:w-12 md:h-12 object-contain" />
              </div>
              <p className="text-xs md:text-sm font-semibold text-gray-900">뼈다귀</p>
            </div>
            <div className="bg-pink-50 rounded-xl p-2 md:p-3 border-2 border-pink-200 text-center">
              <div className="flex items-center justify-center h-10 md:h-12 mb-1 md:mb-2">
                <Image src="/game/obstacles/heart.svg" alt="하트" width={40} height={32} className="w-10 h-10 md:w-12 md:h-12 object-contain" />
              </div>
              <p className="text-xs md:text-sm font-semibold text-gray-900">하트</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-2 md:p-3 border-2 border-blue-200 text-center">
              <div className="flex items-center justify-center h-10 md:h-12 mb-1 md:mb-2">
                <Image src="/game/obstacles/fish.svg" alt="물고기" width={40} height={24} className="w-10 h-10 md:w-12 md:h-12 object-contain" />
              </div>
              <p className="text-xs md:text-sm font-semibold text-gray-900">물고기</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-2 md:p-3 border-2 border-purple-200 text-center col-span-2 md:col-span-1">
              <div className="flex items-center justify-center h-10 md:h-12 mb-1 md:mb-2">
                <Image src="/game/obstacles/ball.svg" alt="공" width={40} height={40} className="w-10 h-10 md:w-12 md:h-12 object-contain" />
              </div>
              <p className="text-xs md:text-sm font-semibold text-gray-900">공</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center break-keep">💡 게임에서 보는 장애물과 똑같은 모양입니다!</p>
        </div>

        {/* 파워업 */}
        <div className="mb-4 md:mb-6">
          <div className="flex items-center space-x-2 mb-2 md:mb-3">
            <Zap className="w-4 h-4 md:w-5 md:h-5 text-yellow-500 flex-shrink-0" />
            <h3 className="text-lg md:text-xl font-bold text-gray-900">파워업 아이템</h3>
          </div>
          <div className="space-y-2 md:space-y-3">
            <div className="flex items-start space-x-2 md:space-x-3 p-2 md:p-3 bg-blue-50 rounded-xl border-2 border-blue-200">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                <Image src="/game/obstacles/shield.svg" alt="실드" width={40} height={40} className="w-6 h-6 md:w-8 md:h-8 object-contain" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm md:text-base text-gray-900">물 (실드)</p>
                <p className="text-xs md:text-sm text-gray-600 break-keep">5초간 무적 상태가 되어 장애물을 파괴할 수 있습니다</p>
              </div>
            </div>
            <div className="flex items-start space-x-2 md:space-x-3 p-2 md:p-3 bg-orange-50 rounded-xl border-2 border-orange-200">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                <Image src="/game/obstacles/hourglass.svg" alt="슬로우" width={40} height={40} className="w-6 h-6 md:w-8 md:h-8 object-contain" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm md:text-base text-gray-900">슬로우</p>
                <p className="text-xs md:text-sm text-gray-600 break-keep">5초간 장애물 속도가 50% 감소합니다</p>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center break-keep">💡 파워업은 10초마다 무작위로 나타납니다</p>
        </div>

        {/* 난이도 증가 */}
        <div className="mb-4 md:mb-6">
          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">난이도 증가 시스템</h3>
          <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-3 md:p-4 border-2 border-red-200">
            <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm text-gray-700">

              <li className="flex items-start space-x-2">
                <span className="text-red-500 font-bold flex-shrink-0">•</span>
                <span className="break-keep">시간이 지날수록 장애물 생성 빈도와 속도가 <span className="font-bold">빨라집니다</span></span>
              </li>
            </ul>
          </div>
        </div>

        {/* 점수 저장 */}
        <div className="mb-4 md:mb-6">
          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">점수 저장</h3>
          <div className="bg-yellow-50 rounded-xl p-3 md:p-4 border-2 border-yellow-200">
            <p className="text-xs md:text-sm text-gray-700 leading-relaxed break-keep">
              <span className="font-bold text-yellow-700">이전 기록보다 높은 점수</span>만 자동으로 저장되며,
              <br />
              주간 랭킹에서 다른 플레이어들과 경쟁할 수 있습니다! 🏆
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
