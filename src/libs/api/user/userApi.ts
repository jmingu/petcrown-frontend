import api from '@/libs/axiosInstance'; // axios 인스턴스
import { LoginRequest,UserResponse} from '@/libs/interface/api/user/userInterface';

/**
 * 로그인
 */
export const login = async (data: LoginRequest): Promise<void> => {
  const response = await api.post('/user/v1/login', data);
};

/**
 * 유저 정보 조회
 */
export const findUser = async (): Promise<UserResponse> => {
  const response = await api.get('/user/v1');
  return response.data.result;
};