import api from '@/libs/axiosInstance';
import { handleApiError } from '@/libs/api/common/errorHandler';
import { CommonResponse } from '@/libs/interface/api/common/common';
import { RankingListResponse } from '@/libs/interface/api/ranking/rankingResponseInterface';

/**
 * 이번주 랭킹 조회 (실시간 투표중)
 */
export const getCurrentWeekRanking = async (): Promise<CommonResponse<RankingListResponse>> => {
  return handleApiError(
    () => api.get('/ranking/v1/current-week')
  );
};

/**
 * 지난주 랭킹 조회 (확정)
 */
export const getLastWeekRanking = async (): Promise<CommonResponse<RankingListResponse>> => {
  return handleApiError(
    () => api.get('/ranking/v1/last-week')
  );
};