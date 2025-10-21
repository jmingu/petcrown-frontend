/**
 * 비밀번호 유효성 검사 유틸리티
 */

/**
 * 비밀번호 유효성 검사
 * @param password 검사할 비밀번호
 * @returns 에러 메시지 (유효하면 빈 문자열)
 */
export const validatePassword = (password: string): string => {
  if (!password) {
    return '비밀번호를 입력해주세요.';
  }
  
  if (password.length < 8) {
    return '비밀번호는 8자 이상이어야 합니다.';
  }
  
  if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(password)) {
    return '비밀번호는 영문자와 숫자를 포함해야 합니다.';
  }
  
  return '';
};

/**
 * 비밀번호 확인 검사
 * @param password 원본 비밀번호
 * @param confirmPassword 확인 비밀번호
 * @returns 에러 메시지 (유효하면 빈 문자열)
 */
export const validatePasswordConfirm = (password: string, confirmPassword: string): string => {
  if (!confirmPassword) {
    return '비밀번호 확인을 입력해주세요.';
  }
  
  if (password !== confirmPassword) {
    return '비밀번호가 일치하지 않습니다.';
  }
  
  return '';
};

/**
 * 비밀번호 변경 시 현재 비밀번호와 새 비밀번호가 다른지 검사
 * @param currentPassword 현재 비밀번호
 * @param newPassword 새 비밀번호
 * @returns 에러 메시지 (유효하면 빈 문자열)
 */
export const validatePasswordChange = (currentPassword: string, newPassword: string): string => {
  if (currentPassword === newPassword && currentPassword.trim()) {
    return '현재 비밀번호와 다른 비밀번호를 입력해주세요.';
  }
  
  return '';
};