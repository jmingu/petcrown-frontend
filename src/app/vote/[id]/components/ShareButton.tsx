'use client';

import { useState } from 'react';
import { Share2, Copy, Check } from 'lucide-react';

interface ShareButtonProps {
  url: string;
  title: string;
  description: string;
  variant?: 'button' | 'text';
}

export default function ShareButton({ 
  url, 
  title, 
  description, 
  variant = 'button' 
}: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url,
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('공유 실패:', error);
        }
      }
    } else {
      setIsOpen(!isOpen);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('클립보드 복사 실패:', error);
    }
  };

  const shareToKakao = () => {
    if (typeof window !== 'undefined' && (window as any).Kakao) {
      (window as any).Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: title,
          description: description,
          imageUrl: '', // 펫 이미지 URL
          link: {
            mobileWebUrl: url,
            webUrl: url,
          },
        },
      });
    }
  };

  if (variant === 'text') {
    return (
      <div className="relative">
        <button 
          onClick={handleShare}
          className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-purple-600 transition-colors duration-200"
        >
          <Share2 className="w-5 h-5" />
          <span>공유하기</span>
        </button>
        
        {isOpen && !navigator.share && (
          <div className="absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-lg border p-3 min-w-48 z-50">
            <div className="space-y-2">
              <button
                onClick={copyToClipboard}
                className="w-full flex items-center space-x-2 px-3 py-2 hover:bg-gray-50 rounded-lg text-left"
              >
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                <span className={copied ? 'text-green-600' : ''}>
                  {copied ? '복사됨!' : '링크 복사'}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={handleShare}
        className="bg-white/80 backdrop-blur-sm hover:bg-white/90 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
      >
        <Share2 className="w-6 h-6 text-gray-700" />
      </button>

      {isOpen && !navigator.share && (
        <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border p-3 min-w-48 z-50">
          <div className="space-y-2">
            <button
              onClick={copyToClipboard}
              className="w-full flex items-center space-x-2 px-3 py-2 hover:bg-gray-50 rounded-lg text-left"
            >
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              <span className={copied ? 'text-green-600' : ''}>
                {copied ? '복사됨!' : '링크 복사'}
              </span>
            </button>
            
            {/* 카카오톡 공유 (실제 구현시) */}
            {/* 
            <button
              onClick={shareToKakao}
              className="w-full flex items-center space-x-2 px-3 py-2 hover:bg-gray-50 rounded-lg text-left"
            >
              <span className="text-yellow-500">💬</span>
              <span>카카오톡</span>
            </button>
            */}
          </div>
        </div>
      )}
    </div>
  );
}