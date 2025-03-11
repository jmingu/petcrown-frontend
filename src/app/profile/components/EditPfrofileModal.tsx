'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface UserInfo {
  id: number;
  name: string;
  email: string;
  gender: string;
  birthdate: string;
  profileImageUrl: string;
}

interface EditProfileModalProps {
  user: UserInfo;
  onClose: () => void;
  onSave: (updatedUser: UserInfo) => void;
}

export default function EditProfileModal({ user, onClose, onSave }: EditProfileModalProps) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [gender, setGender] = useState(user.gender);
  const [birthdate, setBirthdate] = useState(user.birthdate);
  const [profileImageUrl, setProfileImageUrl] = useState(user.profileImageUrl);

  useEffect(() => {
    setName(user.name);
    setEmail(user.email);
    setGender(user.gender);
    setBirthdate(user.birthdate);
    setProfileImageUrl(user.profileImageUrl);
  }, [user]);

  const handleSave = () => {
    if (!name || !email || !gender || !birthdate) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    const updatedUser: UserInfo = {
      id: user.id,
      name,
      email,
      gender,
      birthdate,
      profileImageUrl: profileImageUrl || '/images/default-profile.png',
    };

    onSave(updatedUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div 
        initial={{ opacity: 0, y: -50 }} 
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="bg-white p-6 rounded-lg shadow-lg w-96"
      >
        <h2 className="text-xl font-bold mb-4">프로필 수정</h2>
        <div className="flex flex-col gap-3">
          <input type="text" placeholder="이름" value={name} onChange={(e) => setName(e.target.value)} className="border p-2 rounded" />
          <input type="email" placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} className="border p-2 rounded" />
          <select value={gender} onChange={(e) => setGender(e.target.value)} className="border p-2 rounded">
            <option value="">성별 선택</option>
            <option value="남">남</option>
            <option value="여">여</option>
          </select>
          <input type="date" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} className="border p-2 rounded" />
          <input type="text" placeholder="프로필 사진 URL (선택)" value={profileImageUrl} onChange={(e) => setProfileImageUrl(e.target.value)} className="border p-2 rounded" />
        </div>
        <div className="flex justify-end mt-4 gap-2">
          <button onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded">취소</button>
          <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">저장</button>
        </div>
      </motion.div>
    </div>
  );
}
