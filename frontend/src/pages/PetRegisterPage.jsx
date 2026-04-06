import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPet } from '../api/pets';

const SPECIES_OPTIONS = [
  {
    value: '강아지',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="18" fill="#FFD4B2" />
        <text x="50%" y="55%" textAnchor="middle" dominantBaseline="middle" fontSize="20">&#x1F436;</text>
      </svg>
    ),
    color: 'from-pet-orange/20 to-pet-peach/40 border-pet-orange/30',
    activeColor: 'from-pet-orange/30 to-pet-peach/60 border-pet-orange ring-2 ring-pet-orange/20',
  },
  {
    value: '고양이',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="18" fill="#FFB5C2" />
        <text x="50%" y="55%" textAnchor="middle" dominantBaseline="middle" fontSize="20">&#x1F431;</text>
      </svg>
    ),
    color: 'from-pet-pink/20 to-pet-pink/40 border-pet-pink/30',
    activeColor: 'from-pet-pink/30 to-pet-pink/60 border-pet-pink ring-2 ring-pet-pink/20',
  },
  {
    value: '기타',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="18" fill="#B8E8D0" />
        <text x="50%" y="55%" textAnchor="middle" dominantBaseline="middle" fontSize="20">&#x1F43E;</text>
      </svg>
    ),
    color: 'from-pet-mint/20 to-pet-mint/40 border-pet-mint/30',
    activeColor: 'from-pet-mint/30 to-pet-mint/60 border-pet-mint ring-2 ring-pet-mint/20',
  },
];

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

  const currentYear = new Date().getFullYear();
  const petAge = form.birthYear ? currentYear - parseInt(form.birthYear) : null;

  return (
    <div className="max-w-lg mx-auto py-6 px-4 pb-8">
      {/* Header */}
      <div className="mb-6 animate-slide-up">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-pet-brown/60 hover:text-pet-brown mb-4 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          돌아가기
        </button>
        <h1 className="text-2xl font-bold text-pet-dark-brown font-heading">반려동물 등록</h1>
        <p className="text-sm text-pet-brown/50 mt-1">새로운 가족을 소개해주세요</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Species Selector - Cute Icons */}
        <div className="bg-white rounded-2xl p-5 shadow-sm animate-slide-up" style={{ animationDelay: '50ms' }}>
          <label className="text-sm font-semibold text-pet-dark-brown mb-3 block">어떤 반려동물인가요?</label>
          <div className="grid grid-cols-3 gap-3">
            {SPECIES_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setForm({ ...form, species: option.value })}
                className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 bg-gradient-to-br transition-all duration-200 ${
                  form.species === option.value
                    ? `${option.activeColor} scale-105 shadow-sm`
                    : `${option.color} hover:scale-102 border-transparent`
                }`}
              >
                <div className={`transition-transform duration-200 ${form.species === option.value ? 'scale-110' : ''}`}>
                  {option.icon}
                </div>
                <span className={`text-sm font-medium transition-colors ${
                  form.species === option.value ? 'text-pet-dark-brown' : 'text-pet-brown/70'
                }`}>
                  {option.value}
                </span>
                {form.species === option.value && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-pet-orange rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Name */}
        <div className="bg-white rounded-2xl p-5 shadow-sm animate-slide-up" style={{ animationDelay: '100ms' }}>
          <label className="text-sm font-semibold text-pet-dark-brown mb-2 flex items-center gap-1">
            이름
            <span className="text-pet-orange text-xs">*</span>
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl border border-pet-gray/60 bg-pet-cream/30 focus:outline-none focus:border-pet-orange focus:ring-2 focus:ring-pet-orange/10 focus:bg-white transition-all placeholder:text-pet-brown/30"
            placeholder="반려동물의 이름을 알려주세요"
          />
        </div>

        {/* Breed */}
        <div className="bg-white rounded-2xl p-5 shadow-sm animate-slide-up" style={{ animationDelay: '150ms' }}>
          <label className="text-sm font-semibold text-pet-dark-brown mb-2 block">품종</label>
          <input
            name="breed"
            value={form.breed}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-pet-gray/60 bg-pet-cream/30 focus:outline-none focus:border-pet-orange focus:ring-2 focus:ring-pet-orange/10 focus:bg-white transition-all placeholder:text-pet-brown/30"
            placeholder="예: 푸들, 말티즈, 코숏"
          />
        </div>

        {/* Birth Year + Weight Row */}
        <div className="grid grid-cols-2 gap-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <label className="text-sm font-semibold text-pet-dark-brown mb-2 block">태어난 해</label>
            <input
              name="birthYear"
              type="number"
              value={form.birthYear}
              onChange={handleChange}
              min="2000"
              max={currentYear}
              className="w-full px-4 py-3 rounded-xl border border-pet-gray/60 bg-pet-cream/30 focus:outline-none focus:border-pet-orange focus:ring-2 focus:ring-pet-orange/10 focus:bg-white transition-all placeholder:text-pet-brown/30"
              placeholder={String(currentYear)}
            />
            {/* Age calculator display */}
            {petAge !== null && petAge >= 0 && petAge <= 30 && (
              <div className="mt-2 flex items-center gap-1.5 animate-scale-in">
                <span className="text-xs px-2.5 py-1 bg-pet-mint/30 text-pet-brown rounded-full font-medium">
                  {petAge === 0 ? '1살 미만' : `${petAge}살`}
                </span>
                <span className="text-xs text-pet-brown/40">
                  {petAge <= 1 ? '아기' : petAge <= 3 ? '어린이' : petAge <= 7 ? '청년' : '시니어'}
                </span>
              </div>
            )}
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <label className="text-sm font-semibold text-pet-dark-brown mb-2 block">체중</label>
            <div className="relative">
              <input
                name="weight"
                type="number"
                step="0.1"
                value={form.weight}
                onChange={handleChange}
                className="w-full px-4 py-3 pr-10 rounded-xl border border-pet-gray/60 bg-pet-cream/30 focus:outline-none focus:border-pet-orange focus:ring-2 focus:ring-pet-orange/10 focus:bg-white transition-all placeholder:text-pet-brown/30"
                placeholder="5.0"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-pet-brown/40 font-medium">kg</span>
            </div>
          </div>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-2xl p-5 shadow-sm animate-slide-up" style={{ animationDelay: '250ms' }}>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-pet-dark-brown">소개</label>
            <span className="text-xs text-pet-brown/40">{form.introduction.length}/200</span>
          </div>
          <textarea
            name="introduction"
            value={form.introduction}
            onChange={(e) => e.target.value.length <= 200 && handleChange(e)}
            className="w-full px-4 py-3 rounded-xl border border-pet-gray/60 bg-pet-cream/30 focus:outline-none focus:border-pet-orange focus:ring-2 focus:ring-pet-orange/10 focus:bg-white transition-all resize-none h-24 text-sm leading-relaxed placeholder:text-pet-brown/30"
            placeholder="반려동물의 성격, 좋아하는 것, 특별한 점 등을 적어주세요"
          />
        </div>

        {/* Preview Card */}
        {form.name && (
          <div className="animate-scale-in">
            <p className="text-xs font-medium text-pet-brown/50 mb-2 flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              프로필 미리보기
            </p>
            <div className="bg-white rounded-2xl shadow-md overflow-hidden paw-pattern">
              <div className="h-16 bg-gradient-to-r from-pet-orange via-pet-pink to-pet-peach" />
              <div className="px-5 pb-5 relative">
                <div className="absolute -top-7 left-5">
                  <div className="w-14 h-14 rounded-xl bg-white p-0.5 shadow-lg">
                    <div className="w-full h-full rounded-lg bg-gradient-to-br from-pet-peach to-pet-orange flex items-center justify-center text-xl">
                      {form.species === '고양이' ? '\u{1F431}' : form.species === '강아지' ? '\u{1F436}' : '\u{1F43E}'}
                    </div>
                  </div>
                </div>
                <div className="pt-9">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-pet-dark-brown font-heading">{form.name}</h3>
                    <span className="text-xs px-2 py-0.5 bg-pet-orange/10 text-pet-orange rounded-full font-medium">{form.species}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-pet-brown/50">
                    {form.breed && <span>{form.breed}</span>}
                    {form.breed && (petAge !== null && petAge >= 0) && <span className="w-1 h-1 rounded-full bg-pet-brown/30" />}
                    {petAge !== null && petAge >= 0 && petAge <= 30 && <span>{petAge === 0 ? '1살 미만' : `${petAge}살`}</span>}
                    {form.weight && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-pet-brown/30" />
                        <span>{form.weight}kg</span>
                      </>
                    )}
                  </div>
                  {form.introduction && (
                    <p className="text-sm text-pet-brown/70 mt-2 leading-relaxed">{form.introduction}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submit Actions */}
        <div className="flex gap-3 pt-2 animate-slide-up" style={{ animationDelay: '300ms' }}>
          <button
            type="submit"
            disabled={loading || !form.name.trim()}
            className="flex-1 py-3.5 bg-gradient-to-r from-pet-orange to-pet-pink text-white rounded-xl font-semibold shadow-md shadow-pet-orange/20 hover:shadow-lg hover:shadow-pet-orange/30 hover:-translate-y-0.5 disabled:opacity-40 disabled:shadow-none disabled:hover:translate-y-0 transition-all text-[15px] flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>등록 중...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                등록하기
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-3.5 bg-pet-gray text-pet-brown rounded-xl font-medium hover:bg-pet-peach transition-colors"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
}
