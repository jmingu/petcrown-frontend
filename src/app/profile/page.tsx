'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Edit2 } from 'lucide-react';
import EditProfileModal from '@/app/profile/components/EditPfrofileModal';
import EditPetModal from '@/app/profile/components/EditPetModal';
import UserInfoDto from '@/model/user/dto/UserSignUpDto';
import { UserResponse } from '@/libs/interface/api/user/userResponseInterface';

import Button from '@/components/common/button/Button';

import Alert from '@/components/common/alert/Alert';
import { findUser } from '@/libs/api/user/userApi';

// 반려동물 정보 타입
type Pet = {
  id: number;
  name: string;
  gender: string;
  birthdate: string;
  species: string;
  imageUrl: string;
  awards: number; // 수상 횟수 추가
};

export default function Profile() {
  const router = useRouter();
  const [alertMessage, setAlertMessage] = useState(''); // 알림 메시지
  const [alertAction, setAlertAction] = useState<(() => void) | null>(null); // 알림창 확인 버튼 동작

  const [user, setUser] = useState<UserResponse>();

  const [pets, setPets] = useState<Pet[]>([
    {
      id: 1,
      name: '코코',
      gender: '여아',
      birthdate: '2020-05-10',
      species: '강아지',
      imageUrl: '/images/dog1.jpg',
      awards: 5,
    },
    {
      id: 2,
      name: '나비',
      gender: '남아',
      birthdate: '2018-08-20',
      species: '고양이',
      imageUrl: '/images/cat1.jpg',
      awards: 3,
    },
  ]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

  // 로그인 여부 확인
  useEffect(() => {
    const storedLogin = sessionStorage.getItem('sess');
    console.log('로그인 여부 확인:', storedLogin);
    findLoginUser(); // 로그인 후 사용자 정보 받아오기

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
              <strong>이름:</strong> {user.name}
            </p>
            <p className="text-lg">
              <strong>이메일:</strong> {user.email}
            </p>
            <p className="text-lg">
              <strong>성별:</strong> {user.gender}
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
              key={pet.id}
              className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center relative"
            >
              <button
                onClick={() => setSelectedPet(pet)}
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              >
                <Edit2 size={20} className="cursor-pointer" />
              </button>
              <Image
                src={pet.imageUrl}
                alt={pet.name}
                width={150}
                height={150}
                className="rounded-full mb-4"
              />
              <p className="text-lg">
                <strong>이름:</strong> {pet.name}
              </p>
              <p className="text-lg">
                <strong>성별:</strong> {pet.gender}
              </p>
              <p className="text-lg">
                <strong>나이:</strong> {calculateAge(pet.birthdate)}세
              </p>
              <p className="text-lg">
                <strong>종:</strong> {pet.species}
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
        onClick={() =>
          setSelectedPet({
            id: 0,
            name: '',
            gender: '',
            birthdate: '',
            species: '',
            imageUrl: '',
            awards: 0,
          })
        }
        className="mt-4"
      >
        반려동물 추가하기
      </Button>

      {/* 반려동물 수정 모달 */}
      {selectedPet && (
        <EditPetModal
          pet={selectedPet}
          onClose={() => setSelectedPet(null)}
          onSave={(updatedPet: Pet) => {
            setPets((prevPets) =>
              prevPets.some((p) => p.id === updatedPet.id)
                ? prevPets.map((p) => (p.id === updatedPet.id ? updatedPet : p))
                : [...prevPets, updatedPet]
            );
            setSelectedPet(null);
          }}
        />
      )}

      {/* 프로필 수정 모달 */}
      {isEditModalOpen && (
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
