"use client";
import { useState } from "react";
import Pagination from "react-js-pagination";

interface Comment {
  id: number;
  parentId: number | null;
  author: string;
  content: string;
  date: string;
}

const dummyComments: Comment[] = [
  { id: 1, parentId: null, author: "사용자1", content: "좋은 글이네요!", date: "2025-03-10" },
  { id: 2, parentId: 1, author: "작성자", content: "감사합니다!", date: "2025-03-10" },
  { id: 3, parentId: null, author: "사용자2", content: "강아지 산책할 때 조심해야 할 점은?", date: "2025-03-11" },
  { id: 4, parentId: 3, author: "사용자1", content: "도로에서 리드 줄을 꼭 잡아주세요!", date: "2025-03-11" },
];

const commentsPerPage = 5;

export default function Comment({ postId }: { postId: number }) {
  const [comments, setComments] = useState<Comment[]>(dummyComments);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const handleAddComment = (parentId: number | null, text: string) => {
    if (text.trim() === "") return;

    const newId = comments.length + 1;
    const newCommentObj: Comment = {
      id: newId,
      parentId,
      author: "나",
      content: text,
      date: new Date().toISOString().split("T")[0],
    };

    setComments([...comments, newCommentObj]);

    if (parentId) {
      setReplyingTo(null);
      setReplyText("");
    } else {
      setNewComment("");
    }
  };

  const parentComments = comments.filter(comment => comment.parentId === null);
  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = parentComments.slice(indexOfFirstComment, indexOfLastComment);

  return (
    <div className="mt-8 p-4 border-t border-gray-300">
      <h2 className="text-lg font-bold mb-4">💬 댓글 ({comments.length})</h2>

      <div className="flex gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1 border rounded-md p-2"
          placeholder="댓글을 입력하세요..."
        />
        <button onClick={() => handleAddComment(null, newComment)} className="bg-blue-500 text-white px-4 py-2 rounded-md">
          등록
        </button>
      </div>

      <ul className="mt-4">
        {currentComments.map(comment => (
          <li key={comment.id} className="border-b border-gray-300 py-2">
            <p className="font-medium">{comment.author} <span className="text-gray-500 text-sm">({comment.date})</span></p>
            <p className="ml-4">{comment.content}</p>

            <button
              onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
              className="text-sm text-blue-500 mt-1 ml-4"
            >
              {replyingTo === comment.id ? "취소" : "답글 달기"}
            </button>

            {replyingTo === comment.id && (
              <div className="ml-6 mt-2 flex gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 border rounded-md p-2"
                  placeholder="답글을 입력하세요..."
                />
                <button
                  onClick={() => handleAddComment(comment.id, replyText)}
                  className="bg-green-500 text-white px-4 py-2 rounded-md"
                >
                  등록
                </button>
              </div>
            )}

            {comments
              .filter(reply => reply.parentId === comment.id)
              .map(reply => (
                <div key={reply.id} className="ml-4 pl-2 mt-2 flex">
									<div className="pr-2">
										<p>└</p>
									</div>
									<div>
										<p className="font-medium">{reply.date}</p>
										<p>{reply.content}</p>
									</div>
                </div>
              ))}
          </li>
        ))}
      </ul>

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
    </div>
  );
}
