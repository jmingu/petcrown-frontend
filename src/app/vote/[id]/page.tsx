"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const voteItems = [
  { id: 1, name: "코코", gender: "여", age: 3, type: "강아지", image: "/images/coco.jpg" },
  { id: 2, name: "바둑이", gender: "남", age: 5, type: "강아지", image: "/images/baduk.jpg" },
  { id: 3, name: "냥이", gender: "여", age: 2, type: "고양이", image: "/images/nyang.jpg" },
];

export default function VoteDetail() {
  const { id } = useParams();
  const [votes, setVotes] = useState(0);
  const item = voteItems.find((v) => v.id === Number(id));

  if (!item) {
    return <div className="text-center mt-10">해당 투표 항목을 찾을 수 없습니다.</div>;
  }

  const handleVote = () => {
    setVotes(votes + 1);
  };

  return (
    <div className="p-6 global-wrapper text-center">
      <div className="mt-4 flex justify-center">
        <Image
          src={item.image}
          alt={item.name}
          width={300}
          height={300}
          className="rounded-md border shadow-md"
        />
      </div>
      <h1 className="text-2xl font-bold mt-4">{item.name}</h1>
      <p className="text-gray-500">종류: {item.type}</p>
      <p className="text-gray-500">성별: {item.gender}</p>
      <p className="text-gray-500">나이: {item.age}살</p>
      <button
        onClick={handleVote}
        className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-md font-bold"
      >
        투표하기 ({votes})
      </button>
    </div>
  );
}
