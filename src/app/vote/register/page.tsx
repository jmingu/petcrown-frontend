'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, Crown, Sparkles, ArrowLeft } from 'lucide-react';
import CuteButton from '@/components/common/button/CuteButton';
import CuteCard from '@/components/common/card/CuteCard';
import CuteBadge from '@/components/common/badge/CuteBadge';
import Alert from '@/components/common/alert/Alert';
import PetModal from '@/components/vote/PetRegisterModal';
import EditPetModal from '@/app/profile/components/EditPetModal';
import {MyPetResponse, MyPetsListResponse} from '@/libs/interface/api/pet/petResponseInterface';
import { findMyPet } from '@/libs/api/pet/petApi';
import { calculateAge } from '@/common/util/calculateUtil';


const MY_PETS = [
  { id: 1, name: '코코', gender: 'F', type: '개', image: '/images/coco.jpg', age: 3, awards: 5 },
  { id: 2, name: '바둑이', gender: 'M', type: '개', image: '/images/baduk.jpg', age: 2, awards: 2 },
  { id: 3, name: '몽이', gender: 'F', type: '고양이', image: '/images/mong.jpg', age: 4, awards: 3 },
  { id: 4, name: '밤비', gender: 'M', type: '고양이', image: '/images/bambi.jpg', age: 1, awards: 1 },
  { id: 5, name: '초코', gender: 'F', type: '개', image: '/images/choco.jpg', age: 2, awards: 0 },
  { id: 6, name: '루이', gender: 'M', type: '고양이', image: '/images/lui.jpg', age: 5, awards: 4 },
  { id: 7, name: '탄이', gender: 'F', type: '개', image: '/images/tani.jpg', age: 3, awards: 2 },
  { id: 8, name: '다롱이', gender: 'M', type: '고양이', image: '/images/darong.jpg', age: 6, awards: 0 }
];

const ITEMS_PER_PAGE = 6;

export default function MyPetsPage() {
  const router = useRouter();
  const [pets, setPets] = useState<MyPetResponse[]>([]); // 반려동물 목록 상태
  const [selectedPet, setSelectedPet] = useState<MyPetResponse | null>(null); // 선택된 반려동물 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false); // 반려동물 등록 모달
  const [newlyRegisteredPetId, setNewlyRegisteredPetId] = useState<number | null>(null); // 새로 등록한 펫 ID
  const [currentPage, setCurrentPage] = useState(1);
  const [alertMessage, setAlertMessage] = useState('');
  const [needsLogin, setNeedsLogin] = useState(false);

  // 페이지네이션 처리
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = pets.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    // 로그인 체크
    const accessToken = localStorage.getItem('a_t');
    if (!accessToken) {
      setAlertMessage('로그인이 필요한 페이지입니다.');
      setNeedsLogin(true);
      return;
    }

    fetchMyPets(); // 컴포넌트 마운트 시 나의 펫 조회
  }, []);

    /**
   * 나의 펫 조회
   */
  const fetchMyPets = async () => {
    try {
      const response = await findMyPet();

      setPets(response.result.pets); // 반려동물 목록 저장 (pets 배열)
    } catch (error) {
      setPets([]);
    }
  }

  /**
   * 반려동물 등록 후 호출되는 함수
   */
  const handlePetRegistered = async () => {
    // 펫 목록 다시 조회
    await fetchMyPets();

    // 모달 닫기
    setIsRegisterModalOpen(false);

    // 새로 조회한 펫 목록에서 가장 최근에 등록된 펫 (마지막 펫) 가져오기
    const response = await findMyPet();
    const newPets = response.result.pets;

    if (newPets.length > 0) {
      // 가장 최근에 등록된 펫을 선택하고 투표 등록 모달 열기
      const latestPet = newPets[newPets.length - 1];
      setSelectedPet(latestPet);
      setNewlyRegisteredPetId(latestPet.petId);

      // 잠시 후 투표 등록 모달 열기 (상태 업데이트가 완료된 후)
      setTimeout(() => {
        setIsModalOpen(true);
      }, 100);
    }
  }

  // 로그인이 필요한 경우
  if (needsLogin) {
    return (
      <>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <CuteCard className="text-center" padding="lg">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-600">로그인이 필요합니다</h2>
              <p className="text-gray-500">투표 등록은 로그인 후 이용할 수 있습니다.</p>
            </div>
          </CuteCard>
        </div>
        <Alert
          message={alertMessage}
          onClose={() => {
            setAlertMessage('');
            router.push('/login');
          }}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
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
          <Heart className="w-8 h-8 text-pink-300 opacity-40" fill="currentColor" />
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
          <Crown className="w-6 h-6 text-purple-300 opacity-50" />
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                투표 등록하기
              </h1>
              <p className="text-gray-600 mt-2">
                사랑스러운 반려동물을 투표에 등록해보세요! 🐾
              </p>
            </div>
          </div>
        </motion.div>

        {/* 목록으로 돌아가기 */}
        <div className="mb-6">
          <Link
            href="/vote"
            className="inline-flex items-center text-purple-600 hover:text-purple-800 transition-colors duration-200"
          >
            ← 투표 목록으로 돌아가기
          </Link>
        </div>

        {/* 반려동물 목록 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {currentItems.length > 0 ? (
            currentItems.map((pet, index) => (
              <motion.div
                key={pet.petId}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="cursor-pointer"
                onClick={() => {
                  setSelectedPet(pet);
                  setIsModalOpen(true);
                }}
              >
                <CuteCard
                  className={`relative overflow-hidden transition-all duration-300 ${
                    selectedPet?.petId === pet.petId 
                      ? 'ring-4 ring-purple-300 shadow-xl' 
                      : 'hover:shadow-xl'
                  }`}
                  padding="lg"
                >
                  {/* 반려동물 이미지 */}
                  <div className="relative mb-4">
                    <div className="w-full aspect-square relative">
                      <Image
                        src={pet.imageUrl}
                        alt={pet.name}
                        fill
                        className="rounded-2xl object-cover shadow-lg"
                      />
                      {/* 수상 배지 */}
                      {(pet.awards && pet.awards > 0) && (
                        <div className="absolute top-2 right-2">
                          <CuteBadge variant="success" icon={<Crown className="w-3 h-3" />}>
                            {pet.awards}
                          </CuteBadge>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 반려동물 정보 */}
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center justify-center space-x-2">
                      <span>{pet.name}</span>
                      <Heart className="w-5 h-5 text-pink-500" fill="currentColor" />
                    </h3>

                    <div className="space-y-1 text-sm text-gray-600">
                      {(pet.gender || pet.birthDate) && (
                        <div className="flex justify-center items-center space-x-2">
                          {pet.gender && (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              pet.gender === 'M'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-pink-100 text-pink-700'
                            }`}>
                              {pet.gender === 'M' ? '♂ 남아' : '♀ 여아'}
                            </span>
                          )}
                          {pet.birthDate && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                              {calculateAge(pet.birthDate)}살
                            </span>
                          )}
                        </div>
                      )}

                      {pet.speciesName && (
                        <p className="font-medium text-gray-700">
                          {pet.speciesName} {pet.speciesName === '강아지' ? '🐶' : pet.speciesName === '고양이' ? '🐱' : '🐹'}
                        </p>
                      )}

                      {/* 품종 또는 커스텀 품종 표시 */}
                      {pet.breedId && pet.breedName ? (
                        <p className="text-gray-500 text-sm">{pet.breedName}</p>
                      ) : pet.customBreed ? (
                        <p className="text-gray-500 text-sm">{pet.customBreed}</p>
                      ) : null}

                      {(pet.awards && pet.awards > 0) && (
                        <p className="text-yellow-600 font-medium">
                          🏆 수상 {pet.awards}회
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 선택 효과 */}
                  {selectedPet?.petId === pet.petId && (
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl"></div>
                  )}
                </CuteCard>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="col-span-full"
            >
              <CuteCard className="text-center py-12" padding="lg">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full flex items-center justify-center mx-auto">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-600">
                    등록된 반려동물이 없습니다
                  </h3>
                  <p className="text-gray-500">
                    먼저 반려동물을 등록해주세요!
                  </p>
                  <CuteButton
                    variant="primary"
                    size="lg"
                    onClick={() => setIsRegisterModalOpen(true)}
                  >
                    반려동물 등록하기
                  </CuteButton>
                </div>
              </CuteCard>
            </motion.div>
          )}
        </motion.div>

        {/* 페이지네이션 */}
        {pets.length > ITEMS_PER_PAGE && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8 flex justify-center"
          >
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <div className="flex items-center space-x-2">
                <CuteButton
                  variant="secondary"
                  size="sm"
                  onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  이전
                </CuteButton>
                
                {Array.from({ length: Math.ceil(pets.length / ITEMS_PER_PAGE) }, (_, i) => i + 1).map((page) => (
                  <CuteButton
                    key={page}
                    variant={currentPage === page ? "primary" : "secondary"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </CuteButton>
                ))}
                
                <CuteButton
                  variant="secondary"
                  size="sm"
                  onClick={() => currentPage < Math.ceil(pets.length / ITEMS_PER_PAGE) && setCurrentPage(currentPage + 1)}
                  disabled={currentPage === Math.ceil(pets.length / ITEMS_PER_PAGE)}
                >
                  다음
                </CuteButton>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* 반려동물 정보 모달 */}
      {selectedPet && (
        <PetModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedPet(null); // 모달이 닫힐 때 선택된 반려동물 초기화
          }}
          pet={selectedPet}
        />
      )}

      {/* 반려동물 등록 모달 */}
      {isRegisterModalOpen && (
        <EditPetModal
          pet={null}
          onClose={() => setIsRegisterModalOpen(false)}
          onSave={handlePetRegistered}
        />
      )}
    </div>
  );
}
