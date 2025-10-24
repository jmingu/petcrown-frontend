'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import {
  Menu, X, Crown, Trophy, MessageCircle,
  Megaphone, User, LogOut, Heart, PartyPopper, Info, ChevronDown, Bell
} from 'lucide-react';
import CuteButton from '@/components/common/button/CuteButton';
import CuteAvatar from '@/components/common/avatar/CuteAvatar';
import Alert from '@/components/common/alert/Alert';
import { useUserStore } from '@/libs/store/user/userStore';
import { findUser } from '@/libs/api/user/userApi';
import { authChannel } from '@/libs/broadcastchannel/channel';

type MenuItem = {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  path?: string;
  submenus?: Array<{
    name: string;
    path: string;
    icon: React.ComponentType<{ className?: string }>;
  }>;
};

const MENU_ITEMS: MenuItem[] = [
  { name: '이용안내', path: '/guide', icon: Info },
  {
    name: '투표',
    icon: Crown,
    submenus: [
      { name: '랭킹보기', path: '/ranking', icon: Trophy },
      { name: '투표하기', path: '/vote', icon: Crown },
    ]
  },
  { name: '커뮤니티', path: '/community', icon: MessageCircle },
  {
    name: '알림',
    icon: Bell,
    submenus: [
      { name: '공지사항', path: '/notice', icon: Megaphone },
      { name: '이벤트', path: '/event', icon: PartyPopper },
    ]
  },
];

export default function Header() {
  const router = useRouter();
  const { user, setUser, clearUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState(''); // 알림 메시지
  const [alertAction, setAlertAction] = useState<(() => void) | null>(null); // 알림창 확인 버튼 동작
  const [openDropdown, setOpenDropdown] = useState<string | null>(null); // 드롭다운 상태
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

      // 로그인이 필요한 페이지 목록 (Alert 없이 바로 리다이렉트하는 페이지만)
      const loginRequiredPages = ['/profile'];
      const isLoginRequired = loginRequiredPages.some(page => pathname?.startsWith(page));

      // 로그인이 필요한 페이지인데 토큰이 없으면 로그인 페이지로 이동
      if (isLoginRequired && (!localStorage.getItem('a_t') || !localStorage.getItem('r_t'))) {
        router.push('/login');
        return;
      }

      // 토큰이 없으면 로그아웃 상태로 처리 (페이지 이동은 하지 않음)
      if (!localStorage.getItem('a_t') || !localStorage.getItem('r_t')) {
        clearLoginState()
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
          clearLoginState();

        }
      }, 2000);
    }
  }


  /**
   * 로그아웃 처리 (상태만 초기화, 페이지 이동 없음)
   */
  const clearLoginState = () => {
    localStorage.removeItem('a_t');
    localStorage.removeItem('r_t');
    sessionStorage.clear();
    clearUser(); // 사용자 정보 초기화
    setIsLoggedIn(false);
  };

  /**
   * 로그아웃 처리 (대시보드로 이동)
   */
  const handleLogout = () => {
    clearLoginState();
    // 대시보드(메인)으로 이동
    router.push('/');
  };

  /**
   * 로그인 정보 받기
   */
  const findLoginUser = async () => {
    const userResult = await findUser(); // 사용자 정보 받아오기
    if (userResult.resultCode !== 200) {
      clearLoginState(); // 로그아웃(정보지우기)

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
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="relative flex items-center justify-between px-4 py-4 max-w-7xl mx-auto">
          {/* 모바일 메뉴 버튼 */}
          <button
            className="lg:hidden p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:bg-white transition-colors duration-200"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu className="w-5 h-5 text-purple-600" />
          </button>

          {/* 로고 */}
          <div className="lg:hidden absolute left-1/2 transform -translate-x-1/2">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 rounded-full flex items-center justify-center shadow-lg relative">
                <Trophy className="w-3.5 h-3.5 text-yellow-100 relative z-10 mt-1.5" />
                <Crown className="w-2.5 h-2.5 text-white absolute top-1 left-1/2 transform -translate-x-1/2 drop-shadow-sm" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                PetCrown
              </span>
            </Link>
          </div>

          <div className="hidden lg:block">
            <Link href="/" className="flex items-center space-x-3">
              <motion.div
                className="w-10 h-10 bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 rounded-full flex items-center justify-center shadow-lg relative"
                whileHover={{ scale: 1.1, rotate: 10 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Trophy className="w-4 h-4 text-yellow-100 relative z-10 mt-1.5" />
                <Crown className="w-3 h-3 text-white absolute top-1 left-1/2 transform -translate-x-1/2 drop-shadow-sm" />
              </motion.div>
              <span className="text-2xl font-bold text-gray-900">
                PetCrown
              </span>
            </Link>
          </div>

          {/* 데스크톱 네비게이션 */}
          <nav className="hidden lg:flex items-center space-x-4 xl:space-x-6">
            {MENU_ITEMS.map((item) => {
              const Icon = item.icon;
              const hasSubmenu = item.submenus !== undefined;
              const isActive = hasSubmenu
                ? item.submenus!.some(sub => pathname === sub.path)
                : pathname === item.path;

              if (hasSubmenu) {
                return (
                  <div
                    key={item.name}
                    className="relative group"
                  >
                    <button
                      onMouseEnter={() => setOpenDropdown(item.name)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-white/80 backdrop-blur-sm shadow-md text-purple-700'
                          : 'text-gray-700 hover:bg-white/60 hover:text-purple-600'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                      <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${openDropdown === item.name ? 'rotate-180' : ''}`} />
                    </button>

                    {/* 드롭다운 메뉴 */}
                    {openDropdown === item.name && item.submenus && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        onMouseEnter={() => setOpenDropdown(item.name)}
                        onMouseLeave={() => setOpenDropdown(null)}
                        className="absolute top-full mt-2 left-0 bg-white rounded-2xl shadow-lg border border-gray-100 py-2 min-w-[160px] z-50"
                      >
                        {item.submenus.map((submenu) => {
                          const SubIcon = submenu.icon;
                          return (
                            <Link
                              key={submenu.path}
                              href={submenu.path}
                              className={`flex items-center space-x-2 px-4 py-2.5 hover:bg-purple-50 transition-colors duration-200 ${
                                pathname === submenu.path ? 'text-purple-700 bg-purple-50/50' : 'text-gray-700'
                              }`}
                            >
                              <SubIcon className="w-4 h-4" />
                              <span className="text-sm font-medium">{submenu.name}</span>
                            </Link>
                          );
                        })}
                      </motion.div>
                    )}
                  </div>
                );
              }

              if (!item.path) return null;

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-white/80 backdrop-blur-sm shadow-md text-purple-700'
                      : 'text-gray-700 hover:bg-white/60 hover:text-purple-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* 사용자 메뉴 */}
          <div className="hidden lg:flex items-center space-x-4">
            {isLoading ? (
              <div className="flex items-center space-x-2 px-4 py-2 bg-white/60 rounded-full">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-600 border-t-transparent"></div>
                <span className="text-sm text-gray-600">로딩중...</span>
              </div>
            ) : isLoggedIn ? (
              <>
                <Link
                  href="/profile"
                  className="flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:shadow-lg transition-all duration-200"
                  title={user?.nickname || ''}
                >
                  <CuteAvatar size="sm" />
                  <span className="font-medium text-gray-700">
                    {(user?.nickname || '').length > 8 ? (user?.nickname || '').slice(0, 8) + '...' : user?.nickname || ''}님
                  </span>
                </Link>
                <CuteButton
                  onClick={handleLogout}
                  variant="secondary"
                  size="sm"
                  icon={<LogOut className="w-4 h-4" />}
                >
                  로그아웃
                </CuteButton>
              </>
            ) : (
              <CuteButton
                onClick={() => router.push('/login')}
                variant="primary"
                size="md"
                icon={<User className="w-4 h-4" />}
              >
                로그인
              </CuteButton>
            )}
          </div>
        </div>

        {/* 모바일 메뉴 */}
        {isMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            {/* 오버레이 */}
            <div 
              className="absolute inset-0 bg-black opacity-50"
              onClick={() => setIsMenuOpen(false)}
            />
            
            {/* 메뉴 패널 */}
            <motion.div
              className="absolute top-0 left-0 h-screen w-80 bg-white shadow-xl flex flex-col"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {/* 헤더 */}
              <div className="flex items-center justify-between p-6 bg-purple-50 border-b">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 rounded-full flex items-center justify-center shadow-lg relative">
                    <Trophy className="w-3.5 h-3.5 text-yellow-100 relative z-10 mt-1.5" />
                    <Crown className="w-2.5 h-2.5 text-white absolute top-1 left-1/2 transform -translate-x-1/2 drop-shadow-sm" />
                  </div>
                  <span className="text-xl font-bold text-gray-900">
                    PetCrown
                  </span>
                </div>
                <button
                  className="p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* 사용자 정보 */}
              <div className="p-6 bg-gray-50 border-b">
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2 py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-purple-600 border-t-transparent"></div>
                    <span className="text-gray-600">로딩중...</span>
                  </div>
                ) : isLoggedIn ? (
                  <Link
                    href="/profile"
                    className="flex items-center space-x-3 p-4 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <CuteAvatar size="md" />
                    <div>
                      <p className="font-semibold text-gray-900">
                        {(user?.nickname || '').length > 10 ? (user?.nickname || '').slice(0, 10) + '...' : user?.nickname || ''}님
                      </p>
                      <p className="text-sm text-gray-500">프로필 보기</p>
                    </div>
                  </Link>
                ) : (
                  <CuteButton
                    onClick={() => {
                      router.push('/login');
                      setIsMenuOpen(false);
                    }}
                    variant="primary"
                    className="w-full"
                    icon={<User className="w-4 h-4" />}
                  >
                    로그인
                  </CuteButton>
                )}
              </div>

              {/* 메뉴 아이템들 */}
              <div className="flex-1 p-6 space-y-2 bg-white overflow-y-auto">
                {MENU_ITEMS.map((item, index) => {
                  const Icon = item.icon;
                  const hasSubmenu = item.submenus !== undefined;
                  const isActive = hasSubmenu
                    ? item.submenus!.some(sub => pathname === sub.path)
                    : pathname === item.path;
                  const isExpanded = openDropdown === item.name;

                  return (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {hasSubmenu ? (
                        <div className="space-y-1">
                          <button
                            onClick={() => setOpenDropdown(isExpanded ? null : item.name)}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-medium transition-all duration-200 ${
                              isActive
                                ? 'bg-purple-100 text-purple-700 shadow-sm'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <Icon className="w-5 h-5" />
                              <span>{item.name}</span>
                            </div>
                            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                          </button>

                          {/* 서브메뉴 */}
                          {isExpanded && item.submenus && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="ml-4 space-y-1"
                            >
                              {item.submenus.map((submenu) => {
                                const SubIcon = submenu.icon;
                                return (
                                  <Link
                                    key={submenu.path}
                                    href={submenu.path}
                                    className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                                      pathname === submenu.path
                                        ? 'bg-purple-50 text-purple-600'
                                        : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                    onClick={() => setIsMenuOpen(false)}
                                  >
                                    <SubIcon className="w-4 h-4" />
                                    <span className="text-sm">{submenu.name}</span>
                                  </Link>
                                );
                              })}
                            </motion.div>
                          )}
                        </div>
                      ) : item.path ? (
                        <Link
                          href={item.path}
                          className={`flex items-center space-x-3 px-4 py-3 rounded-2xl font-medium transition-all duration-200 ${
                            isActive
                              ? 'bg-purple-100 text-purple-700 shadow-sm'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Icon className="w-5 h-5" />
                          <span>{item.name}</span>
                        </Link>
                      ) : null}
                    </motion.div>
                  );
                })}
              </div>

              {/* 로그아웃 버튼 */}
              {isLoggedIn && (
                <div className="p-6 bg-gray-50 border-t">
                  <CuteButton
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    variant="secondary"
                    className="w-full"
                    icon={<LogOut className="w-4 h-4" />}
                  >
                    로그아웃
                  </CuteButton>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </header>

      {/* 알림창 */}
      <Alert
        message={alertMessage}
        onClose={async () => {
          setAlertMessage('');
          setAlertAction(null);

          if (alertAction) {
            await alertAction();
          }
        }}
      />
    </>
  );
}
