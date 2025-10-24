'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CuteCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glassmorphism?: boolean;
  gradient?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export default function CuteCard({
  children,
  className = '',
  hover = true,
  glassmorphism = false,
  gradient = false,
  padding = 'md',
  onClick,
}: CuteCardProps) {
  const baseClasses = `
    relative rounded-3xl overflow-hidden
    ${onClick ? 'cursor-pointer' : ''}
  `;

  const backgroundClasses = glassmorphism
    ? 'bg-white/70 backdrop-blur-xl border border-white/20 shadow-2xl'
    : gradient
    ? 'bg-gradient-to-br from-purple-50/80 via-pink-50/80 to-white/80 backdrop-blur-md border border-purple-100/50 shadow-xl'
    : 'bg-white border border-gray-100 shadow-lg';

  const paddings = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <motion.div
      className={`${baseClasses} ${backgroundClasses} ${paddings[padding]} ${className}`}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={hover ? {
        scale: 1.03,
        y: -4,
        boxShadow: '0 30px 60px -12px rgba(168, 85, 247, 0.25), 0 20px 40px -12px rgba(255, 128, 171, 0.15)',
      } : undefined}
      whileTap={hover ? { scale: 0.98 } : undefined}
    >
      {/* 글래스모피즘 효과를 위한 오버레이 */}
      {glassmorphism && (
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-purple-500/5 to-pink-500/10 pointer-events-none"></div>
      )}

      {/* 귀여운 장식 점들 */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        {/* 상단 좌측 */}
        <motion.div
          className="absolute top-4 left-4 w-3 h-3 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full opacity-30"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-6 left-10 w-2 h-2 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full opacity-40"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.6, 0.4]
          }}
          transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
        />

        {/* 상단 우측 */}
        <motion.div
          className="absolute top-3 right-6 w-2.5 h-2.5 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full opacity-35"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.35, 0.55, 0.35]
          }}
          transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
        />

        {/* 하단 우측 */}
        <motion.div
          className="absolute bottom-5 right-5 w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-25"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.25, 0.45, 0.25]
          }}
          transition={{ duration: 4, repeat: Infinity, delay: 1.5 }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-2 h-2 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full opacity-30"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 3, repeat: Infinity, delay: 2 }}
        />

        {/* 하단 좌측 */}
        <motion.div
          className="absolute bottom-4 left-8 w-2.5 h-2.5 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-30"
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 3.5, repeat: Infinity, delay: 0.8 }}
        />

        {/* 미묘한 그래디언트 빛 효과 */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-transparent to-purple-500/5 rounded-3xl"></div>
      </div>

      {/* 실제 콘텐츠 */}
      <div className="relative z-10">
        {children}
      </div>

      {/* hover 시 테두리 빛 효과 */}
      {hover && (
        <motion.div
          className="absolute inset-0 rounded-3xl border-2 border-transparent"
          whileHover={{
            borderColor: 'rgba(168, 85, 247, 0.3)',
          }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );
}
