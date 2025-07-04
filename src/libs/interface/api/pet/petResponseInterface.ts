/**
 * 나의 펫 조회 response
 */
export interface MyPetResponse {
  petId: number;
  name: string;
  gender: string;
  birthDate: string;
	breedId: number; // 
	breedName: string; // 
  speciesId: number;
	speciesName: string;
  imageUrl: string;
  awards: number; // 
}