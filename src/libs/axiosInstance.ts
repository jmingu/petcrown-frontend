import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
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
  (error) => Promise.reject(error)
);

// 응답 인터셉터
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.data?.resultCode === 440 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/refresh-token`,
          {
            refreshToken,
          }
        );

        const { accessToken, refreshToken: newRefreshToken } = res.data.result;

        // 토큰 저장
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        // 새 토큰으로 헤더 갱신하고 재요청
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('리프레시 토큰 재발급 실패:', refreshError);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // 기타 에러 처리
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
