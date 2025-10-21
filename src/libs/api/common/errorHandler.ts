import api from '@/libs/axiosInstance';
import { CommonResponse } from '@/libs/interface/api/common/common';

/**
 * 공통 API 에러 처리 함수
 * @param apiCall API 호출 함수
 * @param errorContext 에러 발생 시 콘솔 로그에 표시할 컨텍스트
 * @returns Promise<CommonResponse<T>>
 */
export const handleApiError = async <T>(
  apiCall: () => Promise<any>,
  errorContext: string
): Promise<CommonResponse<T>> => {
  try {
    const response = await apiCall();
    return response.data;
  } catch (error: any) {
    // axios 인터셉터에서 Promise.reject로 전달된 에러 응답 처리
    if (error.data) {
      return error.data;
    }

    // 백엔드 에러 응답이 직접 온 경우
    if (error.resultCode) {
      return error;
    }

    console.error(`${errorContext} API 에러:`, error);
    throw error;
  }
};