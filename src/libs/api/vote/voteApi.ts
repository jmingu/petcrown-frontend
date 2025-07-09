import api from '@/libs/axiosInstance'; // axios 인스턴스

import { CommonResponse } from '@/libs/interface/api/common/common';
import { VoteRegistrationRequest } from '@/libs/interface/api/vote/voteRequestInterface';

/**
 * 등록
 */
export const voteRegistration = async (
  data: VoteRegistrationRequest
): Promise<CommonResponse<object>> => {
  const response = await api.post('/vote/v1', data);
  return response.data;
};