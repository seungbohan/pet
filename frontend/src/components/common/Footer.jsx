import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="relative mt-auto overflow-hidden bg-gradient-to-br from-pet-dark-brown via-pet-brown to-pet-dark-brown text-white/80">
      {/* Decorative top wave / accent line */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-pet-orange via-pet-pink to-pet-mint" />

      <div className="max-w-7xl mx-auto px-6 pt-14 pb-8">
        {/* ---------- 3-column grid ---------- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">

          {/* Column 1 : Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 group mb-4">
              <span className="text-2xl transition-transform duration-300 group-hover:rotate-12">🐾</span>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-pet-orange to-pet-pink bg-clip-text text-transparent">
                WithPet
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-white/60 max-w-xs">
              반려동물과 함께할 수 있는 최고의 장소를 발견하고, 소중한 경험을 커뮤니티와 나눠보세요.
            </p>
            {/* Social icons - 실제 계정 생성 후 URL 추가 */}
          </div>

          {/* Column 2 : Quick links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-4">
              바로가기
            </h4>
            <ul className="space-y-2.5">
              {[
                { to: '/map', label: '장소 찾기' },
                { to: '/feeds', label: '피드' },
                { to: '/signup', label: '회원가입' },
                { to: '/login', label: '로그인' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-white/60 hover:text-pet-orange transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 : Contact / info */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-4">
              연락처
            </h4>
            <ul className="space-y-2.5 text-sm text-white/60">
              <li className="flex items-center gap-2">
                <span>📧</span>
                <span>contact@withpet.kr</span>
              </li>
              <li className="flex items-center gap-2">
                <span>📍</span>
                <span>서울특별시</span>
              </li>
              <li className="flex items-center gap-2">
                <span>🕐</span>
                <span>평일 10:00 - 18:00</span>
              </li>
            </ul>
          </div>
        </div>

        {/* ---------- Bottom bar ---------- */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <p>&copy; 2025 WithPet. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <span className="text-pet-pink text-sm">❤️</span> for pets
          </p>
        </div>
      </div>
    </footer>
  );
}
