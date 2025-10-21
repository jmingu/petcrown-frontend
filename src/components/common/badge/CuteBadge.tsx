'use client';

import { ReactNode } from 'react';

interface CuteBadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'cute';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  icon?: ReactNode;
}

export default function CuteBadge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  icon,
}: CuteBadgeProps) {
  const baseClasses = `
    inline-flex items-center font-medium rounded-full
    border border-opacity-20
  `;

  const variants = {
    default: 'bg-gray-100 text-gray-800 border-gray-300',
    success: 'bg-green-100 text-green-800 border-green-300',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    danger: 'bg-red-100 text-red-800 border-red-300',
    info: 'bg-blue-100 text-blue-800 border-blue-300',
    cute: 'bg-gradient-to-r from-pink-100 to-purple-100 text-purple-800 border-purple-300',
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs space-x-1',
    md: 'px-3 py-1 text-sm space-x-1',
    lg: 'px-4 py-2 text-base space-x-2',
  };

  return (
    <span className={`
      ${baseClasses}
      ${variants[variant]}
      ${sizes[size]}
      ${className}
    `}>
      {icon && <span>{icon}</span>}
      <span>{children}</span>
      
      {/* 귀여운 반짝이 효과 */}
      {variant === 'cute' && (
        <div className="absolute inset-0 bg-gradient-to-r from-pink-200/30 to-purple-200/30 rounded-full animate-pulse"></div>
      )}
    </span>
  );
}