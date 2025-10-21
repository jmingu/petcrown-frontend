import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnBackdropClick?: boolean;
}

export default function Modal({ 
  children, 
  onClose, 
  title,
  size = 'md',
  closeOnBackdropClick = true 
}: ModalProps) {
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-2 sm:p-4"
        onClick={handleBackdropClick}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ 
            type: "spring", 
            damping: 25, 
            stiffness: 300,
            duration: 0.3 
          }}
          className={`bg-white rounded-3xl shadow-2xl w-full ${sizeClasses[size]} mx-auto relative overflow-hidden border border-gray-100 max-h-[95vh] overflow-y-auto`}
          onClick={(e) => e.stopPropagation()}
        >
          
          {/* 헤더 */}
          {title && (
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {title}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                </button>
              </div>
            </div>
          )}

          {/* 닫기 버튼 (타이틀이 없을 때) */}
          {!title && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 z-10"
            >
              <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
            </button>
          )}

          {/* 콘텐츠 */}
          <div className={title ? 'p-6' : 'p-6 pt-12'}>
            {children}
          </div>

          {/* 귀여운 장식 요소들 */}
          <div className="absolute top-3 left-4 w-2 h-2 bg-purple-200 rounded-full opacity-40"></div>
          <div className="absolute top-6 left-6 w-1 h-1 bg-pink-200 rounded-full opacity-60"></div>
          <div className="absolute bottom-4 right-4 w-2 h-2 bg-purple-200 rounded-full opacity-30"></div>
          <div className="absolute bottom-6 right-8 w-1 h-1 bg-pink-200 rounded-full opacity-50"></div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}