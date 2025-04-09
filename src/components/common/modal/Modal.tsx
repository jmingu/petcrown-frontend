import React from 'react';

export default function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg shadow-lg relative">
        {children}
        <button className="absolute top-2 right-2 cursor-pointer" onClick={onClose}>
          ✖
        </button>
      </div>
    </div>
  );
}