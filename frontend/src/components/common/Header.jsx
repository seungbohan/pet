import { Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

export default function Header() {
  const { isAuthenticated, user, logout } = useAuthStore();

  return (
    <header className="bg-pet-dark-brown text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
          <span className="text-2xl">🐾</span>
          <span className="text-pet-peach">WithPet</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link to="/feeds" className="hover:text-pet-peach transition-colors">피드</Link>
          <Link to="/map" className="hover:text-pet-peach transition-colors">장소 찾기</Link>
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link
                to="/mypage"
                className="text-sm hover:text-pet-peach transition-colors"
              >
                {user?.name || '마이페이지'}
              </Link>
              <button
                onClick={logout}
                className="text-sm bg-pet-orange hover:bg-pet-orange/90 text-white px-4 py-1.5 rounded-xl transition-colors"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm hover:text-pet-peach transition-colors"
              >
                로그인
              </Link>
              <Link
                to="/signup"
                className="text-sm bg-pet-orange hover:bg-pet-orange/90 text-white px-4 py-1.5 rounded-xl transition-colors"
              >
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
