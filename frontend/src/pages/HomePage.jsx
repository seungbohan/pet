import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFeeds } from '../api/feed';
import { getPlaces } from '../api/places';
import useAuthStore from '../store/authStore';
import FeedCard from '../components/feed/FeedCard';
import StarRating from '../components/common/StarRating';

/* ------------------------------------------------------------------ */
/*  Animated counter hook — counts up from 0 to `end` over `duration` */
/* ------------------------------------------------------------------ */
function useCountUp(end, duration = 1600) {
  const [value, setValue] = useState(0);
  const [ref, setRef] = useState(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!ref) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.4 },
    );
    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref]);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = Math.ceil(end / (duration / 16));
    const id = setInterval(() => {
      start += step;
      if (start >= end) { setValue(end); clearInterval(id); }
      else setValue(start);
    }, 16);
    return () => clearInterval(id);
  }, [started, end, duration]);

  return [value, setRef];
}

/* ------------------------------------------------------------------ */
/*  Stat item                                                          */
/* ------------------------------------------------------------------ */
function Stat({ number, suffix = '', label }) {
  const [value, setRef] = useCountUp(number);
  return (
    <div ref={setRef} className="text-center px-6">
      <p className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-pet-orange to-pet-pink bg-clip-text text-transparent">
        {value.toLocaleString()}{suffix}
      </p>
      <p className="text-sm text-pet-brown/60 mt-1 font-medium">{label}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  HomePage                                                           */
/* ------------------------------------------------------------------ */
export default function HomePage() {
  const [recentFeeds, setRecentFeeds] = useState([]);
  const [popularPlaces, setPopularPlaces] = useState([]);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    getFeeds(0, 4).then((res) => setRecentFeeds(res.data.content || [])).catch(() => {});
    getPlaces({ page: 0, size: 6 }).then((res) => setPopularPlaces(res.data.content || [])).catch(() => {});
  }, []);

  return (
    <div className="overflow-hidden">

      {/* ===================== HERO ===================== */}
      <section className="relative min-h-[520px] md:min-h-[600px] flex items-center justify-center
                          bg-gradient-to-br from-pet-orange/90 via-pet-peach to-pet-cream overflow-hidden">
        {/* Floating emoji decorations */}
        <span className="absolute top-[12%] left-[8%] text-5xl opacity-20 animate-bounce" style={{ animationDuration: '3s' }}>🐾</span>
        <span className="absolute top-[20%] right-[10%] text-4xl opacity-15 animate-bounce" style={{ animationDuration: '4s', animationDelay: '0.5s' }}>🐶</span>
        <span className="absolute bottom-[18%] left-[15%] text-4xl opacity-15 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '1s' }}>🐱</span>
        <span className="absolute bottom-[25%] right-[12%] text-5xl opacity-20 animate-bounce" style={{ animationDuration: '4.5s', animationDelay: '0.3s' }}>🐾</span>
        <span className="absolute top-[55%] left-[45%] text-3xl opacity-10 animate-bounce" style={{ animationDuration: '5s', animationDelay: '1.5s' }}>🦴</span>

        {/* Soft radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.35)_0%,_transparent_70%)]" />

        <div className="relative z-10 max-w-3xl mx-auto text-center px-5 py-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-pet-dark-brown leading-tight mb-5">
            🐾 반려동물과 함께하는
            <br />
            <span className="bg-gradient-to-r from-pet-dark-brown to-pet-brown bg-clip-text">
              모든 순간
            </span>
          </h1>

          <p className="text-base sm:text-lg text-pet-brown/80 mb-8 max-w-xl mx-auto leading-relaxed">
            반려동물 동반 가능한 카페, 식당, 숙소를 찾고
            <br className="hidden sm:block" />
            소중한 경험을 나눠보세요
          </p>

          {/* Decorative search bar */}
          <div className="max-w-lg mx-auto mb-8 relative group">
            <div className="flex items-center bg-white/80 backdrop-blur-md rounded-full shadow-xl
                            shadow-pet-brown/10 border border-white/60 px-5 py-3
                            group-hover:shadow-2xl transition-shadow duration-500">
              <span className="text-pet-brown/40 mr-3 text-lg">🔍</span>
              <span className="text-pet-brown/40 text-sm flex-1 text-left">
                어디로 떠나볼까요?
              </span>
              <span className="bg-gradient-to-r from-pet-orange to-pet-pink text-white text-sm
                               font-bold px-5 py-2 rounded-full shadow-md">
                검색
              </span>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/map"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5
                         bg-pet-dark-brown text-white rounded-full font-bold text-lg
                         shadow-lg shadow-pet-dark-brown/30
                         hover:shadow-xl hover:scale-105 active:scale-95
                         transition-all duration-300"
            >
              📍 장소 찾기
            </Link>
            <Link
              to="/feeds"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5
                         bg-white/80 backdrop-blur-md text-pet-brown rounded-full font-bold text-lg
                         border-2 border-pet-brown/15 shadow-lg shadow-pet-brown/5
                         hover:shadow-xl hover:scale-105 hover:bg-white active:scale-95
                         transition-all duration-300"
            >
              🐶 피드 둘러보기
            </Link>
          </div>
        </div>
      </section>

      {/* ===================== STATS ===================== */}
      <section className="-mt-8 relative z-10 max-w-3xl mx-auto px-5">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl shadow-pet-brown/8
                        py-8 px-4 flex flex-wrap justify-center gap-6 md:gap-12
                        border border-white/60">
          <Stat number={9800} suffix="+" label="등록 장소" />
          <Stat number={1000} suffix="+" label="리뷰" />
          <Stat number={500} suffix="+" label="회원" />
        </div>
      </section>

      {/* ===================== FEATURES ===================== */}
      <section className="max-w-6xl mx-auto py-20 px-5">
        <h2 className="text-2xl md:text-3xl font-extrabold text-pet-dark-brown text-center mb-3">
          WithPet이 도와드려요
        </h2>
        <p className="text-center text-pet-brown/50 mb-12 text-sm">
          반려동물과의 외출이 더 쉬워집니다
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {[
            { icon: '📍', title: '장소 탐색', desc: '내 주변 반려동물 동반 가능 장소를 지도에서 찾아보세요', accent: 'from-pet-orange to-pet-yellow' },
            { icon: '⭐', title: '리뷰 & 태그', desc: '실제 방문자의 생생한 리뷰와 편의시설 태그를 확인하세요', accent: 'from-pet-pink to-pet-peach' },
            { icon: '🐶', title: '펫 커뮤니티', desc: '반려동물과의 일상을 공유하고 정보를 나눠보세요', accent: 'from-pet-mint to-pet-sky' },
          ].map((item, i) => (
            <div
              key={item.title}
              className="group relative bg-white rounded-3xl p-7 shadow-md shadow-pet-brown/5
                         hover:shadow-xl hover:-translate-y-2 transition-all duration-400
                         border border-pet-gray/60 overflow-hidden"
              style={{ transform: `rotate(${i === 1 ? 0 : i === 0 ? -1 : 1}deg)` }}
            >
              {/* Gradient accent bar at top */}
              <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${item.accent} rounded-t-3xl`} />

              <div className="text-5xl mb-5 group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-pet-dark-brown mb-2">{item.title}</h3>
              <p className="text-sm text-pet-brown/60 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== RECENT FEEDS ===================== */}
      {recentFeeds.length > 0 && (
        <section className="max-w-6xl mx-auto py-12 px-5">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-pet-dark-brown">최근 피드</h2>
              {/* Decorative underline */}
              <div className="mt-2 h-1 w-16 rounded-full bg-gradient-to-r from-pet-orange to-pet-pink" />
            </div>
            <Link
              to="/feeds"
              className="text-sm font-semibold text-pet-orange hover:text-pet-pink
                         transition-colors duration-200 flex items-center gap-1 group"
            >
              더보기
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">&rarr;</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {recentFeeds.map((feed) => (
              <FeedCard key={feed.id} feed={feed} />
            ))}
          </div>
        </section>
      )}

      {/* ===================== POPULAR PLACES ===================== */}
      {popularPlaces.length > 0 && (
        <section className="max-w-6xl mx-auto py-12 px-5">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-pet-dark-brown">인기 장소</h2>
              <div className="mt-2 h-1 w-16 rounded-full bg-gradient-to-r from-pet-mint to-pet-sky" />
            </div>
            <Link
              to="/map"
              className="text-sm font-semibold text-pet-orange hover:text-pet-pink
                         transition-colors duration-200 flex items-center gap-1 group"
            >
              더보기
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">&rarr;</span>
            </Link>
          </div>

          {/* Horizontal scroll on mobile, grid on desktop */}
          <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory
                          md:grid md:grid-cols-3 md:overflow-visible md:pb-0
                          scrollbar-none">
            {popularPlaces.map((place) => (
              <Link
                key={place.id}
                to={`/places/${place.id}`}
                className="flex-shrink-0 w-72 md:w-auto snap-start
                           bg-white rounded-3xl overflow-hidden shadow-md shadow-pet-brown/5
                           hover:shadow-xl hover:-translate-y-1.5 transition-all duration-400
                           border border-pet-gray/60 group"
              >
                {/* Image with overlay */}
                <div className="relative h-44 overflow-hidden">
                  {place.imageUrls?.[0] ? (
                    <img
                      src={place.imageUrls[0]}
                      alt={place.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-pet-peach to-pet-cream flex items-center justify-center">
                      <span className="text-5xl">📍</span>
                    </div>
                  )}
                  {/* Bottom gradient overlay for text readability */}
                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent" />

                  {/* Category badge */}
                  {place.category && (
                    <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-md
                                     text-pet-dark-brown text-[11px] font-bold rounded-full shadow-sm">
                      {place.category}
                    </span>
                  )}

                  {/* Rating badge */}
                  {place.avgRating > 0 && (
                    <span className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1
                                     bg-pet-yellow/90 backdrop-blur-md text-pet-dark-brown text-xs
                                     font-bold rounded-full shadow-sm">
                      ★ {place.avgRating.toFixed(1)}
                    </span>
                  )}
                </div>

                {/* Card body */}
                <div className="p-4">
                  <h3 className="font-bold text-pet-dark-brown text-sm truncate">{place.title}</h3>
                  <p className="text-xs text-pet-brown/50 mt-1 truncate">{place.addr1}</p>
                  {place.avgRating > 0 && (
                    <div className="flex items-center gap-1.5 mt-2.5">
                      <StarRating rating={Math.round(place.avgRating)} readOnly size="text-xs" />
                      <span className="text-[11px] text-pet-brown/40">({place.reviewCount})</span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ===================== CTA BANNER ===================== */}
      <section className="mx-5 my-16 max-w-5xl lg:mx-auto">
        <div className="relative bg-gradient-to-r from-pet-orange via-pet-pink to-pet-peach
                        rounded-3xl px-8 py-14 md:py-16 text-center overflow-hidden shadow-xl">
          {/* Decorative paw prints */}
          <span className="absolute top-4 left-6 text-4xl opacity-20 rotate-[-20deg]">🐾</span>
          <span className="absolute bottom-4 right-8 text-5xl opacity-20 rotate-[15deg]">🐾</span>
          <span className="absolute top-1/2 left-[80%] text-3xl opacity-15 rotate-[30deg]">🐾</span>

          <h2 className="relative z-10 text-2xl md:text-3xl font-extrabold text-white mb-3">
            지금 시작하세요!
          </h2>
          <p className="relative z-10 text-white/80 mb-8 max-w-md mx-auto text-sm md:text-base">
            반려동물과 함께할 수 있는 장소를 발견하고,
            <br />다른 반려인들과 소통해보세요.
          </p>
          <Link
            to={isAuthenticated ? '/map' : '/signup'}
            className="relative z-10 inline-block bg-white text-pet-orange font-bold
                       px-8 py-3.5 rounded-full shadow-lg
                       hover:shadow-xl hover:scale-105 active:scale-95
                       transition-all duration-300 text-base"
          >
            {isAuthenticated ? '장소 둘러보기' : '무료로 가입하기'}
          </Link>
        </div>
      </section>
    </div>
  );
}
