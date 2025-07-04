'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Edit2 } from 'lucide-react';
import EditProfileModal from '@/app/profile/components/EditPfrofileModal';
import EditPetModal from '@/app/profile/components/EditPetModal';
import { UserResponse } from '@/libs/interface/api/user/userResponseInterface';
import Button from '@/components/common/button/Button';
import Alert from '@/components/common/alert/Alert';
import { findUser } from '@/libs/api/user/userApi';
import { findMyPet } from '@/libs/api/pet/petApi';
import {MyPetResponse} from '@/libs/interface/api/pet/petResponseInterface'; 


export default function Profile() {
  const router = useRouter();
  const [alertMessage, setAlertMessage] = useState(''); // 알림 메시지
  const [alertAction, setAlertAction] = useState<(() => void) | null>(null); // 알림창 확인 버튼 동작
  const [user, setUser] = useState<UserResponse>();
  // 반려동물 모달 오픈 여부
  const [isPetModalOpen, setIsPetModalOpen] = useState(false);
  const [pets, setPets] = useState<MyPetResponse[]>([]); // 반려동물 목록 상태
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState<MyPetResponse | null>(null);

  // 로그인 여부 확인
  useEffect(() => {
    const storedLogin = sessionStorage.getItem('sess');
    findLoginUser(); // 로그인 후 사용자 정보 받아오기
    fetchMyPets(); // 나의 펫 조회

    if (!storedLogin) {
      router.push('/login');
      return;
    }
  }, []);

  /**
   * 로그인 정보 받기
   */
  const findLoginUser = async () => {
    const userResult = await findUser(); // 사용자 정보 받아오기
    if (userResult.resultCode !== 200) {
      // handleLogout(); // 로그아웃(정보지우기)

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
    setUser(userResult.result); // 사용자 정보 저장
  };

  /**
   * 나의 펫 조회
   */
  const fetchMyPets = async () => {
    try {
      const response = await findMyPet();

      setPets(response.result); // 반려동물 목록 저장
    } catch (error) {
      setPets([]);
    }
  }

  // 나이 계산 함수
  const calculateAge = (birthdate: string) => {
    const birthYear = new Date(birthdate).getFullYear();
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear;
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h3 className="text-xl font-bold mt-8 mb-4">내 프로필</h3>

      {/* 사용자 정보 */}
      {user ? (
        <div className="bg-white shadow-md rounded-lg p-6 relative">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
          >
            <Edit2 size={20} className="cursor-pointer" />
          </button>
          <div className="mb-6">
            <p className="text-lg">
              <strong>이메일:</strong> {user.email}
            </p>
            <p className="text-lg">
              <strong>이름:</strong> {user.name}
            </p>
            <p className="text-lg">
              <strong>닉네임:</strong> {user.nickname}
            </p>
            <p className="text-lg">
              <strong>성별:</strong> {user.gender === 'M' ? '남성' : '여성'}
            </p>
            <p className="text-lg">
              <strong>생년월일:</strong> {user.birthDate}
            </p>

            <p className="text-lg">
              <strong>전화번호:</strong> {user.phoneNumber}
            </p>
          </div>
        </div>
      ) : (
        <p>사용자 정보를 불러오는 중...</p>
      )}

      {/* 반려동물 정보 */}
      <h3 className="text-xl font-bold mt-8 mb-4">내 반려동물</h3>
      {pets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pets.map((pet) => (
            <div
              key={pet.petId}
              className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center relative"
            >
              <button
                onClick={
                  () => {
                    setIsPetModalOpen(true)
                    setSelectedPet(pet)
                  }
                }
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              >
                <Edit2 size={20} className="cursor-pointer" />
              </button>
              <Image
                src={pet.imageUrl}
                alt={pet.name}
                width={300}
                height={300}
                className="rounded-full mb-4"
              />
              <p className="text-lg w-full">
                <strong>이름:</strong> {pet.name}
              </p>
              <p className="text-lg w-full">
                <strong>성별:</strong> {pet.gender}
              </p>
              <p className="text-lg w-full">
                <strong>나이:</strong> {calculateAge(pet.birthDate)}세
              </p>
              <p className="text-lg w-full">
                <strong>종:</strong> {pet.speciesName}
              </p>
              <p className="text-lg text-yellow-500 font-semibold">
                <strong>🏆 수상 횟수:</strong> {pet.awards}회
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>등록된 반려동물이 없습니다.</p>
      )}

      {/* 반려동물 등록 버튼 */}
      <Button 
        onClick={
          () => {
            setIsPetModalOpen(true)
            setSelectedPet(null); // 반려동물 등록 시 선택된 반려동물 초기화
          }
        } className="mt-4">
        반려동물 추가하기
      </Button>

      {/* 반려동물 수정 모달 */}
      {isPetModalOpen && (
        <EditPetModal
          pet={selectedPet} // 선택된 반려동물이 없으면 null 전달
          onClose={() => setIsPetModalOpen(false)}
          onSave={() => {fetchMyPets()}}
        />
      )}

      {/* 프로필 수정 모달 */}
      {isEditModalOpen && user && (
        <EditProfileModal
          user={user}
          onClose={() => setIsEditModalOpen(false)}
          onSave={(updatedUser: UserResponse) => {
            setUser(updatedUser);
            setIsEditModalOpen(false);
          }}
        />
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
