/**
 * 펫 등록 인터페이스 - 최소 필드만
 */
export interface PetRegisterRequest {
  name: string; // 이름 (필수)
  profileImage: File; // 이미지 파일 (필수)
  breedId?: number; // 품종 ID (선택사항)
  customBreed?: string; // 기타 종류일 때 커스텀 품종 (선택사항)
}

/**
 * 펫 수정
 */
export interface PetChangeRequest {
  breedId?: number; // 종류 (선택사항)
  customBreed?: string; // 종류 기타면 작성 (선택사항)
  name: string; // 이름 (필수)
  birthDate?: string; // 생년월일 ISO 형식 (선택사항)
  gender?: string; // 성별 M/F (선택사항)
  description?: string; // 소개 (선택사항)
  microchipId?: string; // 내장칩 번호 (선택사항)
  profileImage?: File; // 이미지 파일 (등록시 필수, 수정시 선택)
}
