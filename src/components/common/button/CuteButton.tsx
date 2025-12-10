'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CuteButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'cute' | 'danger' | 'accent' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'xl';
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
    relative inline-flex items-center justify-center font-bold rounded-3xl
    transition-all duration-300 transform-gpu
    focus:outline-none focus:ring-4 focus:ring-offset-2
    disabled:cursor-not-allowed disabled:opacity-50 disabled:transform-none
    active:scale-95
  `;

  const variants = {
    primary: `
      bg-gradient-to-r from-pink-400 to-purple-400
      hover:from-pink-500 hover:to-purple-500
      text-white shadow-lg hover:shadow-xl
      focus:ring-pink-300
    `,
    secondary: `
      bg-gradient-to-r from-purple-300 to-purple-400
      hover:from-purple-400 hover:to-purple-500
      text-white shadow-lg hover:shadow-xl
      focus:ring-purple-300
    `,
    cute: `
      bg-gradient-to-r from-pink-400 via-pink-500 to-rose-500
      hover:from-pink-500 hover:via-pink-600 hover:to-rose-600
      text-white shadow-lg hover:shadow-xl
      focus:ring-pink-300
    `,
    danger: `
      bg-gradient-to-r from-red-400 to-rose-500
      hover:from-red-500 hover:to-rose-600
      text-white shadow-lg hover:shadow-xl
      focus:ring-red-300
    `,
    accent: `
      bg-gradient-to-r from-emerald-400 to-teal-400
      hover:from-emerald-500 hover:to-teal-500
      text-white shadow-lg hover:shadow-xl
      focus:ring-emerald-300
    `,
    success: `
      bg-gradient-to-r from-green-400 to-emerald-500
      hover:from-green-500 hover:to-emerald-600
      text-white shadow-lg hover:shadow-xl
      focus:ring-green-300
    `,
  };

  const sizes = {
    sm: 'px-5 py-2.5 text-sm',
    md: 'px-7 py-3.5 text-base',
    lg: 'px-10 py-4 text-lg',
    xl: 'px-8 py-4 text-base md:px-12 md:py-5 md:text-xl',
  };

  return (
    <motion.button
      whileHover={!disabled && !loading ? { scale: 1.05, y: -2 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.95 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
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
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="rounded-full h-5 w-5 border-3 border-white border-t-transparent"
          />
        </div>
      )}

      <div className={`flex items-center justify-center ${loading ? 'opacity-0' : ''} ${icon ? 'gap-2' : ''}`}>
        {icon && (
          <motion.span
            whileHover={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 0.5 }}
          >
            {icon}
          </motion.span>
        )}
        <span>{children}</span>
      </div>

      {/* 반짝이는 효과 */}
      <motion.div
        className="absolute inset-0 rounded-3xl overflow-hidden"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
      >
        <div className="absolute top-0 -left-4 w-8 h-full bg-white/30 skew-x-12 animate-shine"></div>
      </motion.div>

      {/* 귀여운 점 장식 */}
      <div className="absolute inset-0 rounded-3xl opacity-30 pointer-events-none">
        <div className="absolute top-2 left-3 w-2 h-2 bg-white rounded-full"></div>
        <div className="absolute bottom-3 right-4 w-1.5 h-1.5 bg-white rounded-full"></div>
        <div className="absolute top-1/2 right-2 w-1 h-1 bg-white rounded-full"></div>
      </div>
    </motion.button>
  );
}
