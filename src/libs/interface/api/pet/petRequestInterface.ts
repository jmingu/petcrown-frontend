/**
 * 펫 등록 
 */
export interface PetRegisterRequest {
  name: string;
  gender: string; // 예: "M", "F
  birthDate: string; // ISO 형식 (예: "1990-01-01")
  breedId: number; // 반려동물
  profileImageUrl: string; // 이미지 파일
}

/**
 * 펫 수정 
 */
export interface PetChangeRequest {
  name: string;
  gender: string; // 예: "M", "F
  birthDate: string; // ISO 형식 (예: "1990-01-01")
  breedId: number; // 반려동물
  profileImageUrl: string; // 이미지 파일
}
