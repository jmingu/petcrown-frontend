import '@/styles/layout.module.scss';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import { Noto_Sans_KR } from 'next/font/google';
// 폰트 설정
const notoSans = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '700'], // 사용할 굵기 지정
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={`${notoSans.className} bodyContainer`}>
        <Header />
        <main className="content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
