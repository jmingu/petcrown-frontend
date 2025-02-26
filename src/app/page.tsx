import styles from '@/styles/page.module.scss';

export default function Home() {
  return (
    <div className={styles.dashboard}>
      <h1>펫 크라운 대시보드</h1>
      <p>반려동물 랭킹과 커뮤니티를 관리하는 페이지입니다..</p>
    </div>
  );
}
