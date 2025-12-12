'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import AdSense from '@/components/common/adsense/AdSense';

interface PetDodgeGameProps {
  petImageUrl: string;
  onGameOver: (score: number) => void;
}

export default function PetDodgeGame({ petImageUrl, onGameOver }: PetDodgeGameProps) {
  const gameRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID || '';

  useEffect(() => {
    let mounted = true;

    // 모바일 감지
    setIsMobile(window.innerWidth < 768);

    // Phaser를 동적으로 불러오기 (SSR 방지)
    const initGame = async () => {
      if (!containerRef.current) return;

      try {
        const Phaser = (await import('phaser')).default;
        const PlayScene = (await import('./scenes/PlayScene')).default;

        if (!mounted) return;

        // 게임 캔버스 크기 설정 (비율 유지)
        // 항상 800x600 캔버스를 생성하고 스케일링으로 화면에 맞춤
        const gameWidth = 800;
        const gameHeight = 600;

        // 게임 설정
        const config: any = {
          type: Phaser.AUTO,
          parent: containerRef.current,
          width: gameWidth,
          height: gameHeight,
          backgroundColor: '#f0e6ff',
          physics: {
            default: 'arcade',
            arcade: {
              gravity: { x: 0, y: 0 },
              debug: false,
            },
          },
          scene: PlayScene,
          scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            parent: containerRef.current,
            width: gameWidth,
            height: gameHeight,
          },
        };

        // 게임 인스턴스 생성
        gameRef.current = new Phaser.Game(config);

        // Scene이 시작되면 이벤트 리스너 등록
        gameRef.current.events.once('ready', () => {
          const playScene = gameRef.current.scene.getScene('PlayScene');

          if (playScene) {
            playScene.events.on('gameOver', (score: number) => {
              onGameOver(score);
            });
          }
        });

        // Scene에 데이터 전달
        gameRef.current.scene.start('PlayScene', { petImageUrl });

        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };

    initGame();

    // 클린업
    return () => {
      mounted = false;
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [petImageUrl, onGameOver]);

  const handleLeftPress = () => {
    if (gameRef.current) {
      const playScene = gameRef.current.scene.getScene('PlayScene');
      if (playScene) {
        playScene.setMobileDirection('left');
      }
    }
  };

  const handleRightPress = () => {
    if (gameRef.current) {
      const playScene = gameRef.current.scene.getScene('PlayScene');
      if (playScene) {
        playScene.setMobileDirection('right');
      }
    }
  };

  const handleRelease = () => {
    if (gameRef.current) {
      const playScene = gameRef.current.scene.getScene('PlayScene');
      if (playScene) {
        playScene.setMobileDirection('none');
      }
    }
  };

  return (
    <div className="w-full flex items-center justify-center p-2 relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-purple-600 font-semibold">게임 로딩 중...</p>
          </div>
        </div>
      )}

      <div
        ref={containerRef}
        className="rounded-3xl shadow-2xl overflow-hidden border-4 border-purple-300 w-full"
        style={{ maxWidth: '800px', aspectRatio: '4/3' }}
      />
    </div>
  );
}
