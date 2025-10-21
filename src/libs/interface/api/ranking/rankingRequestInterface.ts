/**
 * 랭킹 목록 조회 request
 */
export interface RankingListRequest {
  period: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  species?: string; // 종 필터
  page: number;
  size: number;
}