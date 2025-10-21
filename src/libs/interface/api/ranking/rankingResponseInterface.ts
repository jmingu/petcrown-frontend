/**
 * 랭킹 목록 조회 response (VoteRankingResponseDto)
 */
export interface RankingListResponse {
  ranking: VotePetRanking[];
}

/**
 * 투표 펫 랭킹 정보 (VotePetResponseDto)
 */
export interface VotePetRanking {
  voteId: number;
  petId: number;
  name: string;
  gender: string;
  birthDate: string;
  breedId?: number;
  breedName?: string;
  speciesId?: number;
  speciesName: string;
  dailyVoteCount: number;
  weeklyVoteCount: number;
  monthlyVoteCount: number;
  voteMonth: string;
  profileImageUrl: string;
  ownerEmail: string;
}