'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import Button from '@/components/common/button/Button';
// import { useUserStore } from '@/libs/store/user/userStore';
import { findUser } from '@/libs/api/user/userApi';
import Alert from '@/components/common/alert/Alert';
import { authChannel } from '@/libs/broadcastchannel/channel';

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
  const [alertMessage, setAlertMessage] = useState(''); // 알림 메시지
  const [alertAction, setAlertAction] = useState<(() => void) | null>(null); // 알림창 확인 버튼 동작
  const [nickname, setNickname] = useState('');
  const [sess, setSess] = useState<string | null>(
    sessionStorage.getItem('sess')
  );

  const isLoggedIn = !!sess;

  useEffect(() => {
    // 다른 탭에 로그인 상태 탭이 있나 요청
    authChannel.postMessage({ type: 'request-login-status' });

    // 다른 탭에서 상태 요청 받았을 때
    const onMessage = async (event: MessageEvent) => {
      const accessToken = localStorage.getItem('a_t');
      const refreshToken = localStorage.getItem('r_t');
      const autoLogin = localStorage.getItem('auto_login');

      // 다른탭에서 로그인 상태 있다고 요청 받음
      if (event.data.type === 'login') {
        if (autoLogin === 'Y') {
          // 오토로그인이면 아래 코드에서 진행
          return;
        }
        setIsLoading(true);
        await findLoginUser();
        setIsLoading(false);
      }

      // request-login-status 요청 받았을 때
      if (event.data.type === 'request-login-status') {
        // 토큰있으면 로그인 상태 있다고 다른 탭에 알림
        if (accessToken && refreshToken) {
          authChannel.postMessage({ type: 'login' });
        }
      }
    };

    authChannel.addEventListener('message', onMessage);

    return () => {
      authChannel.removeEventListener('message', onMessage);
    };
    // BroadcastChannel 예시도 여기서 가능
  }, []);

  useEffect(() => {
    const init = async () => {
      const accessToken = localStorage.getItem('a_t');
      const refreshToken = localStorage.getItem('r_t');
      const sessData = sessionStorage.getItem('sess');
      const autoLogin = localStorage.getItem('auto_login'); // 'Y' or 'N'

      // 둘 중 하나라도 없으면 로그아웃 처리
      if (!accessToken || !refreshToken) {
        handleLogout();
        return;
      }

      // 토큰있는데 세션이 없으면 다시 넣기
      if (sessData === null) {
        setIsLoading(true);
        await findLoginUser();
        setIsLoading(false);
        return;
      }

      // autoLogin이 'Y'일 때만 로그인 처리
      if (autoLogin === 'Y') {
        // 이미 세션있으면 통과
        if (sess) {
          return;
        }

        setIsLoading(true);
        await findLoginUser();
        setIsLoading(false);
        return;
      }

      setSess(sessionStorage.getItem('sess'));
    };

    init();
  }, [pathname]);

  // sess가 바뀌면 로그인 상태 설정
  useEffect(() => {
    if (sess) {
      const user = JSON.parse(decodeURIComponent(atob(sess)));
      setNickname(user.nickname);
    }
  }, [sess]);

  /**
   * 로그아웃 처리
   */
  const handleLogout = () => {
    // 다른 탭에 로그아웃 알림 전송
    authChannel.postMessage('logout');
    setSess(null);
    setNickname('');
    localStorage.removeItem('a_t');
    localStorage.removeItem('r_t');
    sessionStorage.clear();
    // 메인으로 이동
    router.push('/');
  };

  /**
   * 로그인 정보 받기
   */
  const findLoginUser = async () => {
    const userResult = await findUser(); // 사용자 정보 받아오기
    if (userResult.resultCode !== 200) {
      handleLogout(); // 로그아웃(정보지우기)

      if (userResult.resultCode >= 3000) {
        setAlertMessage(userResult.resultMessageKo);
        setAlertAction(() => router.push('/login')); // 함수 참조 전달
        return;
      }
      setAlertMessage(
        '사용자 정보를 가져오는 데 실패했습니다. 다시 시도해주세요.'
      );
      setAlertAction(() => router.push('/login')); // 함수 참조 전달
      return;
    }

    // 세션에 필요한 데이터만 등록
    const sessData = {
      nickname: userResult.result.nickname,
    };
    // 한글과 특수문자를 처리할 수 있도록 인코딩
    const encodedUser = btoa(encodeURIComponent(JSON.stringify(sessData)));
    sessionStorage.setItem('sess', encodedUser); // 스토리지에 저장
    setSess(encodedUser); // ✅ React 상태로도 업데이트
  };

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
                <span>
                  {nickname.length > 5
                    ? nickname.slice(0, 5) + '...'
                    : nickname}
                  님
                </span>
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
                <span>
                  {nickname.length > 5
                    ? nickname.slice(0, 5) + '...'
                    : nickname}
                  님
                </span>
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
      {/* 알림창 */}
      <Alert
        message={alertMessage}
        onClose={async () => {
          setAlertMessage(''); // 메시지 초기화
          setAlertAction(null); // 동작 초기화

          if (alertAction) {
            await alertAction(); // 특정 동작 실행 (비동기 처리)
          }
        }}
      />
    </header>
  );
}
