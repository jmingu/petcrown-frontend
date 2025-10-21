"use client";
import { useState, useEffect } from "react";
import Pagination from "react-js-pagination";
import Button from '@/components/common/button/Button';
import { createComment, getCommentList } from '@/libs/api/community/communityApi';
import { Comment as CommentType } from '@/libs/interface/api/community/communityResponseInterface';

const commentsPerPage = 5;

interface CommentProps {
  postId: number;
  comments?: any[];
  onCommentAdded?: () => void;
}

export default function Comment({ postId, comments: initialComments, onCommentAdded }: CommentProps) {
  const [comments, setComments] = useState<any[]>(initialComments || []);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialComments) {
      setComments(initialComments);
    }
  }, [initialComments]);

  const handleAddComment = async (parentCommentId: number | null, text: string) => {
    if (text.trim() === "") return;

    setIsLoading(true);
    try {
      const response = await createComment({
        postId,
        parentCommentId: parentCommentId || undefined,
        content: text,
      });

      if (response.resultCode === 200) {
        // 댓글 목록 다시 불러오기
        if (onCommentAdded) {
          onCommentAdded();
        }

        if (parentCommentId) {
          setReplyingTo(null);
          setReplyText("");
        } else {
          setNewComment("");
        }
      }
    } catch (error) {
      console.error('댓글 등록 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const parentComments = comments.filter(comment => comment.parentCommentId === null);
  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = parentComments.slice(indexOfFirstComment, indexOfLastComment);

  const totalComments = comments.reduce((acc, comment) => {
    return acc + 1 + (comment.replies?.length || 0);
  }, 0);

  return (
    <div className="mt-8 p-4 border-t border-gray-300">
      <h2 className="text-lg font-bold mb-4">💬 댓글 ({totalComments})</h2>

      <div className="flex gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1 border rounded-md p-2"
          placeholder="댓글을 입력하세요..."
          disabled={isLoading}
        />
        <Button onClick={() => handleAddComment(null, newComment)} disabled={isLoading}>
          {isLoading ? '등록 중...' : '등록'}
        </Button>
      </div>

      <ul className="mt-4">
        {currentComments.map(comment => (
          <li key={comment.commentId} className="border-b border-gray-300 py-2">
            <p className="font-medium">
              {comment.nickname || '알 수 없음'}
              <span className="text-gray-500 text-sm ml-2">
                ({new Date(comment.createDate).toLocaleDateString('ko-KR')})
              </span>
            </p>
            <p className="ml-4">{comment.content}</p>

            <button
              onClick={() => setReplyingTo(replyingTo === comment.commentId ? null : comment.commentId)}
              className="text-sm text-blue-500 mt-1 ml-4"
            >
              {replyingTo === comment.commentId ? "취소" : "답글 달기"}
            </button>

            {replyingTo === comment.commentId && (
              <div className="ml-6 mt-2 flex gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 border rounded-md p-2"
                  placeholder="답글을 입력하세요..."
                  disabled={isLoading}
                />
                <button
                  onClick={() => handleAddComment(comment.commentId, replyText)}
                  className="bg-green-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? '등록 중...' : '등록'}
                </button>
              </div>
            )}

            {comment.replies && comment.replies.length > 0 && comment.replies.map((reply: CommentType) => (
              <div key={reply.commentId} className="ml-4 pl-2 mt-2 flex">
                <div className="pr-2">
                  <p>└</p>
                </div>
                <div>
                  <p className="font-medium">
                    {reply.nickname || '알 수 없음'}
                    <span className="text-gray-500 text-sm ml-2">
                      ({new Date(reply.createDate).toLocaleDateString('ko-KR')})
                    </span>
                  </p>
                  <p>{reply.content}</p>
                </div>
              </div>
            ))}
          </li>
        ))}
      </ul>

      {parentComments.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          댓글이 없습니다. 첫 번째 댓글을 작성해보세요!
        </div>
      )}

      {parentComments.length > commentsPerPage && (
        <div className="flex justify-center mt-4">
          <Pagination
            activePage={currentPage}
            itemsCountPerPage={commentsPerPage}
            totalItemsCount={parentComments.length}
            pageRangeDisplayed={3}
            onChange={(page: any) => setCurrentPage(page)}
            innerClass="flex gap-2"
            itemClass="px-3 py-1 rounded-md cursor-pointer"
            activeClass="text-black font-bold"
            linkClass="hover:text-blue-500"
            disabledClass="opacity-50 cursor-not-allowed"
          />
        </div>
      )}
    </div>
  );
}
