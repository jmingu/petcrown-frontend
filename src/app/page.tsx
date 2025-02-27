import styles from '@/styles/page.module.scss';
import Ranking from '@/components/ranking/Ranking';

const dogRanking = [
  { id: 2, name: '코코', img: '/pets/coco.jpg', rank: 2 },
  { id: 1, name: '바둑이', img: '/pets/badugi.jpg', rank: 1 },
  { id: 3, name: '몽이', img: '/pets/mong.jpg', rank: 3 },
];

const catRanking = [
  { id: 2, name: '냐옹이', img: '/pets/nyaong.jpg', rank: 2 },
  { id: 1, name: '냥냥', img: '/pets/nyang.jpg', rank: 1 },
  { id: 3, name: '미옹', img: '/pets/miyong.jpg', rank: 3 },
];

export default function Home() {
  return (
    <div className={styles.dashboard}>
      <h1>펫 크라운 대시보드</h1>
      <p>반려동물 랭킹과 커뮤니티를 관리하는 페이지입니다.</p>

      <div className={styles.rankings}>
        <Ranking title="🐶 강아지 랭킹" pets={dogRanking} />
        <Ranking title="🐱 고양이 랭킹" pets={catRanking} />
      </div>
    </div>
  );
}
