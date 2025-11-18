'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import ImageModal from '@/components/common/modal/ImageModal';

interface ClickableImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  unoptimized?: boolean;
}

/**
 * 클릭 시 확대되는 이미지 컴포넌트
 * Next.js Image 컴포넌트를 래핑하여 클릭 시 모달로 확대 보기 기능 제공
 */
export default function ClickableImage({
  src,
  alt,
  fill,
  width,
  height,
  className = '',
  priority,
  quality,
  sizes,
  unoptimized,
}: ClickableImageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
  };

  return (
    <>
      <div
        onClick={handleClick}
        className="cursor-pointer w-full h-full relative"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsModalOpen(true);
          }
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill={fill}
          width={width}
          height={height}
          className={className}
          priority={priority}
          quality={quality}
          sizes={sizes}
          unoptimized={unoptimized}
        />
      </div>

      {/* 모달을 Portal로 body에 직접 렌더링 */}
      {isModalOpen && typeof document !== 'undefined' && createPortal(
        <ImageModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          imageUrl={src}
          alt={alt}
        />,
        document.body
      )}
    </>
  );
}
