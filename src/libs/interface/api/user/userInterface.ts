/**\
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
}
