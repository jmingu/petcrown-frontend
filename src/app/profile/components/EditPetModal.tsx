'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Heart, Plus, Trash2 } from 'lucide-react';
import CuteButton from '@/components/common/button/CuteButton';
import CuteCard from '@/components/common/card/CuteCard';
import RadioGroup from '@/components/common/input/RadioGroup';
import Modal from '@/components/common/modal/Modal';
import Alert from '@/components/common/alert/Alert';
import DateInput from '@/components/common/input/DateInput';
import { petRegister, changePet, deletePet, getSpeciesList, getBreedsList } from '@/libs/api/pet/petApi';
import {MyPetResponse} from '@/libs/interface/api/pet/petResponseInterface';
import { PetRegisterRequest, PetChangeRequest } from '@/libs/interface/api/pet/petRequestInterface';
import { SpeciesDto, BreedDto } from '@/libs/interface/api/pet/petSpeciesInterface';



interface PetModalProps {
  pet: MyPetResponse | null;
  onClose: () => void;
  onSave: () => void;
}

export default function PetModal({ pet, onClose, onSave }: PetModalProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [speciesId, setSpeciesId] = useState<number | null>(null);
  const [breedId, setBreedId] = useState<number | null>(null);
  const [customBreed, setCustomBreed] = useState('');
  const [description, setDescription] = useState('');
  const [microchipId, setMicrochipId] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [alertMessage, setAlertMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 종/품종 관련 상태
  const [speciesList, setSpeciesList] = useState<SpeciesDto[]>([]);
  const [breedsList, setBreedsList] = useState<BreedDto[]>([]);
  const [isLoadingBreeds, setIsLoadingBreeds] = useState(false);

  // 종 목록 로드
  useEffect(() => {
    const loadSpecies = async () => {
      try {
        const response = await getSpeciesList();
        if (response.resultCode === 200 && response.result) {
          setSpeciesList(response.result.species);
        }
      } catch (error) {
        console.error('종 목록 로드 실패:', error);
      }
    };
    loadSpecies();
  }, []);

  // 종 선택 시 품종 목록 로드
  useEffect(() => {
    const loadBreeds = async () => {
      if (!speciesId) {
        setBreedsList([]);
        setBreedId(null);
        return;
      }

      // '기타' 종인지 확인 (이름으로 체크)
      const selectedSpecies = speciesList.find(s => s.speciesId === speciesId);
      const isEtc = selectedSpecies?.name === '기타' || selectedSpecies?.name.includes('기타');

      if (isEtc) {
        setBreedsList([]);
        setBreedId(null);
        return;
      }

      setIsLoadingBreeds(true);
      try {
        const response = await getBreedsList(speciesId);
        if (response.resultCode === 200 && response.result) {
          setBreedsList(response.result.breeds);
        }
      } catch (error) {
        console.error('품종 목록 로드 실패:', error);
        setBreedsList([]);
      } finally {
        setIsLoadingBreeds(false);
      }
    };
    loadBreeds();
  }, [speciesId, speciesList]);

  // pet이 있으면 기존 데이터를 기본값으로 설정
  useEffect(() => {
    setIsEditMode(!!pet);

    if (pet) {
      setName(pet.name);
      setGender(pet.gender);
      setBirthDate(pet.birthDate);
      setDescription(pet.description || '');
      setMicrochipId(pet.microchipId || '');
      setImageUrl(pet.imageUrl);
      setImagePreview(pet.imageUrl);
      setCustomBreed(pet.customBreed || '');

      console.log('펫 데이터 로드:', {
        petId: pet.petId,
        speciesId: pet.speciesId,
        breedId: pet.breedId,
        customBreed: pet.customBreed,
        speciesListLength: speciesList.length
      });

      // speciesId 설정: null이고 customBreed가 있으면 "기타" 종 찾기
      if ((pet.speciesId === null || pet.speciesId === undefined) && pet.customBreed && speciesList.length > 0) {
        const etcSpecies = speciesList.find(s => s.name === '기타' || s.name.includes('기타'));
        if (etcSpecies) {
          console.log('기타 종 자동 매칭:', etcSpecies);
          setSpeciesId(etcSpecies.speciesId);
        } else {
          setSpeciesId(null);
        }
      } else {
        setSpeciesId(pet.speciesId !== undefined && pet.speciesId !== null ? pet.speciesId : null);
      }

      setBreedId(pet.breedId !== undefined && pet.breedId !== null ? pet.breedId : null);
    } else {
      // 새 펫 등록 모드일 때 초기화
      setName('');
      setGender('');
      setBirthDate('');
      setSpeciesId(null);
      setBreedId(null);
      setCustomBreed('');
      setDescription('');
      setMicrochipId('');
      setImageUrl('');
      setImagePreview('');
      setImageFile(null);
    }
  }, [pet, speciesList]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && /image\/(jpeg|jpg|png)/.test(file.type)) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setImagePreview('');
      setAlertMessage('jpg, jpeg, png 파일만 업로드 가능합니다.');
    }
  };

  const handleSave = async () => {
    setIsLoading(true);

    try {
      // 등록모드
      if(!isEditMode) {
        if (!name || !gender || !birthDate || !imageFile) {
          setAlertMessage('이름, 성별, 생년월일, 프로필 사진은 필수입니다.');
          return;
        }

        // 펫 등록 - 새로운 PetRegisterRequest 인터페이스 사용
        const petData: PetRegisterRequest = {
          name,
          gender,
          birthDate,
          profileImage: imageFile,
          ...(breedId && { breedId: Number(breedId) }),
          ...(customBreed && { customBreed }),
          ...(description && { description }),
          ...(microchipId && { microchipId }),
        };

        const registerResult = await petRegister(petData);

        if (registerResult.resultCode === 200) {
          setAlertMessage('반려동물이 성공적으로 등록되었습니다! 🎉');
        } else {
          setAlertMessage('등록 중 오류가 발생했습니다. 다시 시도해주세요.');
          return;
        }

      // 수정모드
      } else {
        if (!name || !gender || !birthDate) {
          setAlertMessage('이름, 성별, 생년월일은 필수입니다.');
          return;
        }

        if (!imageFile && !imagePreview) {
          setAlertMessage('프로필 사진은 필수입니다.');
          return;
        }

        if (!pet || pet.petId === undefined) {
          setAlertMessage('수정할 반려동물 정보가 없습니다.');
          return;
        }

        // 펫 수정 - 새로운 PetChangeRequest 인터페이스 사용
        const petData: PetChangeRequest = {
          name,
          gender,
          birthDate,
          ...(breedId && { breedId: Number(breedId) }),
          ...(customBreed && { customBreed }),
          ...(description && { description }),
          ...(microchipId && { microchipId }),
          ...(imageFile && { profileImage: imageFile }), // 새 이미지가 선택된 경우만
        };

        const changeResult = await changePet(pet?.petId, petData);

        if (changeResult.resultCode === 200) {
          setAlertMessage('반려동물 정보가 성공적으로 수정되었습니다! ✨');
        } else {
          setAlertMessage('수정 중 오류가 발생했습니다. 다시 시도해주세요.');
          return;
        }
      }

      onSave();
      onClose();
    } catch (error) {
      setAlertMessage('처리 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async () => {
    if (!pet || pet.petId === undefined) {
      setAlertMessage('삭제할 반려동물 정보가 없습니다.');
      return;
    }

    setIsLoading(true);
    try {
      const deleteResult = await deletePet(pet.petId);
      onSave();
      onClose();
    } catch (error) {
      setAlertMessage('반려동물 삭제 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }


  return (
    <>
      <Modal onClose={onClose}>
        <CuteCard className="max-w-lg mx-auto" padding="lg">
          <div className="space-y-6">
            {/* 제목 섹션 */}
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-white" fill="currentColor" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {isEditMode ? '반려동물 수정' : '반려동물 등록'}
              </h3>
              <p className="text-gray-600 text-sm">
                {isEditMode ? '소중한 반려동물 정보를 수정해주세요 🐾' : '새로운 가족을 등록해주세요 🏠'}
              </p>
            </div>

            {/* 폼 섹션 */}
            <div className="space-y-4">
              {/* 이름 입력 */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">이름</label>
                <input
                  type="text"
                  placeholder="반려동물의 이름을 입력해주세요"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={10}
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* 성별 선택 */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">성별</label>
                <RadioGroup
                  name="gender"
                  options={[
                    { label: '♂ 남아', value: 'M' },
                    { label: '♀ 여아', value: 'F' },
                  ]}
                  selectedValue={gender}
                  onChange={(e) => setGender(e)}
                />
              </div>

              {/* 생년월일 */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">생년월일</label>
                <DateInput
                  value={birthDate}
                  onChange={(value) => setBirthDate(value)}
                  placeholder="YYYY-MM-DD"
                  minDate={new Date('1900-01-01')}
                  maxDate={new Date()}
                />
              </div>

              {/* 종 선택 */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">종 *</label>
                <select
                  value={speciesId ?? ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    console.log('종 선택:', value);
                    if (value) {
                      const numValue = Number(value);
                      setSpeciesId(numValue);
                      setBreedId(null); // 종 변경 시 품종 초기화
                      setCustomBreed(''); // 커스텀 품종도 초기화
                      console.log('종 ID 설정:', numValue);
                    } else {
                      setSpeciesId(null);
                      setBreedId(null);
                      setCustomBreed('');
                    }
                  }}
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">종을 선택해주세요</option>
                  {speciesList.map((species) => (
                    <option key={species.speciesId} value={species.speciesId}>
                      {species.name === '강아지' && '🐶 '}
                      {species.name === '고양이' && '🐱 '}
                      {species.name === '기타' && '🐹 '}
                      {species.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 품종 선택 - 종이 선택되고 '기타'가 아닐 때만 표시 */}
              {(() => {
                const selectedSpecies = speciesList.find(s => s.speciesId === speciesId);
                const isEtc = selectedSpecies?.name === '기타' || selectedSpecies?.name.includes('기타');

                return speciesId !== null && !isEtc ? (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">품종 *</label>
                    {isLoadingBreeds ? (
                      <div className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-gray-400">
                        품종 목록 로딩 중...
                      </div>
                    ) : (
                      <select
                        value={breedId || ''}
                        onChange={(e) => setBreedId(e.target.value ? Number(e.target.value) : null)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="">품종을 선택해주세요</option>
                        {breedsList.map((breed) => (
                          <option key={breed.breedId} value={breed.breedId}>
                            {breed.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                ) : null;
              })()}

              {/* 기타 종류일 때 커스텀 품종 입력 */}
              {(() => {
                const selectedSpecies = speciesList.find(s => s.speciesId === speciesId);
                const isEtc = selectedSpecies?.name === '기타' || selectedSpecies?.name.includes('기타');

                return speciesId !== null && isEtc ? (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">종류 상세</label>
                    <input
                      type="text"
                      placeholder="예: 토끼, 햄스터, 페럿, 믹스 등"
                      value={customBreed}
                      onChange={(e) => setCustomBreed(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                ) : null;
              })()}

              {/* 소개 */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">소개 (선택사항)</label>
                <textarea
                  placeholder="반려동물의 특징이나 성격을 알려주세요"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                />
              </div>

              {/* 마이크로칩 번호 */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">마이크로칩 번호 (선택사항)</label>
                <input
                  type="text"
                  placeholder="마이크로칩 번호를 입력해주세요"
                  value={microchipId}
                  onChange={(e) => setMicrochipId(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* 이미지 업로드 */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">프로필 사진 *</label>

                <div className="flex flex-col items-center space-y-3">
                  <CuteButton
                    variant="secondary"
                    icon={<Plus className="w-4 h-4" />}
                    onClick={() => document.getElementById('profile-image-input')?.click()}
                  >
                    이미지 선택하기
                  </CuteButton>

                  <input
                    id="profile-image-input"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    style={{ display: 'none' }}
                    onChange={handleImageChange}
                  />

                  {imagePreview && (
                    <div className="relative">
                      <div className="w-24 h-24 relative">
                        <Image
                          src={imagePreview}
                          alt="미리보기"
                          fill
                          className="object-cover rounded-2xl border-2 border-gray-200"
                        />
                      </div>
                      <button
                        onClick={() => {
                          setImagePreview('');
                          setImageFile(null);
                          const input = document.getElementById('profile-image-input') as HTMLInputElement;
                          if (input) input.value = '';
                        }}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 hover:bg-red-600 rounded-full transition-colors duration-200"
                      >
                        <Trash2 className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 액션 버튼들 */}
            <div className="flex space-x-3">
              <CuteButton
                onClick={handleSave}
                variant="primary"
                className="flex-1"
                loading={isLoading}
              >
                {isEditMode ? '수정' : '등록'}
              </CuteButton>

              {isEditMode && (
                <CuteButton
                  onClick={handleRemove}
                  variant="danger"
                  className="flex-1"
                >
                  삭제
                </CuteButton>
              )}
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
