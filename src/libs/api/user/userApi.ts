import api from '@/libs/axiosInstance'; // axios 인스턴스
import {
  LoginRequest,
  SignUpRequest,
  ChangeUserInfoRequest,
} from '@/libs/interface/api/user/userRequestInterface';
import {
  UserResponse,
  TokenResponse,
} from '@/libs/interface/api/user/userResponseInterface';
import { CommonResponse } from '@/libs/interface/api/common/common';

/**
 * 로그인
 */
export const login = async (
  data: LoginRequest
): Promise<CommonResponse<TokenResponse>> => {
  const response = await api.post('/user/v1/login', data);
  return response.data;
};

/**
 * 로그아웃
 */
export const logout = async (): Promise<CommonResponse<object>> => {
  const response = await api.post('/user/v1/logout');
  return response.data;
};

/**
 * 유저 정보 조회
 */
export const findUser = async (): Promise<CommonResponse<UserResponse>> => {
  const response = await api.get('/user/v1');
  return response.data;
};

/**
 * 이메일 중복 확인
 */
export const checkEmail = async (
  email: string
): Promise<CommonResponse<object>> => {
  const response = await api.get(`/user/v1/check-email?email=${email}`);
  return response.data;
};

/**
 * 닉네임 중복 확인
 */
export const checkNickname = async (
  nickname: string
): Promise<CommonResponse<object>> => {
  const response = await api.get(
    `/user/v1/check-nickname?nickname=${nickname}`
  );
  return response.data;
};

/**
 * 회원가입
 */
export const signup = async (
  data: SignUpRequest
): Promise<CommonResponse<object>> => {
  const response = await api.post('/user/v1', data);
  return response.data;
};

/**
 * 이메일 인증코드 발송
 */
export const sendEmailVerificationCode = async (
  email: string
): Promise<CommonResponse<object>> => {
  const response = await api.post('/user/v1/email/verification/send', email);
  return response.data;
};

/**
 * 이메일 인증코드 확인
 */
export const checkEmailVerificationCode = async (data: {
  code: string;
  email: string;
}): Promise<CommonResponse<object>> => {
  const response = await api.post('/user/v1/email/verification', data);
  return response.data;
};

/**
 * 회원 정보 수정
 */
export const changeUserInfo = async (
  data: ChangeUserInfoRequest
): Promise<CommonResponse<object>> => {
  const response = await api.put('/user/v1', data);
  return response.data;
};
