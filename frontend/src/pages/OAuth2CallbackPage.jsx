import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { getMe } from '../api/auth';

export default function OAuth2CallbackPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  useEffect(() => {
    // [SECURITY] URL fragment(#)에서 토큰 읽기 - 서버 로그에 남지 않음 (HIGH-2 수���)
    const hash = window.location.hash;
    const token = hash.startsWith('#token=') ? hash.substring(7) : null;

    // 사용 후 즉시 URL에서 토큰 제거
    if (window.history.replaceState) {
      window.history.replaceState(null, '', window.location.pathname);
    }

    if (token) {
      localStorage.setItem('token', token);
      getMe()
        .then((res) => {
          setAuth(res.data, token);
          navigate('/');
        })
        .catch(() => {
          localStorage.removeItem('token');
          navigate('/login');
        });
    } else {
      navigate('/login');
    }
  }, [navigate, setAuth]);

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="text-center">
        <div className="text-4xl animate-bounce mb-4">🐾</div>
        <p className="text-pet-brown font-medium">로그인 처리 중...</p>
      </div>
    </div>
  );
}
