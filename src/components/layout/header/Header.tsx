"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Button from "@/components/common/button/Button";
import { useUserStore } from '@/libs/store/user/userStore';
import { findUser } from "@/libs/api/user/userApi"; // ✅ 유저 정보 API import

const MENU_ITEMS = [
  { name: "랭킹보기", path: "/ranking" },
  { name: "투표하기", path: "/vote" },
  { name: "커뮤니티", path: "/community" },
  { name: "공지사항", path: "/notice" },
];

export default function Header() {
  // 1. Zustand에서 값 받아오기
  const { user, setUser, clearUser } = useUserStore();
  const [hasFetched, setHasFetched] = useState(false);

  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isLoggedIn = !!user;
  const nickname = user?.nickname || "사용자";

  useEffect(() => {
    const fetchUserIfNeeded = async () => {
      if (!user && !hasFetched) {
        try {
          const userData = await findUser();
          setUser(userData);
        } catch (error) {
          console.error("유저 정보 로드 실패:", error);
          clearUser();
        } finally {
          setHasFetched(true); // ✅ 재요청 막기
        }
      }
    };
  
    fetchUserIfNeeded();
  }, [user, hasFetched, setUser, clearUser]);


  // 로그아웃 함수
  const handleLogout = () => {
    clearUser(); // Zustand 상태 초기화
     // 또는 쿠키를 썼다면 제거
     document.cookie = "A_ID=; path=/; max-age=0";
     document.cookie = "R_ID=; path=/; max-age=0";
  };

  const truncatedNickname =
    nickname.length > 8 ? nickname.slice(0, 8) + "..." : nickname;

  return (
    <header className="w-full bg-white shadow-md">
      <div className="relative flex items-center justify-between px-2 py-3 global-wrapper">
        <button className="md:hidden text-2xl" onClick={() => setIsMenuOpen(true)}>
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
              className={`text-gray-700 font-medium hover:text-[var(--color-theme-green)] ${pathname === path ? "!text-[var(--color-theme-green)] font-bold" : ""}`}
            >
              {name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <Link
                href="/profile"
                className="text-gray-700 font-medium "
                title={nickname}
              >
                <span>{truncatedNickname}님</span>
              </Link>
              <Button onClick={handleLogout}>
                로그아웃
              </Button>
            </>
          ) : (
            <Button onClick={() => (window.location.href = "/login")}>
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
          initial={{ x: "-100%" }}
          animate={{ x: isMenuOpen ? 0 : "-100%" }}
          transition={{ type: "tween", duration: 0.3 }}
        >
          <button className="self-end text-2xl" onClick={() => setIsMenuOpen(false)}>
            ×
          </button>

          <div className="mb-6 text-center">
            {isLoggedIn ? (
              <Link
                href="/profile"
                className="font-medium text-lg mt-2 block"
                onClick={() => setIsMenuOpen(false)}
              >
                <span>{truncatedNickname}님</span>
              </Link>
            ) : (
              <Button onClick={() => (window.location.href = "/login")}>
                로그인
              </Button>
            )}
          </div>

          {MENU_ITEMS.map(({ name, path }) => (
            <Link
              key={path}
              href={path}
              className={`text-gray-700 text-lg my-4 ${pathname === path ? "!text-[var(--color-theme-green)] font-bold" : ""}`}
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