/**
 * 조회 request
 */
export interface VoteListResponse {
  voteId: number;
  petId: number;
  name: string;
  gender: string;
  birthDate: string; // LocalDate → string (ISO 형식)
  breedId: number;
  breedName: string;
  speciesId: number;
  speciesName: string;
  dailyVoteCount: number;
  weeklyVoteCount: number;
  monthlyVoteCount: number;
  voteMonth: string; // LocalDate → string (ISO 형식)
  profileImageUrl: string;
}


