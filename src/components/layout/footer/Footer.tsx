import Link from 'next/link';
import { Crown, Trophy, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-12 bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* 메인 푸터 컨텐츠 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* 브랜드 섹션 */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 rounded-full flex items-center justify-center shadow-lg relative">
                <Trophy className="w-4 h-4 text-yellow-100 relative z-10 mt-1.5" />
                <Crown className="w-3 h-3 text-white absolute top-1 left-1/2 transform -translate-x-1/2 drop-shadow-sm" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                PetCrown
              </span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              반려동물과 함께하는 특별한 여행을 시작하세요! 🐾<br />
              PetCrown에서 우리 아이들의 귀여운 순간을 공유하고,<br />
              다른 반려인들과 소중한 추억을 만들어보세요.
            </p>
            <div className="flex items-center space-x-1 text-pink-500">
              <Heart className="w-4 h-4" fill="currentColor" />
              <span className="text-sm font-medium">Made with love for pets</span>
            </div>
          </div>

          {/* 고객 지원 */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">고객 지원</h3>
            <div className="space-y-3">
              <Link
                href="/contact"
                className="block text-gray-600 hover:text-purple-600 transition-colors duration-200 text-sm"
              >
                문의하기
              </Link>
              <Link
                href="/privacy"
                className="block text-gray-600 hover:text-purple-600 transition-colors duration-200 text-sm"
              >
                개인정보 처리방침
              </Link>
            </div>
          </div>
        </div>

        {/* 하단 구분선 */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <p>© 2025 PetCrown. All rights reserved.</p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span>버전 1.0.0</span>
              <span>•</span>
              <span>베타 서비스</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
