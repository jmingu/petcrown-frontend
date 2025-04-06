import axios from 'axios';

// 기본 axios 인스턴스 생성
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // 환경 변수로 API URL 관리
  timeout: 10000, // 요청 타임아웃 설정 (10초)
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터: 인증 토큰 자동 추가
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 에러 처리
api.interceptors.response.use(
  (response) => {
    console.log(response);
    return response.data;
  },
  (error) => {
    if (error.response) {
      const { status } = error.response;

      // 401 에러 처리 (로그인 필요)
      if (status === 401) {
        console.error('Unauthorized! Redirecting to login...');
        window.location.href = '/login';
      }

      // 403 에러 처리 (권한 없음)
      if (status === 403) {
        console.error('Forbidden! You do not have access.');
      }

      // 기타 에러 로그 출력
      console.error('API Error:', error.response.data);
    }

    return Promise.reject(error);
  }
);

export default api;
