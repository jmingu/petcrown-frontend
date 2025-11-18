'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function BackButton() {
  const searchParams = useSearchParams();

  // URL에서 페이지 정보 추출
  const fromPage = searchParams.get('from') || 'page-1';
  const pageNumber = fromPage.replace('page-', '');

  return (
    <Link
      href={`/vote?page=${pageNumber}`}
      className="inline-flex items-center text-purple-600 hover:text-purple-800 transition-colors duration-200"
    >
      ← 투표 목록으로 돌아가기
    </Link>
  );
}
