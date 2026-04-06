import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import useAuthStore from '../store/authStore';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="text-4xl mb-2">🐾</div>
            <h1 className="text-2xl font-bold text-pet-dark-brown">로그인</h1>
            <p className="text-sm text-pet-brown/60 mt-1">WithPet에 오신 것을 환영합니다</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-pet-brown mb-1">이메일</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-pet-gray bg-pet-cream/50 focus:outline-none focus:border-pet-orange transition-colors"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-pet-brown mb-1">비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-pet-gray bg-pet-cream/50 focus:outline-none focus:border-pet-orange transition-colors"
                placeholder="비밀번호를 입력하세요"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-pet-orange text-white rounded-xl font-semibold hover:bg-pet-orange/90 transition-colors disabled:opacity-50"
            >
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          {/* Social Login */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-pet-gray"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-pet-brown/50">또는</span>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <a
                href="/api/v1/auth/oauth2/google"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-pet-gray text-pet-brown font-medium hover:bg-pet-gray transition-colors"
              >
                <span>🔵</span> Google로 로그인
              </a>
            </div>
          </div>

          <p className="text-center text-sm text-pet-brown/60 mt-6">
            아직 회원이 아니신가요?{' '}
            <Link to="/signup" className="text-pet-orange font-medium hover:underline">
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
