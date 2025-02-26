import styles from '@/components/Header/Header.module.scss';

export default function Header() {
  return (
    <header className={styles.header}>
      <h1>🐾 PetCrown Dashboard</h1>
      <nav>
        <ul>
          <li>
            <a href="/dashboard">대시보드</a>
          </li>
          <li>
            <a href="/ranking">랭킹</a>
          </li>
          <li>
            <a href="/profile">프로필</a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
