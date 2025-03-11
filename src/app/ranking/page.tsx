"use client";

import { useState } from "react";
import PeriodRanking from "@/app/ranking/components/PeriodRanking";

interface RankingItem {
  name: string;
  image: string;
}

interface Rankings {
  daily: Record<
    string,
    RankingItem[]
  >;
  weekly: Record<
    string,
    RankingItem[]
  >;
  monthly: Record<
    string,
    RankingItem[]
  >;
}

const dogRankings: Rankings = {
  daily: {
    Monday: [
      { name: "코코", image: "/images/coco.jpg" },
      { name: "바둑이", image: "/images/baduk.jpg" },
      { name: "초코", image: "/images/choco.jpg" },
    ],
    Tuesday: [
      { name: "흰둥이", image: "/images/whindung.jpg" },
      { name: "몽이", image: "/images/mong.jpg" },
      { name: "밤비", image: "/images/bambi.jpg" },
    ],
    Wednesday: [
      { name: "탄이", image: "/images/tani.jpg" },
      { name: "루이", image: "/images/lui.jpg" },
      { name: "바둑이", image: "/images/baduk.jpg" },
    ],
    Thursday: [
      { name: "초코", image: "/images/choco.jpg" },
      { name: "코코", image: "/images/coco.jpg" },
      { name: "흰둥이", image: "/images/whindung.jpg" },
    ],
    Friday: [
      { name: "밤비", image: "/images/bambi.jpg" },
      { name: "몽이", image: "/images/mong.jpg" },
      { name: "탄이", image: "/images/tani.jpg" },
    ],
    Saturday: [
      { name: "루이", image: "/images/lui.jpg" },
      { name: "바둑이", image: "/images/baduk.jpg" },
      { name: "코코", image: "/images/coco.jpg" },
    ],
    Sunday: [
      { name: "초코", image: "/images/choco.jpg" },
      { name: "흰둥이", image: "/images/whindung.jpg" },
      { name: "밤비", image: "/images/bambi.jpg" },
    ],
  },
  weekly: {
    "1주": [
      { name: "코코", image: "/images/coco.jpg" },
      { name: "바둑이", image: "/images/baduk.jpg" },
      { name: "초코", image: "/images/choco.jpg" },
    ],
    "2주": [
      { name: "흰둥이", image: "/images/whindung.jpg" },
      { name: "몽이", image: "/images/mong.jpg" },
      { name: "밤비", image: "/images/bambi.jpg" },
    ],
    "3주": [
      { name: "탄이", image: "/images/tani.jpg" },
      { name: "루이", image: "/images/lui.jpg" },
      { name: "바둑이", image: "/images/baduk.jpg" },
    ],
    "4주": [
      { name: "초코", image: "/images/choco.jpg" },
      { name: "코코", image: "/images/coco.jpg" },
      { name: "흰둥이", image: "/images/whindung.jpg" },
    ],
    "5주": [
      { name: "밤비", image: "/images/bambi.jpg" },
      { name: "몽이", image: "/images/mong.jpg" },
      { name: "탄이", image: "/images/tani.jpg" },
    ]
  },
  monthly: {
    "월": [
      { name: "코코", image: "/images/coco.jpg" },
      { name: "바둑이", image: "/images/baduk.jpg" },
      { name: "초코", image: "/images/choco.jpg" },
    ],
  },
};

const rankings: Record<"dog" | "cat", Rankings> = {
  dog: dogRankings,
  cat: JSON.parse(JSON.stringify(dogRankings)),
};

export default function RankingView() {
  const [category, setCategory] = useState<"dog" | "cat">("dog");

  return (
    <div className="p-6 global-wrapper">
      <h1 className="text-2xl font-bold text-center mb-6">랭킹 보기</h1>
      <div className="flex justify-center gap-4 mb-6">
        <button onClick={() => setCategory("dog")} className={`px-4 py-2 rounded-md ${category === "dog" ? "bg-blue-500 text-white" : "bg-gray-200"}`}>🐶 강아지</button>
        <button onClick={() => setCategory("cat")} className={`px-4 py-2 rounded-md ${category === "cat" ? "bg-blue-500 text-white" : "bg-gray-200"}`}>🐱 고양이</button>
      </div>

      <div className="flex flex-col gap-6">
        <PeriodRanking title="📅 일간 랭킹" rankings={rankings[category].daily} />
        <PeriodRanking title="📅 주간 랭킹" rankings={rankings[category].weekly} />
        <PeriodRanking title="📅 월간 랭킹" rankings={rankings[category].monthly} />
      </div>
    </div>
  );
}
