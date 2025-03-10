'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const MENU_ITEMS = ['랭킹보기', '투표하기', '커뮤니티', '공지사항'];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full bg-white shadow-md">
      <div className="relative flex items-center justify-between px-6 py-3 global-wrapper">
        {/* 모바일 햄버거 버튼 */}
        <button className="md:hidden text-2xl" onClick={() => setIsMenuOpen(true)}>
          ☰
        </button>

        {/* 로고 (모바일에서는 가운데 정렬) */}
        <div className="text-xl font-bold md:ml-4 md:static absolute left-1/2 transform -translate-x-1/2">
          PetCrown
        </div>

        {/* 데스크톱 메뉴 */}
        <nav className="hidden md:flex gap-12">
          {MENU_ITEMS.map((item) => (
            <a key={item} href="#" className="text-gray-700 font-medium hover:text-blue-500">
              {item}
            </a>
          ))}
        </nav>

        {/* 로그인 버튼 */}
        <button className="hidden md:block bg-blue-500 text-white px-4 py-2 rounded-md font-bold">
          로그인
        </button>

        {/* 오버레이 및 사이드 메뉴 */}
        {isMenuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-10" onClick={() => setIsMenuOpen(false)} />
        )}
        <motion.div
          className="fixed top-0 left-0 w-64 h-full bg-white shadow-lg flex flex-col p-6 z-20"
          initial={{ x: '-100%' }}
          animate={{ x: isMenuOpen ? 0 : '-100%' }}
          transition={{ type: 'tween', duration: 0.3 }}
        >
          <button className="self-end text-2xl" onClick={() => setIsMenuOpen(false)}>
            ×
          </button>
          {MENU_ITEMS.map((item) => (
            <a key={item} href="#" className="text-gray-700 text-lg my-4" onClick={() => setIsMenuOpen(false)}>
              {item}
            </a>
          ))}
          <button className="mt-auto bg-blue-500 text-white py-2 rounded-md font-bold">
            로그인
          </button>
        </motion.div>
      </div>
    </header>
  );
}
