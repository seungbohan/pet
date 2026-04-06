import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { getMe } from '../api/auth';

export default function OAuth2CallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      localStorage.setItem('token', token);
      getMe()
        .then((res) => {
          setAuth(res.data, token);
          navigate('/');
        })
        .catch(() => {
          navigate('/login');
        });
    } else {
      navigate('/login');
    }
  }, [searchParams, navigate, setAuth]);

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="text-center">
        <div className="text-4xl animate-bounce mb-4">🐾</div>
        <p className="text-pet-brown font-medium">로그인 처리 중...</p>
      </div>
    </div>
  );
}
