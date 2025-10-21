// 종 관련 인터페이스

export interface SpeciesDto {
  speciesId: number;
  name: string;
}

export interface SpeciesListResponseDto {
  species: SpeciesDto[];
}

export interface BreedDto {
  breedId: number;
  name: string;
}

export interface BreedListResponseDto {
  breeds: BreedDto[];
}
