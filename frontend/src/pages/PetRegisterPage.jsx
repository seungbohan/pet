import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPet } from '../api/pets';

export default function PetRegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', species: '강아지', breed: '', birthYear: '', weight: '', introduction: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { alert('이름을 입력해주세요.'); return; }
    setLoading(true);
    try {
      await createPet({
        ...form,
        birthYear: form.birthYear ? parseInt(form.birthYear) : 0,
        weight: form.weight ? parseFloat(form.weight) : 0,
      });
      navigate('/mypage');
    } catch {
      alert('등록에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-pet-dark-brown mb-6">🐾 반려동물 등록</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-medium text-pet-brown mb-1">이름 *</label>
          <input name="name" value={form.name} onChange={handleChange} required
            className="w-full px-4 py-3 rounded-xl border border-pet-gray bg-pet-cream/50 focus:outline-none focus:border-pet-orange" placeholder="반려동물 이름" />
        </div>
        <div>
          <label className="block text-sm font-medium text-pet-brown mb-1">종류</label>
          <select name="species" value={form.species} onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-pet-gray bg-pet-cream/50 focus:outline-none focus:border-pet-orange">
            <option value="강아지">🐶 강아지</option>
            <option value="고양이">🐱 고양이</option>
            <option value="기타">🐾 기타</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-pet-brown mb-1">품종</label>
          <input name="breed" value={form.breed} onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-pet-gray bg-pet-cream/50 focus:outline-none focus:border-pet-orange" placeholder="예: 푸들, 말티즈" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-pet-brown mb-1">태어난 해</label>
            <input name="birthYear" type="number" value={form.birthYear} onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-pet-gray bg-pet-cream/50 focus:outline-none focus:border-pet-orange" placeholder="2020" />
          </div>
          <div>
            <label className="block text-sm font-medium text-pet-brown mb-1">체중 (kg)</label>
            <input name="weight" type="number" step="0.1" value={form.weight} onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-pet-gray bg-pet-cream/50 focus:outline-none focus:border-pet-orange" placeholder="5.0" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-pet-brown mb-1">소개</label>
          <textarea name="introduction" value={form.introduction} onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-pet-gray bg-pet-cream/50 focus:outline-none focus:border-pet-orange resize-none h-24" placeholder="반려동물을 소개해주세요" />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading}
            className="flex-1 py-3 bg-pet-orange text-white rounded-xl font-semibold hover:bg-pet-orange/90 transition-colors disabled:opacity-50">
            {loading ? '등록 중...' : '등록하기'}
          </button>
          <button type="button" onClick={() => navigate(-1)}
            className="px-6 py-3 bg-pet-gray text-pet-brown rounded-xl font-medium hover:bg-pet-peach transition-colors">
            취소
          </button>
        </div>
      </form>
    </div>
  );
}
