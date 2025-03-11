"use client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Comment from "@/app/community/commponents/Comment"; // 댓글 컴포넌트 추가

const allPosts = [
  { id: 1, title: "강아지 산책 꿀팁", author: "멍멍이", date: "2025-03-10", views: 120, likes: 30, content: "강아지를 산책할 때 중요한 팁입니다..." },
  { id: 2, title: "고양이 캣타워 추천", author: "냐옹이", date: "2025-03-09", views: 85, likes: 22, content: "고양이에게 적합한 캣타워를 추천합니다..." },
  { id: 3, title: "반려동물 건강 관리법", author: "펫러버", date: "2025-03-08", views: 150, likes: 45, content: "반려동물 건강을 위해 신경 써야 할 것들..." },
];

export default function PostDetail() {
  const router = useRouter();
  const params = useParams();
  const post = allPosts.find(p => p.id === Number(params.id));
  const [likes, setLikes] = useState(post?.likes || 0);
  const [liked, setLiked] = useState(false);

  if (!post) {
    return <div className="text-center mt-10">해당 게시글을 찾을 수 없습니다.</div>;
  }

  const handleLike = () => {
    if (!liked) {
      setLikes(likes + 1);
      setLiked(true);
    }
  };

  return (
    <div className="global-wrapper p-4">
      <h1 className="text-2xl font-bold mt-4">{post.title}</h1>
      <p className="text-gray-500 text-sm mt-4">👤 {post.author} ・ 📅 {post.date} ・ 👁️ {post.views} ・ ❤️ {likes}</p>
      <div className="mt-4 p-4 rounded-md bg-gray-50">{post.content}</div>

      {/* 좋아요 버튼 */}
      <div className="flex justify-center mt-6">
        <button 
          className={`px-6 py-2 rounded-lg text-white ${liked ? "bg-gray-400" : "bg-red-500 hover:bg-red-600"}`}
          onClick={handleLike}
          disabled={liked}
        >
          ❤️ 좋아요 {likes}
        </button>
      </div>
    </div>
  );
}
