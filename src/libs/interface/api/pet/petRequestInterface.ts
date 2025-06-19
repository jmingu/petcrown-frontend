/**
 * 펫 등록 request
 */
export interface PetRegisterRequest {
  name: string;
  gender: string; // 예: "M", "F
  birthDate: string; // ISO 형식 (예: "1990-01-01")
  species: number; // 반려동물의 종 (예: "1" : 개, "2" 고양이, "3" : 기타)
  image: string; // 이미지 파일
}
