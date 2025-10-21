/**
 * 이벤트 목록 조회 response
 */
export type EventListResponse = Event[];

/**
 * 이벤트 정보
 */
export interface Event {
  eventId: number;
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
  thumbnailUrl?: string;
}

/**
 * 이벤트 상세 response
 */
export interface EventDetailResponse {
  eventId: number;
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
