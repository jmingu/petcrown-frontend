'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/common/button/Button';
import Input from '@/components/common/input/Input';
import RadioGroup from '@/components/common/input/RadioGroup';
import DateInput from '@/components/common/input/DateInput';
import Alert from '@/components/common/alert/Alert';
import Modal from '@/components/common/modal/Modal'; // 모달 컴포넌트 임포트
import {
  checkEmail,
  checkNickname,
  signup,
  sendEmailVerificationCode,
  checkEmailVerificationCode
} from '@/libs/api/user/userApi';

export default function SignupPage() {
  const router = useRouter();

  const [emailWrite, setEmailWrite] = useState(''); // 이메일
  const [emailDomain, setEmailDomain] = useState(''); // 이메일 도메인
  const [name, setName] = useState(''); // 이름
  const [nickname, setNickname] = useState(''); // 닉네임
  const [gender, setGender] = useState(''); // 성별
  const [birthDate, setBirthDate] = useState(''); // 생년월일
  const [phoneNumber1, setPhoneNumber1] = useState(''); // 핸드폰 번호1
  const [phoneNumber2, setPhoneNumber2] = useState(''); // 핸드폰 번호2
  const [phoneNumber3, setPhoneNumber3] = useState(''); // 핸드폰 번호3
  const [password, setPassword] = useState(''); // 비밀번호
  const [passwordCheck, setPasswordCheck] = useState(''); // 비밀번호 확인

  const [alertMessage, setAlertMessage] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
  const [inputCode, setInputCode] = useState(''); // 입력된 인증번호
  const [isEmailVerified, setIsEmailVerified] = useState(false); // 이메일 인증 상태
  const [isNicknameVerified, setIsNicknameVerified] = useState(false); // 닉네임 인증 상태

  /**
   * 이메일 도메인 선택
   */
  const handleEmailDomainChange = (value: string) => {
    if (value === 'custom') {
      setEmailDomain(''); // 도메인 초기화
    } else {
      setEmailDomain(value);
    }
  };

  /**
   * 이메일 중복 확인
   */
  const handleCheckEmail = async () => {
    if (!emailWrite || !emailDomain) {
      setAlertMessage('이메일을 입력해주세요.');
      return;
    }

    const emailCheck = await checkEmail(emailWrite + '@' + emailDomain); // 이메일 합쳐서 확인
    
    if(emailCheck.resultCode !== 200) {
      if(emailCheck.resultCode >= 3000) {
        setAlertMessage(emailCheck.resultMessageKo); // 한국어 메시지
        setIsEmailVerified(false);
        return

      }
      setAlertMessage('이메일 중복 확인 중 오류가 발생했습니다.');
      setIsEmailVerified(false);
      return
    }
    setAlertMessage('이메일이 사용 가능합니다!');
    setIsEmailVerified(true); // 이메일 인증 상태 업데이트

  };

  /**
   * 닉네임 중복 확인
   */
  const handleCheckNickname = async () => {

    if (!nickname) {
      setAlertMessage('닉네임을 입력해주세요.');
      return;
    }

    const nicknameCheck = await checkNickname(nickname);

    if(nicknameCheck.resultCode !== 200) {
      if(nicknameCheck.resultCode >= 3000) {
        setAlertMessage(nicknameCheck.resultMessageKo); // 한국어 메시지
        setIsNicknameVerified(false);
        return

      }
      
      setAlertMessage('닉네임 중복 확인 중 오류가 발생했습니다.'); 
      setIsNicknameVerified(false);
      return
    }
    setAlertMessage('닉네임이 사용 가능합니다!');
    setIsNicknameVerified(true); // 닉네임 인증 상태 업데이트

  };

  /**
   * 값 변경 처리
   */
  const handleChange = (name: string, value: string) => {
    if (name === 'emailWrite') {
      setEmailWrite(value);
    } else if (name === 'emailDomain') {
      setEmailDomain(value);
    } else if (name === 'name') {
      setName(value);
    } else if (name === 'nickname') {
      setNickname(value);
    } else if (name === 'gender') {
      setGender(value);
    } else if (name === 'birthDate') {
      setBirthDate(value);
    } else if (name === 'phoneNumber1') {
      setPhoneNumber1(value);
    } else if (name === 'phoneNumber2') {
      setPhoneNumber2(value);
    } else if (name === 'phoneNumber3') {
      setPhoneNumber3(value);
    } else if (name === 'password') {
      setPassword(value);
    } else if (name === 'passwordCheck') {
      setPasswordCheck(value);
    }
  };

  /**
   * 생년월일 형식 변환 (YYYY-MM-DD -> YYYYMMDD)
   */
  const formatBirthDate = (date: string) => {
    return date.replace(/-/g, '');
  };

  /**
   * 회원가입 처리
   */
  const handleSignup = async () => {

    // 이메일, 도메인 빈값 확인
    if (!emailWrite || !emailDomain) {
      setAlertMessage('이메일을 입력해주세요.');
      return;
    }

    // 이름 빈값 확인
    if (!name) {
      setAlertMessage('이름을 입력해주세요.');
      return;
    }

    // 닉네임 빈값 확인
    if (!nickname) {
      setAlertMessage('닉네임을 입력해주세요.');
      return;
    }

    // 성별 빈값 확인
    if (!gender) {
      setAlertMessage('성별을 선택해주세요.');
      return;
    }

    // 생년월일 빈값 확인
    if (!birthDate) {
      setAlertMessage('생년월일을 입력해주세요.');
      return;
    }

    // 핸드폰 번호 빈값 확인
    if (!phoneNumber1 || !phoneNumber2 || !phoneNumber3) {
      setAlertMessage('핸드폰 번호를 입력해주세요.');
      return;
    }

    // 비밀번호 빈값 확인
    if (!password) {
      setAlertMessage('비밀번호를 입력해주세요.');
      return;
    }
    // 비밀번호 빈값 확인
    if (!passwordCheck) {
      setAlertMessage('비밀번호를 입력해주세요.');
      return;
    }

    // 비밀번호 최소 자리수 확인 4자리
    if (password.length < 4) {
      setAlertMessage('비밀번호는 최소 4자리 이상이어야 합니다.');
      return;
    }

    // 비밀번호 확인
    if (password !== passwordCheck) {
      setAlertMessage('비밀번호가 일치하지 않습니다.');
      return;
    }

    // 핸드폰 번호 자리수 확인
    if (phoneNumber1.length < 3 || phoneNumber2.length < 4 || phoneNumber3.length < 4) {
      setAlertMessage('핸드폰 번호를 올바르게 입력해주세요.');
      return;
    }

    // 이메일 인증 확인
    if (!isEmailVerified) {
      setAlertMessage('이메일 인증을 완료해주세요.');
      return;
    }

    // 닉네임 인증 확인
    if (!isNicknameVerified) {
      setAlertMessage('닉네임 인증을 완료해주세요.');
      return;
    }
    
    // 회원가입
    const signupResult = await signup({
      email: emailWrite + '@' + emailDomain,
      name,
      nickname,
      gender,
      birthDate : formatBirthDate(birthDate), // YYYYMMDD 형식으로 변환
      phoneNumber: `${phoneNumber1}-${phoneNumber2}-${phoneNumber3}`,
      password,
      passwordCheck,
    });

    if(signupResult.resultCode !== 200) {
      if(signupResult.resultCode >= 3000) { 
        setAlertMessage(signupResult.resultMessageKo); // 한국어 메시지
        return

      }
      setAlertMessage('회원가입 중 오류가 발생했습니다.');
      return;
    }  

    setIsModalOpen(true); // 인증번호 모달 열기

  };

  /**
   * 인증번호 확인
   */
  const handleVerifyCode = async () => {
    if(inputCode === null || inputCode.trim() === '' || inputCode === undefined) {
      setAlertMessage('인증번호를 입력해주세요.');
      return;
    }

    const codeCheck = await checkEmailVerificationCode({
      code: inputCode,
      email: emailWrite + '@' + emailDomain,
    })

    if(codeCheck.resultCode !== 200) {
      if(codeCheck.resultCode >= 3000) {
        setAlertMessage(codeCheck.resultMessageKo); // 한국어 메시지
        return

      }
      setAlertMessage('인증번호 확인 중 오류가 발생했습니다.');
      return
    }

    setAlertMessage('인증이 완료되었습니다!');
    setIsModalOpen(false);
    router.push('/'); // 메인 페이지로 이동
  };

  /**
   * 인증번호 재전송
   */
  const handleResendCode = async () => {
    const sendResult = await sendEmailVerificationCode(
      emailWrite + '@' + emailDomain
    );

    if(sendResult.resultCode !== 200) {
      if(sendResult.resultCode >= 3000) { 
        setAlertMessage(sendResult.resultMessageKo); // 한국어 메시지
        return

      }
      setAlertMessage('인증번호 재전송 중 오류가 발생했습니다.');
      return
    }
    setInputCode(''); // 입력된 인증번호 초기화
    setAlertMessage('인증번호가 재전송되었습니다.');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-sm bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">회원가입</h2>

        {/* 이메일 입력 */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold">이메일</label>
          <div className="flex items-center gap-2">
            <Input
              name="email"
              placeholder="이메일 입력"
              value={emailWrite}
              onChange={(value) => handleChange('emailWrite', value)}
              divClass="flex-1"
            />
            <span className="text-lg font-bold">@</span>
            <Input
              name="emailDomain"
              placeholder="도메인 입력"
              value={emailDomain}
              onChange={(value) => handleChange('emailDomain', value)}
              divClass="!w-[45%]"
            />
          </div>
          <div className="flex justify-between">
            <Button onClick={handleCheckEmail} type="accent">
              중복 확인
            </Button>
            <select
              onChange={(e) => handleEmailDomainChange(e.target.value)}
              className="p-3 border rounded border-gray-300"
            >
              <option value="custom">직접 입력</option>
              <option value="naver.com">naver.com</option>
              <option value="gmail.com">gmail.com</option>
              <option value="nate.com">nate.com</option>
              <option value="daum.net">daum.net</option>
            </select>
          </div>
        </div>

        {/* 이름 */}
        <label className="block text-gray-700 font-bold">이름</label>
        <Input
          name="name"
          placeholder="이름"
          value={name}
          onChange={(value) => handleChange('name', value)}
          maxLength={10}
        />

        {/* 닉네임 */}
        <label className="block text-gray-700 font-bold">닉네임</label>
        <div className="flex">
          <Input
            name="nickname"
            placeholder="닉네임"
            value={nickname}
            onChange={(value) => handleChange('nickname', value)}
            className="flex-1"
            maxLength={10}
          />
          <Button
            onClick={handleCheckNickname}
            type="accent"
            className="!w-[45%] mb-3 ml-2"
          >
            중복 확인
          </Button>
        </div>

        {/* 성별 선택 */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold">성별</label>
          <RadioGroup
            name="gender"
            options={[
              { label: '남성', value: 'M' },
              { label: '여성', value: 'W' },
            ]}
            selectedValue={gender}
            onChange={(value) => handleChange('gender', value)}
          />
        </div>

        {/* 생년월일 (캘린더) */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold">생년월일</label>
          <DateInput
            value={birthDate}
            onChange={(value) => handleChange('birthDate', value)}
            placeholder="YYYY-MM-DD"
            minDate={new Date('1900-01-01')} // 최소 선택 가능 날짜
            maxDate={new Date()} // 오늘 날짜까지 선택 가능
          />
        </div>

        {/* 핸드폰 번호 입력 */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold">핸드폰 번호</label>
          <div className="flex gap-2">
            <Input
              name="phone1"
              placeholder="010"
              value={phoneNumber1}
              onChange={(value) => handleChange('phoneNumber1', value)}
              minLength={3}
              maxLength={3}
              className="w-1/3"
              onlyNumbers={true} // 숫자만 입력 가능
            />
            <Input
              name="phone2"
              placeholder="1234"
              value={phoneNumber2}
              onChange={(value) => handleChange('phoneNumber2', value)}
              minLength={4}
              maxLength={4}
              className="w-1/3"
              onlyNumbers={true} // 숫자만 입력 가능
            />
            <Input
              name="phone3"
              placeholder="5678"
              value={phoneNumber3}
              onChange={(value) => handleChange('phoneNumber3', value)}
              minLength={4}
              maxLength={4}
              className="w-1/3"
              onlyNumbers={true} // 숫자만 입력 가능
            />
          </div>
        </div>
        {/* 비밀번호 */}
        <label className="block text-gray-700 font-bold">비밀번호</label>
        <Input
          type="password"
          name="password"
          placeholder="비밀번호"
          value={password}
          onChange={(value) => handleChange('password', value)}
          minLength={4}
          maxLength={20}
        />
        <Input
          type="password"
          name="confirmPassword"
          placeholder="비밀번호 확인"
          value={passwordCheck}
          onChange={(value) => handleChange('passwordCheck', value)}
          minLength={4}
          maxLength={20}
        />

        {/* 회원가입 버튼 */}
        <Button onClick={handleSignup} className="w-full">
          회원가입
        </Button>
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
                onClick={handleResendCode}
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
      <Alert message={alertMessage} onClose={() => setAlertMessage('')} />
      
    </div>
  );
}
