import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000,
  withCredentials: true, // 쿠키 포함
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ 요청 인터셉터: accessToken 자동 추가
api.interceptors.request.use(
  (config) => {
    // SSR 환경에서 localStorage가 없을 수 있으므로 체크
    if (typeof window !== 'undefined') {
      const accessToken = localStorage.getItem('a_t');
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ 응답 인터셉터 - 440 (accessToken 만료) 시 refresh-token API 호출
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 440: accessToken 만료 → 리프레시 시도
    if (error.response?.data?.resultCode === 440 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // SSR 환경에서는 토큰 갱신 불가
        if (typeof window === 'undefined') {
          return Promise.reject(error);
        }

        // ✅ 리프레시 API 호출
        const refreshResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/v1/refresh-token`,
          {
            accessToken: localStorage.getItem('a_t'), // 현재 액세스 토큰 바디로 전송
            refreshToken: localStorage.getItem('r_t'), // 현재 리프레시 토큰 바디로 전송
          }, // body로 전송
          {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: false,
          }
        );

        // ✅ 새 토큰 저장
        localStorage.setItem('a_t', refreshResponse.data.result.accessToken);
        localStorage.setItem('r_t', refreshResponse.data.result.refreshToken);

        // ✅ 원래 요청에 새 accessToken 반영
        originalRequest.headers.Authorization = `Bearer ${localStorage.getItem(
          'a_t'
        )}`;
        return api(originalRequest); // 재요청
      } catch (refreshError) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('a_t');
          localStorage.removeItem('r_t');
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    const status = error.response?.status;
    if (status === 401 && typeof window !== 'undefined') {
      window.location.href = '/login';
    }

    // 에러 응답이 있는 경우 해당 응답을 Promise.reject로 전달
    if (error.response) {
      return Promise.reject(error.response);
    }
    
    // 네트워크 에러 등 response가 없는 경우
    return Promise.reject(error);
  }
);

export default api;
