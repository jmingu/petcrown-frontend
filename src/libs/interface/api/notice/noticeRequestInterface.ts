/**
 * 공지사항 목록 조회 request
 */
export interface NoticeListRequest {
  page: number;
  size: number;
  search?: string;
}