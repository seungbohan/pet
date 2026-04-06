import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import useAuthStore from '../store/authStore';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(email, password);
      setAuth(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex">
      {/* ===== Left decorative panel (desktop only) ===== */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-pet-orange via-pet-pink to-pet-peach overflow-hidden items-center justify-center">
        {/* Animated background paw prints */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-[10%] left-[15%] text-6xl animate-[bounce_4s_ease-in-out_infinite]">&#x1F43E;</div>
          <div className="absolute top-[30%] right-[20%] text-4xl animate-[bounce_5s_ease-in-out_infinite_0.5s]">&#x1F43E;</div>
          <div className="absolute bottom-[25%] left-[25%] text-5xl animate-[bounce_6s_ease-in-out_infinite_1s]">&#x1F43E;</div>
          <div className="absolute top-[60%] right-[10%] text-3xl animate-[bounce_4.5s_ease-in-out_infinite_1.5s]">&#x1F43E;</div>
          <div className="absolute bottom-[10%] right-[35%] text-7xl animate-[bounce_5.5s_ease-in-out_infinite_0.8s]">&#x1F43E;</div>
          <div className="absolute top-[5%] right-[40%] text-4xl animate-[bounce_3.5s_ease-in-out_infinite_2s]">&#x1F43E;</div>
        </div>

        {/* Center content */}
        <div className="relative z-10 text-center text-white px-12 max-w-md">
          <div className="text-8xl mb-6 drop-shadow-lg">&#x1F436;</div>
          <h2 className="text-3xl font-extrabold mb-3 drop-shadow-sm">WithPet</h2>
          <p className="text-lg font-medium text-white/90 leading-relaxed">
            반려동물과 함께하는<br />특별한 장소를 발견하세요
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <span className="text-3xl">&#x1F431;</span>
            <span className="text-3xl">&#x1F436;</span>
            <span className="text-3xl">&#x1F430;</span>
            <span className="text-3xl">&#x1F439;</span>
          </div>
        </div>
      </div>

      {/* ===== Right form panel ===== */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 bg-pet-cream/50">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-xl shadow-pet-brown/5 p-8 sm:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="lg:hidden text-5xl mb-3">&#x1F43E;</div>
              <h1 className="text-2xl font-extrabold text-pet-dark-brown">
                로그인
              </h1>
              <p className="text-sm text-pet-brown/50 mt-1.5">
                WithPet에 오신 것을 환영합니다
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-11 pr-11 py-3 rounded-xl border border-pet-gray bg-pet-cream/30 text-sm focus:outline-none focus:border-pet-orange focus:ring-2 focus:ring-pet-orange/20 transition-all duration-200 placeholder:text-pet-brown/30"
                    placeholder="비밀번호를 입력하세요"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3.5 flex items-center text-pet-brown/40 hover:text-pet-brown/70 transition-colors duration-200"
                    aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

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
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-pet-orange to-pet-orange/85 text-white rounded-xl font-semibold shadow-md shadow-pet-orange/20 hover:shadow-lg hover:shadow-pet-orange/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-md"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    로그인 중...
                  </span>
                ) : (
                  '로그인'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-7">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-pet-gray" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-pet-brown/40 text-xs font-medium">또는</span>
              </div>
            </div>

            {/* Social Login */}
            <a
              href="/api/v1/auth/oauth2/google"
              className="flex items-center justify-center gap-3 w-full py-3 rounded-xl border-2 border-pet-gray/80 text-pet-brown font-medium hover:bg-pet-cream/60 hover:border-pet-brown/20 transition-all duration-200 text-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google로 로그인
            </a>

            {/* Signup link */}
            <p className="text-center text-sm text-pet-brown/50 mt-7">
              아직 회원이 아니신가요?{' '}
              <Link to="/signup" className="text-pet-orange font-semibold hover:underline transition-colors duration-200">
                회원가입
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
