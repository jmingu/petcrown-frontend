import api from '@/libs/axiosInstance'; // axios 인스턴스
import { handleApiError } from '@/libs/api/common/errorHandler';
import {
  LoginRequest,
  SignUpRequest,
  ChangeUserInfoRequest,
  SendEmailVerificationCodeRequest,
  CheckEmailVerificationCodeRequest,
  ChangePasswordRequest,
  PasswordResetRequest,
} from '@/libs/interface/api/user/userRequestInterface';
import {
  VotingEmailVerificationRequest,
  VotingEmailConfirmationRequest,
} from '@/libs/interface/api/vote/voteRequestInterface';
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
  return handleApiError(
    () => api.post('/users/v1/login', data)
  );
};

/**
 * 로그아웃
 */
export const logout = async (): Promise<CommonResponse<object>> => {
  return handleApiError(
    () => api.post('/users/v1/logout')
  );
};

/**
 * 유저 정보 조회
 */
export const findUser = async (): Promise<CommonResponse<UserResponse>> => {
  return handleApiError(
    () => api.get('/users/v1/info')
  );
};

/**
 * 이메일 중복 확인
 */
export const checkEmail = async (
  email: string
): Promise<CommonResponse<object>> => {
  return handleApiError(
    () => api.get(`/users/v1/check-email?email=${email}`)
  );
};

/**
 * 닉네임 중복 확인
 */
export const checkNickname = async (
  nickname: string
): Promise<CommonResponse<object>> => {
  return handleApiError(
    () => api.get(`/users/v1/check-nickname?nickname=${nickname}`)
  );
};

/**
 * 회원가입
 */
export const signup = async (
  data: SignUpRequest
): Promise<CommonResponse<object>> => {
  return handleApiError(
    () => api.post('/users/v1', data)
  );
};

/**
 * 이메일 인증코드 발송
 */
export const sendEmailVerificationCode = async (
  data: SendEmailVerificationCodeRequest
): Promise<CommonResponse<object>> => {
  return handleApiError(
    () => api.post('/users/v1/email/verification/send', data)
  );
};

/**
 * 이메일 인증코드 확인
 */
export const checkEmailVerificationCode = async (
  data: CheckEmailVerificationCodeRequest
): Promise<CommonResponse<object>> => {
  return handleApiError(
    () => api.post('/users/v1/email/verification', data)
  );
};

/**
 * 회원 정보 수정
 */
export const changeUserInfo = async (
  data: ChangeUserInfoRequest
): Promise<CommonResponse<object>> => {
  return handleApiError(
    () => api.put('/users/v1/info', data)
  );
};

/**
 * 비밀번호 변경
 */
export const changePassword = async (
  data: ChangePasswordRequest
): Promise<CommonResponse<object>> => {
  return handleApiError(
    () => api.put('/users/v1/password', data)
  );
};

/**
 * 투표 가능 인증 이메일 발송
 */
export const sendVotingVerificationEmail = async (
  data: VotingEmailVerificationRequest
): Promise<CommonResponse<object>> => {
  return handleApiError(
    () => api.post('/users/v1/vote-verification/send', data)
  );
};

/**
 * 투표 이메일 인증 확인
 */
export const confirmVotingEmail = async (
  data: VotingEmailConfirmationRequest
): Promise<CommonResponse<object>> => {
  return handleApiError(
    () => api.post('/users/v1/vote-verification', data)
  );
};

/**
 * 오늘 인증된 이메일인지 확인
 */
export const checkVerifiedEmailToday = async (
  email: string
): Promise<CommonResponse<object>> => {
  return handleApiError(
    () => api.get(`/users/v1/vote-verification/check?email=${email}`)
  );
};

/**
 * 비밀번호 찾기 (재설정)
 */
export const resetPassword = async (
  data: PasswordResetRequest
): Promise<CommonResponse<object>> => {
  return handleApiError(
    () => api.post('/users/v1/password/reset', data)
  );
};
