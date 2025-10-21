import api from '@/libs/axiosInstance'; // axios 인스턴스
import { handleApiError } from '@/libs/api/common/errorHandler';
import { CommonResponse } from '@/libs/interface/api/common/common';
import { PetRegisterRequest } from '@/libs/interface/api/pet/petRequestInterface'; // 실제 경로에 맞게 수정
import { PetChangeRequest } from '@/libs/interface/api/pet/petRequestInterface'; // 실제 경로에 맞게 수정
import { MyPetResponse, MyPetsListResponse } from '@/libs/interface/api/pet/petResponseInterface'; // 실제 경로에 맞게 수정
import { SpeciesListResponseDto, BreedListResponseDto } from '@/libs/interface/api/pet/petSpeciesInterface';
import { PetModeListResponse } from '@/libs/interface/api/pet/petModeInterface';

/**
 * 나의 펫 등록
 */
export const petRegister = async (data: PetRegisterRequest): Promise<CommonResponse<object>> => {
  return handleApiError(async () => {
    const formData = new FormData();
    if (data.profileImage) {
      formData.append('image', data.profileImage); // 파일
    }

    // 백엔드 PetRegistrationRequestDto에 맞는 데이터 구성
    const petData = {
      name: data.name,
      gender: data.gender,
      birthDate: data.birthDate,
      ...(data.breedId !== undefined && { breedId: data.breedId }),
      ...(data.customBreed && { customBreed: data.customBreed }),
      ...(data.description && { description: data.description }),
      ...(data.microchipId && { microchipId: data.microchipId }),
    };

    formData.append('data', new Blob([JSON.stringify(petData)], { type: 'application/json' })); // JSON 데이터

    return api.post('/pets/v1', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }, '펫 등록');
};

/**
 * 나의 펫 조회
 */
export const findMyPet = async (): Promise<CommonResponse<MyPetsListResponse>> => {
  return handleApiError(
    () => api.get('/pets/v1'),
    '펫 조회'
  );
}

/**
 * 나의 펫 수정
 */
export const changePet = async (
  petId: number,
  data: PetChangeRequest
): Promise<CommonResponse<object>> => {
  return handleApiError(async () => {
    const formData = new FormData();

    // 백엔드 PetRegistrationRequestDto에 맞는 데이터 구성
    const petData = {
      name: data.name,
      gender: data.gender,
      birthDate: data.birthDate,
      ...(data.breedId !== undefined && { breedId: data.breedId }),
      ...(data.customBreed && { customBreed: data.customBreed }),
      ...(data.description && { description: data.description }),
      ...(data.microchipId && { microchipId: data.microchipId }),
    };

    formData.append('data', new Blob([JSON.stringify(petData)], { type: 'application/json' }));

    // 이미지가 있는 경우에만 추가
    if (data.profileImage) {
      formData.append('image', data.profileImage);
    }

    return api.put(`/pets/v1/${petId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }, '펫 수정');
}

/**
 * 나의 펫 삭제
 */
export const deletePet = async (
  petId: number
): Promise<CommonResponse<object>> => {
  return handleApiError(
    () => api.delete(`/pets/v1/${petId}`),
    '펫 삭제'
  );
}

/**
 * 종 목록 조회
 */
export const getSpeciesList = async (): Promise<CommonResponse<SpeciesListResponseDto>> => {
  return handleApiError(
    () => api.get('/pets/v1/species'),
    '종 목록 조회'
  );
}

/**
 * 품종 목록 조회
 */
export const getBreedsList = async (speciesId: number): Promise<CommonResponse<BreedListResponseDto>> => {
  return handleApiError(
    () => api.get(`/pets/v1/breeds?speciesId=${speciesId}`),
    '품종 목록 조회'
  );
}

/**
 * 감정(PetMode) 목록 조회
 */
export const getPetModeList = async (): Promise<CommonResponse<PetModeListResponse>> => {
  return handleApiError(
    () => api.get('/pets/v1/modes'),
    '감정 목록 조회'
  );
}
