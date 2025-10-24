import { CommonResponse } from '@/libs/interface/api/common/common';

/**
 * 공통 API 에러 처리 함수
 * @param apiCall API 호출 함수
 * @returns Promise<CommonResponse<T>>
 */
export const handleApiError = async <T>(
  apiCall: () => Promise<{ data: CommonResponse<T> }>
): Promise<CommonResponse<T>> => {
  try {
    const response = await apiCall();
    return response.data;
  } catch (error: unknown) {
    // axios 인터셉터에서 Promise.reject로 전달된 에러 응답 처리
    if (error && typeof error === 'object' && 'data' in error) {
      return (error as { data: CommonResponse<T> }).data;
    }

    // 백엔드 에러 응답이 직접 온 경우
    if (error && typeof error === 'object' && 'resultCode' in error) {
      return error as CommonResponse<T>;
    }

    throw error;
  }
};