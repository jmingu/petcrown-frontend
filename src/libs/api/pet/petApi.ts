import api from '@/libs/axiosInstance'; // axios 인스턴스
import { CommonResponse } from '@/libs/interface/api/common/common';
import { PetRegisterRequest } from '@/libs/interface/api/pet/petRequestInterface'; // 실제 경로에 맞게 수정

/**
 * 펫 등록
 */
export const petRegister = async (
  data: PetRegisterRequest
): Promise<CommonResponse<object>> => {
  const response = await api.post('/pet/v1', data);
  return response.data;
};
