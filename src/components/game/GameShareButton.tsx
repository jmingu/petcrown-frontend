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
  const description = `${nickname}님의 ${score}점을 넘어보세요!`;

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
      setTimeout(() => {
        setCopied(false);
        setIsOpen(false);
      }, 2000);
    } catch (error) {
      // 복사 실패 처리
    }
  };

  const shareToKakao = () => {
    if (typeof window !== 'undefined' && (window as any).Kakao) {
      (window as any).Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: title,
          description: description,
          imageUrl: `${baseUrl}/logo.svg`,
          link: {
            mobileWebUrl: shareUrl,
            webUrl: shareUrl,
          },
        },
        buttons: [
          {
            title: '게임하러 가기',
            link: {
              mobileWebUrl: shareUrl,
              webUrl: shareUrl,
            },
          },
        ],
      });
    } else {
      alert('카카오톡 공유 기능을 사용할 수 없습니다.');
    }
  };

  const shareToFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  };

  const shareToTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(description)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
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
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 p-2 min-w-48 z-50">
              <div className="space-y-1">
                <button
                  onClick={copyToClipboard}
                  className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-gray-50 rounded-lg text-left transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-600" />}
                  <span className={`text-sm ${copied ? 'text-green-600 font-medium' : 'text-gray-700'}`}>
                    {copied ? '복사완료!' : '링크 복사'}
                  </span>
                </button>

                <button
                  onClick={shareToKakao}
                  className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-yellow-50 rounded-lg text-left transition-colors"
                >
                  <span className="text-xl">💬</span>
                  <span className="text-sm text-gray-700">카카오톡</span>
                </button>

                <button
                  onClick={shareToFacebook}
                  className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-blue-50 rounded-lg text-left transition-colors"
                >
                  <span className="text-xl">📘</span>
                  <span className="text-sm text-gray-700">페이스북</span>
                </button>

                <button
                  onClick={shareToTwitter}
                  className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-sky-50 rounded-lg text-left transition-colors"
                >
                  <span className="text-xl">🐦</span>
                  <span className="text-sm text-gray-700">트위터</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={handleShare}
        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-md hover:shadow-lg"
      >
        <Share2 className="w-5 h-5" />
        <span className="font-medium">도전장 보내기</span>
      </button>

      {isOpen && !navigator.share && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 p-3 min-w-64 z-50">
            <div className="space-y-2">
              <button
                onClick={copyToClipboard}
                className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 rounded-lg text-left transition-colors"
              >
                {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5 text-gray-600" />}
                <span className={copied ? 'text-green-600 font-medium' : 'text-gray-700'}>
                  {copied ? '링크가 복사되었습니다!' : '링크 복사'}
                </span>
              </button>

              <button
                onClick={shareToKakao}
                className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-yellow-50 rounded-lg text-left transition-colors"
              >
                <span className="text-2xl">💬</span>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">카카오톡</div>
                  <div className="text-xs text-gray-500">친구에게 도전장 보내기</div>
                </div>
              </button>

              <button
                onClick={shareToFacebook}
                className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-blue-50 rounded-lg text-left transition-colors"
              >
                <span className="text-2xl">📘</span>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">페이스북</div>
                  <div className="text-xs text-gray-500">페이스북에 공유하기</div>
                </div>
              </button>

              <button
                onClick={shareToTwitter}
                className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-sky-50 rounded-lg text-left transition-colors"
              >
                <span className="text-2xl">🐦</span>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">트위터</div>
                  <div className="text-xs text-gray-500">트위터에 공유하기</div>
                </div>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
