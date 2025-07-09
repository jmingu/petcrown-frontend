'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import Button from '@/components/common/button/Button';
import { useUserStore } from '@/libs/store/user/userStore';
import { findUser } from '@/libs/api/user/userApi';
import Alert from '@/components/common/alert/Alert';
import { authChannel } from '@/libs/broadcastchannel/channel';
import { tr } from 'framer-motion/client';

const MENU_ITEMS = [
  { name: '랭킹보기', path: '/ranking' },
  { name: '투표하기', path: '/vote' },
  { name: '커뮤니티', path: '/community' },
  { name: '공지사항', path: '/notice' },
];

export default function Header() {
  const router = useRouter();
  const { user, setUser, clearUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState(''); // 알림 메시지
  const [alertAction, setAlertAction] = useState<(() => void) | null>(null); // 알림창 확인 버튼 동작
  const [nickname, setNickname] = useState('');
 
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 맨처음 렌더링 시에만 실행되는 useEffect
  useEffect(() => {

    const onMessage = async (event: MessageEvent) => {

      // 다른탭에서 로그인 상태 type: 'login'요청 받음
      if (event.data.type === 'login') {

        if(await getToken() === false) {
          
          return ;
        }

      }else if (event.data.type === 'request-login-status') {

        // 토큰있으면 로그인 상태 있다고 다른 탭에 type: 'login' 으로 알림
        if (localStorage.getItem('a_t') && localStorage.getItem('r_t') && sessionStorage.getItem('sess')) {

          authChannel.postMessage({ type: 'login' });
        }
      }

    };
    authChannel.addEventListener('message', onMessage);

    return () => {
      authChannel.removeEventListener('message', onMessage);
    };
    
  }, []);

  useEffect(() => {
    
    const init = async () => {

      // 토큰이 있는데 로그인페이지, 회원가입이면 메인으로 이동
      if (pathname === '/login' || pathname === '/signup') {
        if (localStorage.getItem('a_t') && localStorage.getItem('r_t')) {
          router.push('/'); // 메인으로 이동
          return;
        }
      }
      
      // 애초에 토큰이 없으면 로그아웃 처리
      if (!localStorage.getItem('a_t') || !localStorage.getItem('r_t')) {
        handleLogout()
        return
      }

      // 세선조회
      if(sessionStorage.getItem('sess') === null || sessionStorage.getItem('sess') === undefined) {

        // 자동로그인 조회 
        await checkAutoLogin();
        return

      }

      // 토큰조회
      if(await getToken() === false) {
        return
      }

    };

    init();
  }, [pathname]);


  /**
   * 토큰조회
   */
  const getToken = async () => {
    // 토큰이 없으면 false 반환
    if (!localStorage.getItem('a_t') || !localStorage.getItem('r_t')) {
      return false;
    }

    
    // 토큰이 있으면 사용자 정보 조회
    if(user === null) {
      setIsLoading(true);
      await findLoginUser();
      
      setIsLoading(false);
    }else {
      setNickname(user?.nickname || '');
    }
    setIsLoggedIn(true);
  }

  /**
   * 자동로그인 여부 조회
   */
  const checkAutoLogin = async () => {
    
    // 자동로그인 여부 확인
    if (localStorage.getItem('auto_login') !== null && localStorage.getItem('auto_login') !== undefined && localStorage.getItem('auto_login') === 'Y') {
      // 자동로그인 처리 로직
      if(await getToken() === false) {
        return
      }
    } else {
      // 자동로그인 설정이 없으면 다른탭 로그인 여부 확인
      authChannel.postMessage({ type: 'request-login-status' });
      
      // 2초뒤 다른탭이 없어서 로그인 여부 확인안되서 로그인이 진행되지 않아 토큰 없으면 로그아웃 처리
      setTimeout(() => {
        
        if (!localStorage.getItem('a_t') || !localStorage.getItem('r_t') || !sessionStorage.getItem('sess')) {
          handleLogout();
          
        }
      }, 2000);
    }
  }


  /**
   * 로그아웃 처리
   */
  const handleLogout = () => {
    setNickname('');
    localStorage.removeItem('a_t');
    localStorage.removeItem('r_t');
    sessionStorage.clear();
    clearUser(); // 사용자 정보 초기화
    setIsLoggedIn(false);
    if(pathname === '/profile') {
      router.push('/'); // 메인으로 이동
    }
    // 메인으로 이동
    // router.push('/');
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
      loginTime: new Date().toISOString(), // 로그인 시간
    };
    // 한글과 특수문자를 처리할 수 있도록 인코딩
    const encodedUser = JSON.stringify(sessData);
    sessionStorage.setItem('sess', encodedUser);

    useUserStore.getState().setUser(userResult.result); // 전역 상태에 저장
 
    setNickname(userResult.result.nickname); // 닉네임 상태 업데이트
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
            <Button onClick={() => router.push('/login')}>
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
              <Button onClick={() => router.push('/login')}>
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
