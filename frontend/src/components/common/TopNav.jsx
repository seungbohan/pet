import { Link, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

export default function TopNav() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const location = useLocation();

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <header className="sticky top-0 z-50 h-14 bg-white border-b border-pet-gray flex-shrink-0">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-1.5 group">
          <span className="text-xl transition-transform duration-300 group-hover:rotate-12">
            🐾
          </span>
          <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-pet-orange to-pet-pink bg-clip-text text-transparent">
            WithPet
          </span>
        </Link>

        {/* Center nav links - hidden on mobile since BottomNav handles it */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold">
          <Link
            to="/"
            className={`py-1 transition-colors ${
              isActive('/map') || location.pathname === '/'
                ? 'text-pet-orange'
                : 'text-pet-brown hover:text-pet-dark-brown'
            }`}
          >
            지도
          </Link>
          <Link
            to="/feeds"
            className={`py-1 transition-colors ${
              isActive('/feeds')
                ? 'text-pet-orange'
                : 'text-pet-brown hover:text-pet-dark-brown'
            }`}
          >
            피드
          </Link>
        </nav>

        {/* Auth area */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link
                to="/mypage"
                className="flex items-center gap-2 group"
              >
                <span className="w-7 h-7 rounded-full bg-gradient-to-br from-pet-orange to-pet-pink
                                 flex items-center justify-center text-white text-xs font-bold
                                 ring-2 ring-white shadow-sm">
                  {(user?.name || '?')[0]}
                </span>
                <span className="hidden md:inline text-sm font-medium text-pet-brown group-hover:text-pet-dark-brown transition-colors">
                  {user?.name || '마이페이지'}
                </span>
              </Link>
              <button
                onClick={logout}
                className="hidden md:inline text-sm font-medium text-pet-brown/50 hover:text-pet-orange transition-colors"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-semibold text-pet-brown hover:text-pet-dark-brown transition-colors"
              >
                로그인
              </Link>
              <Link
                to="/signup"
                className="hidden md:inline text-sm font-bold bg-gradient-to-r from-pet-orange to-pet-pink
                           text-white px-4 py-1.5 rounded-full shadow-sm
                           hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-300"
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
