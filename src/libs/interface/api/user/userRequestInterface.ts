/**
 * 회원가입 request
 */
export interface SignUpRequest {
  email: string;
  name: string;
  nickname: string;
  password: string;
  passwordCheck: string; // 비밀번호 확인
}

/**
 * 로그인 request
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * 회원 정보 변경
 */
export interface ChangeUserInfoRequest {
  name: string; // 필수
  nickname: string; // 필수
  gender?: string; // 선택 - 예: "M", "F"
  birthDate?: string; // 선택 - ISO 형식 (예: "1990-01-01")
  phoneNumber?: string; // 선택 - 전화번호 형식 (예: "010-1234-5678")
}

/**
 * 인증코드 발송
 */
export interface SendEmailVerificationCodeRequest{
  email: string;
}

/**
 * 인증코드 검증
 */
export interface CheckEmailVerificationCodeRequest{
  email: string;
  code: string;
}

/**
 * 비밀번호 변경
 */
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
}

/**
 * 비밀번호 찾기 (재설정)
 */
export interface PasswordResetRequest {
  email: string;
  name: string;
}
