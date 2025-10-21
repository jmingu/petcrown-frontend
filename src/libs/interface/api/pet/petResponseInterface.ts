/**
 * 나의 펫 조회 response - 단일 펫 정보
 */
export interface MyPetResponse {
  petId: number;
  name: string;
  breedId?: number;
  breedName?: string;
  speciesId?: number;
  speciesName: string;
  customBreed?: string;
  gender: string;
  birthDate: string;
  description?: string;
  microchipId?: string;
  ownershipId: number;
  ownershipName: string;
  imageUrl: string;
  createDate: string;
  awards?: number;
}

/**
 * 나의 펫 목록 조회 response
 */
export interface MyPetsListResponse {
  pets: MyPetResponse[];
  totalCount: number;
}