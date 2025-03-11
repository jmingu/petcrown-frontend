"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Pagination from "react-js-pagination";

import Link from 'next/link';

const tabs = ["전체", "강아지", "고양이", "토끼", "햄스터", "파충류", "기타"];
const postsPerPage = 5; //한 페이지당 5개의 게시물을 표시

export default function CommunityBoard() {
  const [currentTab, setCurrentTab] = useState("전체");
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  const allPosts = [
    { id: 1, title: "강아지 산책 꿀팁", author: "멍멍이", date: "2025-03-10", views: 120, likes: 30 },
    { id: 2, title: "고양이 캣타워 추천", author: "냐옹이", date: "2025-03-09", views: 85, likes: 22 },
    { id: 3, title: "반려동물 건강 관리법", author: "펫러버", date: "2025-03-08", views: 150, likes: 45 },
    { id: 4, title: "토끼 키우기 가이드", author: "토순이", date: "2025-03-07", views: 95, likes: 15 },
    { id: 5, title: "햄스터 집 추천", author: "햄찌", date: "2025-03-06", views: 60, likes: 10 },
    { id: 6, title: "파충류 키우는 법", author: "파충이", date: "2025-03-05", views: 40, likes: 5 },
    { id: 7, title: "강아지 훈련법", author: "도그마스터", date: "2025-03-04", views: 130, likes: 25 },
    { id: 8, title: "고양이 사료 추천", author: "냥이덕후", date: "2025-03-03", views: 75, likes: 20 },
    { id: 9, title: "반려동물과 여행하는 법", author: "펫트래블러", date: "2025-03-02", views: 110, likes: 35 },
    { id: 10, title: "강아지 목욕 시 주의할 점", author: "멍순이", date: "2025-03-01", views: 90, likes: 18 },
    { id: 11, title: "고양이 화장실 청소법", author: "집사1호", date: "2025-02-29", views: 65, likes: 12 },
    { id: 12, title: "햄스터 운동용품 추천", author: "햄찌러버", date: "2025-02-28", views: 55, likes: 8 },
    { id: 13, title: "토끼 먹이 추천", author: "토끼맘", date: "2025-02-27", views: 70, likes: 14 },
    { id: 14, title: "파충류 온도 관리법", author: "도마뱀러버", date: "2025-02-26", views: 35, likes: 6 },
    { id: 15, title: "반려동물 보험 추천", author: "펫케어", date: "2025-02-25", views: 115, likes: 28 },
    { id: 16, title: "강아지 간식 추천", author: "댕댕이", date: "2025-02-24", views: 125, likes: 38 },
    { id: 17, title: "고양이 장난감 추천", author: "캣러버", date: "2025-02-23", views: 80, likes: 16 },
    { id: 18, title: "강아지 산책 코스 추천", author: "도그워커", date: "2025-02-22", views: 100, likes: 22 },
    { id: 19, title: "반려동물 호텔 이용 후기", author: "펫여행자", date: "2025-02-21", views: 95, likes: 20 },
    { id: 20, title: "햄스터 스트레스 줄이는 법", author: "햄찌맘", date: "2025-02-20", views: 45, likes: 7 },
    { id: 21, title: "강아지 건강 체크 리스트", author: "견주", date: "2025-02-19", views: 140, likes: 40 },
    { id: 22, title: "고양이 이갈이 시기 대처법", author: "냥집사", date: "2025-02-18", views: 77, likes: 15 },
    { id: 23, title: "토끼 배변 훈련하기", author: "토끼보호자", date: "2025-02-17", views: 85, likes: 17 },
    { id: 24, title: "파충류 사육장 만들기", author: "사육왕", date: "2025-02-16", views: 50, likes: 9 },
    { id: 25, title: "강아지 털 관리법", author: "펫그루머", date: "2025-02-15", views: 105, likes: 24 },
    { id: 26, title: "고양이 물 안 먹을 때 대처법", author: "수의사", date: "2025-02-14", views: 90, likes: 19 },
    { id: 27, title: "반려동물 장수 비결", author: "장수펫", date: "2025-02-13", views: 135, likes: 33 },
    { id: 28, title: "토끼 외출할 때 주의사항", author: "토끼마스터", date: "2025-02-12", views: 65, likes: 12 },
    { id: 29, title: "강아지와 놀아주는 방법", author: "댕댕놀이터", date: "2025-02-11", views: 120, likes: 27 },
    { id: 30, title: "햄스터 먹이 종류 정리", author: "햄찌사랑", date: "2025-02-10", views: 55, likes: 8 },
    { id: 31, title: "고양이 낮잠 루틴", author: "낮잠냥이", date: "2025-02-09", views: 75, likes: 14 },
    { id: 32, title: "강아지 유치 빠지는 시기", author: "치아건강", date: "2025-02-08", views: 95, likes: 20 },
    { id: 33, title: "파충류 먹이 추천", author: "파충류매니아", date: "2025-02-07", views: 42, likes: 6 }
  ];
  

  // 🔥 조회수 기준으로 상위 3개 핫글 추출
  const hotPosts = [...allPosts]
    .sort((a, b) => b.views - a.views) // 조회수 내림차순 정렬
    .slice(0, 3);

  // 🔹 현재 선택된 탭의 일반 게시글 필터링 (핫글 제외)
  const filteredPosts = currentTab === "전체"
    ? allPosts.filter(post => !hotPosts.includes(post))
    : allPosts.filter(post => post.title.includes(currentTab) && !hotPosts.includes(post));

  // 🔹 현재 페이지 게시글 추출
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <div className="global-wrapper mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">커뮤니티</h1>
      <div className="flex justify-end mb-4">
        <Link href="/community/register">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            등록
          </button>
        </Link>
      </div>
      {/* 🔹 탭 메뉴 */}
      <div className="overflow-x-auto whitespace-nowrap scrollbar-hide">
        <div className="flex gap-4 pb-2">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => { setCurrentTab(tab); setCurrentPage(1); }}
              className={`px-4 py-2 text-sm font-medium rounded-t-md ${
                currentTab === tab ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* 🔥 인기 핫글 (상위 3개) */}
      <div className="mt-6 pt-4">
        <ul>
          {hotPosts.map(post => (
            <li
              key={post.id}
              className="flex justify-between items-center border-b border-gray-300 py-3 cursor-pointer hover:bg-gray-100"
              onClick={() => router.push(`/community/${post.id}`)}
            >
              <div className="text-left">
                <h3 className="text-lg font-medium">🔥 {post.title}</h3>
                <p className="text-sm text-gray-500">👤 {post.author} ・ 📅 {post.date}</p>
              </div>
              <div className="flex items-center gap-3 text-gray-500 text-sm">
                <span>👁️ {post.views}</span>
                <span>❤️ {post.likes}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* 🔹 일반 게시글 목록 */}
      <ul>
        {currentPosts.map(post => (
          <li
            key={post.id}
            className="flex justify-between items-center border-b border-gray-300 py-3 cursor-pointer hover:bg-gray-100"
            onClick={() => router.push(`/community/${post.id}`)}
          >
            <div className="text-left">
              <h3 className="text-lg font-medium">{post.title}</h3>
              <p className="text-sm text-gray-500">👤 {post.author} ・ 📅 {post.date}</p>
            </div>
            <div className="flex items-center gap-3 text-gray-500 text-sm">
              <span>👁️ {post.views}</span>
              <span>❤️ {post.likes}</span>
            </div>
          </li>
        ))}
      </ul>

      {/* 🔹 페이지네이션 */}
      <div className="flex justify-center mt-6">
        <Pagination
          activePage={currentPage}
          itemsCountPerPage={postsPerPage} // 한 페이지당 표시할 게시물 수
          totalItemsCount={filteredPosts.length} // 전체 게시물 개수 기준으로 페이지네이션 계산
          pageRangeDisplayed={3} // 한 번에 표시되는 페이지 번호 개수는 3개
          onChange={(page: any) => setCurrentPage(page)} // 페이지 변경 시 상태 업데이트
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
