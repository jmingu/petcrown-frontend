import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000,
  withCredentials: true, // 쿠키 포함
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 (더 이상 토큰 추가 안함)
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// 응답 인터셉터
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 440: 토큰 만료 -> 리프레시 요청
    if (error.response?.data?.resultCode === 440 && !originalRequest._retry) {
      originalRequest._retry = true; // 처음 한 번만 재시도 허용

      try {
        // 쿠키 기반이므로 refresh-token 요청에 쿠키가 자동 포함됨
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/v1/refresh-token`,
          {},
          {
            withCredentials: true, // 리프레시 요청에도 쿠키 포함
          }
        );

        // 재요청
        return api(originalRequest);
      } catch (refreshError) {
        console.error('토큰 재발급 실패:', refreshError);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    const status = error.response?.status;
    if (status === 401) {
      console.error('Unauthorized! Redirecting to login...');
      window.location.href = '/login';
    } else if (status === 403) {
      console.error('Forbidden! You do not have access.');
    } else {
      console.error('API Error:', error.response?.data);
    }

    return Promise.reject(error);
  }
);

export default api;
