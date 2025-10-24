"use client";
import { useState, useEffect } from "react";
import { MessageCircle, Send, CornerDownRight, User } from 'lucide-react';
import Pagination from "react-js-pagination";
import CuteButton from '@/components/common/button/CuteButton';
import CuteCard from '@/components/common/card/CuteCard';
import Alert from '@/components/common/alert/Alert';
import { createComment } from '@/libs/api/community/communityApi';
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
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    if (initialComments) {
      setComments(initialComments);
    }
  }, [initialComments]);

  const handleAddComment = async (parentCommentId: number | null, text: string) => {
    if (text.trim() === "") {
      setAlertMessage('댓글 내용을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await createComment({
        postId,
        parentCommentId: parentCommentId || undefined,
        content: text,
      });

      if (response.resultCode === 200) {
        setAlertMessage('댓글이 등록되었습니다.');
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
      } else {
        setAlertMessage(response.resultMessageKo || '댓글 등록에 실패했습니다.');
      }
    } catch (error) {
      setAlertMessage('댓글 등록 중 오류가 발생했습니다.');
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
    <div className="mt-8">
      <CuteCard padding="lg">
        <div className="space-y-6">
          {/* 댓글 헤더 */}
          <div className="flex items-center space-x-2 pb-4 border-b border-gray-100">
            <MessageCircle className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-900">댓글</h2>
            <span className="text-sm text-gray-500">({totalComments}개)</span>
          </div>

          {/* 댓글 작성 */}
          <div className="space-y-3">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
              placeholder="댓글을 입력해주세요..."
              rows={3}
              disabled={isLoading}
            />
            <div className="flex justify-end">
              <CuteButton
                onClick={() => handleAddComment(null, newComment)}
                disabled={isLoading || !newComment.trim()}
                variant="primary"
                size="md"
                icon={<Send className="w-4 h-4" />}
              >
                {isLoading ? '등록 중...' : '댓글 등록'}
              </CuteButton>
            </div>
          </div>

          {/* 댓글 목록 */}
          <div className="space-y-4">
            {currentComments.map(comment => (
              <div key={comment.commentId} className="border-b border-gray-100 pb-4 last:border-b-0">
                {/* 댓글 작성자 및 내용 */}
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-semibold text-gray-900">{comment.nickname || '알 수 없음'}</span>
                      <span className="text-xs text-gray-400">
                        {new Date(comment.createDate).toLocaleDateString('ko-KR')}
                      </span>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap break-words">{comment.content}</p>

                    {/* 답글 달기 버튼 */}
                    <button
                      onClick={() => setReplyingTo(replyingTo === comment.commentId ? null : comment.commentId)}
                      className="mt-2 text-sm text-purple-600 hover:text-purple-800 transition-colors flex items-center space-x-1"
                    >
                      <CornerDownRight className="w-3 h-3" />
                      <span>{replyingTo === comment.commentId ? "취소" : "답글 달기"}</span>
                    </button>
                  </div>
                </div>

                {/* 답글 입력 */}
                {replyingTo === comment.commentId && (
                  <div className="ml-13 mt-3 space-y-2">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                      placeholder="답글을 입력하세요..."
                      rows={2}
                      disabled={isLoading}
                    />
                    <div className="flex justify-end">
                      <CuteButton
                        onClick={() => handleAddComment(comment.commentId, replyText)}
                        disabled={isLoading || !replyText.trim()}
                        variant="secondary"
                        size="sm"
                        icon={<Send className="w-3 h-3" />}
                      >
                        {isLoading ? '등록 중...' : '답글 등록'}
                      </CuteButton>
                    </div>
                  </div>
                )}

                {/* 답글 목록 */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="ml-13 mt-3 space-y-3">
                    {comment.replies.map((reply: CommentType) => (
                      <div key={reply.commentId} className="flex items-start space-x-3 bg-gray-50 rounded-2xl p-3">
                        <CornerDownRight className="w-4 h-4 text-gray-400 mt-1 shrink-0" />
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center shrink-0">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-semibold text-gray-900 text-sm">{reply.nickname || '알 수 없음'}</span>
                            <span className="text-xs text-gray-400">
                              {new Date(reply.createDate).toLocaleDateString('ko-KR')}
                            </span>
                          </div>
                          <p className="text-gray-700 text-sm whitespace-pre-wrap break-words">{reply.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 댓글 없음 */}
          {parentComments.length === 0 && (
            <div className="text-center py-12">
              <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">아직 댓글이 없습니다.</p>
              <p className="text-gray-400 text-sm mt-1">첫 번째 댓글을 작성해보세요!</p>
            </div>
          )}

          {/* 페이지네이션 */}
          {parentComments.length > commentsPerPage && (
            <div className="flex justify-center pt-4 border-t border-gray-100">
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={commentsPerPage}
                totalItemsCount={parentComments.length}
                pageRangeDisplayed={3}
                onChange={(page: any) => setCurrentPage(page)}
                innerClass="flex gap-2"
                itemClass="px-3 py-1 rounded-xl cursor-pointer transition-all duration-200"
                activeClass="bg-purple-600 text-white font-semibold"
                linkClass="hover:bg-purple-100 hover:text-purple-600"
                disabledClass="opacity-50 cursor-not-allowed"
              />
            </div>
          )}
        </div>
      </CuteCard>

      {/* Alert */}
      <Alert
        message={alertMessage}
        onClose={() => setAlertMessage('')}
      />
    </div>
  );
}
