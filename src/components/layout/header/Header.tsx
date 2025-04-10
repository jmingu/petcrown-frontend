'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Button from '@/components/common/button/Button';
import { useUserStore } from '@/libs/store/user/userStore';
import { findUser, logout } from '@/libs/api/user/userApi';

const MENU_ITEMS = [
  { name: '랭킹보기', path: '/ranking' },
  { name: '투표하기', path: '/vote' },
  { name: '커뮤니티', path: '/community' },
  { name: '공지사항', path: '/notice' },
];

export default function Header() {
  const { user, setUser, clearUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);

  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isLoggedIn = !!user;
  const nickname = user?.nickname || '사용자';

  useEffect(() => {
    const syncUserState = async () => {
      setIsLoading(true);
      try {
        const storedUser = localStorage.getItem('pc_sess');
        const hasLocalStorage = !!storedUser;
        const hasZustand = !!user;

        // 1. 둘 다 있는 경우: 통과
        if (hasLocalStorage && hasZustand) {
          return;
        }

        // 2. 로컬 스토리지에만 있는 경우: Zustand에 저장
        if (hasLocalStorage && !hasZustand) {
          try {
            const decodedUser = JSON.parse(
              decodeURIComponent(atob(storedUser))
            );
            setUser(decodedUser);
            return;
          } catch {
            localStorage.removeItem('pc_sess');
          }
        }

        // 3. Zustand에만 있는 경우: 로컬 스토리지에 저장
        if (!hasLocalStorage && hasZustand) {
          const encodedUser = btoa(encodeURIComponent(JSON.stringify(user)));
          localStorage.setItem('pc_sess', encodedUser);
          return;
        }

        // 4. 둘 다 없는 경우: 로그아웃 처리
        clearUser();
        localStorage.removeItem('pc_sess');
        logout();
      } catch {
        // 에러 발생 시 로그아웃 처리
        clearUser();
        localStorage.removeItem('pc_sess');
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    syncUserState();
  }, [user, setUser, clearUser]);

  const handleLogout = () => {
    clearUser();
    localStorage.removeItem('pc_sess');
    logout();
  };

  const truncatedNickname =
    nickname.length > 8 ? nickname.slice(0, 8) + '...' : nickname;

  return (
    <header className="w-full bg-white shadow-md">
      <div className="relative flex items-center justify-between px-2 py-3 global-wrapper">
        <button
          className="md:hidden text-2xl"
          onClick={() => setIsMenuOpen(true)}
        >
          ☰
        </button>

        <div className="md:hidden absolute left-1/2 transform -translate-x-1/2 text-xl font-bold">
          <Link href="/">PetCrown</Link>
        </div>
        <div className="hidden md:block text-xl font-bold">
          <Link href="/">PetCrown</Link>
        </div>

        <nav className="hidden md:flex gap-12">
          {MENU_ITEMS.map(({ name, path }) => (
            <Link
              key={path}
              href={path}
              className={`text-gray-700 font-medium hover:text-[var(--color-theme-green)] ${
                pathname === path
                  ? '!text-[var(--color-theme-green)] font-bold'
                  : ''
              }`}
            >
              {name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {isLoading ? (
            <div className="animate-pulse">로딩중...</div>
          ) : isLoggedIn ? (
            <>
              <Link
                href="/profile"
                className="text-gray-700 font-medium "
                title={nickname}
              >
                <span>{truncatedNickname}님</span>
              </Link>
              <Button onClick={handleLogout}>로그아웃</Button>
            </>
          ) : (
            <Button onClick={() => (window.location.href = '/login')}>
              로그인
            </Button>
          )}
        </div>

        {isMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-10"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
        <motion.div
          className="fixed top-0 left-0 w-64 h-full bg-white shadow-lg flex flex-col p-6 z-20"
          initial={{ x: '-100%' }}
          animate={{ x: isMenuOpen ? 0 : '-100%' }}
          transition={{ type: 'tween', duration: 0.3 }}
        >
          <button
            className="self-end text-2xl"
            onClick={() => setIsMenuOpen(false)}
          >
            ×
          </button>

          <div className="mb-6 text-center">
            {isLoading ? (
              <div className="animate-pulse">로딩중...</div>
            ) : isLoggedIn ? (
              <Link
                href="/profile"
                className="font-medium text-lg mt-2 block"
                onClick={() => setIsMenuOpen(false)}
              >
                <span>{truncatedNickname}님</span>
              </Link>
            ) : (
              <Button onClick={() => (window.location.href = '/login')}>
                로그인
              </Button>
            )}
          </div>

          {MENU_ITEMS.map(({ name, path }) => (
            <Link
              key={path}
              href={path}
              className={`text-gray-700 text-lg my-4 ${
                pathname === path
                  ? '!text-[var(--color-theme-green)] font-bold'
                  : ''
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {name}
            </Link>
          ))}

          {isLoggedIn && (
            <Button
              onClick={handleLogout}
              className="mt-auto py-2 rounded-md font-bold w-full"
            >
              로그아웃
            </Button>
          )}
        </motion.div>
      </div>
    </header>
  );
}
