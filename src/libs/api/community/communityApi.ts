import api from '@/libs/axiosInstance';
import { handleApiError } from '@/libs/api/common/errorHandler';
import { CommonResponse } from '@/libs/interface/api/common/common';
import {
  CommunityPostRequest,
  CommunityListRequest,
  CommentRequest,
} from '@/libs/interface/api/community/communityRequestInterface';
import {
  CommunityListResponse,
  CommunityDetailResponse,
  CommentListResponse,
} from '@/libs/interface/api/community/communityResponseInterface';

/**
 * 커뮤니티 게시글 등록
 */
export const createCommunityPost = async (
  data: CommunityPostRequest
): Promise<CommonResponse<object>> => {
  return handleApiError(async () => {
    const formData = new FormData();

    // 게시글 데이터 구성
    const postData = {
      title: data.title,
      content: data.content,
      category: data.category,
      contentType: data.contentType || 'TEXT',
    };

    formData.append('data', new Blob([JSON.stringify(postData)], { type: 'application/json' }));

    // 이미지가 있는 경우에만 추가
    if (data.images && data.images.length > 0) {
      data.images.forEach((image) => {
        formData.append('images', image);
      });
    }

    return api.post('/community/posts/v1', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }, '커뮤니티 게시글 등록');
};

/**
 * 커뮤니티 게시글 목록 조회
 */
export const getCommunityList = async (
  data: CommunityListRequest
): Promise<CommonResponse<CommunityListResponse>> => {
  return handleApiError(
    () => api.get(`/community/posts/v1?page=${data.page}&size=${data.size}&category=${data.category || ''}&search=${data.search || ''}`),
    '커뮤니티 게시글 목록 조회'
  );
};

/**
 * 커뮤니티 게시글 상세 조회
 */
export const getCommunityDetail = async (
  postId: number
): Promise<CommonResponse<CommunityDetailResponse>> => {
  return handleApiError(
    () => api.get(`/community/posts/v1/${postId}`),
    '커뮤니티 게시글 상세 조회'
  );
};

/**
 * 커뮤니티 게시글 수정
 */
export const updateCommunityPost = async (
  postId: number,
  data: CommunityPostRequest
): Promise<CommonResponse<object>> => {
  return handleApiError(async () => {
    const formData = new FormData();

    // 게시글 데이터 구성
    const postData = {
      title: data.title,
      content: data.content,
      category: data.category,
      contentType: data.contentType || 'TEXT',
    };

    formData.append('data', new Blob([JSON.stringify(postData)], { type: 'application/json' }));

    // 이미지가 있는 경우에만 추가
    if (data.images && data.images.length > 0) {
      data.images.forEach((image) => {
        formData.append('images', image);
      });
    }

    return api.put(`/community/posts/v1/${postId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }, '커뮤니티 게시글 수정');
};

/**
 * 커뮤니티 게시글 삭제
 */
export const deleteCommunityPost = async (
  postId: number
): Promise<CommonResponse<object>> => {
  return handleApiError(
    () => api.delete(`/community/posts/v1/${postId}`),
    '커뮤니티 게시글 삭제'
  );
};

/**
 * 게시글 좋아요
 */
export const likeCommunityPost = async (
  postId: number
): Promise<CommonResponse<object>> => {
  return handleApiError(
    () => api.post(`/community/posts/v1/${postId}/like`),
    '게시글 좋아요'
  );
};

/**
 * 댓글 작성 (댓글 또는 대댓글)
 */
export const createComment = async (
  data: CommentRequest
): Promise<CommonResponse<object>> => {
  return handleApiError(
    () => api.post('/community/comments/v1', data),
    '댓글 작성'
  );
};

/**
 * 댓글 및 대댓글 목록 조회
 */
export const getCommentList = async (
  postId: number,
  page: number = 1,
  size: number = 20
): Promise<CommonResponse<CommentListResponse>> => {
  return handleApiError(
    () => api.get(`/community/comments/v1/post/${postId}?page=${page}&size=${size}`),
    '댓글 목록 조회'
  );
};

/**
 * 댓글 수정
 */
export const updateComment = async (
  commentId: number,
  data: CommentRequest
): Promise<CommonResponse<object>> => {
  return handleApiError(
    () => api.put(`/community/comments/v1/${commentId}`, data),
    '댓글 수정'
  );
};

/**
 * 댓글 삭제
 */
export const deleteComment = async (
  commentId: number
): Promise<CommonResponse<object>> => {
  return handleApiError(
    () => api.delete(`/community/comments/v1/${commentId}`),
    '댓글 삭제'
  );
};

/**
 * 댓글 좋아요
 */
export const likeComment = async (
  commentId: number
): Promise<CommonResponse<object>> => {
  return handleApiError(
    () => api.post(`/community/comments/v1/${commentId}/like`),
    '댓글 좋아요'
  );
};