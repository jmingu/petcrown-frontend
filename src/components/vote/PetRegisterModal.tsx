'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, Crown, Heart, Camera, Upload, Plus, Trash2, Smile } from 'lucide-react';
import CuteButton from '@/components/common/button/CuteButton';
import CuteCard from '@/components/common/card/CuteCard';
import CuteBadge from '@/components/common/badge/CuteBadge';
import Alert from '@/components/common/alert/Alert';
import {MyPetResponse} from '@/libs/interface/api/pet/petResponseInterface';
import {VoteRegistrationRequest} from '@/libs/interface/api/vote/voteRequestInterface';
import {voteRegistration} from '@/libs/api/vote/voteApi';
import {getPetModeList} from '@/libs/api/pet/petApi';
import {PetModeDto} from '@/libs/interface/api/pet/petModeInterface';

interface PetModalProps {
  isOpen: boolean;
  onClose: () => void;
  pet: MyPetResponse;
}

export default function PetModal({ isOpen, onClose, pet }: PetModalProps) {
  const router = useRouter();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(pet.imageUrl);
  const [alertMessage, setAlertMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [petModes, setPetModes] = useState<PetModeDto[]>([]);
  const [selectedModeId, setSelectedModeId] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (isOpen) {
      loadPetModes();
    }
  }, [isOpen]);

  const loadPetModes = async () => {
    try {
      const response = await getPetModeList();
      if (response.resultCode === 200 && response.result) {
        setPetModes(response.result.petModes);
      }
    } catch (error) {
    }
  };

  if (!isOpen) return null;

  // 이미지 변경 처리
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 파일 타입 검증
      if (!/image\/(jpeg|jpg|png)/.test(file.type)) {
        setAlertMessage('JPEG, JPG, PNG 형식의 이미지만 업로드 가능합니다.');
        return;
      }

      // 파일 크기 검증 (10MB = 10 * 1024 * 1024 bytes)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        setAlertMessage('이미지 파일은 10MB 이하만 업로드 가능합니다.');
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 이미지 제거
  const handleImageRemove = () => {
    setImageFile(null);
    setImagePreview(pet.imageUrl); // 기존 펫 이미지로 복원
    const input = document.getElementById('vote-image-input') as HTMLInputElement;
    if (input) input.value = '';
  };

  const handleSave = async () => {
    setIsLoading(true);

    try {
      const voteData: VoteRegistrationRequest = {
        petId: pet.petId,
        ...(selectedModeId && { petModeId: selectedModeId }),
        ...(imageFile && { image: imageFile }), // 새 이미지가 있는 경우
        ...(!imageFile && { profileImageUrl: pet.imageUrl }), // 기존 이미지 사용
      };
      
      const voteResult = await voteRegistration(voteData);
      
      if (voteResult.resultCode === 200) {
        setAlertMessage('투표가 성공적으로 등록되었습니다! 🎉');
        setTimeout(() => {
          onClose();
          router.push('/vote');
        }, 1500);
      } else {
        setAlertMessage(voteResult.resultMessageKo || '투표 등록에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      setAlertMessage('투표 등록 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 300,
            duration: 0.3
          }}
          className="w-full max-w-md mx-auto my-8"
          onClick={(e) => e.stopPropagation()}
        >
          <CuteCard className="relative overflow-hidden" padding="lg">
            {/* 헤더 그라데이션 */}
            <div className="h-2 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500"></div>
            
            {/* 닫기 버튼 */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 z-10"
            >
              <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
            </button>

            {/* 펫 정보 */}
            <div className="text-center space-y-4">
              {/* 제목 */}
              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-2">
                  <Crown className="w-5 h-5 md:w-6 md:h-6 text-yellow-500" />
                  <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    투표 등록
                  </h2>
                  <Crown className="w-5 h-5 md:w-6 md:h-6 text-yellow-500" />
                </div>
                <p className="text-sm md:text-base text-gray-600">
                  {pet.name}를 투표에 등록하시겠어요? 🏆
                </p>
              </div>

              {/* 투표에 등록될 펫 이미지 */}
              <div className="relative">
                <div className="w-32 h-32 md:w-40 md:h-40 mx-auto relative">
                  <Image
                    src={imagePreview}
                    alt={pet.name}
                    fill
                    className="object-cover rounded-3xl border-4 border-white shadow-xl"
                  />
                  {(pet.awards && pet.awards > 0) && (
                    <div className="absolute -top-2 -right-2">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                        <Crown className="w-4 h-4 md:w-5 md:h-5 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 펫 상세 정보 */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-3 md:p-4">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3 flex items-center justify-center space-x-2">
                  <Heart className="w-4 h-4 md:w-5 md:h-5 text-pink-500" fill="currentColor" />
                  <span>{pet.name}</span>
                </h3>

                <div className="flex justify-center space-x-2 md:space-x-3 mb-2 md:mb-3">
                  <CuteBadge variant={pet.gender === 'F' ? 'success' : 'info'}>
                    {pet.gender === 'F' ? '♀ 여아' : '♂ 남아'}
                  </CuteBadge>
                  <CuteBadge variant="default">
                    {pet.speciesName} {pet.speciesName === '개' ? '🐶' : '🐱'}
                  </CuteBadge>
                </div>

                {(pet.awards && pet.awards > 0) && (
                  <div className="flex items-center justify-center space-x-1">
                    <Crown className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-semibold text-yellow-600">
                      수상 경력 {pet.awards}회
                    </span>
                  </div>
                )}
              </div>

              {/* 감정 선택 드롭다운 */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-3 md:p-4">
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2 flex items-center justify-center space-x-2">
                  <Smile className="w-3 h-3 md:w-4 md:h-4 text-orange-500" />
                  <span>사진의 기분을 선택해주세요</span>
                </label>
                <select
                  value={selectedModeId || ''}
                  onChange={(e) => setSelectedModeId(e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border-2 border-orange-200 rounded-xl focus:outline-none focus:border-orange-400 transition-colors bg-white text-gray-700 font-medium"
                >
                  <option value="">감정을 선택해주세요</option>
                  {petModes.map((mode) => (
                    <option key={mode.petModeId} value={mode.petModeId}>
                      {mode.modeName}
                    </option>
                  ))}
                </select>
              </div>

              {/* 이미지 업로드 섹션 */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-2 md:p-3">
                {/* 이미지 업로드 버튼 */}
                <div className="flex flex-col space-y-2">
                  <input
                    type="file"
                    id="vote-image-input"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleImageChange}
                    className="hidden"
                  />

                  <CuteButton
                    onClick={() => document.getElementById('vote-image-input')?.click()}
                    variant="secondary"
                    size="sm"
                    className="w-full text-sm"
                    icon={<Camera className="w-4 h-4" />}
                  >
                    새로운 사진 업로드
                  </CuteButton>

                  {imageFile && (
                    <CuteButton
                      onClick={handleImageRemove}
                      variant="secondary"
                      size="sm"
                      className="w-full text-sm"
                      icon={<Trash2 className="w-4 h-4" />}
                    >
                      기본 사진으로 복원
                    </CuteButton>
                  )}
                </div>

                <p className="text-xs text-gray-500 text-center mt-2">
                  JPG, JPEG, PNG 형식만 업로드 가능
                </p>
              </div>

              {/* 액션 버튼들 */}
              <div className="space-y-2 md:space-y-3">
                <CuteButton
                  onClick={handleSave}
                  variant="primary"
                  size="lg"
                  className="w-full"
                  icon={<Crown className="w-5 h-5" />}
                  disabled={isLoading}
                >
                  {isLoading ? '등록 중...' : '투표 등록하기'}
                </CuteButton>
                
                <CuteButton
                  onClick={onClose}
                  variant="secondary"
                  size="md"
                  className="w-full"
                  disabled={isLoading}
                >
                  취소
                </CuteButton>
              </div>
            </div>

            {/* 알림 메시지 */}
            {alertMessage && (
              <Alert 
                message={alertMessage} 
                onClose={() => setAlertMessage('')} 
              />
            )}

            {/* 귀여운 장식 요소들 */}
            <div className="absolute top-8 left-4 w-2 h-2 bg-purple-200 rounded-full opacity-40"></div>
            <div className="absolute top-12 left-6 w-1 h-1 bg-pink-200 rounded-full opacity-60"></div>
            <div className="absolute bottom-8 right-4 w-2 h-2 bg-purple-200 rounded-full opacity-30"></div>
            <div className="absolute bottom-12 right-8 w-1 h-1 bg-pink-200 rounded-full opacity-50"></div>
          </CuteCard>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
