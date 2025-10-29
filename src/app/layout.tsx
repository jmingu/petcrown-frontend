import type { Metadata } from 'next';
import "./globals.css";
import Script from 'next/script';
import Header from "@/components/layout/header/Header"
import Footer from '@/components/layout/footer/Footer';

export const metadata: Metadata = {
  title: '펫크라운 - 반려동물 투표 & 커뮤니티',
  description: '사랑스러운 우리 반려동물을 자랑하고 투표에 참여하세요! 주간 랭킹, 커뮤니티, 이벤트 등 다양한 혜택이 가득합니다.',
  keywords: ['반려동물', '펫', '투표', '랭킹', '커뮤니티', '강아지', '고양이', 'pet', 'petcrown'],
  authors: [{ name: 'PetCrown' }],
  creator: 'PetCrown',
  publisher: 'PetCrown',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: '/',
    siteName: '펫크라운',
    title: '펫크라운 - 우리 반려동물이 세상에서 제일 귀여워요! 💕',
    description: '반려동물 사진을 공유하고 투표하세요! 이메일 인증으로 1표, 회원가입 후 1표 더! 주간 랭킹 1위에 도전하세요! 🏆',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: '펫크라운 - 반려동물 투표 플랫폼',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '펫크라운 - 반려동물 투표 & 커뮤니티',
    description: '우리 반려동물이 세상에서 제일 귀여워요! 투표하고, 공유하고, 함께 소통해보세요 🐾',
    images: ['/opengraph-image.png'],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code', // Google Search Console에서 받은 코드로 교체
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  return (
    <html lang="ko">
      <head>
        {/* Google AdSense */}
        {adsenseId && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body className="bg-white text-black font-noto-sans-kr">
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
