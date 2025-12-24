'use client';

import { useState } from 'react';
import { Share2, Copy, Check } from 'lucide-react';

interface GameShareButtonProps {
  nickname: string;
  score: number;
  variant?: 'button' | 'icon';
}

export default function GameShareButton({
  nickname,
  score,
  variant = 'button'
}: GameShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const timestamp = Date.now();
  const shareUrl = `${baseUrl}/game?nickname=${encodeURIComponent(nickname)}&t=${timestamp}`;
  const title = '펫크라운 게임 도전장! 🎮';
  const description = `${nickname}님의 ${score.toFixed(1)}초 기록을 넘어보세요!`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: shareUrl,
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          // 공유 취소가 아닌 실제 에러만 처리
        }
      }
    } else {
      setIsOpen(!isOpen);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      // 복사 실패 처리
    }
  };

  if (variant === 'icon') {
    return (
      <div className="relative">
        <button
          onClick={handleShare}
          className="p-2 rounded-full bg-purple-100 hover:bg-purple-200 transition-colors duration-200"
          title="공유하기"
        >
          <Share2 className="w-5 h-5 text-purple-600" />
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
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative inline-block w-full">
      <button
        onClick={handleShare}
        className="w-full px-6 py-3 bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200"
      >
        <div className="flex items-center justify-center space-x-2">
          <Share2 className="w-5 h-5" />
          <span>도전장 보내기</span>
        </div>
      </button>

      {isOpen && !navigator.share && (
        <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border p-3 min-w-48 z-50 w-full">
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
