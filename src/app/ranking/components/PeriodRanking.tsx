import Image from "next/image";

interface RankingItem {
  name: string;
  image: string;
}

interface RankingProps {
  title: string;
  rankings: Record<string, RankingItem[]>; // 요일, 주차, 월간 등 다양한 텍스트를 지원
}

export default function PeriodRanking({ title, rankings }: RankingProps) {
	const rankingList = rankings[title] || [];
  const gridCols = Math.min(rankingList.length, 7); // 최대 7컬럼까지 제한
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className={`grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4`}>
        {Object.entries(rankings).map(([key, items]) => (
          <div key={key} className="border p-4 rounded-md shadow-md text-center">
            <h3 className="font-bold text-blue-500">{key}</h3>
            {items.map(({ name, image }, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <Image src={image} alt={name} width={120} height={120} className="rounded-full" />
                <p className="text-gray-700">{idx + 1}위: {name}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
