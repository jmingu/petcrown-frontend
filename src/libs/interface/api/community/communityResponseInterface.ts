/**
 * 커뮤니티 게시글 목록 조회 response
 */
export type CommunityListResponse = CommunityPost[];

/**
 * 커뮤니티 게시글 정보
 */
export interface CommunityPost {
  postId: number;
  userId: number;
  nickname?: string;
  category: string;
  title: string;
  content?: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  isPinned: string;
  pinOrder: number;
  createDate: string;
}

/**
 * 커뮤니티 게시글 상세 response
 */
export interface CommunityDetailResponse {
  postId: number;
  nickname: string;
  category: string;
  title: string;
  content: string;
  contentType: 'TEXT' | 'HTML';
  viewCount: number;
  likeCount: number;
  commentCount: number;
  isPinned: string;
  pinOrder: number;
  createDate: string;
  imageUrls: string[];
}

/**
 * 댓글 목록 조회 response
 */
export type CommentListResponse = Comment[];

/**
 * 댓글 정보
 */
export interface Comment {
  commentId: number;
  postId: number;
  nickname: string;
  parentCommentId: number | null;
  content: string;
  likeCount: number;
  depth: number;
  createDate: string;
  replies: Comment[];
}