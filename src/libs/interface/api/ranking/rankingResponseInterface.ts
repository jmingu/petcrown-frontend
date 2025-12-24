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
  rank: number;
  name: string;
  nickname?: string;
  gender: string | null;
  birthDate: string | null;
  breedId?: number | null;
  breedName?: string | null;
  customBreed?: string | null;
  speciesId?: number | null;
  speciesName?: string | null;
  petModeId?: number | null;
  petModeName?: string | null;
  dailyVoteCount: number;
  weeklyVoteCount: number;
  monthlyVoteCount: number;
  voteMonth: string;
  profileImageUrl: string;
  ownerEmail: string;
}

/**
 * 내 투표 랭킹 조회 response (VotePetRankResponseDto)
 */
export interface MyVoteRankingResponse extends VotePetRanking {}