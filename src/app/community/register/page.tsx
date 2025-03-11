"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CommunityWrite() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !author.trim() || !content.trim()) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    // 🔹 임시로 콘솔에 게시글 데이터 출력 (실제 API 연동 필요)
    console.log({ title, author, content, date: new Date().toISOString().split("T")[0] });

    alert("게시글이 등록되었습니다.");
    router.push("/community"); // 등록 후 커뮤니티 목록으로 이동
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">글 작성</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded p-2"
            placeholder="제목을 입력하세요"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">작성자</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full border rounded p-2"
            placeholder="이름을 입력하세요"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">내용</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border rounded p-2 h-40"
            placeholder="내용을 입력하세요"
          />
        </div>
        <div className="flex gap-4">
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">등록</button>
          <button type="button" onClick={() => router.back()} className="px-4 py-2 bg-gray-400 text-white rounded">
            취소
          </button>
        </div>
      </form>
    </div>
  );
}
