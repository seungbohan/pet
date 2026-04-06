import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFeeds } from '../api/feed';
import { getPlaces } from '../api/places';
import FeedCard from '../components/feed/FeedCard';
import StarRating from '../components/common/StarRating';

export default function HomePage() {
  const [recentFeeds, setRecentFeeds] = useState([]);
  const [popularPlaces, setPopularPlaces] = useState([]);

  useEffect(() => {
    getFeeds(0, 4).then((res) => setRecentFeeds(res.data.content || [])).catch(() => {});
    getPlaces({ page: 0, size: 6 }).then((res) => setPopularPlaces(res.data.content || [])).catch(() => {});
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-pet-orange via-pet-peach to-pet-cream py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-pet-dark-brown mb-4">
            🐾 반려동물과 함께하는
            <br />모든 순간
          </h1>
          <p className="text-lg text-pet-brown/80 mb-8">
            반려동물 동반 가능한 카페, 식당, 숙소를 찾고
            <br />소중한 경험을 나눠보세요
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/map" className="px-8 py-3 bg-pet-dark-brown text-white rounded-2xl font-semibold hover:bg-pet-brown transition-colors text-lg">
              장소 찾기
            </Link>
            <Link to="/feeds" className="px-8 py-3 bg-white text-pet-brown rounded-2xl font-semibold hover:bg-pet-peach transition-colors text-lg border-2 border-pet-brown/20">
              피드 둘러보기
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto py-16 px-4">
        <h2 className="text-2xl font-bold text-pet-dark-brown text-center mb-10">WithPet이 도와드려요</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: '📍', title: '장소 탐색', desc: '내 주변 반려동물 동반 가능 장소를 지도에서 찾아보세요' },
            { icon: '⭐', title: '리뷰 & 태그', desc: '실제 방문자의 생생한 리뷰와 편의시설 태그를 확인하세요' },
            { icon: '🐶', title: '펫 커뮤니티', desc: '반려동물과의 일상을 공유하고 정보를 나눠보세요' },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-lg font-bold text-pet-brown mb-2">{item.title}</h3>
              <p className="text-sm text-pet-brown/70">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Feeds */}
      {recentFeeds.length > 0 && (
        <section className="max-w-6xl mx-auto py-12 px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-pet-dark-brown">최근 피드</h2>
            <Link to="/feeds" className="text-sm text-pet-orange hover:underline">더보기 →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {recentFeeds.map((feed) => (
              <FeedCard key={feed.id} feed={feed} />
            ))}
          </div>
        </section>
      )}

      {/* Popular Places */}
      {popularPlaces.length > 0 && (
        <section className="max-w-6xl mx-auto py-12 px-4 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-pet-dark-brown">인기 장소</h2>
            <Link to="/map" className="text-sm text-pet-orange hover:underline">더보기 →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {popularPlaces.map((place) => (
              <Link key={place.id} to={`/places/${place.id}`}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
                {place.imageUrls?.[0] ? (
                  <img src={place.imageUrls[0]} alt={place.title} className="w-full h-40 object-cover group-hover:scale-105 transition-transform" />
                ) : (
                  <div className="w-full h-40 bg-gradient-to-br from-pet-peach to-pet-cream flex items-center justify-center">
                    <span className="text-4xl">📍</span>
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-bold text-pet-dark-brown text-sm">{place.title}</h3>
                  <p className="text-xs text-pet-brown/60 mt-1 truncate">{place.addr1}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {place.avgRating > 0 && (
                      <div className="flex items-center gap-1">
                        <StarRating rating={Math.round(place.avgRating)} readOnly size="text-xs" />
                        <span className="text-xs text-pet-brown/50">({place.reviewCount})</span>
                      </div>
                    )}
                    <span className="px-2 py-0.5 bg-pet-mint text-pet-dark-brown rounded-full text-[10px]">{place.category}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
