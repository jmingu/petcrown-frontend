'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Plus, Heart, MessageCircle, Trophy, X } from 'lucide-react';

export default function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    {
      icon: <Heart className="w-5 h-5" />,
      label: '투표 등록',
      href: '/vote/register',
      color: 'from-pink-500 to-red-500',
    },
    {
      icon: <MessageCircle className="w-5 h-5" />,
      label: '게시글 작성',
      href: '/community/register',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: <Trophy className="w-5 h-5" />,
      label: '랭킹 보기',
      href: '/ranking',
      color: 'from-yellow-500 to-orange-500',
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* 액션 버튼들 */}
      <AnimatePresence>
        {isOpen && (
          <div className="absolute bottom-16 right-0 space-y-3">
            {actions.map((action, index) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, scale: 0, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0, y: 20 }}
                transition={{ duration: 0.2, delay: index * 0.1 }}
              >
                <Link href={action.href}>
                  <div className="flex items-center space-x-3 group">
                    {/* 라벨 */}
                    <div className="bg-white px-3 py-2 rounded-lg shadow-lg border opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-700">
                        {action.label}
                      </span>
                    </div>
                    
                    {/* 버튼 */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`
                        w-12 h-12 rounded-full bg-gradient-to-r ${action.color}
                        text-white shadow-lg hover:shadow-xl
                        flex items-center justify-center
                        transition-shadow duration-200
                      `}
                    >
                      {action.icon}
                    </motion.button>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* 메인 FAB */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500
          text-white shadow-lg hover:shadow-xl
          flex items-center justify-center
          transition-all duration-300
          ${isOpen ? 'rotate-45' : 'rotate-0'}
        `}
      >
        <Plus className="w-6 h-6" />
      </motion.button>

      {/* 배경 오버레이 (모바일용) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}