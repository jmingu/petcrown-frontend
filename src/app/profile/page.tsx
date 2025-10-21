'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { 
  Edit2, User, Phone, Mail, Calendar, Heart, 
  Award, Crown, Plus, Sparkles, Shield 
} from 'lucide-react';
import EditProfileModal from '@/app/profile/components/EditPfrofileModal';
import EditPetModal from '@/app/profile/components/EditPetModal';
import ChangePasswordModal from '@/app/profile/components/ChangePasswordModal';
import CuteButton from '@/components/common/button/CuteButton';
import CuteCard from '@/components/common/card/CuteCard';
import CuteBadge from '@/components/common/badge/CuteBadge';
import CuteAvatar from '@/components/common/avatar/CuteAvatar';
import Alert from '@/components/common/alert/Alert';
import { UserResponse } from '@/libs/interface/api/user/userResponseInterface';
import { findUser } from '@/libs/api/user/userApi';
import { findMyPet } from '@/libs/api/pet/petApi';
import {MyPetResponse, MyPetsListResponse} from '@/libs/interface/api/pet/petResponseInterface'; 


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
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

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

      setPets(response.result.pets); // 반려동물 목록 저장 (pets 배열)
      console.log(response.result.pets)
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
    <div className="min-h-screen bg-gray-50">
      {/* 배경 장식 요소들 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10"
          animate={{
            y: [-20, 20, -20],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Heart className="w-8 h-8 text-green-300 opacity-40" fill="currentColor" />
        </motion.div>
        
        <motion.div
          className="absolute top-32 right-20"
          animate={{
            y: [20, -20, 20],
            rotate: [0, -10, 10, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Sparkles className="w-6 h-6 text-blue-300 opacity-50" />
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 relative z-10">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center space-x-2 mb-4">
            <User className="w-8 h-8 text-green-500" />
            <h1 className="text-4xl font-bold text-gray-900">
              내 프로필
            </h1>
            <User className="w-8 h-8 text-green-500" />
          </div>
          <p className="text-gray-600 text-lg">
            나와 내 반려동물의 소중한 공간 🐾
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 사용자 정보 */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {user ? (
                <CuteCard className="relative" padding="lg">
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="absolute top-4 right-4 p-2 bg-blue-100 hover:bg-blue-200 rounded-full transition-colors duration-200"
                  >
                    <Edit2 className="w-5 h-5 text-blue-600" />
                  </button>

                  <div className="text-center mb-6">
                    <div className="relative w-24 h-24 mx-auto mb-4">
                      <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                        <User className="w-12 h-12 text-white" />
                      </div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{user.nickname}</h2>
                    <CuteBadge variant="success">활성 사용자</CuteBadge>
                  </div>

                  <div className="space-y-4">
                    {/* 비밀번호 변경 버튼 */}
                    <CuteButton
                      onClick={() => setIsPasswordModalOpen(true)}
                      variant="secondary"
                      size="sm"
                      icon={<Shield className="w-4 h-4" />}
                      className="w-full mb-4"
                    >
                      비밀번호 변경
                    </CuteButton>

                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-2xl">
                      <Mail className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-sm text-gray-500">이메일</p>
                        <p className="font-medium text-gray-900">{user.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-2xl">
                      <User className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-500">이름</p>
                        <p className="font-medium text-gray-900">{user.name}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-2xl">
                      <Heart className="w-5 h-5 text-pink-600" />
                      <div>
                        <p className="text-sm text-gray-500">성별</p>
                        <p className="font-medium text-gray-900">{user.gender === 'M' ? '남성' : '여성'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-2xl">
                      <Calendar className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="text-sm text-gray-500">생년월일</p>
                        <p className="font-medium text-gray-900">{user.birthDate}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-2xl">
                      <Phone className="w-5 h-5 text-orange-600" />
                      <div>
                        <p className="text-sm text-gray-500">전화번호</p>
                        <p className="font-medium text-gray-900">{user.phoneNumber}</p>
                      </div>
                    </div>
                  </div>
                </CuteCard>
              ) : (
                <CuteCard padding="lg">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-600">사용자 정보를 불러오는 중...</p>
                  </div>
                </CuteCard>
              )}
            </motion.div>
          </div>

          {/* 반려동물 정보 */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center space-x-2">
                  <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-pink-500" />
                  <span>내 반려동물</span>
                  <CuteBadge variant="info">{pets.length}마리</CuteBadge>
                </h2>
                
                <CuteButton
                  onClick={() => {
                    setIsPetModalOpen(true);
                    setSelectedPet(null);
                  }}
                  variant="cute"
                  size="sm"
                  icon={<Plus className="w-4 h-4 sm:w-5 sm:h-5" />}
                  className="w-full sm:w-auto"
                >
                  <span className="hidden sm:inline">반려동물 추가</span>
                  <span className="sm:hidden">추가</span>
                </CuteButton>
              </div>

              {pets.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {pets.map((pet, index) => (
                    <motion.div
                      key={pet.petId}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <CuteCard hover className="relative h-full">
                        <button
                          onClick={() => {
                            setIsPetModalOpen(true);
                            setSelectedPet(pet);
                          }}
                          className="absolute top-4 right-4 p-2 bg-purple-100 hover:bg-purple-200 rounded-full transition-colors duration-200 z-10"
                        >
                          <Edit2 className="w-4 h-4 text-purple-600" />
                        </button>

                        <div className="text-center">
                          {/* 펫 이미지 */}
                          <div className="relative w-32 h-32 mx-auto mb-4">
                            <Image
                              src={pet.imageUrl}
                              alt={pet.name}
                              fill
                              className="object-cover rounded-full ring-4 ring-gradient-to-r from-pink-200 to-purple-200"
                            />
                            {(pet.awards && pet.awards > 0) && (
                              <div className="absolute -top-2 -right-2">
                                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                                  <Crown className="w-5 h-5 text-white" />
                                </div>
                              </div>
                            )}
                          </div>

                          {/* 펫 정보 */}
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{pet.name}</h3>

                          <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-center space-x-2">
                              <CuteBadge variant="default" size="sm">
                                {pet.gender === 'M' ? '남아' : '여아'}
                              </CuteBadge>
                              <CuteBadge variant="info" size="sm">
                                {calculateAge(pet.birthDate)}세
                              </CuteBadge>
                            </div>

                            {/* 종 표시 */}
                            <p className="text-gray-600">{pet.speciesName}</p>

                            {/* 품종 또는 커스텀 품종 표시 */}
                            {pet.breedId && pet.breedName ? (
                              <p className="text-gray-500 text-sm">{pet.breedName}</p>
                            ) : pet.customBreed ? (
                              <p className="text-gray-500 text-sm">{pet.customBreed}</p>
                            ) : null}

                            {(pet.awards && pet.awards > 0) && (
                              <div className="flex items-center justify-center space-x-1 mt-3">
                                <Award className="w-4 h-4 text-yellow-500" />
                                <span className="font-semibold text-yellow-600">
                                  수상 {pet.awards}회
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </CuteCard>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <CuteCard padding="lg">
                  <div className="text-center py-12">
                    <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-xl font-medium text-gray-400 mb-2">등록된 반려동물이 없습니다</p>
                    <p className="text-gray-500 mb-6">첫 번째 반려동물을 등록해보세요!</p>
                    <CuteButton
                      onClick={() => {
                        setIsPetModalOpen(true);
                        setSelectedPet(null);
                      }}
                      variant="primary"
                      icon={<Plus className="w-5 h-5" />}
                    >
                      반려동물 등록하기
                    </CuteButton>
                  </div>
                </CuteCard>
              )}
            </motion.div>
          </div>
        </div>
      </div>

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

      {/* 비밀번호 변경 모달 */}
      {isPasswordModalOpen && (
        <ChangePasswordModal
          onClose={() => setIsPasswordModalOpen(false)}
          onSuccess={() => {
            // 모달에서 이미 성공 메시지를 표시하므로 추가 처리 없음
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
