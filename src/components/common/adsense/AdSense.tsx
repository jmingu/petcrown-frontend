'use client';

import { useEffect } from 'react';

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

  useEffect(() => {
    // Only push to adsbygoogle in production mode
    if (!isProduction) return;

    try {
      if (typeof window !== 'undefined') {
        const adElements = document.querySelectorAll('.adsbygoogle');
        const hasAds = Array.from(adElements).some((el) => el.getAttribute('data-adsbygoogle-status'));

        if (!hasAds) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, [isProduction]);

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
      className="adsbygoogle"
      style={style}
      data-ad-client={adClient}
      {...(adSlot && { 'data-ad-slot': adSlot })}
      data-ad-format={adFormat}
      data-full-width-responsive={fullWidthResponsive.toString()}
    />
  );
}
