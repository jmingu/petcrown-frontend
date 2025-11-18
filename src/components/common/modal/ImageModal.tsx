'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, ZoomIn } from 'lucide-react';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  alt?: string;
}

export default function ImageModal({ isOpen, onClose, imageUrl, alt = '이미지' }: ImageModalProps) {
  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999]">
          {/* 배경 오버레이 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/95"
          />

          {/* 닫기 버튼 - 고정 위치 */}
          <button
            onClick={onClose}
            className="fixed top-4 right-4 z-10 p-3 bg-white hover:bg-gray-100 rounded-full shadow-lg transition-colors duration-200 group"
            aria-label="닫기"
          >
            <X className="w-6 h-6 text-gray-800 group-hover:rotate-90 transition-transform duration-200" />
          </button>

          {/* 이미지 컨테이너 - 전체 화면 */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 flex items-center justify-center"
            onClick={onClose}
          >
            <div className="relative w-full h-full">
              <Image
                src={imageUrl}
                alt={alt}
                fill
                className="object-contain"
                quality={100}
                priority
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
