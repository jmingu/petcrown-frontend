import api from '@/libs/axiosInstance'; // axios 인스턴스
import {
  LoginRequest,
  UserResponse,
} from '@/libs/interface/api/user/userInterface';

/**
 * 로그인
 */
export const login = async (data: LoginRequest): Promise<void> => {
  await api.post('/user/v1/login', data);
};

/**
 * 로그아웃
 */
export const logout = async (): Promise<void> => {
  await api.post('/user/v1/logout');
};

/**
 * 유저 정보 조회
 */
export const findUser = async (): Promise<UserResponse> => {
  const response = await api.get('/user/v1');
  return response.data.result;
};

/**
 * 이메일 중복 확인
 */
export const checkEmail = async (email: string): Promise<boolean> => {
  const response = await api.get(`/user/v1/check-email?email=${email}`);
  console.log(response)
  return response.data;
};

/**
 * 닉네임 중복 확인
 */
export const checkNickname = async (nickname: string): Promise<boolean> => {
  const response = await api.get(`/user/v1/check-nickname?nickname=${nickname}`);
  return response.data.result;
};

/**
 * 회원가입
 */
export const signup = async (data: {
  email: string;
  name: string;
  nickname: string;
  password: string;
  passwordCheck: string;
  phoneNumber: string;
  birthDate: string;
  gender: string;
}): Promise<void> => {
  await api.post('/user/v1', data);
};
