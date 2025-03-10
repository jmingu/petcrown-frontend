import "./globals.css";
import Header from "@/components/layout/header/Header"
import Footer from '@/components/layout/footer/Footer';
import { Noto_Sans_KR } from 'next/font/google';

// 폰트 설정
const notoSans = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '700'], // 사용할 굵기 지정
  display: 'swap',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${notoSans.className} bg-white text-black`}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
