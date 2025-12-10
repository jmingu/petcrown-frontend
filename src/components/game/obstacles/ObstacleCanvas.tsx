'use client';

import { useEffect, useRef } from 'react';

interface ObstacleCanvasProps {
  type: 'paw' | 'bone' | 'heart' | 'fish' | 'ball';
  size?: number;
}

// Phaser 게임과 100% 동일한 장애물을 Canvas로 렌더링
export default function ObstacleCanvas({ type, size = 80 }: ObstacleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 고해상도 지원
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    // 배경 투명
    ctx.clearRect(0, 0, size, size);

    // 중앙 좌표
    const centerX = size / 2;
    const centerY = size / 2;

    if (type === 'paw') {
      // 발바닥 - Phaser: circle(0, 5, 15) + 3 toes
      const color = '#ff6b9d';

      // 중앙 패드 (mainPad)
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(centerX, centerY + 5, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 3;
      ctx.stroke();

      // 발가락 3개
      const toes = [
        { x: centerX - 10, y: centerY - 8 },
        { x: centerX, y: centerY - 10 },
        { x: centerX + 10, y: centerY - 8 },
      ];

      toes.forEach(toe => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(toe.x, toe.y, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 3;
        ctx.stroke();
      });
    } else if (type === 'bone') {
      // 뼈다귀 - Phaser: rect(0,0,30,10) + 2 circles
      const color = '#ffd6a5';

      // 중앙 막대
      ctx.fillStyle = color;
      ctx.fillRect(centerX - 15, centerY - 5, 30, 10);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 3;
      ctx.strokeRect(centerX - 15, centerY - 5, 30, 10);

      // 왼쪽 원
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(centerX - 15, centerY, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 3;
      ctx.stroke();

      // 오른쪽 원
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(centerX + 15, centerY, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 3;
      ctx.stroke();
    } else if (type === 'heart') {
      // 하트 - Phaser: triangle(0, 15, -15, 0, 15, 0, 0, 20) + 2 circles
      const color = '#ffafcc';

      // Phaser triangle 형식: (x, y, x1, y1, x2, y2, x3, y3)
      // 실제 삼각형 좌표는 (0,15)를 중심으로 (-15, 0), (15, 0), (0, 20)
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(centerX - 15, centerY - 5); // 왼쪽 위
      ctx.lineTo(centerX + 15, centerY - 5); // 오른쪽 위
      ctx.lineTo(centerX, centerY + 15); // 아래 중앙
      ctx.closePath();
      ctx.fill();

      // 왼쪽 원
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(centerX - 8, centerY - 5, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 3;
      ctx.stroke();

      // 오른쪽 원
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(centerX + 8, centerY - 5, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 3;
      ctx.stroke();
    } else if (type === 'fish') {
      // 물고기 - Phaser: ellipse(0,0,35,20) + triangle + eye
      const color = '#a8dadc';

      // 몸통 (타원)
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, 17.5, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 3;
      ctx.stroke();

      // 꼬리 (삼각형) - Phaser: triangle(15, 0, 15, -12, 15, 12, 25, 0)
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(centerX + 15, centerY - 12);
      ctx.lineTo(centerX + 15, centerY + 12);
      ctx.lineTo(centerX + 25, centerY);
      ctx.closePath();
      ctx.fill();

      // 눈
      ctx.fillStyle = '#2b2d42';
      ctx.beginPath();
      ctx.arc(centerX - 8, centerY - 3, 3, 0, Math.PI * 2);
      ctx.fill();
    } else if (type === 'ball') {
      // 공 - Phaser: circle(0,0,20) + pattern
      const color = '#cdb4db';

      // 공 본체
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
      ctx.fill();

      // 공 무늬 (외곽선)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
      ctx.stroke();

      // 곡선 무늬 - Phaser: arc(0, 0, 20, -Math.PI / 4, Math.PI / 4)
      ctx.beginPath();
      ctx.arc(centerX, centerY, 20, -Math.PI / 4, Math.PI / 4, false);
      ctx.stroke();
    }
  }, [type, size]);

  return <canvas ref={canvasRef} className="inline-block" />;
}
