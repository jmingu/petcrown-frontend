'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import Button from '@/components/common/button/Button';
// import { useUserStore } from '@/libs/store/user/userStore';
import { logout, findUser, refresh } from '@/libs/api/user/userApi';
import { getCookie } from '@/common/util/cookieUtil';

const MENU_ITEMS = [
  { name: '랭킹보기', path: '/ranking' },
  { name: '투표하기', path: '/vote' },
  { name: '커뮤니티', path: '/community' },
  { name: '공지사항', path: '/notice' },
];

export default function Header() {
  const router = useRouter();
  // const { user, setUser, clearUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);

  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isLoggedIn = !!getCookie('A_ID');
  const sessData: string | null = sessionStorage.getItem('loginData');

  const nickname = sessData
    ? JSON.parse(decodeURIComponent(atob(sessData)))
    : '';

  useEffect(() => {
    const syncUserState = async () => {
      setIsLoading(true); // 로딩 상태 시작

      // 엑세스 토큰 없으면 로그아웃 상태
      console.log('isLoggedIn', isLoggedIn);
      console.log('sessData', sessData);
      // sessData 없으면 처음 로그인
      if (sessData === null || sessData === undefined) {
        // sessData 없는데 엑세스 토큰 있는경우 (새로운탭 오픈, 세션스토리지 강제지움)
        // 세션을 다시 가져와 넣어준다
        if (isLoggedIn === true) {
          findLoginUser();

          // sessData 없고 엑세스 토큰도 없는데 오토로그인이 있는 경우
        } else if (
          isLoggedIn === false &&
          localStorage.getItem('autoLogin') === 'Y'
        ) {
          // 리프레시 토큰으로 로그인
          // 리프레시 토큰 없으면 로그인 페이지 이동
          refreshLogin();
        }

        // sessData 있으면 로그인 상태
      } else {
        // sessData 있는데 토큰 없는경우 리프레시로 재 요청(이건 알아서 할듯 )
        if (isLoggedIn === false) {
          refreshLogin();
        }
      }

      // 엑세스 토큰이 있다면 로그인 시도
      // 자동 로그인이 있으면 로그인

      //     try {
      //       if (!user) {
      //         if (loginData) {
      //           // 새로고침으로 인한 로그인 복구
      //           await login();
      //         } else {
      //           // 처음 방문
      //           if (localStorage.getItem('autoLogin') === 'Y') {
      //             await login();
      //           } else {
      //             logout();
      //           }
      //         }
      //       }
      //     } catch (error) {
      //       console.error('로그인 상태 복구 중 에러 발생:', error);
      //       clearUser();
      //       logout();
      //     } finally {
      //       setIsLoading(false); // 로딩 상태 종료
      //     }
    };

    syncUserState();
  }, [sessData]); // 의존성 배열에 user 추가

  const handleLogout = () => {
    // clearUser();
    localStorage.removeItem('pc_sess');
    logout();
  };

  /**
   * 로그인 정보 받기
   */
  const findLoginUser = async () => {
    const userResult = await findUser(); // 사용자 정보 받아오기
    if (userResult.resultCode === 200) {
      const loginData: { loginTime: string; nickname: string } = {
        loginTime: new Date().toString(),
        nickname: userResult.result.nickname,
      };
      // 한글과 특수문자를 처리할 수 있도록 인코딩
      const encodedUser = btoa(encodeURIComponent(JSON.stringify(loginData)));
      sessionStorage.setItem('loginData', encodedUser); // 로그인 날짜 저장

      setIsLoading(true);
    } else {
      logout();
      router.push('/');
    }
  };

  /**
   * 리프레시 토큰으로 로그인
   */
  const refreshLogin = async () => {
    const userResult = await refresh(); // 사용자 정보 받아오기
    if (userResult.resultCode !== 200) {
      logout();
      router.push('/login');
    }
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
