/**
 * 이벤트 목록 조회 request
 */
export interface EventListRequest {
  page: number;
  size: number;
  search?: string;
}
