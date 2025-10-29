/**
 * 공지사항 목록 조회 response
 */
export interface NoticeListResponse {
  notices: Notice[];
  totalCount: number;
}

/**
 * 공지사항 정보
 */
export interface Notice {
  noticeId: number;
  title: string;
  content?: string;
  contentType?: 'TEXT' | 'HTML';
  isPinned: string;
  pinOrder: number | null;
  startDate: string;
  endDate: string;
  viewCount: number;
  createDate: string;
  createUserId?: number;
}

/**
 * 공지사항 상세 response
 */
export interface NoticeDetailResponse {
  noticeId: number;
  title: string;
  content: string;
  contentType: 'TEXT' | 'HTML';
  isPinned: string;
  pinOrder: number | null;
  startDate: string;
  endDate: string;
  viewCount: number;
  createDate: string;
  createUserId: number;
}