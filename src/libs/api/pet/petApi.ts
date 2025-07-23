import api from '@/libs/axiosInstance'; // axios 인스턴스
import { CommonResponse } from '@/libs/interface/api/common/common';
import { PetRegisterRequest } from '@/libs/interface/api/pet/petRequestInterface'; // 실제 경로에 맞게 수정
import { PetChangeRequest } from '@/libs/interface/api/pet/petRequestInterface'; // 실제 경로에 맞게 수정
import { MyPetResponse } from '@/libs/interface/api/pet/petResponseInterface'; // 실제 경로에 맞게 수정

/**
 * 나의 펫 등록
 */
export const petRegister = async (data: PetRegisterRequest): Promise<CommonResponse<object>> => {
  const formData = new FormData();
  formData.append('image', data.profileImage); // 파일
  formData.append('data', new Blob([JSON.stringify({
    name: data.name,
    gender: data.gender,
    birthDate: data.birthDate,
    breedId: data.breedId,
  })], { type: 'application/json' })); // JSON 데이터

  const response = await api.post('/pet/v1', formData, {
     headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

/**
 * 나의 펫 조회
 */
export const findMyPet = async (): Promise<CommonResponse<MyPetResponse[]>> => {
  const response = await api.get('/pet/v1');
  return response.data;
}

/**
 * 나의 펫 수정
 */
export const changePet = async (
  petId: number,
  data: PetChangeRequest
): Promise<CommonResponse<object>> => {
  const response = await api.put(`/pet/v1/${petId}`, data);
  return response.data;
}

/**
 * 나의 펫 삭제
 */
export const deletePet = async (
  petId: number
): Promise<CommonResponse<object>> => {
  const response = await api.delete(`/pet/v1/${petId}`);
  return response.data;
}
