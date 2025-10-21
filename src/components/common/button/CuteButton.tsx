'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CuteButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'cute' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  icon?: ReactNode;
  loading?: boolean;
}

export default function CuteButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  icon,
  loading = false,
}: CuteButtonProps) {
  const baseClasses = `
    relative inline-flex items-center justify-center font-bold rounded-2xl
    transition-all duration-300 transform-gpu
    focus:outline-none focus:ring-4 focus:ring-offset-2
    disabled:cursor-not-allowed disabled:opacity-50 disabled:transform-none
  `;

  const variants = {
    primary: `
      bg-purple-500 hover:bg-purple-600
      text-white shadow-md hover:shadow-lg
      focus:ring-purple-300
    `,
    secondary: `
      bg-gray-200 hover:bg-gray-300
      text-gray-800 shadow-md hover:shadow-lg
      focus:ring-gray-300
    `,
    cute: `
      bg-pink-500 hover:bg-pink-600
      text-white shadow-md hover:shadow-lg
      focus:ring-pink-300
    `,
    danger: `
      bg-red-500 hover:bg-red-600
      text-white shadow-md hover:shadow-lg
      focus:ring-red-300
    `,
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      whileHover={!disabled && !loading ? { scale: 1.05 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.95 } : {}}
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
        </div>
      )}
      
      <div className={`flex items-center justify-center ${loading ? 'opacity-0' : ''} ${icon ? 'gap-2' : ''}`}>
        {icon && <span>{icon}</span>}
        <span>{children}</span>
      </div>

      {/* 귀여운 효과를 위한 배경 요소들 */}
      <div className="absolute inset-0 rounded-2xl opacity-20">
        <div className="absolute top-1 left-2 w-2 h-2 bg-white rounded-full opacity-60"></div>
        <div className="absolute bottom-2 right-3 w-1 h-1 bg-white rounded-full opacity-40"></div>
      </div>
    </motion.button>
  );
}