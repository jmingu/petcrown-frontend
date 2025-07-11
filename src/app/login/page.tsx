'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '@/components/common/button/Button';
import Input from '@/components/common/input/Input';
import {
  login,
  findUser,
  checkEmailVerificationCode,
  sendEmailVerificationCode,
} from '@/libs/api/user/userApi';
import { useUserStore } from '@/libs/store/user/userStore';
import Alert from '@/components/common/alert/Alert';
import Modal from '@/components/common/modal/Modal'; // 모달 컴포넌트
// 체크박스
import CheckboxGroup from '@/components/common/input/CheckboxGroup';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alertMessage, setAlertMessage] = useState(''); // 알림 메시지
  const [alertAction, setAlertAction] = useState<(() => void) | null>(null); // 알림창 확인 버튼 동작
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
  const [inputCode, setInputCode] = useState(''); // 입력된 인증번호
  const [autoLogin, setAutoLogin] = useState(
    typeof window !== 'undefined' && localStorage.getItem('auto_login') === 'Y'
  );

  /**
   * 로그인
   */
  const handleLogin = async () => {
    if (email === null || email.trim() === '' || email === undefined) {
      alert('이메일을 입력해주세요.');
      return;
    }

    if (password === null || password.trim() === '' || password === undefined) {
      alert('비밀번호를 입력해주세요.');
      return;
    }

    // 로그인
    const loginResult = await login({ email, password }); // 로그인 요청
    if (loginResult.resultCode !== 200) {
      if (loginResult.resultCode >= 3000) {
        setAlertMessage(loginResult.resultMessageKo);
        return;
      }
      setAlertMessage('로그인에 실패했습니다. 다시 시도해주세요.');
      return;
    }

    // 로그인 토큰 로컬스토리지에 저장
    localStorage.setItem('a_t', loginResult.result.accessToken);
    localStorage.setItem('r_t', loginResult.result.refreshToken);

    const userResult = await findUser(); // 로그인 후 사용자 정보 받아오기
    if (userResult.resultCode !== 200) {
      if (userResult.resultCode >= 3000) {
        setAlertMessage(userResult.resultMessageKo);
        return;
      }
      setAlertMessage(
        '사용자 정보를 가져오는 데 실패했습니다. 다시 시도해주세요.'
      );
    }

    // isEmailVerified 아직 N일때 인증 필요
    if (userResult.result.isEmailVerified === 'N') {
      handleResendCode(''); // 인증번호 재전송
      setIsModalOpen(true); // 모달 열기
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
    // 로그인 성공 시 사용자 정보 조회 or 메인 페이지 이동
    router.push('/'); // 또는 getMyInfo()로 사용자 상태 업데이트
  };

  /**
   * 인증번호 확인
   */
  const handleVerifyCode = async () => {
    if (
      inputCode === null ||
      inputCode.trim() === '' ||
      inputCode === undefined
    ) {
      setAlertMessage('인증번호를 입력해주세요.');
      return;
    }

    const codeCheck = await checkEmailVerificationCode({
      code: inputCode,
      email: email,
    });

    if (codeCheck.resultCode !== 200) {
      if (codeCheck.resultCode >= 3000) {
        setAlertMessage(codeCheck.resultMessageKo); // 한국어 메시지
        return;
      }
      setAlertMessage('인증번호 확인 중 오류가 발생했습니다.');
      return;
    }

    const userResult = await findUser(); // 사용자 정보 받아오기
    if (userResult.resultCode !== 200) {
      if (userResult.resultCode >= 3000) {
        setAlertMessage(userResult.resultMessageKo);
        return;
      }
      setAlertMessage(
        '사용자 정보를 가져오는 데 실패했습니다. 다시 시도해주세요.'
      );
    }

    // 세션에 필요한 데이터만 등록
    const sessData = {
      loginTime: new Date().toISOString(), // 로그인 시간
    };
    // 한글과 특수문자를 처리할 수 있도록 인코딩
    const encodedUser = JSON.stringify(sessData);

    sessionStorage.setItem('sess', encodedUser);

    useUserStore.getState().setUser(userResult.result); // 전역 상태에 저장

    // 확인 버튼 클릭 시 메인 페이지로 이동하는 알림창
    setAlertMessage('인증이 완료되었습니다!');
    setAlertAction(() => router.push('/')); // 함수 참조 전달
    setIsModalOpen(false);
  };

  /**
   * 인증번호 전송
   */
  const handleResendCode = async (value: string) => {
    const sendResult = await sendEmailVerificationCode(email);

    if (sendResult.resultCode !== 200) {
      if (sendResult.resultCode >= 3000) {
        setAlertMessage(sendResult.resultMessageKo); // 한국어 메시지
        return;
      }
      setAlertMessage('인증번호 재전송 중 오류가 발생했습니다.');
      return;
    }
    if (value === 'resend') {
      setAlertMessage('인증번호가 재전송되었습니다.');
    }
    setInputCode(''); // 입력된 인증번호 초기화
  };

  // 자동로그인 체크박스 변경 핸들러
  const handleAutoLoginChange = (values: string[]) => {
    const checked = values.includes('auto_login');
    setAutoLogin(checked);
    if (checked) {
      localStorage.setItem('auto_login', 'Y');
    } else {
      localStorage.removeItem('auto_login');
    }
  };

  return (
    <div className="h-full flex items-center justify-center px-3 mt-20">
      <div className="w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-4">로그인</h2>
        <div className="mb-3">
          <label className="block text-gray-700 font-bold">이메일</label>
          <Input
            name="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e)}
          />
        </div>

        <div className="mb-3">
          <label className="block text-gray-700 font-bold">비밀번호</label>
          <Input
            name="password"
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e)}
          />
        </div>

        {/* 자동로그인 체크박스 */}
        <CheckboxGroup
          name="autoLogin"
          options={[{ label: '자동로그인', value: 'auto_login' }]}
          selectedValues={autoLogin ? ['auto_login'] : []}
          onChange={handleAutoLoginChange}
        />
        <Button onClick={handleLogin} className="w-full mb-3">
          로그인
        </Button>
        <div className="flex justify-between text-sm">
          <Link href="/find-id" className="text-gray-600 hover:underline">
            아이디 찾기
          </Link>
          <Link href="/find-password" className="text-gray-600 hover:underline">
            비밀번호 찾기
          </Link>
          <Link
            href="/signup"
            className="text-[var(--color-theme-sky)] hover:underline"
          >
            회원가입
          </Link>
        </div>
      </div>

      {/* 인증번호 모달 */}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <div className="p-4">
            <h3 className="text-xl font-bold mb-4">인증번호 확인</h3>
            <p className="mb-2">이메일로 인증번호가 전송되었습니다.</p>
            <p className="mb-2">인증까지 완료해야 최종 가입이 완료됩니다.</p>
            <Input
              name="verificationCode"
              placeholder="인증번호 입력"
              value={inputCode}
              onChange={(value) => setInputCode(value)}
            />
            <div className="flex justify-between mt-4">
              <Button onClick={handleVerifyCode} className="flex-1 mr-2">
                확인
              </Button>
              <Button
                onClick={() => handleResendCode('resend')}
                type="accent"
                className="flex-1 ml-2"
              >
                재전송
              </Button>
            </div>
          </div>
        </Modal>
      )}
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
    </div>
  );
}
