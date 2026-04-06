import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

export default function Header() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Close mobile menu on route-level clicks */
  const close = () => setMobileOpen(false);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-white/80 backdrop-blur-xl shadow-lg shadow-pet-brown/5'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">
          {/* ---------- Logo ---------- */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
            onClick={close}
          >
            <span className="text-2xl transition-transform duration-300 group-hover:rotate-12">
              🐾
            </span>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-pet-orange to-pet-pink bg-clip-text text-transparent">
              WithPet
            </span>
          </Link>

          {/* ---------- Desktop nav ---------- */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
            {[
              { to: '/feeds', label: '피드' },
              { to: '/map', label: '장소 찾기' },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="relative py-1 text-pet-brown hover:text-pet-dark-brown transition-colors
                           after:absolute after:left-0 after:bottom-0 after:h-0.5
                           after:w-0 hover:after:w-full after:bg-gradient-to-r
                           after:from-pet-orange after:to-pet-pink after:rounded-full
                           after:transition-all after:duration-300"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* ---------- Desktop auth area ---------- */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/mypage"
                  className="flex items-center gap-2 group"
                >
                  {/* Avatar circle */}
                  <span className="w-8 h-8 rounded-full bg-gradient-to-br from-pet-orange to-pet-pink
                                   flex items-center justify-center text-white text-xs font-bold
                                   ring-2 ring-white shadow-md group-hover:shadow-lg
                                   transition-shadow duration-300">
                    {(user?.name || '?')[0]}
                  </span>
                  <span className="text-sm font-medium text-pet-brown group-hover:text-pet-dark-brown transition-colors">
                    {user?.name || '마이페이지'}
                  </span>
                </Link>
                <button
                  onClick={logout}
                  className="text-sm font-semibold text-pet-brown/60 hover:text-pet-orange
                             transition-colors ml-2"
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
                  className="text-sm font-bold bg-gradient-to-r from-pet-orange to-pet-pink
                             text-white px-5 py-2 rounded-full shadow-md
                             hover:shadow-lg hover:scale-105
                             active:scale-95 transition-all duration-300"
                >
                  회원가입
                </Link>
              </>
            )}
          </div>

          {/* ---------- Mobile hamburger ---------- */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? '메뉴 닫기' : '메뉴 열기'}
            className="md:hidden flex flex-col justify-center items-center w-9 h-9
                       rounded-xl hover:bg-pet-orange/10 transition-colors"
          >
            <span
              className={`block h-0.5 w-5 rounded-full bg-pet-brown transition-all duration-300
                          ${mobileOpen ? 'rotate-45 translate-y-1.5' : ''}`}
            />
            <span
              className={`block h-0.5 w-5 rounded-full bg-pet-brown mt-1 transition-all duration-300
                          ${mobileOpen ? 'opacity-0' : ''}`}
            />
            <span
              className={`block h-0.5 w-5 rounded-full bg-pet-brown mt-1 transition-all duration-300
                          ${mobileOpen ? '-rotate-45 -translate-y-1.5' : ''}`}
            />
          </button>
        </div>
      </header>

      {/* ---------- Mobile slide-in menu ---------- */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-pet-dark-brown/30 backdrop-blur-sm transition-opacity duration-300
                    md:hidden ${mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={close}
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-white/95 backdrop-blur-xl shadow-2xl
                    transform transition-transform duration-400 ease-[cubic-bezier(.4,0,.2,1)]
                    md:hidden ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col p-6 pt-20 gap-2">
          {[
            { to: '/feeds', label: '피드' },
            { to: '/map', label: '장소 찾기' },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={close}
              className="text-lg font-semibold text-pet-brown hover:text-pet-orange
                         py-3 border-b border-pet-gray transition-colors"
            >
              {label}
            </Link>
          ))}

          <div className="mt-4 flex flex-col gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/mypage"
                  onClick={close}
                  className="flex items-center gap-3 py-3"
                >
                  <span className="w-10 h-10 rounded-full bg-gradient-to-br from-pet-orange to-pet-pink
                                   flex items-center justify-center text-white font-bold shadow-md">
                    {(user?.name || '?')[0]}
                  </span>
                  <span className="font-semibold text-pet-dark-brown">
                    {user?.name || '마이페이지'}
                  </span>
                </Link>
                <button
                  onClick={() => { logout(); close(); }}
                  className="text-left text-pet-brown/60 hover:text-pet-orange
                             font-semibold transition-colors"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={close}
                  className="text-center py-3 rounded-2xl border-2 border-pet-orange
                             text-pet-orange font-bold hover:bg-pet-orange/5 transition-colors"
                >
                  로그인
                </Link>
                <Link
                  to="/signup"
                  onClick={close}
                  className="text-center py-3 rounded-2xl bg-gradient-to-r from-pet-orange to-pet-pink
                             text-white font-bold shadow-md"
                >
                  회원가입
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Spacer so content is not hidden behind fixed header */}
      <div className="h-16" />
    </>
  );
}
