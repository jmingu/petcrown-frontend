'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import styles from '@/components/header/styles/header.module.scss';

const MENU_ITEMS = ['역대 랭킹', '투표하기', '커뮤니티', '공지사항'];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      {/* 모바일 햄버거 버튼 */}
      <button className={styles.hamburger} onClick={() => setIsMenuOpen(true)}>
        ☰
      </button>

      {/* 로고 (모바일에서는 가운데 정렬) */}
      <div className={styles.logo}>PetCrown</div>

      {/* 데스크톱 메뉴 */}
      <nav className={styles.nav}>
        {MENU_ITEMS.map((item) => (
          <a key={item} href="#">
            {item}
          </a>
        ))}
      </nav>

      {/* 로그인 버튼 */}
      <button className={styles.loginButton}>로그인</button>

      {/* 오버레이 및 사이드 메뉴 */}
      {isMenuOpen && (
        <div className={styles.overlay} onClick={() => setIsMenuOpen(false)} />
      )}
      <motion.div
        className={styles.sideMenu}
        initial={{ x: '-100%' }}
        animate={{ x: isMenuOpen ? 0 : '-100%' }}
        transition={{ type: 'tween', duration: 0.3 }}
      >
        <button
          className={styles.closeButton}
          onClick={() => setIsMenuOpen(false)}
        >
          ×
        </button>
        {MENU_ITEMS.map((item) => (
          <a key={item} href="#" onClick={() => setIsMenuOpen(false)}>
            {item}
          </a>
        ))}
        <button className={styles.mobileLogin}>로그인</button>
      </motion.div>
    </header>
  );
}
