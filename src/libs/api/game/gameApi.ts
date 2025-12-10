import api from '@/libs/axiosInstance';
import { handleApiError } from '@/libs/api/common/errorHandler';
import { CommonResponse } from '@/libs/interface/api/common/common';
import {
  MyWeeklyScoreResponseDto,
  WeeklyRankingListResponseDto,
  SaveScoreRequestDto,
  SaveScoreResponseDto,
} from '@/libs/interface/api/game/gameInterface';

/**
 * 내 주간 점수 조회
 */
export const getMyWeeklyScore = async (): Promise<CommonResponse<MyWeeklyScoreResponseDto>> => {
  return handleApiError(
    () => api.get('/games/v1/my-weekly-score')
  );
};

/**
 * 주간 랭킹 조회 (이번주)
 */
export const getWeeklyRankings = async (): Promise<CommonResponse<WeeklyRankingListResponseDto>> => {
  return handleApiError(
    () => api.get('/games/v1/weekly-rankings')
  );
};

/**
 * 지난주 랭킹 조회
 */
export const getLastWeeklyRankings = async (): Promise<CommonResponse<WeeklyRankingListResponseDto>> => {
  return handleApiError(
    () => api.get('/games/v1/last-weekly-rankings')
  );
};

/**
 * 점수 저장
 */
export const saveScore = async (data: SaveScoreRequestDto): Promise<CommonResponse<SaveScoreResponseDto>> => {
  return handleApiError(
    () => api.post('/games/v1/scores', data)
  );
};

/**
 * 닉네임으로 주간 점수 조회 (상대방 점수 확인용)
 */
export const getWeeklyScoreByNickname = async (nickname: string): Promise<CommonResponse<MyWeeklyScoreResponseDto>> => {
  return handleApiError(
    () => api.get(`/games/v1/scores/weekly/${encodeURIComponent(nickname)}`)
  );
};
