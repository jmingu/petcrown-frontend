/**
 * 펫 등록/수정 공통 인터페이스
 */
export interface PetRegisterRequest {
  breedId?: number; // 종류 (선택사항)
  customBreed?: string; // 종류 기타면 작성 (선택사항)
  name: string; // 이름 (필수)
  birthDate: string; // 생년월일 ISO 형식 (필수) 
  gender: string; // 성별 M/F (필수)
  description?: string; // 소개 (선택사항)
  microchipId?: string; // 내장칩 번호 (선택사항)
  profileImage?: File; // 이미지 파일 (등록시 필수, 수정시 선택)
}

/**
 * 펫 수정
 */
export interface PetChangeRequest {
  breedId?: number; // 종류 (선택사항)
  customBreed?: string; // 종류 기타면 작성 (선택사항)
  name: string; // 이름 (필수)
  birthDate: string; // 생년월일 ISO 형식 (필수) 
  gender: string; // 성별 M/F (필수)
  description?: string; // 소개 (선택사항)
  microchipId?: string; // 내장칩 번호 (선택사항)
  profileImage?: File; // 이미지 파일 (등록시 필수, 수정시 선택)
}
