'use client';
import Link from 'next/link';

import { useRouter } from 'next/navigation';

export default function Community() {
  const router = useRouter();
  const posts = [
    {
      id: 1,
      title: '오늘의 강아지 이야기',
      author: '강아지사랑',
      views: 120,
      likes: 30,
    },
    {
      id: 2,
      title: '고양이의 일상',
      author: '고양이러버',
      views: 85,
      likes: 22,
    },
    { id: 3, title: '반려동물 팁', author: '펫마스터', views: 150, likes: 45 },
  ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-left text-xl font-bold">인기 글</h2>
        <Link href="/community" className="text-[var(--color-theme-sky)] hover:underline">
          더보기 {' >'}
        </Link>
      </div>

      <ul className="list-none mt-4">
        {posts.map((post) => (
          <li
            key={post.id}
            className="p-3 border-b border-gray-300 cursor-pointer"
            onClick={() => router.push(`/community/${post.id}`)}
          >
            <div className="text-left text-lg font-semibold">{post.title}</div>
            <div className="flex gap-4 text-sm text-gray-500 mt-2">
              <span>👤 {post.author}</span>
              <span>👁️ {post.views}</span>
              <span>❤️ {post.likes}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
