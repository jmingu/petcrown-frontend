import api from '@/libs/axiosInstance';
import { handleApiError } from '@/libs/api/common/errorHandler';
import { CommonResponse } from '@/libs/interface/api/common/common';
import { EventListRequest } from '@/libs/interface/api/event/eventRequestInterface';
import {
  EventListResponse,
  EventDetailResponse,
} from '@/libs/interface/api/event/eventResponseInterface';

/**
 * 이벤트 목록 조회
 */
export const getEventList = async (
  data: EventListRequest
): Promise<CommonResponse<EventListResponse>> => {
  return handleApiError(
    () => api.get(`/events/v1?page=${data.page}&size=${data.size}&search=${data.search || ''}`),
    '이벤트 목록 조회'
  );
};

/**
 * 이벤트 상세 조회
 */
export const getEventDetail = async (
  eventId: number
): Promise<CommonResponse<EventDetailResponse>> => {
  return handleApiError(
    () => api.get(`/events/v1/${eventId}`),
    '이벤트 상세 조회'
  );
};
