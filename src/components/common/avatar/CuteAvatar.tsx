'use client';

import Image from 'next/image';
import { User } from 'lucide-react';

interface CuteAvatarProps {
  src?: string | null;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  border?: boolean;
}

export default function CuteAvatar({
  src,
  alt = 'Avatar',
  size = 'md',
  className = '',
  border = true,
}: CuteAvatarProps) {
  const sizes = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const baseClasses = `
    relative rounded-full overflow-hidden
    ${border ? 'ring-2 ring-white shadow-lg' : ''}
    bg-gradient-to-br from-pink-100 to-purple-100
  `;

  if (src) {
    return (
      <div className={`${baseClasses} ${sizes[size]} ${className}`}>
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
        />
        {/* 귀여운 반짝이 효과 */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className={`${baseClasses} ${sizes[size]} ${className} flex items-center justify-center`}>
      <User className={`${iconSizes[size]} text-purple-400`} />
      {/* 귀여운 반짝이 효과 */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent rounded-full"></div>
    </div>
  );
}