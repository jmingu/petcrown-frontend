'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterVotePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    gender: '♀',
    type: 'dog',
    image: '',
    period: 'daily',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('등록된 데이터:', formData);
    alert('투표가 등록되었습니다.');
    router.push('/vote'); // 등록 후 투표 페이지로 이동
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">투표 등록</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">이름</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded-md"
          />
        </div>

        <div>
          <label className="block font-semibold">성별</label>
          <select name="gender" value={formData.gender} onChange={handleChange} className="w-full border p-2 rounded-md">
            <option value="♀">♀ (암컷)</option>
            <option value="♂">♂ (수컷)</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold">종류</label>
          <select name="type" value={formData.type} onChange={handleChange} className="w-full border p-2 rounded-md">
            <option value="dog">강아지</option>
            <option value="cat">고양이</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold">이미지 URL</label>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded-md"
          />
        </div>

        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
          등록하기
        </button>
      </form>
    </div>
  );
}
