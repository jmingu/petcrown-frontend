/**
 * 커뮤니티 게시글 등록/수정 request
 */
export interface CommunityPostRequest {
  title: string;
  content: string;
  category: string;
  contentType?: 'TEXT' | 'HTML';
  images?: File[];
}

/**
 * 커뮤니티 게시글 목록 조회 request
 */
export interface CommunityListRequest {
  page: number;
  size: number;
  category?: string;
  search?: string;
}

/**
 * 댓글 작성 request
 */
export interface CommentRequest {
  postId?: number; // 댓글 작성 시 필요
  content: string;
  parentCommentId?: number; // 대댓글인 경우
}