'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

interface AdSenseProps {
  adClient: string;
  adSlot?: string;
  adFormat?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal';
  fullWidthResponsive?: boolean;
  style?: React.CSSProperties;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export default function AdSense({
  adClient,
  adSlot,
  adFormat = 'auto',
  fullWidthResponsive = true,
  style = { display: 'block' },
}: AdSenseProps) {
  const isProduction = process.env.NODE_ENV === 'production';
  const pathname = usePathname();
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    // Only push to adsbygoogle in production mode
    if (!isProduction) return;

    try {
      if (typeof window !== 'undefined' && adRef.current) {
        // 페이지 전환 시마다 광고를 다시 로드
        const adElement = adRef.current;

        // 이미 로드된 광고인지 확인
        const isLoaded = adElement.getAttribute('data-adsbygoogle-status');

        if (!isLoaded) {
          // 광고 푸시
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      }
    } catch {
      // AdSense 로드 실패 무시
    }
  }, [isProduction, pathname]); // pathname을 의존성에 추가하여 페이지 전환 시 재실행

  // Show placeholder in development mode
  if (!isProduction) {
    return (
      <div
        style={{
          backgroundColor: '#f3f4f6',
          border: '2px dashed #d1d5db',
          borderRadius: '8px',
          padding: '40px 20px',
          textAlign: 'center',
          minHeight: '250px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          ...style,
        }}
      >
        <div style={{ fontSize: '32px' }}>📢</div>
        <div style={{ fontSize: '16px', fontWeight: '600', color: '#4b5563' }}>
          AdSense 광고 영역
        </div>
        <div style={{ fontSize: '12px', color: '#9ca3af' }}>
          (프로덕션에서만 표시됩니다)
        </div>
        {adSlot && (
          <div style={{ fontSize: '11px', color: '#d1d5db', marginTop: '8px' }}>
            adSlot: {adSlot}
          </div>
        )}
      </div>
    );
  }

  // Show actual AdSense in production
  return (
    <ins
      ref={adRef}
      className="adsbygoogle"
      style={style}
      data-ad-client={adClient}
      {...(adSlot && { 'data-ad-slot': adSlot })}
      data-ad-format={adFormat}
      data-full-width-responsive={fullWidthResponsive.toString()}
    />
  );
}
