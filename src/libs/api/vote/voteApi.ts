import api from '@/libs/axiosInstance'; // axios 인스턴스

import { CommonResponse } from '@/libs/interface/api/common/common';
import { VoteRegistrationRequest } from '@/libs/interface/api/vote/voteRequestInterface';
import { VoteListRequest } from '@/libs/interface/api/vote/voteRequestInterface';
import { VoteListResponse } from '@/libs/interface/api/vote/voteResponseInterface';

/**
 * 등록
 */
export const voteRegistration = async (
  data: VoteRegistrationRequest
): Promise<CommonResponse<object>> => {
  const response = await api.post('/vote/v1', data);
  return response.data;
};

/**
 * 리스트 조회
 */
export const getVoteList = async (
  data: VoteListRequest
): Promise<CommonResponse<VoteListResponse>> => {
  const response = await api.get(`/vote/v1?page=${data.page}&size=${data.size}`);
  return response.data;
};