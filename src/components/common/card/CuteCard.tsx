'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CuteCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export default function CuteCard({
  children,
  className = '',
  hover = true,
  gradient = false,
  padding = 'md',
  onClick,
}: CuteCardProps) {
  const baseClasses = `
    relative rounded-3xl overflow-hidden
    ${gradient 
      ? 'bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50' 
      : 'bg-white'
    }
    shadow-lg border border-gray-100
    ${onClick ? 'cursor-pointer' : ''}
  `;

  const paddings = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const hoverAnimation = hover ? {
    whileHover: { 
      scale: 1.02,
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
    },
    transition: { duration: 0.2 }
  } : {};

  return (
    <motion.div
      className={`${baseClasses} ${paddings[padding]} ${className}`}
      onClick={onClick}
      {...hoverAnimation}
    >
      {/* 귀여운 장식 요소들 */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {/* 상단 좌측 작은 원들 */}
        <div className="absolute top-4 left-4 w-3 h-3 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full opacity-20"></div>
        <div className="absolute top-6 left-8 w-2 h-2 bg-gradient-to-r from-yellow-300 to-pink-300 rounded-full opacity-30"></div>
        
        {/* 하단 우측 작은 원들 */}
        <div className="absolute bottom-4 right-4 w-4 h-4 bg-gradient-to-r from-blue-300 to-cyan-300 rounded-full opacity-15"></div>
        <div className="absolute bottom-8 right-8 w-2 h-2 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full opacity-25"></div>
        
        {/* 미묘한 그래디언트 오버레이 */}
        {gradient && (
          <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-white/30 rounded-3xl"></div>
        )}
      </div>

      {/* 실제 콘텐츠 */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}