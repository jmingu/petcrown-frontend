'use client';

import { useState } from 'react';
import { User } from 'lucide-react';
import Alert from '@/components/common/alert/Alert';
import CuteButton from '@/components/common/button/CuteButton';
import RadioGroup from '@/components/common/input/RadioGroup';
import Modal from '@/components/common/modal/Modal';
import CuteCard from '@/components/common/card/CuteCard';
import DateInput from '@/components/common/input/DateInput';
import { checkNickname, changeUserInfo } from '@/libs/api/user/userApi';
import { UserResponse } from '@/libs/interface/api/user/userResponseInterface';
import { useUserStore } from '@/libs/store/user/userStore';

interface EditProfileModalProps {
  user: UserResponse;
  onClose: () => void;
  onSave: (updatedUser: UserResponse) => void;
}

export default function EditProfileModal({
  user,
  onClose,
  onSave,
}: EditProfileModalProps) {
  const { setUser } = useUserStore();
  const [alertMessage, setAlertMessage] = useState('');

  const [email, setEmail] = useState(user.email);
  const [name, setName] = useState(user.name);
  const [originalNickname, setOriginalNickname] = useState(user.nickname);
  const [nickname, setNickname] = useState(user.nickname);
  const [gender, setGender] = useState(user.gender);
  const [birthDate, setBirthDate] = useState(user.birthDate);

  // 전화번호가 없을 수 있으므로 null 체크
  const phoneNumberParts = user.phoneNumber ? user.phoneNumber.split('-') : ['', '', ''];
  const [phoneNumber1, setPhoneNumber1] = useState(phoneNumberParts[0] || '');
  const [phoneNumber2, setPhoneNumber2] = useState(phoneNumberParts[1] || '');
  const [phoneNumber3, setPhoneNumber3] = useState(phoneNumberParts[2] || '');

  const [isNicknameVerified, setIsNicknameVerified] = useState(false);

  const handleCheckNickname = async () => {
    if (!nickname) {
      setAlertMessage('닉네임을 입력해주세요.');
      return;
    }

    const nicknameCheck = await checkNickname(nickname);

    if (nicknameCheck.resultCode !== 200) {
      if (nicknameCheck.resultCode >= 3000) {
        setAlertMessage(nicknameCheck.resultMessageKo);
        setIsNicknameVerified(false);
        return;
      }

      setAlertMessage('닉네임 중복 확인 중 오류가 발생했습니다.');
      setIsNicknameVerified(false);
      return;
    }
    setAlertMessage('닉네임이 사용 가능합니다!');
    setIsNicknameVerified(true);
  };

  const changeUser = async () => {
    // 필수 필드 검증 - 이름, 닉네임만
    if (!name) {
      setAlertMessage('이름을 입력해주세요.');
      return;
    }

    if (!nickname) {
      setAlertMessage('닉네임을 입력해주세요.');
      return;
    }

    // 전화번호 선택사항이지만 입력했다면 유효성 검사
    if (phoneNumber1 || phoneNumber2 || phoneNumber3) {
      if (!phoneNumber1 || !phoneNumber2 || !phoneNumber3) {
        setAlertMessage('핸드폰 번호를 모두 입력해주세요.');
        return;
      }

      if (
        phoneNumber1.length < 3 ||
        phoneNumber2.length < 4 ||
        phoneNumber3.length < 4
      ) {
        setAlertMessage('핸드폰 번호를 올바르게 입력해주세요.');
        return;
      }
    }

    if (originalNickname !== nickname) {
      if (!isNicknameVerified) {
        setAlertMessage('닉네임 인증을 완료해주세요.');
        return;
      }
    }

    const changeResult = await changeUserInfo({
      name,
      nickname,
      ...(gender && { gender }),
      ...(birthDate && { birthDate }),
      ...(phoneNumber1 && phoneNumber2 && phoneNumber3 && {
        phoneNumber: `${phoneNumber1}-${phoneNumber2}-${phoneNumber3}`,
      }),
    });

    if (changeResult.resultCode !== 200) {
      if (changeResult.resultCode >= 3000) {
        setAlertMessage(changeResult.resultMessageKo);
        return;
      }
      setAlertMessage('오류가 발생했습니다.');
      return;
    }

    setAlertMessage('수정되었습니다!');

    const updatedUser: UserResponse = {
      ...user,
      name,
      nickname,
      ...(gender && { gender }),
      ...(birthDate && { birthDate }),
      ...(phoneNumber1 && phoneNumber2 && phoneNumber3 && {
        phoneNumber: `${phoneNumber1}-${phoneNumber2}-${phoneNumber3}`
      })
    };

    setUser({
      email: updatedUser.email,
      name: updatedUser.name,
      nickname: updatedUser.nickname,
      phoneNumber: updatedUser.phoneNumber || '',
      profileImageUrl: updatedUser.profileImageUrl,
      birthDate: updatedUser.birthDate || '',
      gender: updatedUser.gender || '',
    });

    setTimeout(() => {
      onSave(updatedUser);
      onClose();
    }, 1500);
  };

  const handleSave = () => {
    changeUser();
  };

  return (
    <>
      <Modal onClose={onClose}>
        <CuteCard className="max-w-lg mx-auto" padding="lg">
          <div className="space-y-6">
            {/* 제목 섹션 */}
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">프로필 수정</h3>
              <p className="text-gray-600 text-sm">
                개인정보를 수정해주세요 ✨
              </p>
            </div>

            {/* 폼 섹션 */}
            <div className="space-y-4">
              {/* 이메일 입력 */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">이메일</label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl bg-gray-100 text-gray-500 cursor-not-allowed transition-all duration-200"
                />
              </div>

              {/* 이름 */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">이름 *</label>
                <input
                  type="text"
                  placeholder="이름을 입력해주세요"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={10}
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* 닉네임 */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">닉네임 *</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="닉네임을 입력해주세요"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    maxLength={10}
                    className="flex-1 min-w-0 px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  />
                  <CuteButton
                    onClick={handleCheckNickname}
                    variant={isNicknameVerified ? "secondary" : "primary"}
                    size="sm"
                    className="shrink-0 whitespace-nowrap"
                  >
                    {isNicknameVerified ? "확인완료" : "중복확인"}
                  </CuteButton>
                </div>
              </div>

              {/* 성별 선택 */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">성별 (선택사항)</label>
                <RadioGroup
                  name="gender"
                  options={[
                    { label: '남성', value: 'M' },
                    { label: '여성', value: 'W' },
                  ]}
                  selectedValue={gender}
                  onChange={setGender}
                />
              </div>

              {/* 생년월일 */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">생년월일 (선택사항)</label>
                <DateInput
                  value={birthDate}
                  onChange={(value) => setBirthDate(value)}
                  placeholder="YYYY-MM-DD"
                  minDate={new Date('1900-01-01')}
                  maxDate={new Date()}
                />
              </div>

              {/* 핸드폰 번호 입력 */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">핸드폰 번호 (선택사항)</label>
                <div className="flex space-x-2 items-center">
                  <input
                    type="text"
                    placeholder="010"
                    value={phoneNumber1}
                    onChange={(e) => setPhoneNumber1(e.target.value.replace(/[^0-9]/g, ''))}
                    maxLength={3}
                    className="w-16 sm:w-20 px-2 sm:px-3 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-center text-sm"
                  />
                  <span className="text-gray-500 shrink-0">-</span>
                  <input
                    type="text"
                    placeholder="1234"
                    value={phoneNumber2}
                    onChange={(e) => setPhoneNumber2(e.target.value.replace(/[^0-9]/g, ''))}
                    maxLength={4}
                    className="w-18 sm:w-24 px-2 sm:px-3 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-center text-sm"
                  />
                  <span className="text-gray-500 shrink-0">-</span>
                  <input
                    type="text"
                    placeholder="5678"
                    value={phoneNumber3}
                    onChange={(e) => setPhoneNumber3(e.target.value.replace(/[^0-9]/g, ''))}
                    maxLength={4}
                    className="w-18 sm:w-24 px-2 sm:px-3 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-center text-sm"
                  />
                </div>
              </div>
            </div>

            {/* 액션 버튼들 */}
            <div className="flex space-x-3">
              <CuteButton
                onClick={handleSave}
                variant="primary"
                className="flex-1"
              >
                저장
              </CuteButton>
            </div>
          </div>
        </CuteCard>
      </Modal>

      {/* Alert 컴포넌트 */}
      <Alert
        message={alertMessage}
        onClose={() => setAlertMessage('')}
      />
    </>
  );
}
