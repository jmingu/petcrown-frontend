/**
 * PetMode 목록 조회 response
 */
export interface PetModeListResponse {
  petModes: PetModeDto[];
}

/**
 * PetMode 정보
 */
export interface PetModeDto {
  petModeId: number;
  modeName: string;
}
