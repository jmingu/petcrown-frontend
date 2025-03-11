import Image from 'next/image';

interface Pet {
  id: number;
  name: string;
  img: string;
  rank: number;
}

interface RankingProps {
  title: string;
  pets: Pet[];
}

export default function Ranking({ title, pets }: RankingProps) {
  return (
    <div className="text-center mt-8">
      <h3 className="text-xl font-bold">{title}</h3>
      <div className="flex justify-center items-end h-52 mt-12">
        {pets.map((pet) => (
          <div key={pet.id} className="flex flex-col items-center">
            <div className="text-yellow-500 text-lg">👑</div>{' '}
            {/* 왕관 아이콘 */}
            <Image
              src={pet.img}
              alt="이미지"
              className="w-20 h-20 rounded-full border-2 object-cover mb-6"
              width={80}
              height={80}
            />
            <div
              className={`w-20 flex flex-col justify-end items-center p-2 text-lg font-bold border-2 border-black ${
                pet.rank === 1
                  ? 'h-20'
                  : pet.rank === 2
                  ? 'h-16 border-r-0'
                  : 'h-12 border-l-0'
              }`}
            >
              <span>{pet.rank}등</span>
            </div>
            <div className="mt-2">{pet.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
