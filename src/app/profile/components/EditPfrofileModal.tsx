'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Alert from '@/components/common/alert/Alert';
import Button from '@/components/common/button/Button';
import Input from '@/components/common/input/Input';

import { checkNickname, changeUserInfo } from '@/libs/api/user/userApi';

import RadioGroup from '@/components/common/input/RadioGroup';

import DateInput from '@/components/common/input/DateInput';
import { UserResponse } from '@/libs/interface/api/user/userResponseInterface';

interface EditProfileModalProps {
  user: UserResponse; // UserResponse 타입으로 변경
  onClose: () => void;
  onSave: (updatedUser: UserResponse) => void;
}

export default function EditProfileModal({
  user,
  onClose,
  onSave,
}: EditProfileModalProps) {
  const [alertMessage, setAlertMessage] = useState('');

  const [email, setEmail] = useState(user.email); // 이메일
  const [name, setName] = useState(user.name); // 이름
  const [nickname, setNickname] = useState(user.nickname); // 닉네임
  const [gender, setGender] = useState(user.gender); // 성별
  const [birthDate, setBirthDate] = useState(user.birthDate); // 생년월일
  const [phoneNumber1, setPhoneNumber1] = useState(
    user.phoneNumber.split('-')[0]
  ); // 핸드폰 번호1
  const [phoneNumber2, setPhoneNumber2] = useState(
    user.phoneNumber.split('-')[1]
  ); // 핸드폰 번호2
  const [phoneNumber3, setPhoneNumber3] = useState(
    user.phoneNumber.split('-')[2]
  ); // 핸드폰 번호3
  const [password, setPassword] = useState(''); // 비밀번호
  const [passwordCheck, setPasswordCheck] = useState(''); // 비밀번호 확인

  const [isNicknameVerified, setIsNicknameVerified] = useState(false); // 닉네임 인증 상태

  /**
   * 닉네임 중복 확인
   */
  const handleCheckNickname = async () => {
    if (!nickname) {
      setAlertMessage('닉네임을 입력해주세요.');
      return;
    }

    const nicknameCheck = await checkNickname(nickname);

    if (nicknameCheck.resultCode !== 200) {
      if (nicknameCheck.resultCode >= 3000) {
        setAlertMessage(nicknameCheck.resultMessageKo); // 한국어 메시지
        setIsNicknameVerified(false);
        return;
      }

      setAlertMessage('닉네임 중복 확인 중 오류가 발생했습니다.');
      setIsNicknameVerified(false);
      return;
    }
    setAlertMessage('닉네임이 사용 가능합니다!');
    setIsNicknameVerified(true); // 닉네임 인증 상태 업데이트
  };

  /**
   * 값 변경 처리
   */
  const handleChange = (name: string, value: string) => {
    if (name === 'name') {
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
  const changeUser = async () => {
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

    // 핸드폰 번호 자리수 확인
    if (
      phoneNumber1.length < 3 ||
      phoneNumber2.length < 4 ||
      phoneNumber3.length < 4
    ) {
      setAlertMessage('핸드폰 번호를 올바르게 입력해주세요.');
      return;
    }

    // 닉네임 인증 확인
    if (!isNicknameVerified) {
      setAlertMessage('닉네임 인증을 완료해주세요.');
      return;
    }

    // 회원가입
    const changeResult = await changeUserInfo({
      name,
      nickname,
      gender,
      birthDate: formatBirthDate(birthDate), // YYYYMMDD 형식으로 변환
      phoneNumber: `${phoneNumber1}-${phoneNumber2}-${phoneNumber3}`,
    });

    if (changeResult.resultCode !== 200) {
      if (changeResult.resultCode >= 3000) {
        setAlertMessage(changeResult.resultMessageKo); // 한국어 메시지
        return;
      }
      setAlertMessage('오류가 발생했습니다.');
      return;
    }
  };

  const handleSave = () => {
    console.log('저장 버튼 클릭');
    changeUser();
    // onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="bg-white p-6 rounded-lg shadow-lg w-96"
      >
        <h2 className="text-xl font-bold mb-4">프로필 수정</h2>
        <div className="flex flex-col">
          {/* 이메일 입력 */}
          <label className="block text-gray-700 font-bold">이메일</label>
          <Input
            name="name"
            placeholder="이메일"
            value={email}
            onChange={(value) => handleChange('name', value)}
            className="bg-gray-200"
            maxLength={10}
            disabled={true} // 이메일은 수정 불가
          />

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
              className="!w-[45%] mb-3"
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
                { label: '여성', value: 'F' },
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
              maxDate={new Date()} // 미래 날짜 선택 방지
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
                onChange={(value) => handleChange('phone1', value)}
                maxLength={3}
                className="w-1/3"
              />
              <Input
                name="phone2"
                placeholder="1234"
                value={phoneNumber2}
                onChange={(value) => handleChange('phone2', value)}
                maxLength={4}
                className="w-1/3"
              />
              <Input
                name="phone3"
                placeholder="5678"
                value={phoneNumber3}
                onChange={(value) => handleChange('phone3', value)}
                maxLength={4}
                className="w-1/3"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-4 gap-2">
          <Button type="gray" onClick={onClose}>
            취소
          </Button>
          <Button onClick={handleSave}>저장</Button>
        </div>
      </motion.div>
      {/* 알림창 */}
      <Alert
        message={alertMessage}
        onClose={async () => {
          setAlertMessage(''); // 메시지 초기화
        }}
      />
    </div>
  );
}
