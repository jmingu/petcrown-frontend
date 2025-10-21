import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import CuteButton from '@/components/common/button/CuteButton';

interface AlertProps {
  message: string;
  onClose: () => void;
  type?: 'info' | 'success' | 'warning' | 'error';
}

const Alert: React.FC<AlertProps> = ({ message, onClose, type = 'info' }) => {
  if (!message) return null;

  const getAlertConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: <CheckCircle className="w-8 h-8 text-green-500" />,
          bgColor: 'from-green-400 to-emerald-500',
          borderColor: 'border-green-200',
          bgLight: 'bg-green-50',
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-8 h-8 text-yellow-500" />,
          bgColor: 'from-yellow-400 to-orange-500',
          borderColor: 'border-yellow-200',
          bgLight: 'bg-yellow-50',
        };
      case 'error':
        return {
          icon: <AlertCircle className="w-8 h-8 text-red-500" />,
          bgColor: 'from-red-400 to-pink-500',
          borderColor: 'border-red-200',
          bgLight: 'bg-red-50',
        };
      default:
        return {
          icon: <Info className="w-8 h-8 text-blue-500" />,
          bgColor: 'from-blue-400 to-purple-500',
          borderColor: 'border-blue-200',
          bgLight: 'bg-blue-50',
        };
    }
  };

  const config = getAlertConfig();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ 
            type: "spring", 
            damping: 25, 
            stiffness: 300,
            duration: 0.3 
          }}
          className={`bg-white rounded-3xl shadow-2xl w-full max-w-sm mx-auto relative overflow-hidden border-2 ${config.borderColor}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            {/* 닫기 버튼 */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
            </button>

            {/* 아이콘과 메시지 */}
            <div className="text-center space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
                className="flex justify-center"
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${config.bgLight}`}>
                  {config.icon}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-2"
              >
                <p className="text-lg font-semibold text-gray-900 leading-relaxed">
                  {message}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="pt-2"
              >
                <CuteButton
                  onClick={onClose}
                  variant="primary"
                  size="lg"
                  className="w-full"
                >
                  확인
                </CuteButton>
              </motion.div>
            </div>
          </div>

          {/* 귀여운 장식 요소들 */}
          <div className="absolute top-4 left-4 w-2 h-2 bg-white rounded-full opacity-30"></div>
          <div className="absolute bottom-6 right-6 w-1 h-1 bg-white rounded-full opacity-20"></div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Alert;
