"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const MENU_ITEMS = [
  { name: "랭킹보기", path: "/ranking" },
  { name: "투표하기", path: "/vote" },
  { name: "커뮤니티", path: "/community" },
  { name: "공지사항", path: "/notice" },
];

const MAX_NICKNAME_LENGTH = 8; // 최대 닉네임 길이 제한

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nickname, setNickname] = useState("");

  // 로그인 상태 확인
  useEffect(() => {
    const loginData = localStorage.getItem("login");
    if (loginData) {
      try {
        const user = JSON.parse(loginData);
        setIsLoggedIn(true);
        setNickname(user.nickname || "사용자");
      } catch (error) {
        console.error("로그인 데이터 오류:", error);
        setIsLoggedIn(false);
      }
    }
  }, []);

  // 로그아웃 처리
  const handleLogout = () => {
    localStorage.removeItem("login");
    setIsLoggedIn(false);
    window.location.reload(); // 새로고침하여 상태 반영
  };

  // 닉네임 길이 제한 처리
  const truncatedNickname =
    nickname.length > MAX_NICKNAME_LENGTH
      ? nickname.slice(0, MAX_NICKNAME_LENGTH) + "..."
      : nickname;

  return (
    <header className="w-full bg-white shadow-md">
      <div className="relative flex items-center justify-between px-6 py-3 global-wrapper">
        {/* 모바일 햄버거 버튼 */}
        <button className="md:hidden text-2xl" onClick={() => setIsMenuOpen(true)}>
          ☰
        </button>

        {/* 로고 (모바일에서는 가운데 정렬) */}
        <div className="text-xl font-bold md:ml-4 md:static absolute left-1/2 transform -translate-x-1/2">
          <Link href="/">PetCrown</Link>
        </div>

        {/* 데스크톱 메뉴 */}
        <nav className="hidden md:flex gap-12">
          {MENU_ITEMS.map(({ name, path }) => (
            <Link key={path} href={path} className="text-gray-700 font-medium hover:text-blue-500">
              {name}
            </Link>
          ))}
        </nav>

        {/* 로그인/닉네임 & 로그아웃 버튼 (데스크톱) */}
        {isLoggedIn ? (
          <div className="hidden md:flex items-center gap-4">
            <Link 
              href="/profile" 
              className="text-gray-700 font-medium hover:text-blue-500" 
              title={nickname}
            >
              {truncatedNickname}님
            </Link>
            <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-md font-bold">
              로그아웃
            </button>
          </div>
        ) : (
          <button
            onClick={() => (window.location.href = "/login")}
            className="hidden md:block bg-blue-500 text-white px-4 py-2 rounded-md font-bold"
          >
            로그인
          </button>
        )}

        {/* 오버레이 및 사이드 메뉴 */}
        {isMenuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-10" onClick={() => setIsMenuOpen(false)} />
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

          {/* ✅ 모바일 최상단에 로그인 버튼 or 닉네임 + 내정보 버튼 */}
          {isLoggedIn ? (
            <div className="mb-6 text-center">
              <div className="text-gray-700 font-medium text-lg" title={nickname}>
              <Link href="/profile" className="text-blue-500 font-medium text-lg mt-2 block" onClick={() => setIsMenuOpen(false)}>{truncatedNickname}님</Link>
              </div>            
            </div>
          ) : (
            <button
              onClick={() => (window.location.href = "/login")}
              className="mb-6 bg-blue-500 text-white py-2 rounded-md font-bold w-full"
            >
              로그인
            </button>
          )}

          {/* 메뉴 리스트 */}
          {MENU_ITEMS.map(({ name, path }) => (
            <Link key={path} href={path} className="text-gray-700 text-lg my-4" onClick={() => setIsMenuOpen(false)}>
              {name}
            </Link>
          ))}

          {/* ✅ 로그아웃 버튼 (모바일에서 맨 아래) */}
          {isLoggedIn && (
            <button onClick={handleLogout} className="mt-auto bg-red-500 text-white py-2 rounded-md font-bold w-full">
              로그아웃
            </button>
          )}
        </motion.div>
      </div>
    </header>
  );
}
