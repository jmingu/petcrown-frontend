import React from "react";
import Button from "@/components/common/button/Button"

interface AlertProps {
  message: string;
  onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, onClose }) => {
  if (!message) return null; // 메시지가 없으면 렌더링 안 함

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-gray-100 p-6 rounded-lg shadow-lg w-80 text-center relative">
        {/* 닫기(X) 버튼 */}
        <button
          className="absolute top-2 right-2 text-green-600 hover:text-green-800"
          onClick={onClose}
        >
          ✖
        </button>

        {/* 메시지 */}
        <p className="text-lg font-semibold mb-4">{message}</p>

        {/* 확인 버튼 */}
        <Button onClick={onClose} type="gray">확인</Button>
      </div>
    </div>
  );
};

export default Alert;
