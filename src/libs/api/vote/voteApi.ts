import api from '@/libs/axiosInstance'; // axios 인스턴스
import { handleApiError } from '@/libs/api/common/errorHandler';
import { CommonResponse } from '@/libs/interface/api/common/common';
import {
  VoteRegistrationRequest,
  VoteUpdateRequest,
  VoteListRequest,
  VoteActionRequest
} from '@/libs/interface/api/vote/voteRequestInterface';
import { 
  VoteListResponse,
  VoteDetailResponse 
} from '@/libs/interface/api/vote/voteResponseInterface';

/**
 * 투표 등록
 */
export const voteRegistration = async (
  data: VoteRegistrationRequest
): Promise<CommonResponse<object>> => {
  return handleApiError(async () => {
    const formData = new FormData();

    // 백엔드 VoteRegistrationRequestDto에 맞는 데이터 구성
    const voteData = {
      petId: data.petId,
      ...(data.petModeId && { petModeId: data.petModeId }),
      ...(data.profileImageUrl && { profileImageUrl: data.profileImageUrl }),
    };

    formData.append('data', new Blob([JSON.stringify(voteData)], { type: 'application/json' }));

    // 이미지가 있는 경우에만 추가
    if (data.image) {
      formData.append('image', data.image);
    }

    return api.post('/votes/v1', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  });
};

/**
 * 투표 목록 조회
 */
export const getVoteList = async (
  data: VoteListRequest
): Promise<CommonResponse<VoteListResponse>> => {
  return handleApiError(
    () => api.get(`/votes/v1?page=${data.page}&size=${data.size}`)
  );
};

/**
 * 투표 상세 조회
 */
export const getVoteDetail = async (
  voteId: number
): Promise<CommonResponse<VoteDetailResponse>> => {
  return handleApiError(
    () => api.get(`/votes/v1/${voteId}`)
  );
};

/**
 * 투표하기
 */
export const doVote = async (
  voteId: number,
  data: VoteActionRequest
): Promise<CommonResponse<object>> => {
  return handleApiError(
    () => api.post(`/votes/v1/${voteId}/weekly`, data)
  );
};

/**
 * 투표 수정
 */
export const updateVote = async (
  voteId: number,
  data: VoteUpdateRequest
): Promise<CommonResponse<object>> => {
  return handleApiError(async () => {
    const formData = new FormData();

    // 백엔드 VoteRegistrationRequestDto에 맞는 데이터 구성
    const voteData = {
      petId: data.petId,
      ...(data.petModeId && { petModeId: data.petModeId }),
      ...(data.profileImageUrl && { profileImageUrl: data.profileImageUrl }),
    };

    formData.append('data', new Blob([JSON.stringify(voteData)], { type: 'application/json' }));

    // 이미지가 있는 경우에만 추가
    if (data.image) {
      formData.append('image', data.image);
    }

    return api.put(`/votes/v1/${voteId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  });
};


/**
 * 투표 삭제
 */
export const deleteVote = async (
  voteId: number
): Promise<CommonResponse<object>> => {
  return handleApiError(
    () => api.delete(`/votes/v1/${voteId}`)
  );
};