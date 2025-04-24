/**
 * 회원가입 request
 */
export interface SignUpRequest {
  email: string;
  name: string;
  nickname: string;
  gender: string; // 예: "M", "F
  birthDate: string; // ISO 형식 (예: "1990-01-01")
  phoneNumber: string; // 전화번호 형식 (예: "010-1234-5678")
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
 * 사용자 정보 response
 */
export interface UserResponse {
  email: string;
  name: string;
  nickname: string;
  phoneNumber: string;
  profileImageUrl: string;
  birthDate: string; // ISO 형식 (예: "1990-01-01")
  gender: string; // 예: "MALE", "FEMALE" 등
  isEmailVerified: string; // 이메일 인증 여부 (Y/N)
}
