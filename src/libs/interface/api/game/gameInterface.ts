// 게임 관련 인터페이스

// 내 주간 점수 조회 응답
export interface MyWeeklyScoreResponseDto {
  weekStartDate: string | null; // 주 시작일 (YYYY-MM-DD)
  score: number | null; // 내 점수
  name: string | null; // 펫 이름
  imageUrl: string | null; // 이미지 URL
  nickname: string | null; // 유저 닉네임
}

// 주간 랭킹 아이템
export interface RankingItemDto {
  ranking: number; // 순위
  userId: number; // 사용자 ID
  nickname: string; // 닉네임
  score: number; // 점수
  name: string; // 펫 이름
  imageUrl: string; // 이미지 URL
}

// 주간 랭킹 목록 응답
export interface WeeklyRankingListResponseDto {
  rankings: RankingItemDto[]; // 주간 랭킹 목록
}

// 점수 저장 요청
export interface SaveScoreRequestDto {
  score: number; // 저장할 점수
  petId: number; // 게임에 사용한 펫 ID
}

// 점수 저장 응답
export interface SaveScoreResponseDto {
  saved: boolean; // 저장 여부
  message: string; // 메시지
  newScore?: number; // 새로 저장된 점수 (저장된 경우)
}
