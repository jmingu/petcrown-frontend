'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/common/button/Button';
import Input from '@/components/common/input/Input';
import RadioGroup from '@/components/common/input/RadioGroup';
import DateInput from '@/components/common/input/DateInput';
import Alert from '@/components/common/alert/Alert';
import Modal from '@/components/common/modal/Modal'; // 모달 컴포넌트 임포트
import { checkEmail, checkNickname, signup } from '@/libs/api/user/userApi';

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: '',
    name: '',
    nickname: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    birthDate: '',
    gender: '',
  });
  const [alertMessage, setAlertMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
  const [verificationCode, setVerificationCode] = useState(''); // 인증번호
  const [inputCode, setInputCode] = useState(''); // 입력된 인증번호
  const [isEmailVerified, setIsEmailVerified] = useState(false); // 이메일 인증 상태
  const [isNicknameVerified, setIsNicknameVerified] = useState(false); // 닉네임 인증 상태

  // 폰번호 합치기
  const handlePhoneChange = (name: string, value: string) => {
    let newPhoneNumber = form.phoneNumber;
  
    if (name === 'phone1') {
      newPhoneNumber = `${value}-${form.phoneNumber.split('-')[1] || ''}-${form.phoneNumber.split('-')[2] || ''}`;
    } else if (name === 'phone2') {
      newPhoneNumber = `${form.phoneNumber.split('-')[0] || ''}-${value}-${form.phoneNumber.split('-')[2] || ''}`;
    } else if (name === 'phone3') {
      newPhoneNumber = `${form.phoneNumber.split('-')[0] || ''}-${form.phoneNumber.split('-')[1] || ''}-${value}`;
    }
  
    setForm((prev) => ({ ...prev, phoneNumber: newPhoneNumber }));
  };

  // 이메일 합치기
  const handleEmailChange = (name: string, value: string) => {
    let newEmail = form.email;

    if (name === 'email') {
      newEmail = `${value}@${form.email.split('@')[1] || ''}`;
    } else if (name === 'emailDomain') {
      newEmail = `${form.email.split('@')[0] || ''}@${value}`;
    }

    setForm((prev) => ({ ...prev, email: newEmail }));
  };

  // 이메일 도메인 선택
  const handleEmailDomainChange = (value: string) => {
    if (value === 'custom') {
      setForm((prev) => ({ ...prev, email: `${prev.email.split('@')[0]}@` })); // 도메인 비우기
    } else {
      setForm((prev) => ({...prev, email: `${prev.email.split('@')[0]}@${value}`})); // 새로운 도메인 적용
    }
  };

  // 이메일 중복 확인
  const handleCheckEmail = async () => {
    try {
      await checkEmail(form.email);
      setAlertMessage('이메일이 사용 가능합니다!');
      setIsEmailVerified(true); // 이메일 인증 상태 업데이트
    } catch (error) {
      setIsEmailVerified(false);
      if ((error as any)?.response?.data?.resultMessage) {
        setAlertMessage((error as any).response.data.resultMessage);
      } else {
        setAlertMessage('이메일 중복 확인 중 오류가 발생했습니다.');
      } 
      
    }
  };

  // 닉네임 중복 확인
  const handleCheckNickname = async () => {
    try {
      await checkNickname(form.nickname);
      setAlertMessage('닉네임이 사용 가능합니다!');
      setIsNicknameVerified(true); // 닉네임 인증 상태 업데이트
    } catch (error) {
      
      setIsNicknameVerified(false);
      if ((error as any)?.response?.data?.resultMessage) {
        setAlertMessage((error as any).response.data.resultMessage);
      } else {
        setAlertMessage('닉네임 중복 확인 중 오류가 발생했습니다.');
      } 
    }
  };

  // 값 변경 처리
  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 생년월일 형식 변환 (YYYY-MM-DD -> YYYYMMDD)
  const formatBirthDate = (date: string) => {
    return date.replace(/-/g, '');
  };

  // 인증번호 생성 함수
  const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6자리 인증번호 생성
  };

  // 회원가입 처리
  const handleSignup = async () => {
    try {
      // 비밀번호 확인
      if (form.password !== form.confirmPassword) {
        setAlertMessage('비밀번호가 일치하지 않습니다.');
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

      // 생년월일 형식 변환
      const formattedBirthDate = formatBirthDate(form.birthDate);

      // 인증번호 생성 및 모달 열기
      const generatedCode = generateVerificationCode();
      setVerificationCode(generatedCode);
      setIsModalOpen(true);

      // 인증번호 전송 로직 (예: 이메일 전송)
      console.log(`인증번호 전송: ${generatedCode}`);
      setAlertMessage('인증번호가 전송되었습니다.');
    } catch (error) {
      setAlertMessage('회원가입 중 오류가 발생했습니다.');
    }
  };

  // 인증번호 확인
  const handleVerifyCode = () => {
    if (inputCode === verificationCode) {
      setAlertMessage('인증이 완료되었습니다!');
      setIsModalOpen(false);

      // 회원가입 요청
      signup({
        ...form,
        birthDate: formatBirthDate(form.birthDate),
        passwordCheck: form.confirmPassword,
      })
        .then(() => {
          setAlertMessage('회원가입이 완료되었습니다.');
          router.push('/login');
        })
        .catch((error) => {
          setAlertMessage('회원가입 중 오류가 발생했습니다.');
        });
    } else {
      setAlertMessage('인증번호가 일치하지 않습니다.');
    }
  };

  // 인증번호 재전송
  const handleResendCode = () => {
    const newCode = generateVerificationCode();
    setVerificationCode(newCode);

    // 인증번호 재전송 로직 (예: 이메일 전송)
    console.log(`인증번호 재전송: ${newCode}`);
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
              placeholder="아이디 입력"
              value={form.email.split('@')[0] || ''}
              onChange={(value) => handleEmailChange('email', value)}
              divClass="flex-1"
            />
            <span className="text-lg font-bold">@</span>
            <Input
              name="emailDomain"
              placeholder="도메인 입력"
              value={form.email.split('@')[1] || ''}
              onChange={(value) => handleEmailChange('emailDomain', value)}
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
              <option value="">선택</option>
              <option value="naver.com">naver.com</option>
              <option value="gmail.com">gmail.com</option>
              <option value="nate.com">nate.com</option>
              <option value="daum.net">daum.net</option>
              <option value="custom">직접 입력</option>
            </select>
          </div>
        </div>

        {/* 이름 */}
          <label className="block text-gray-700 font-bold">이름</label>
          <Input
            name="name"
            placeholder="이름"
            value={form.name}
            onChange={(value) => handleChange('name', value)}
            maxLength={10}
          />

        {/* 닉네임 */}
          <label className="block text-gray-700 font-bold">닉네임</label>
        <div className='flex'>
            <Input
              name="nickname"
              placeholder="닉네임"
              value={form.nickname}
              onChange={(value) => handleChange('nickname', value)}
            className='flex-1'
              maxLength={10}
            />
          <Button onClick={handleCheckNickname} type="accent" className='!w-[45%] mb-3'>
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
            selectedValue={form.gender}
            onChange={(value) => handleChange('gender', value)}
          />
        </div>

        {/* 생년월일 (캘린더) */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold">생년월일</label>
          <DateInput
  value={form.birthDate}
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
              value={form.phoneNumber.split('-')[0] || ''}
              onChange={(value) => handlePhoneChange('phone1', value)}
              maxLength={3}
              className="w-1/3"
              onlyNumbers={true} // 숫자만 입력 가능
            />
            <Input
              name="phone2"
              placeholder="1234"
              value={form.phoneNumber.split('-')[1] || ''}
              onChange={(value) => handlePhoneChange('phone2', value)}
              maxLength={4}
              className="w-1/3"
              onlyNumbers={true} // 숫자만 입력 가능
            />
            <Input
              name="phone3"
              placeholder="5678"
              value={form.phoneNumber.split('-')[2] || ''}
              onChange={(value) => handlePhoneChange('phone3', value)}
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
          value={form.password}
          onChange={(value) => handleChange('password', value)}
          minLength={4}
          maxLength={20}
          />
        <Input
          type="password"
          name="confirmPassword"
          placeholder="비밀번호 확인"
          value={form.confirmPassword}
          onChange={(value) => handleChange('confirmPassword', value)}
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
            <p className="mb-2">이메일로 전송된 인증번호를 입력하세요.</p>
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
              <Button onClick={handleResendCode} type="accent" className="flex-1 ml-2">
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
