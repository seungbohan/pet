import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../api/auth';

/* Password strength logic */
function getPasswordStrength(pw) {
  if (!pw) return { level: 0, label: '', color: '' };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) return { level: 1, label: '약함', color: 'bg-red-400' };
  if (score <= 2) return { level: 2, label: '보통', color: 'bg-pet-yellow' };
  if (score <= 3) return { level: 3, label: '좋음', color: 'bg-pet-mint' };
  return { level: 4, label: '강함', color: 'bg-green-500' };
}

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', passwordConfirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const passwordStrength = useMemo(() => getPasswordStrength(form.password), [form.password]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (form.password.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다.');
      return;
    }

    setLoading(true);
    try {
      await signup({ name: form.name, email: form.email, password: form.password });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || '회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  /* Current visual step based on filled fields */
  const currentStep = form.name && form.email ? (form.password ? 3 : 2) : form.name || form.email ? 1 : 0;

  /* Success overlay */
  if (success) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-pet-cream/50">
        <div className="text-center animate-[fadeIn_0.5s_ease-out]">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-pet-mint to-green-400 rounded-full flex items-center justify-center shadow-lg shadow-green-200/50 animate-[bounce_1s_ease-in-out_2]">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h2 className="text-2xl font-extrabold text-pet-dark-brown mb-2">회원가입 완료!</h2>
          <p className="text-sm text-pet-brown/60">잠시 후 로그인 페이지로 이동합니다...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex">
      {/* ===== Left decorative panel (desktop only) ===== */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-pet-mint via-pet-sky to-pet-pink overflow-hidden items-center justify-center">
        {/* Animated background paw prints */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-[10%] left-[15%] text-6xl animate-[bounce_4s_ease-in-out_infinite]">&#x1F43E;</div>
          <div className="absolute top-[30%] right-[20%] text-4xl animate-[bounce_5s_ease-in-out_infinite_0.5s]">&#x1F43E;</div>
          <div className="absolute bottom-[25%] left-[25%] text-5xl animate-[bounce_6s_ease-in-out_infinite_1s]">&#x1F43E;</div>
          <div className="absolute top-[60%] right-[10%] text-3xl animate-[bounce_4.5s_ease-in-out_infinite_1.5s]">&#x1F43E;</div>
          <div className="absolute bottom-[10%] right-[35%] text-7xl animate-[bounce_5.5s_ease-in-out_infinite_0.8s]">&#x1F43E;</div>
        </div>

        {/* Center content */}
        <div className="relative z-10 text-center text-white px-12 max-w-md">
          <div className="text-8xl mb-6 drop-shadow-lg">&#x1F43E;</div>
          <h2 className="text-3xl font-extrabold mb-3 drop-shadow-sm">함께해요, WithPet</h2>
          <p className="text-lg font-medium text-white/90 leading-relaxed">
            반려동물 친화 장소를<br />함께 만들어가요
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <span className="text-3xl">&#x1F3E0;</span>
            <span className="text-3xl">&#x2615;</span>
            <span className="text-3xl">&#x1F3DE;&#xFE0F;</span>
            <span className="text-3xl">&#x1F6CD;&#xFE0F;</span>
          </div>
        </div>
      </div>

      {/* ===== Right form panel ===== */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 bg-pet-cream/50">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-xl shadow-pet-brown/5 p-8 sm:p-10">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="lg:hidden text-5xl mb-3">&#x1F43E;</div>
              <h1 className="text-2xl font-extrabold text-pet-dark-brown">회원가입</h1>
              <p className="text-sm text-pet-brown/50 mt-1.5">WithPet과 함께 시작해요</p>
            </div>

            {/* Step indicator dots */}
            <div className="flex items-center justify-center gap-2 mb-7">
              {[0, 1, 2].map((step) => (
                <div
                  key={step}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    step <= currentStep
                      ? 'w-8 bg-pet-orange'
                      : 'w-4 bg-pet-gray'
                  }`}
                />
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-pet-brown mb-1.5">이름</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-pet-brown/35">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-pet-gray bg-pet-cream/30 text-sm focus:outline-none focus:border-pet-orange focus:ring-2 focus:ring-pet-orange/20 transition-all duration-200 placeholder:text-pet-brown/30"
                    placeholder="이름을 입력하세요"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-pet-brown mb-1.5">이메일</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-pet-brown/35">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-pet-gray bg-pet-cream/30 text-sm focus:outline-none focus:border-pet-orange focus:ring-2 focus:ring-pet-orange/20 transition-all duration-200 placeholder:text-pet-brown/30"
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-pet-brown mb-1.5">비밀번호</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-pet-brown/35">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-pet-gray bg-pet-cream/30 text-sm focus:outline-none focus:border-pet-orange focus:ring-2 focus:ring-pet-orange/20 transition-all duration-200 placeholder:text-pet-brown/30"
                    placeholder="8자 이상 입력하세요"
                  />
                </div>
                {/* Password strength indicator */}
                {form.password && (
                  <div className="mt-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                            i <= passwordStrength.level ? passwordStrength.color : 'bg-pet-gray'
                          }`}
                        />
                      ))}
                    </div>
                    <p className={`text-xs mt-1 transition-all duration-200 ${
                      passwordStrength.level <= 1 ? 'text-red-400' :
                      passwordStrength.level <= 2 ? 'text-pet-brown/50' :
                      'text-green-600'
                    }`}>
                      비밀번호 강도: {passwordStrength.label}
                    </p>
                  </div>
                )}
              </div>

              {/* Password Confirm */}
              <div>
                <label className="block text-sm font-semibold text-pet-brown mb-1.5">비밀번호 확인</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-pet-brown/35">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    name="passwordConfirm"
                    value={form.passwordConfirm}
                    onChange={handleChange}
                    required
                    className={`w-full pl-11 pr-10 py-3 rounded-xl border bg-pet-cream/30 text-sm focus:outline-none focus:ring-2 transition-all duration-200 placeholder:text-pet-brown/30 ${
                      form.passwordConfirm && form.password !== form.passwordConfirm
                        ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                        : 'border-pet-gray focus:border-pet-orange focus:ring-pet-orange/20'
                    }`}
                    placeholder="비밀번호를 다시 입력하세요"
                  />
                  {/* Match indicator */}
                  {form.passwordConfirm && (
                    <div className="absolute inset-y-0 right-3.5 flex items-center">
                      {form.password === form.passwordConfirm ? (
                        <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Terms checkbox */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative mt-0.5">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-5 h-5 rounded-md border-2 border-pet-gray peer-checked:border-pet-orange peer-checked:bg-pet-orange transition-all duration-200 flex items-center justify-center">
                    {agreed && (
                      <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-xs text-pet-brown/60 leading-relaxed group-hover:text-pet-brown transition-colors duration-200">
                  <span className="text-pet-orange font-medium">이용약관</span> 및{' '}
                  <span className="text-pet-orange font-medium">개인정보처리방침</span>에 동의합니다.
                </span>
              </label>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 px-3 py-2.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !agreed}
                className="w-full py-3 bg-gradient-to-r from-pet-orange to-pet-orange/85 text-white rounded-xl font-semibold shadow-md shadow-pet-orange/20 hover:shadow-lg hover:shadow-pet-orange/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-md disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    가입 중...
                  </span>
                ) : (
                  '회원가입'
                )}
              </button>
            </form>

            {/* Login link */}
            <p className="text-center text-sm text-pet-brown/50 mt-7">
              이미 회원이신가요?{' '}
              <Link to="/login" className="text-pet-orange font-semibold hover:underline transition-colors duration-200">
                로그인
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
