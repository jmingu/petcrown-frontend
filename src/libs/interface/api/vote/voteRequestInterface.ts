/**
 * 등록 request
 */
export interface VoteRegistrationRequest {
  petId: number;
  profileImageUrl: string;
}

/**
 * 리스트 조회 request
 */
export interface VoteListRequest {
  page: number;
  size: number;
}


