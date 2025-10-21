/**
 * 투표 목록 조회 response
 */
export interface VoteListResponse {
  votes: VotePetResponse[];
  totalCount: number;
}

/**
 * 투표 펫 응답 (목록용)
 */
export interface VotePetResponse {
  voteId: number;
  petId: number;
  name: string;
  gender: string;
  birthDate: string;
  breedId?: number;
  breedName?: string;
  speciesId?: number;
  speciesName: string;
  customBreed?: string;
  petModeId?: number;
  petModeName?: string;
  weeklyVoteCount: number;
  monthlyVoteCount: number;
  voteMonth: string;
  profileImageUrl: string;
}

/**
 * 투표 상세 response (백엔드 API 스펙에 맞춤)
 */
export interface VoteDetailResponse {
  voteId: number;
  petId: number;
  name: string;
  gender: string;
  birthDate: string; // LocalDate는 문자열로 전송됨
  breedId?: number;
  breedName?: string;
  speciesId?: number;
  speciesName: string;
  customBreed?: string;
  petModeId?: number;
  petModeName?: string;
  weeklyVoteCount: number;
  monthlyVoteCount: number;
  voteMonth: string; // LocalDate는 문자열로 전송됨
  profileImageUrl: string;
  ownerEmail: string; // 투표를 올린 사용자의 이메일
}

