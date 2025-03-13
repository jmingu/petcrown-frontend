// 사용자 정보 타입
export default interface IUserInfo {
  emailId: string;
  emailDomain: string;
  name: string;
  nickname: string;
  gender: string;
  birthDate: string;
  phone1: string;
  phone2: string;
  phone3: string;
  password: string;
  confirmPassword: string;
  profileImageUrl: string; // 기본 프로필 이미지 URL 추가 가능
}
