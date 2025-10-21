import api from '@/libs/axiosInstance';
import { handleApiError } from '@/libs/api/common/errorHandler';
import { CommonResponse } from '@/libs/interface/api/common/common';
import { NoticeListRequest } from '@/libs/interface/api/notice/noticeRequestInterface';
import {
  NoticeListResponse,
  NoticeDetailResponse,
} from '@/libs/interface/api/notice/noticeResponseInterface';

/**
 * 공지사항 목록 조회
 */
export const getNoticeList = async (
  data: NoticeListRequest
): Promise<CommonResponse<NoticeListResponse>> => {
  return handleApiError(
    () => api.get(`/notices/v1?page=${data.page}&size=${data.size}&search=${data.search || ''}`),
    '공지사항 목록 조회'
  );
};

/**
 * 공지사항 상세 조회
 */
export const getNoticeDetail = async (
  noticeId: number
): Promise<CommonResponse<NoticeDetailResponse>> => {
  return handleApiError(
    () => api.get(`/notices/v1/${noticeId}`),
    '공지사항 상세 조회'
  );
};